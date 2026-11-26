/* NØTRACE ASCII Engine 3.0 — High-Precision 60FPS Procedural Character Engine
 * Framework-agnostic ES/TS module with zero dependencies.
 * Samples hacker-luma.png into a responsive character matrix rendered on Canvas 2D
 * with silky-smooth 60fps per-cell progressive reconstruction (sub-pixel glide, smoothstep fade,
 * wavefront crest illumination, and glyph locking) and zero per-frame string allocations.
 */

import { HACKER_LUMA_DATA_URI } from './hacker-luma-data';

export const DEFAULT_ASCII_SOURCE = HACKER_LUMA_DATA_URI;
export const GLYPHS = ' .:+-=/0#%@';

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const noise = (x: number, y: number) => {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
};

// Pre-allocated 65-level monochrome luminance LUT (zero per-frame string allocations)
const LUT_STEPS = 64;
const PALETTE_LUT: string[] = Array.from({ length: LUT_STEPS + 1 }, (_, i) => {
  const a = (i / LUT_STEPS).toFixed(3);
  return `rgba(245,245,245,${a})`;
});

const RAIN_LUT: string[] = Array.from({ length: 7 }, (_, k) => {
  const a = (0.088 * (1 - k / 7)).toFixed(3);
  return `rgba(165,165,165,${a})`;
});

export type AsciiQuality = 'auto' | 'high' | 'low';
export type CellRegion = 'eyes' | 'prompt' | 'screen' | 'hands' | 'hood' | 'body';

export interface AsciiEngineOptions {
  source?: string;
  density?: number;
  speed?: number;
  rain?: boolean;
  assemble?: boolean;
  quality?: AsciiQuality;
}

interface AsciiCell {
  c: number;
  r: number;
  x: number;
  y: number;
  nx: number;
  ny: number;
  lum: number;
  baseLum: number;
  level: number;
  glyph: string;
  seed: number;
  assembleThreshold: number;
  region: CellRegion;
}

function classifyRegion(nx: number, ny: number, lum: number): CellRegion {
  // Eyes inside the dark hood cavity
  if (ny >= 0.3 && ny <= 0.44 && nx >= 0.4 && nx <= 0.6 && lum > 0.55) {
    return 'eyes';
  }
  // Prompt >_ inside laptop screen
  if (ny >= 0.67 && ny <= 0.84 && nx >= 0.41 && nx <= 0.58 && lum > 0.5) {
    return 'prompt';
  }
  // Laptop screen & bezel area
  if (ny >= 0.58 && ny <= 0.94 && nx >= 0.28 && nx <= 0.72) {
    return 'screen';
  }
  // Hands / keyboard typing region at bottom left & right
  if (ny >= 0.78 && ((nx >= 0.14 && nx <= 0.33) || (nx >= 0.67 && nx <= 0.86))) {
    return 'hands';
  }
  // Hood & upper shoulders
  if (ny <= 0.56) {
    return 'hood';
  }
  return 'body';
}

export class AsciiEngine {
  public canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  public options: Required<Omit<AsciiEngineOptions, 'source'>>;
  public playing = true;
  public visible = true;
  public disposed = false;
  public clock = 0;
  private last = 0;
  private lastMutation = 0;
  private frame = 0;
  private media: MediaQueryList;
  public reduce: boolean;
  private resizeObserver: ResizeObserver;
  private intersection: IntersectionObserver;
  private image: HTMLImageElement;
  public ready: Promise<AsciiEngine>;

  private w = 0;
  private h = 0;
  private lastQuality: AsciiQuality = 'auto';
  private cols = 0;
  private rows = 0;
  private cw = 0;
  private ch = 0;
  private font = 10;
  private cells: AsciiCell[] | null = null;
  private activityBoost = 0;

  private onVisibility: () => void;
  private onMotion: (e: MediaQueryListEvent) => void;

  constructor(
    canvas: HTMLCanvasElement,
    {
      source = DEFAULT_ASCII_SOURCE,
      density = 0.85,
      speed = 0.6,
      rain = true,
      assemble = true,
      quality = 'auto',
    }: AsciiEngineOptions = {}
  ) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) {
      throw new Error('Canvas 2D no disponible');
    }
    this.ctx = context;
    this.options = { density, speed, rain, assemble, quality };

    this.media = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reduce = this.media.matches;

    this.onVisibility = () => this.sync();
    this.onMotion = (e: MediaQueryListEvent) => {
      this.reduce = e.matches;
      this.sync();
    };

    document.addEventListener('visibilitychange', this.onVisibility);
    this.media.addEventListener('change', this.onMotion);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);

    this.intersection = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      this.sync();
    });
    this.intersection.observe(canvas);

    this.image = new Image();
    this.image.decoding = 'async';
    let retriedInline = false;
    this.ready = new Promise((resolve, reject) => {
      this.image.onload = () => {
        if (!this.disposed) {
          this.resize();
          this.sync();
        }
        resolve(this);
      };
      this.image.onerror = () => {
        if (!retriedInline && this.image.src !== HACKER_LUMA_DATA_URI) {
          retriedInline = true;
          this.image.src = HACKER_LUMA_DATA_URI;
          return;
        }
        reject(new Error('No se pudo cargar la ilustración ASCII'));
      };
    });
    this.image.src = source || HACKER_LUMA_DATA_URI;
  }

  public set(options: Partial<Omit<AsciiEngineOptions, 'source'>>): void {
    const prevQuality = this.options.quality;
    Object.assign(this.options, options);
    if (options.quality && options.quality !== prevQuality) {
      this.resize(true);
    } else {
      this.draw();
    }
    this.sync();
  }

  /** Triggers a subtle interaction pulse */
  public pulseActivity(amount = 0.35): void {
    this.activityBoost = clamp(this.activityBoost + amount, 0, 1);
  }

  public pause(): void {
    this.playing = false;
    this.sync();
  }

  public resume(): void {
    this.playing = true;
    this.sync();
  }

  public replay(): void {
    this.clock = 0;
    this.last = 0;
    this.lastMutation = 0;
    if (!this.cells || !this.w) {
      this.resize(true);
    } else {
      this.draw();
    }
    this.sync();
  }

  public resize(force = false): void {
    if (this.disposed || !this.image.naturalWidth) return;
    const rawW =
      this.canvas.clientWidth ||
      this.canvas.parentElement?.clientWidth ||
      Math.min(720, Math.max(320, window.innerWidth - 48));
    const w = Math.round(rawW);
    if (!w) return;

    const q = this.options.quality;
    // Do not reset canvas buffer or re-sample cells if width and quality have not changed
    if (
      !force &&
      this.cells &&
      this.cells.length > 0 &&
      Math.abs(w - this.w) <= 1 &&
      q === this.lastQuality
    ) {
      return;
    }

    const h = Math.round(w / 1.6);
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    this.w = w;
    this.h = h;
    this.lastQuality = q;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const target = q === 'low' ? 74 : q === 'high' ? 168 : w < 480 ? 86 : 138;
    this.cols = Math.min(target, Math.max(48, Math.floor(w / 4.7)));
    this.cw = w / this.cols;
    this.font = this.cw * 1.58;
    this.ch = this.font * 1.03;
    this.rows = Math.floor(h / this.ch);

    const sample = document.createElement('canvas');
    sample.width = this.cols;
    sample.height = this.rows;
    const s = sample.getContext('2d', { willReadFrequently: true });
    if (!s) return;

    s.imageSmoothingEnabled = true;
    s.imageSmoothingQuality = 'high';
    s.fillStyle = '#000';
    s.fillRect(0, 0, this.cols, this.rows);
    s.drawImage(this.image, 0, 0, this.cols, this.rows);

    const p = s.getImageData(0, 0, this.cols, this.rows).data;
    this.cells = [];

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const i = r * this.cols + c;
        const lum = p[i * 4] / 255;
        if (lum < 0.025) continue;
        const nx = c / this.cols;
        const ny = r / this.rows;
        const level = clamp(
          Math.round(Math.pow(lum, 0.47) * (GLYPHS.length - 1)),
          1,
          GLYPHS.length - 1
        );
        const seed = noise(c, r);
        // Smooth radial + vertical wavefront threshold in [0, 0.74]
        const radialDist = Math.abs(nx - 0.5) * 0.35;
        const assembleThreshold = clamp(ny * 0.52 + radialDist + seed * 0.22, 0, 0.74);

        this.cells.push({
          c,
          r,
          x: (c + 0.5) * this.cw,
          y: (r + 0.5) * this.ch,
          nx,
          ny,
          lum,
          baseLum: 0.29 + Math.pow(lum, 0.5) * 0.96,
          level,
          glyph: GLYPHS[level],
          seed,
          assembleThreshold,
          region: classifyRegion(nx, ny, lum),
        });
      }
    }
    this.draw();
  }

  public sync(): void {
    if (this.disposed) return;
    const active =
      this.playing && !this.reduce && this.visible && !document.hidden && !!this.cells;
    if (!active) {
      if (this.frame) cancelAnimationFrame(this.frame);
      this.frame = 0;
      this.last = 0;
      if (this.reduce) this.draw(true);
      return;
    }
    if (!this.frame) {
      this.frame = requestAnimationFrame(this.tick);
    }
  }

  private tick = (ts: number): void => {
    this.frame = 0;
    if (this.disposed || !this.cells) return;
    const dt = this.last ? Math.min(34, ts - this.last) : 16.67;
    this.last = ts;
    this.clock += dt;

    if (this.activityBoost > 0) {
      this.activityBoost = Math.max(0, this.activityBoost - dt * 0.0012);
    }

    const effectiveSpeed = clamp(this.options.speed + this.activityBoost * 0.25, 0, 1);
    if (this.clock - this.lastMutation > 1000 / (5 + 10 * effectiveSpeed)) {
      this.lastMutation = this.clock;
      const mutationCount = Math.ceil(
        this.cells.length * (0.028 + this.activityBoost * 0.015)
      );
      for (let i = 0; i < mutationCount; i++) {
        const cell = this.cells[Math.floor(Math.random() * this.cells.length)];
        if (!cell) break;
        const delta = Math.floor(Math.random() * 3) - 1;
        const n = clamp(cell.level + delta, 1, GLYPHS.length - 1);
        cell.glyph = GLYPHS[n];
      }
    }

    // Native 60 FPS draw pass
    this.draw();
    this.sync();
  };

  public draw(forceStatic = false): void {
    if (!this.cells || this.disposed) return;
    const { ctx, w, h, cw, ch, rows, cols } = this;
    const t = this.clock / 1000;
    const still = forceStatic || this.reduce;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);
    ctx.font = `${this.font}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Subtle background binary streams
    if (this.options.rain) {
      for (let k = 0; k < 7; k++) {
        ctx.fillStyle = RAIN_LUT[k];
        for (let c = 1; c < cols; c += 5) {
          const head =
            (noise(c, 9) * rows + (still ? 0 : t * (2 + noise(c, 2) * 4))) % rows;
          const r = (head - k + rows) % rows;
          const bit = noise(c, k + Math.floor(still ? 0 : t)) > 0.5 ? '1' : '0';
          ctx.fillText(bit, (c + 0.5) * cw, (r + 0.5) * ch);
        }
      }
    }

    // 60FPS silky-smooth progressive reconstruction over 1.85 seconds with cubic ease-out
    const assembleDuration = 1.85;
    const rawAssemble =
      still || !this.options.assemble ? 1 : clamp(t / assembleDuration, 0, 1);
    // Smooth cubic ease-out: 1 - (1 - x)^3
    const reveal =
      rawAssemble >= 1 ? 1 : 1 - Math.pow(1 - rawAssemble, 2.8);
    const isAssembling = reveal < 1;

    const amount = clamp(this.options.density, 0.15, 1);

    // Subtle organic breathing offset for upper hood/shoulders
    const breathOffset = still ? 0 : Math.sin(t * 1.35) * (ch * 0.16);
    // Eye micro-blink & focus pulse
    const eyeCycle =
      Math.sin(t * 2.1) * 0.08 + (Math.sin(t * 0.65) > 0.96 ? -0.35 : 0.08);
    // Laptop screen & >_ prompt reflection pulse
    const promptGlow = still ? 0 : 0.12 * Math.sin(t * 3.4);
    const scanRow = (t * 5) % (rows * 2.5);

    let lastStyle = '';

    for (let i = 0, len = this.cells.length; i < len; i++) {
      const cell = this.cells[i];
      const { r, c, x, y, lum, baseLum, seed, assembleThreshold, region } = cell;
      if (seed > amount && lum < 0.3) continue;

      let cellAlpha = 1;
      let assembleGlideY = 0;
      let crestGlow = 0;
      let activeGlyph = cell.glyph;

      if (isAssembling) {
        // Each cell transitions smoothly over a 0.26 window (~28 intermediate frames at 60fps)
        const local = (reveal - assembleThreshold) / 0.26;
        if (local <= 0) continue;

        if (local < 1) {
          // Smoothstep interpolation: 3x^2 - 2x^3
          cellAlpha = local * local * (3 - 2 * local);
          // Sub-pixel downward condensation glide into place
          assembleGlideY = (1 - cellAlpha) * (-ch * 1.25);
          // Luminous crest highlight as the reconstruction wave passes through this cell
          crestGlow = Math.sin(local * Math.PI) * 0.24;
          // Progressive glyph refinement from lighter code symbols to final density glyph
          const morphLevel = clamp(
            Math.max(1, Math.round(cell.level * cellAlpha)),
            1,
            GLYPHS.length - 1
          );
          activeGlyph = GLYPHS[morphLevel];
        }
      }

      let pulse = still ? 1 : 0.94 + 0.06 * Math.sin(t * 1.6 + seed * 6);
      const scanDist = Math.abs(r - scanRow);
      const scan = still || scanDist >= 2 ? 0 : (1 - scanDist * 0.5) * 0.1;

      let yOffset = assembleGlideY;
      let extraLum = crestGlow;

      if (!still) {
        if (region === 'hood') {
          yOffset += breathOffset * (1 - cell.ny);
        } else if (region === 'eyes') {
          extraLum += eyeCycle + this.activityBoost * 0.18;
        } else if (region === 'prompt') {
          extraLum += promptGlow + this.activityBoost * 0.2;
        } else if (region === 'screen') {
          pulse += 0.04 * Math.sin(t * 2.4 + cell.nx * 4);
        } else if (region === 'hands') {
          extraLum += Math.sin(t * 9 + c * 0.9) * 0.05;
        }
      }

      const brightness = clamp((baseLum * pulse + scan + extraLum) * cellAlpha, 0, 1);
      const lutIdx = (brightness * LUT_STEPS + 0.5) | 0;
      if (lutIdx <= 0) continue;

      const style = PALETTE_LUT[lutIdx];
      if (style !== lastStyle) {
        ctx.fillStyle = style;
        lastStyle = style;
      }

      ctx.fillText(activeGlyph, x, y + yOffset);
    }
  }

  public destroy(): void {
    this.disposed = true;
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.resizeObserver.disconnect();
    this.intersection.disconnect();
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.media.removeEventListener('change', this.onMotion);
    this.image.onload = null;
    this.image.onerror = null;
  }
}
