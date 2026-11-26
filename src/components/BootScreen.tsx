import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AsciiHackerArt, QualityTier } from './AsciiHackerArt';
import type { AsciiEngine } from '../visual/ascii-engine';

interface BootScreenProps {
  open: boolean;
  isPreview?: boolean;
  onClose: () => void;
  onRevealStart?: () => void;
  quality?: QualityTier;
  readinessPromise?: Promise<unknown> | null;
}

const BOOT_STAGES = [
  { threshold: 0, text: 'Inicializando matriz de renderizado ASCII...' },
  { threshold: 24, text: 'Sincronizando retrato neuronal y lluvia de código...' },
  { threshold: 52, text: 'Verificando módulos de laboratorio y topología de red...' },
  { threshold: 80, text: 'Preparando transición de dígitos hacia NØTRACE...' },
  { threshold: 96, text: 'Acceso listo · ejecutando barrido de salida...' },
];

const DIGIT_CHARS = '01010110017942853601#@%/_:+-=';

export const BootScreen: React.FC<BootScreenProps> = ({
  open,
  isPreview = false,
  onClose,
  onRevealStart,
  quality = 'auto',
  readinessPromise = null,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const curtainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<AsciiEngine | null>(null);
  const closingRef = useRef<boolean>(false);

  // Store callbacks in refs so parent state updates never reset the active transition useEffect
  const onCloseRef = useRef(onClose);
  const onRevealStartRef = useRef(onRevealStart);
  const readinessPromiseRef = useRef(readinessPromise);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    onRevealStartRef.current = onRevealStart;
  }, [onRevealStart]);

  useEffect(() => {
    readinessPromiseRef.current = readinessPromise;
  }, [readinessPromise]);

  const [engineReady, setEngineReady] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>(
    'Inicializando matriz de renderizado ASCII...'
  );
  const [isDeconstructing, setIsDeconstructing] = useState<boolean>(false);
  const [isDigitRevealing, setIsDigitRevealing] = useState<boolean>(false);
  const [isLeaving, setIsLeaving] = useState<boolean>(false);

  // High-performance 60FPS falling digits transition:
  // Uses 1x logical canvas resolution, stops the loader's ASCII engine immediately to avoid dual-canvas contention,
  // batches fillStyle changes into 3 passes, and fades the curtain via GPU-composited CSS opacity while
  // the Home page's initial composition materializes underneath.
  const runDigitCurtainTransition = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      if (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        onRevealStartRef.current?.();
        resolve();
        return;
      }

      const canvas = curtainCanvasRef.current;
      if (!canvas) {
        onRevealStartRef.current?.();
        resolve();
        return;
      }

      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) {
        onRevealStartRef.current?.();
        resolve();
        return;
      }

      // 1x logical resolution keeps pixel fill & text rasterization ultra-fast at 60fps
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      canvas.style.opacity = '1';

      // Stop loader ASCII engine immediately so only 1 canvas animates at a time
      engineRef.current?.pause();
      setIsDeconstructing(true);

      const fontSize = w < 640 ? 15 : 16;
      const colWidth = w < 640 ? 18 : 20;
      const cols = Math.ceil(w / colWidth);
      const rows = Math.ceil(h / fontSize) + 6;

      const colState = Array.from({ length: cols }, (_, i) => {
        const seed = Math.sin(i * 91.7) * 43758.5453;
        const rand = seed - Math.floor(seed);
        return {
          head: -rand * 8,
          speed: 1.55 + rand * 1.15,
          tailLength: 10 + Math.floor(rand * 6),
        };
      });

      const durationMs = 1180;
      const start = performance.now();
      let revealTriggered = false;

      const step = (now: number) => {
        const elapsed = now - start;
        const p = Math.min(1, elapsed / durationMs);

        // Trigger the main page entrance choreography at 30% while digits are raining at peak density
        if (p >= 0.3 && !revealTriggered) {
          revealTriggered = true;
          setIsDigitRevealing(true);
          onRevealStartRef.current?.();
        }

        // Smooth hardware-composited opacity fade on the curtain canvas during the second half
        // so the emerging Home page is revealed at 60fps without expensive per-pixel destination-out
        if (p > 0.32) {
          const curtainOpacity = Math.max(0, 1 - (p - 0.32) / 0.68);
          canvas.style.opacity = curtainOpacity.toFixed(3);
        }

        // Classic fast phosphor trail fade
        ctx.fillStyle = 'rgba(0, 0, 0, 0.26)';
        ctx.fillRect(0, 0, w, h);

        ctx.font = `600 ${fontSize}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'center';

        const charTick = Math.floor(elapsed * 0.04);

        // Advance column heads once per frame
        for (let c = 0; c < cols; c++) {
          colState[c].head += colState[c].speed;
        }

        // Pass 1: Bright white leading characters (k === 0) — 1 single fillStyle change!
        ctx.fillStyle = '#FFFFFF';
        for (let c = 0; c < cols; c++) {
          const headRow = Math.floor(colState[c].head);
          if (headRow < 0 || headRow > rows) continue;
          const x = c * colWidth + colWidth * 0.5;
          const charIdx = (c * 17 + headRow * 31 + charTick) % DIGIT_CHARS.length;
          ctx.fillText(DIGIT_CHARS[Math.abs(charIdx)], x, headRow * fontSize);
        }

        // Pass 2: Mid-bright silver trail (k = 1..3) — 1 single fillStyle change!
        ctx.fillStyle = 'rgba(224, 224, 224, 0.72)';
        for (let c = 0; c < cols; c++) {
          const headRow = Math.floor(colState[c].head);
          const x = c * colWidth + colWidth * 0.5;
          for (let k = 1; k <= 3; k++) {
            const r = headRow - k;
            if (r < 0 || r > rows) continue;
            const charIdx = (c * 17 + r * 31 + charTick) % DIGIT_CHARS.length;
            ctx.fillText(DIGIT_CHARS[Math.abs(charIdx)], x, r * fontSize);
          }
        }

        // Pass 3: Outer dim trail (k >= 4) — 1 single fillStyle change!
        ctx.fillStyle = 'rgba(140, 140, 140, 0.36)';
        for (let c = 0; c < cols; c++) {
          const st = colState[c];
          const headRow = Math.floor(st.head);
          const x = c * colWidth + colWidth * 0.5;
          for (let k = 4; k < st.tailLength; k += 2) {
            const r = headRow - k;
            if (r < 0 || r > rows) continue;
            const charIdx = (c * 17 + r * 31 + charTick) % DIGIT_CHARS.length;
            ctx.fillText(DIGIT_CHARS[Math.abs(charIdx)], x, r * fontSize);
          }
        }

        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          ctx.clearRect(0, 0, w, h);
          canvas.style.opacity = '0';
          resolve();
        }
      };

      requestAnimationFrame(step);
    });
  }, []);

  const triggerExitWithDigits = useCallback(async () => {
    if (closingRef.current) return;
    closingRef.current = true;

    setProgress(100);
    setStatusText('Transición de dígitos activa // Materializando NØTRACE...');

    await runDigitCurtainTransition();

    setIsDeconstructing(false);
    setIsDigitRevealing(false);
    setIsLeaving(false);
    closingRef.current = false;
    onCloseRef.current();
  }, [runDigitCurtainTransition]);

  // Reset and run minimum 4.8-second boot animation once the ASCII engine is decoded and visible
  useEffect(() => {
    if (!open) {
      closingRef.current = false;
      setIsDeconstructing(false);
      setIsDigitRevealing(false);
      setIsLeaving(false);
      return;
    }

    if (closingRef.current) return;

    setIsDeconstructing(false);
    setIsDigitRevealing(false);
    setIsLeaving(false);
    setProgress(0);
    setStatusText(
      isPreview
        ? 'Vista previa de animación ASCII · observa el motor o pulsa para transición de dígitos'
        : BOOT_STAGES[0].text
    );

    if (engineRef.current) {
      engineRef.current.resize();
      engineRef.current.replay();
      engineRef.current.resume();
    }

    let cancelled = false;
    let rafId = 0;

    const startSequence = async () => {
      if (engineRef.current) {
        try {
          await engineRef.current.ready;
        } catch {
          // Proceed even if fallback image is used
        }
      }

      if (cancelled || closingRef.current) return;
      engineRef.current?.resize();
      engineRef.current?.replay();
      engineRef.current?.resume();

      const minDisplayDurationMs = isPreview ? 5200 : 4800;
      const startTime = performance.now();

      const updateLoop = (now: number) => {
        if (cancelled || closingRef.current) return;
        const elapsed = now - startTime;
        const pct = Math.min(99, Math.round((elapsed / minDisplayDurationMs) * 100));
        setProgress(pct);

        if (!isPreview) {
          for (let i = BOOT_STAGES.length - 1; i >= 0; i--) {
            if (pct >= BOOT_STAGES[i].threshold) {
              setStatusText(BOOT_STAGES[i].text);
              break;
            }
          }
        }

        if (elapsed < minDisplayDurationMs) {
          rafId = requestAnimationFrame(updateLoop);
        } else if (!isPreview) {
          Promise.resolve(readinessPromiseRef.current)
            .catch(() => null)
            .finally(() => {
              if (!cancelled && !closingRef.current) {
                triggerExitWithDigits();
              }
            });
        } else {
          setProgress(100);
          setStatusText('Animación completada · pulsa el botón para ver la transición de dígitos');
        }
      };

      rafId = requestAnimationFrame(updateLoop);
    };

    startSequence();

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [open, isPreview, engineReady, triggerExitWithDigits]);

  return (
    <section
      ref={sectionRef}
      className={`nt-loader ${isDeconstructing ? 'is-deconstructing' : ''} ${
        isDigitRevealing ? 'is-digit-revealing' : ''
      } ${isLeaving ? 'is-leaving' : ''}`}
      id="loader"
      hidden={!open}
      aria-label="Pantalla de carga"
    >
      {/* Full-viewport Digital Matrix Curtain Canvas for Exit Transition */}
      <canvas
        ref={curtainCanvasRef}
        className={`nt-digit-curtain ${isDeconstructing || isDigitRevealing ? 'is-active' : ''}`}
        aria-hidden="true"
      />

      <div className="nt-loader-inner">
        <div className="nt-loader-brand">NØTRACE</div>

        <div className="nt-loader-art-wrap">
          <AsciiHackerArt
            density={1}
            speed={0.72}
            rain={true}
            assemble={true}
            quality={quality}
            paused={!open || isDeconstructing || isDigitRevealing}
            onEngineReady={(eng) => {
              engineRef.current = eng;
              eng.resize();
              eng.replay();
              setEngineReady(true);
            }}
          />
        </div>

        <div
          className="nt-progress"
          role="progressbar"
          aria-label="Progreso de inicialización"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          style={{ '--progress': `${progress}%` } as React.CSSProperties}
        >
          <span />
        </div>

        <div className="nt-loader-text" role="status">
          <span>{statusText}</span>{' '}
          <span className="nt-mono text-white font-semibold">{progress}%</span>
        </div>

        <div>
          <button
            type="button"
            className="nt-btn"
            id="close-loader"
            onClick={triggerExitWithDigits}
          >
            {isPreview ? 'Ejecutar transición de dígitos' : 'Entrar ahora'}
          </button>
        </div>
      </div>
    </section>
  );
};
