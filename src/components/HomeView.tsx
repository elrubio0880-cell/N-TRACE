import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Globe,
  Clock,
  ShieldCheck,
  Network,
  Hash,
  Lock,
  Target,
  Boxes,
  BookOpen,
  Wallet,
  Compass,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { AsciiHackerArt, QualityTier } from './AsciiHackerArt';
import { CourseMotionRemotionPlayer } from './RemotionCompositions';
import {
  ByteIcon,
  CoreIcon,
  CurrencyAmount,
  RankInsignia,
} from './CurrencyIcons';
import {
  NOTRACE_METHODS,
  TOOLKIT_CATALOG,
  OPERATIONS_MISSIONS,
  OPERATOR_RANKS,
  NotraceMethod,
} from '../data/notracePlatformData';

const CIPHER_GLYPHS = '0101#@%/_:+-=Ø';

function scrambleText(target: string, progress: number, seedOffset: number): string {
  if (progress >= 1) return target;
  const len = target.length;
  const lockCount = Math.floor(progress * len);
  let out = '';
  for (let i = 0; i < len; i++) {
    const ch = target[i];
    if (ch === ' ') {
      out += ' ';
    } else if (i < lockCount) {
      out += ch;
    } else {
      const idx =
        Math.abs(Math.floor((i * 19 + seedOffset * 13 + progress * 97))) %
        CIPHER_GLYPHS.length;
      out += CIPHER_GLYPHS[idx];
    }
  }
  return out;
}

interface HomeViewProps {
  quality: QualityTier;
  loaderOpen: boolean;
  bootRevealTick?: number;
  unlockedMethodIds: string[];
  onNavigate: (path: string) => void;
  onSelectMethod: (method: NotraceMethod) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  quality,
  loaderOpen,
  bootRevealTick = 0,
  unlockedMethodIds,
  onNavigate,
  onSelectMethod,
}) => {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [hoveredMethodId, setHoveredMethodId] = useState<string | null>(null);

  // Direct DOM ref for zero-layout-shift monospace caption decoding
  const captionTextRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (bootRevealTick <= 0) return;

    const setFinalTexts = () => {
      if (captionTextRef.current) {
        captionTextRef.current.textContent = 'NØTRACE // ECOSYSTEM IDENTITY';
      }
    };

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setFinalTexts();
      return;
    }

    const duration = 820;
    const start = performance.now();
    let lastUpdate = 0;
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(1, elapsed / duration);

      // Update fixed-width monospace caption directly (zero layout shift, zero React re-renders)
      if (now - lastUpdate >= 34 || p >= 1) {
        lastUpdate = now;
        const eased = 1 - Math.pow(1 - p, 2);
        if (captionTextRef.current) {
          captionTextRef.current.textContent = scrambleText(
            'NØTRACE // ECOSYSTEM IDENTITY',
            eased,
            4
          );
        }
      }

      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setFinalTexts();
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      setFinalTexts();
    };
  }, [bootRevealTick]);

  const featuredMethods = NOTRACE_METHODS.filter((m) => m.featured);
  const featuredTools = TOOLKIT_CATALOG.filter((t) => t.featuredInHome);

  const scrollCarousel = (direction: 'left' | 'right') => {
    const el = carouselRef.current;
    if (!el) return;
    const step = Math.min(390, el.clientWidth * 0.85);
    el.scrollBy({
      left: direction === 'left' ? -step : step,
      behavior: 'smooth',
    });
  };

  const renderToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'globe':
        return <Globe className="w-5 h-5 text-white" />;
      case 'clock':
        return <Clock className="w-5 h-5 text-white" />;
      case 'shield-check':
        return <ShieldCheck className="w-5 h-5 text-white" />;
      case 'network':
        return <Network className="w-5 h-5 text-white" />;
      case 'hash':
        return <Hash className="w-5 h-5 text-white" />;
      case 'lock':
        return <Lock className="w-5 h-5 text-white" />;
      default:
        return <Boxes className="w-5 h-5 text-white" />;
    }
  };

  return (
    <main id="home" data-view="home" className="pb-12">
      {/* 01. HERO PRINCIPAL */}
      <section className="nt-hero" id="inicio">
        <div className="nt-hero-copy">
          <div className="nt-boot-stage-1 flex items-center gap-2 text-xs font-mono text-[#A3A3A3] tracking-wider uppercase">
            <span>NØTRACE 3.0</span>
            <span aria-hidden="true">·</span>
            <span>ECOSISTEMA DE CIBERSEGURIDAD</span>
          </div>

          <h1 className="nt-boot-stage-2" style={{ textWrap: 'balance' }}>
            El conocimiento
            <br />
            es poder.
          </h1>

          <p className="nt-muted nt-boot-stage-3">
            Comprende los sistemas. Domina la ciberseguridad. Desarrolla
            habilidades reales mediante métodos especializados, laboratorios
            prácticos y herramientas profesionales.
          </p>

          <div className="nt-actions nt-boot-stage-4">
            <button
              type="button"
              className="nt-btn nt-btn--primary"
              onClick={() => onNavigate('/metodos')}
            >
              <span>Explorar métodos</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              className="nt-btn"
              onClick={() => onNavigate('/herramientas')}
            >
              <span>Explorar herramientas</span>
            </button>

            <button
              type="button"
              className="nt-btn nt-btn--ghost"
              onClick={() => onNavigate('/nosotros')}
            >
              <span>Descubre NØTRACE</span>
            </button>
          </div>
        </div>

        <div className="nt-boot-art-stage min-w-0 w-full">
          <AsciiHackerArt
            density={0.88}
            speed={0.62}
            rain={true}
            assemble={true}
            quality={quality}
            paused={loaderOpen}
            replayOnUnpause={true}
          />
          <div className="nt-art-caption">
            <span ref={captionTextRef}>NØTRACE // ECOSYSTEM IDENTITY</span>
            <span>MONOCHROME OBSIDIAN UI</span>
          </div>
        </div>
      </section>

      {/* 02. CARRUSEL DE MÉTODOS DESTACADOS */}
      <section className="nt-section nt-boot-stage-5" id="metodos-destacados">
        <div className="nt-section-head">
          <div>
            <div className="text-xs font-mono text-[#737373] uppercase tracking-wider mb-1">
              NØTRACE METHODS
            </div>
            <h2>Métodos destacados</h2>
            <p className="nt-muted mt-1">
              Explora conocimientos que transforman tu manera de comprender la
              tecnología.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-2">
              <button
                type="button"
                onClick={() => scrollCarousel('left')}
                aria-label="Desplazar métodos a la izquierda"
                className="w-10 h-10 rounded-lg border border-[#2E2E2E] bg-[#0A0A0A] hover:bg-[#171717] hover:border-[#404040] flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel('right')}
                aria-label="Desplazar métodos a la derecha"
                className="w-10 h-10 rounded-lg border border-[#2E2E2E] bg-[#0A0A0A] hover:bg-[#171717] hover:border-[#404040] flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/metodos')}
              className="nt-btn text-xs"
            >
              <span>Ver todos los métodos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel Track with partial preview of next card */}
        <div
          ref={carouselRef}
          tabIndex={0}
          aria-label="Carrusel de Métodos destacados"
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth focus:outline-none"
          style={{ scrollbarWidth: 'thin' }}
        >
          {featuredMethods.map((method) => {
            const isOwned = unlockedMethodIds.includes(method.id);
            const isHovered = hoveredMethodId === method.id;

            return (
              <article
                key={method.id}
                onMouseEnter={() => setHoveredMethodId(method.id)}
                onMouseLeave={() => setHoveredMethodId(null)}
                className="snap-start shrink-0 w-[320px] sm:w-[356px] rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] hover:border-[#525252] transition-colors p-4 flex flex-col justify-between"
              >
                <div>
                  {/* Animated Technical Cover */}
                  <div className="mb-3.5">
                    <CourseMotionRemotionPlayer
                      theme={method.remotionTheme}
                      title={method.category}
                      showControls={false}
                      autoPlay={isHovered}
                    />
                  </div>

                  {/* Category & Access Tier Line */}
                  <div className="flex items-center justify-between gap-2 text-xs text-[#A3A3A3] mb-1.5">
                    <span className="font-mono uppercase tracking-wider text-[11px] text-[#A3A3A3]">
                      {method.category}
                    </span>
                    <span className="font-mono text-[11px] text-[#737373]">
                      {method.isFree ? 'MÉTODO GRATUITO' : 'MÉTODO PREMIUM'}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-white leading-snug">
                    {method.title}
                  </h3>

                  <p className="mt-2 text-xs text-[#A3A3A3] leading-relaxed line-clamp-2">
                    {method.shortDescription}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#1F1F1F] space-y-3">
                  {/* Difficulty, Modules & Duration */}
                  <div className="flex items-center justify-between text-xs text-[#737373]">
                    <span>Nivel: {method.level}</span>
                    <span className="font-mono tabular-nums">
                      {method.modulesCount} módulos · {method.duration}
                    </span>
                  </div>

                  {/* Price & Completion Reward */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      {method.isFree ? (
                        <span className="font-mono text-sm font-semibold text-white">
                          Acceso Libre
                        </span>
                      ) : (
                        <CurrencyAmount
                          currency={method.currency}
                          amount={method.priceAmount}
                          size="md"
                        />
                      )}
                    </div>

                    <div
                      className="flex items-center gap-1 text-[11px] text-[#A3A3A3]"
                      title="Recompensa educativa al completar el Método"
                    >
                      <span>Recompensa:</span>
                      <CurrencyAmount
                        currency="NOBYTE"
                        amount={method.rewardByte}
                        size="sm"
                        showName={false}
                        plusSign
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectMethod(method)}
                    className={`w-full nt-btn text-xs ${
                      isOwned ? '' : 'nt-btn--primary'
                    }`}
                  >
                    <span>
                      {isOwned ? 'Continuar método →' : 'Explorar método →'}
                    </span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 03. ECOSISTEMA DE HERRAMIENTAS — TU ARSENAL DE CONOCIMIENTO */}
      <section className="nt-section" id="arsenal-herramientas">
        <div className="nt-section-head">
          <div>
            <div className="text-xs font-mono text-[#737373] uppercase tracking-wider mb-1">
              NØTRACE TOOLKIT
            </div>
            <h2>Tu arsenal de conocimiento.</h2>
            <p className="nt-muted mt-1">
              Herramientas diseñadas para comprender, analizar y proteger los
              sistemas digitales.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/herramientas')}
            className="nt-btn text-xs"
          >
            <span>Explorar todas las herramientas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredTools.map((tool) => {
            const isAvailable =
              tool.status === 'Disponible' || tool.status === 'Interactivo';

            return (
              <article
                key={tool.id}
                className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] hover:border-[#525252] transition-colors p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="nt-icon-tile">
                      {renderToolIcon(tool.lucideIcon)}
                    </span>
                    <span className="text-xs font-mono text-[#737373]">
                      {tool.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {tool.name}
                    </h3>
                    <p className="mt-1.5 text-xs text-[#A3A3A3] leading-relaxed">
                      {tool.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="pt-3.5 border-t border-[#1F1F1F] flex items-center justify-between gap-3">
                  <span className="text-xs font-mono text-[#A3A3A3]">
                    {isAvailable ? 'Disponible' : 'Próximamente'}
                    {' · '}
                    {tool.tier === 'Gratuita'
                      ? 'Gratuita'
                      : `${tool.costAmount} ${tool.tier}`}
                  </span>

                  <button
                    type="button"
                    onClick={() => onNavigate(tool.route)}
                    className="nt-btn nt-btn--sm text-xs"
                  >
                    <span>
                      {isAvailable ? 'Abrir herramienta →' : 'Ver ficha →'}
                    </span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 04. ECONOMÍA NØTRACE — NØBYTE & NØCORE */}
      <section className="nt-section" id="economia-notrace">
        <div className="nt-section-head">
          <div>
            <div className="text-xs font-mono text-[#737373] uppercase tracking-wider mb-1">
              NØTRACE VAULT & ECONOMY SYSTEM
            </div>
            <h2>Economía virtual del ecosistema</h2>
            <p className="nt-muted mt-1">
              Un sistema de créditos internos diseñado para separar el mérito
              educativo del acceso a recursos especializados.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/billetera')}
            className="nt-btn text-xs"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Abrir NØTRACE VAULT</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* NØBYTE Card */}
          <article className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-6 flex flex-col justify-between gap-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="text-xs font-mono text-[#A3A3A3] uppercase tracking-wider">
                  MONEDA EDUCATIVA Y DE PARTICIPACIÓN
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  NØBYTE
                </h3>
                <p className="text-xs text-[#A3A3A3] leading-relaxed max-w-md">
                  Representa unidades de actividad tecnológica, aprendizaje y
                  resolución de laboratorios. Se obtiene principalmente
                  completando Métodos, módulos, evaluaciones y misiones.
                </p>
              </div>
              <div className="shrink-0 p-3 rounded-xl bg-[#111111] border border-[#2E2E2E]">
                <ByteIcon size={56} animated variant="detailed" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#1F1F1F] text-xs">
              <div>
                <div className="text-[#737373] mb-1">Cómo se obtiene</div>
                <div className="text-white">
                  Completar Métodos (+100), aprobar evaluaciones (+25) y
                  misiones del ecosistema.
                </div>
              </div>
              <div>
                <div className="text-[#737373] mb-1">Aplicaciones</div>
                <div className="text-white">
                  Herramientas de diagnóstico, laboratorios básicos y Métodos
                  seleccionados.
                </div>
              </div>
            </div>
          </article>

          {/* NØCORE Card */}
          <article className="rounded-xl bg-[#0A0A0A] border border-[#404040] p-6 flex flex-col justify-between gap-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="text-xs font-mono text-white uppercase tracking-wider">
                  MONEDA PREMIUM E INFRAESTRUCTURA
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  NØCORE
                </h3>
                <p className="text-xs text-[#A3A3A3] leading-relaxed max-w-md">
                  Representa el núcleo de capacidad tecnológica del ecosistema
                  NØTRACE. Destinada al acceso comercial a Métodos premium,
                  laboratorios avanzados y recursos con mayor costo operativo.
                </p>
              </div>
              <div className="shrink-0 p-3 rounded-xl bg-[#141414] border border-[#525252]">
                <CoreIcon size={56} animated variant="detailed" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#1F1F1F] text-xs">
              <div>
                <div className="text-[#737373] mb-1">Naturaleza</div>
                <div className="text-white">
                  Crédito interno de uso exclusivo en la plataforma (no es
                  criptomoneda ni activo especulativo).
                </div>
              </div>
              <div>
                <div className="text-[#737373] mb-1">Aplicaciones</div>
                <div className="text-white">
                  Desbloqueo de Métodos premium, entornos CTF avanzados e
                  informes especializados.
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* 05. MISIONES, ACTIVIDADES Y PROGRESIÓN (NØTRACE OPERATIONS) */}
      <section className="nt-section" id="operaciones-notrace">
        <div className="nt-section-head">
          <div>
            <div className="text-xs font-mono text-[#737373] uppercase tracking-wider mb-1">
              NØTRACE OPERATIONS & PROGRESSION
            </div>
            <h2>Misiones, actividades y rangos</h2>
            <p className="nt-muted mt-1">
              Desarrolla experiencia verificable mediante objetivos prácticos,
              separa tu rango académico de las monedas y obtén recompensas.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/misiones')}
            className="nt-btn text-xs"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Ver todas las operaciones</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Active Operations Preview */}
          <div className="lg:col-span-7 space-y-3">
            {OPERATIONS_MISSIONS.slice(0, 3).map((mission) => (
              <article
                key={mission.id}
                className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-[#737373]">
                    <span className="text-[#A3A3A3] font-medium">
                      {mission.type}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Dificultad: {mission.difficulty}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-white">
                      {mission.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white">
                    {mission.title}
                  </h3>
                  <p className="text-xs text-[#A3A3A3] line-clamp-1">
                    {mission.description}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <CurrencyAmount
                    currency={mission.rewardCurrency}
                    amount={mission.rewardAmount}
                    size="sm"
                    plusSign
                  />
                  <button
                    type="button"
                    onClick={() => onNavigate('/misiones')}
                    className="nt-btn nt-btn--sm text-xs"
                  >
                    <span>Ir a misión →</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* 7 Academic Progression Ranks Summary */}
          <div className="lg:col-span-5 rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-5 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-[#A3A3A3] uppercase tracking-wider">
                  JERARQUÍA ACADÉMICA (NO COMPRABLE)
                </span>
                <Award className="w-4 h-4 text-[#A3A3A3]" />
              </div>

              <div className="grid grid-cols-1 gap-2">
                {OPERATOR_RANKS.slice(0, 4).map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between gap-3 p-2 rounded-lg bg-[#121212] border border-[#1F1F1F]"
                  >
                    <div className="flex items-center gap-2.5">
                      <RankInsignia
                        rankNumber={r.id}
                        size={26}
                        active={r.id === 2}
                      />
                      <div>
                        <div className="text-xs font-mono font-semibold text-white">
                          {r.code}
                        </div>
                        <div className="text-[11px] text-[#737373] line-clamp-1">
                          {r.description}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-[#A3A3A3] tabular-nums shrink-0">
                      {r.minXp} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#1F1F1F] flex items-center justify-between text-xs text-[#A3A3A3]">
              <span>Rangos 01 — INITIATE hasta 07 — ZERO</span>
              <button
                type="button"
                onClick={() => onNavigate('/campus/progreso')}
                className="text-white hover:underline font-medium cursor-pointer"
              >
                Ver escalafón completo →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 06. SOBRE NØTRACE */}
      <section className="nt-section" id="sobre-notrace">
        <div className="rounded-2xl bg-[#0A0A0A] border border-[#2E2E2E] p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-mono text-[#A3A3A3] uppercase tracking-wider">
              SOBRE NØTRACE // ÉTICA Y TECNOLOGÍA
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              El conocimiento no tiene límites. La responsabilidad sí.
            </h2>
            <p className="text-sm text-[#A3A3A3] leading-relaxed">
              NØTRACE es un ecosistema de aprendizaje tecnológico especializado
              en ciberseguridad, privacidad digital y comprensión de sistemas
              informáticos. Nuestra misión es ofrecer métodos educativos,
              herramientas prácticas y experiencias de aprendizaje que permitan
              desarrollar habilidades reales en entornos responsables y
              autorizados.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('/nosotros')}
                className="nt-btn text-xs"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Conocer nuestra filosofía y metodología</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/ayuda')}
                className="nt-btn nt-btn--ghost text-xs"
              >
                <span>Centro de ayuda</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-[#121212] border border-[#2E2E2E] space-y-1.5">
              <BookOpen className="w-4 h-4 text-white" />
              <div className="font-semibold text-white">Métodos prácticos</div>
              <p className="text-[#A3A3A3] leading-relaxed">
                Módulos guiados con laboratorios CLI en entornos propios y
                simulados.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#121212] border border-[#2E2E2E] space-y-1.5">
              <Boxes className="w-4 h-4 text-white" />
              <div className="font-semibold text-white">Toolkit profesional</div>
              <p className="text-[#A3A3A3] leading-relaxed">
                Utilidades reales de inspección de red, privacidad y
                criptografía local.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#121212] border border-[#2E2E2E] space-y-1.5">
              <CheckCircle2 className="w-4 h-4 text-white" />
              <div className="font-semibold text-white">Ética verificable</div>
              <p className="text-[#A3A3A3] leading-relaxed">
                Cero análisis activos contra infraestructura ajena sin
                autorización.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#121212] border border-[#2E2E2E] space-y-1.5">
              <Wallet className="w-4 h-4 text-white" />
              <div className="font-semibold text-white">Economía transparente</div>
              <p className="text-[#A3A3A3] leading-relaxed">
                Separación estricta entre progreso académico y créditos
                internos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 07. LLAMADA A LA ACCIÓN FINAL */}
      <section className="nt-section">
        <div className="rounded-2xl bg-[#0A0A0A] border border-[#2E2E2E] p-8 md:p-12 text-center space-y-5">
          <div className="text-xs font-mono text-[#A3A3A3] uppercase tracking-wider">
            COMIENZA TU FORMACIÓN EN NØTRACE
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight max-w-2xl mx-auto">
            Construye criterio técnico real en ciberseguridad y privacidad.
          </h2>
          <p className="text-sm text-[#A3A3A3] max-w-xl mx-auto leading-relaxed">
            Accede a Métodos gratuitos desde hoy, explora el VPN Inspector con
            cartografía real o crea tu cuenta de estudiante para registrar tu
            progreso en el Campus.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('/registro')}
              className="nt-btn nt-btn--primary"
            >
              <span>Crear cuenta</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/metodos')}
              className="nt-btn"
            >
              <span>Explorar métodos</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};
