import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Terminal,
  SlidersHorizontal,
  Award,
  Layers,
  Clock,
  UserCheck,
} from 'lucide-react';
import {
  NOTRACE_METHODS,
  NotraceMethod,
} from '../data/notracePlatformData';
import { CourseMotionRemotionPlayer } from './RemotionCompositions';
import { CurrencyAmount } from './CurrencyIcons';

interface MethodsCatalogViewProps {
  selectedMethodSlug?: string | null;
  unlockedMethodIds: string[];
  onNavigate: (path: string) => void;
  onUnlockOrOpenMethod: (method: NotraceMethod) => void;
}

const ALL_CATEGORIES = [
  'Todas',
  'Hacking ético',
  'Ciberseguridad defensiva',
  'Linux',
  'Redes',
  'Privacidad digital',
  'OSINT responsable',
] as const;

export const MethodsCatalogView: React.FC<MethodsCatalogViewProps> = ({
  selectedMethodSlug = null,
  unlockedMethodIds,
  onNavigate,
  onUnlockOrOpenMethod,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Todas');
  const [tierFilter, setTierFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('Todos');
  const [currencyFilter, setCurrencyFilter] = useState<'all' | 'NOBYTE' | 'NOCORE'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'recent' | 'duration-asc' | 'price-asc'>('featured');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const selectedMethod = useMemo(() => {
    if (!selectedMethodSlug) return null;
    return (
      NOTRACE_METHODS.find(
        (m) => m.slug === selectedMethodSlug || m.id === selectedMethodSlug
      ) || null
    );
  }, [selectedMethodSlug]);

  const filteredMethods = useMemo(() => {
    return NOTRACE_METHODS.filter((m) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.shortDescription.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.instructor.toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === 'Todas' || m.category === categoryFilter;

      const matchesTier =
        tierFilter === 'all' ||
        (tierFilter === 'free' && m.isFree) ||
        (tierFilter === 'premium' && !m.isFree);

      const matchesDifficulty =
        difficultyFilter === 'Todos' || m.level === difficultyFilter;

      const matchesCurrency =
        currencyFilter === 'all' ||
        (m.isFree && currencyFilter === 'NOBYTE') ||
        m.currency === currencyFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesTier &&
        matchesDifficulty &&
        matchesCurrency
      );
    }).sort((a, b) => {
      if (sortBy === 'recent') {
        return (b.isRecent ? 1 : 0) - (a.isRecent ? 1 : 0);
      }
      if (sortBy === 'duration-asc') {
        return a.durationHours - b.durationHours;
      }
      if (sortBy === 'price-asc') {
        return a.priceAmount - b.priceAmount;
      }
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [
    searchQuery,
    categoryFilter,
    tierFilter,
    difficultyFilter,
    currencyFilter,
    sortBy,
  ]);

  // VIEW A: Individual Method Detail Page (/metodos/:slug)
  if (selectedMethod) {
    const isOwned =
      selectedMethod.isFree || unlockedMethodIds.includes(selectedMethod.id);

    return (
      <main className="py-5 sm:py-8 space-y-6 sm:space-y-8" aria-label={`Detalle del Método ${selectedMethod.title}`}>
        {/* Breadcrumb / Back Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1F1F1F]">
          <button
            type="button"
            onClick={() => onNavigate('/metodos')}
            className="nt-btn nt-btn--sm text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al catálogo de Métodos</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-[#A3A3A3]">
            <span>NØTRACE METHODS</span>
            <span aria-hidden="true">/</span>
            <span className="text-white">{selectedMethod.category}</span>
          </div>
        </div>

        {/* Hero Detail Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#A3A3A3]">
              <span className="font-mono uppercase text-white">
                {selectedMethod.category}
              </span>
              <span aria-hidden="true">·</span>
              <span>Nivel: {selectedMethod.level}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                {selectedMethod.modulesCount} módulos · {selectedMethod.duration}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-white">
                {selectedMethod.isFree ? 'Método Gratuito' : 'Método Premium'}
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
              {selectedMethod.title}
            </h1>

            <p className="text-sm text-[#A3A3A3] leading-relaxed">
              {selectedMethod.shortDescription}
            </p>

            {/* Instructor & Environment Note */}
            <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-[#A3A3A3]" />
                <div>
                  <span className="text-[#737373]">Especialista responsable: </span>
                  <strong className="text-white">{selectedMethod.instructor}</strong>
                </div>
              </div>
              <span className="font-mono text-[#A3A3A3]">
                Entorno de práctica aislado incluido
              </span>
            </div>

            {/* Objectives / Outcomes */}
            <div className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-5 space-y-3">
              <h2 className="text-sm font-semibold text-white">
                Objetivos de aprendizaje y competencias
              </h2>
              <ul className="space-y-2 text-xs text-[#A3A3A3]">
                {selectedMethod.outcomes.map((outcome, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements & Included Resources */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-5 space-y-2.5">
                <h3 className="text-xs font-mono uppercase tracking-wider text-white">
                  Conocimientos requeridos
                </h3>
                <ul className="space-y-2 text-xs text-[#A3A3A3]">
                  {selectedMethod.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-mono text-white">—</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-5 space-y-2.5">
                <h3 className="text-xs font-mono uppercase tracking-wider text-white">
                  Recursos incluidos
                </h3>
                <ul className="space-y-2 text-xs text-[#A3A3A3]">
                  {selectedMethod.resourcesIncluded.map((res, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-mono text-white">—</span>
                      <span>{res}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Cover, Acquisition/Access Card & Reward */}
          <aside className="lg:col-span-5 space-y-5">
            <div className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-4 sm:p-5 space-y-5">
              <CourseMotionRemotionPlayer
                theme={selectedMethod.remotionTheme}
                title={selectedMethod.title}
                showControls={true}
                autoPlay={false}
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1F1F1F]">
                <div>
                  <div className="text-xs text-[#737373] mb-1">
                    {selectedMethod.isFree
                      ? 'Acceso al Método'
                      : 'Valor en créditos internos'}
                  </div>
                  {selectedMethod.isFree ? (
                    <div className="text-xl font-bold font-mono text-white">
                      Gratuito
                    </div>
                  ) : (
                    <CurrencyAmount
                      currency={selectedMethod.currency}
                      amount={selectedMethod.priceAmount}
                      size="lg"
                    />
                  )}
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs text-[#737373] mb-1">
                    Recompensa al completar
                  </div>
                  <CurrencyAmount
                    currency="NOBYTE"
                    amount={selectedMethod.rewardByte}
                    size="md"
                    plusSign
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-[#121212] border border-[#1F1F1F]">
                  <Layers className="w-3.5 h-3.5 text-[#A3A3A3] mx-auto mb-1" />
                  <div className="font-mono font-semibold text-white">
                    {selectedMethod.modulesCount}
                  </div>
                  <div className="text-[11px] text-[#737373]">Módulos</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#121212] border border-[#1F1F1F]">
                  <Clock className="w-3.5 h-3.5 text-[#A3A3A3] mx-auto mb-1" />
                  <div className="font-mono font-semibold text-white">
                    {selectedMethod.duration}
                  </div>
                  <div className="text-[11px] text-[#737373]">Duración</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#121212] border border-[#1F1F1F]">
                  <Award className="w-3.5 h-3.5 text-[#A3A3A3] mx-auto mb-1" />
                  <div className="font-mono font-semibold text-white">
                    +{selectedMethod.rewardByte}
                  </div>
                  <div className="text-[11px] text-[#737373]">NØBYTE</div>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => onUnlockOrOpenMethod(selectedMethod)}
                  className="w-full nt-btn nt-btn--primary"
                >
                  <Terminal className="w-4 h-4" />
                  <span>
                    {isOwned
                      ? 'Acceder al Método en Campus Virtual →'
                      : 'Desbloquear y abrir en Campus Virtual →'}
                  </span>
                </button>

                {!isOwned && (
                  <button
                    type="button"
                    onClick={() => onNavigate('/billetera')}
                    className="w-full nt-btn text-xs"
                  >
                    <span>Consultar saldo en NØTRACE VAULT</span>
                  </button>
                )}
              </div>

              <p className="text-[11px] text-[#737373] leading-relaxed">
                Nota: Todos los laboratorios y ejercicios incluidos en este
                Método se ejecutan dentro del entorno aislado de NØTRACE Campus.
              </p>
            </div>
          </aside>
        </div>

        {/* Syllabus / Temario & Laboratory Preview */}
        <section className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-4 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#1F1F1F]">
            <div>
              <div className="text-xs font-mono text-[#737373] uppercase">
                ESTRUCTURA CURRICULAR
              </div>
              <h2 className="text-lg font-semibold text-white">
                Temario principal y laboratorio práctico
              </h2>
            </div>
            <span className="text-xs font-mono text-[#A3A3A3]">
              {selectedMethod.courseRef.lessons.length} sesiones interactivas + 1 Laboratorio CLI
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedMethod.courseRef.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="p-4 rounded-xl bg-[#121212] border border-[#2E2E2E] space-y-2"
              >
                <div className="flex items-start justify-between gap-2 text-xs">
                  <span className="font-semibold text-white">{lesson.title}</span>
                  <span className="font-mono text-[#A3A3A3] tabular-nums shrink-0">
                    {lesson.duration}
                  </span>
                </div>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  {lesson.summary}
                </p>
                <div className="pt-1 font-mono text-[11px] text-[#737373] break-all sm:truncate">
                  Comando clave: <span className="text-white">$ {lesson.keyCommand}</span>
                </div>
              </div>
            ))}

            {/* Laboratory Card */}
            <div className="p-4 rounded-xl bg-[#121212] border border-[#404040] space-y-2">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Laboratorio Práctico Autorizado</span>
                </span>
                <span className="font-mono text-white">CLI SANDBOX</span>
              </div>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                {selectedMethod.courseRef.lab.prompt}
              </p>
              <div className="pt-1 font-mono text-[11px] text-[#A3A3A3]">
                Recompensa asociada: +{selectedMethod.rewardByte} NØBYTE al completar evaluación.
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // VIEW B: Full Methods Catalog (/metodos)
  return (
    <main className="py-5 sm:py-8 space-y-6 sm:space-y-8" aria-label="Catálogo de Métodos NØTRACE">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
        <div>
          <div className="text-xs font-mono text-[#737373] uppercase tracking-wider mb-1">
            NØTRACE METHODS // CATÁLOGO OFICIAL
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
            Explorar Métodos
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-2 max-w-2xl">
            Experiencias estructuradas de aprendizaje, investigación, práctica
            en consola y desarrollo de habilidades de ciberseguridad en
            entornos autorizados.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('/campus')}
            className="nt-btn text-xs w-full sm:w-auto justify-center"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Ir a mi Campus ({unlockedMethodIds.length})</span>
          </button>
        </div>
      </div>

      {/* Search & Multi-Filter Control Bar */}
      <div className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar Método por tema, protocolo o instructor..."
              aria-label="Buscar Métodos"
              className="nt-input pl-10 text-xs"
            />
          </div>

          {/* Tier Filter (Gratuitos / Premium) */}
          <div className="md:col-span-2">
            <select
              aria-label="Filtrar por acceso"
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value as any)}
              className="nt-input text-xs"
            >
              <option value="all">Acceso: Todos</option>
              <option value="free">Métodos gratuitos</option>
              <option value="premium">Métodos premium</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="md:col-span-2">
            <select
              aria-label="Filtrar por dificultad"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="nt-input text-xs"
            >
              <option value="Todos">Nivel: Todos</option>
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
              <option value="Especialista">Especialista</option>
            </select>
          </div>

          {/* Currency Filter */}
          <div className="md:col-span-3">
            <select
              aria-label="Ordenar y filtrar por moneda"
              value={`${currencyFilter}|${sortBy}`}
              onChange={(e) => {
                const [curr, srt] = e.target.value.split('|');
                setCurrencyFilter(curr as any);
                setSortBy(srt as any);
              }}
              className="nt-input text-xs"
            >
              <option value="all|featured">Orden: Destacados primero</option>
              <option value="all|recent">Orden: Más recientes</option>
              <option value="all|duration-asc">Orden: Menor duración</option>
              <option value="all|price-asc">Orden: Acceso libre / menor costo</option>
              <option value="NOBYTE|featured">Moneda: NØBYTE / Gratuitos</option>
              <option value="NOCORE|featured">Moneda: NØCORE (Premium)</option>
            </select>
          </div>
        </div>

        {/* Category Segmented Bar */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-3 pt-2 border-t border-[#1F1F1F]">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-white text-black'
                    : 'bg-[#121212] text-[#A3A3A3] hover:text-white border border-[#2E2E2E]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono text-[#737373]">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{filteredMethods.length} Métodos encontrados</span>
          </div>
        </div>
      </div>

      {/* Methods Grid */}
      {filteredMethods.length === 0 ? (
        <div className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-12 text-center space-y-3">
          <p className="text-sm text-white font-semibold">
            No se encontraron Métodos con los filtros seleccionados.
          </p>
          <p className="text-xs text-[#A3A3A3]">
            Prueba a restablecer la categoría o el término de búsqueda.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('Todas');
              setTierFilter('all');
              setDifficultyFilter('Todos');
              setCurrencyFilter('all');
            }}
            className="nt-btn text-xs"
          >
            Restablecer filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMethods.map((method) => {
            const isOwned =
              method.isFree || unlockedMethodIds.includes(method.id);
            const isHovered = hoveredId === method.id;

            return (
              <article
                key={method.id}
                onMouseEnter={() => setHoveredId(method.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] hover:border-[#525252] transition-colors p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="mb-4">
                    <CourseMotionRemotionPlayer
                      theme={method.remotionTheme}
                      title={method.category}
                      showControls={false}
                      autoPlay={isHovered}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 text-xs text-[#A3A3A3] mb-1.5">
                    <span className="font-mono uppercase text-[11px] text-white">
                      {method.category}
                    </span>
                    <span className="font-mono text-[11px] text-[#737373]">
                      {method.isFree ? 'GRATUITO' : 'PREMIUM'}
                    </span>
                  </div>

                  <h2 className="text-base font-semibold text-white leading-snug">
                    {method.title}
                  </h2>

                  <p className="mt-2 text-xs text-[#A3A3A3] leading-relaxed line-clamp-3">
                    {method.shortDescription}
                  </p>

                  <div className="mt-3 pt-3 border-t border-[#171717] text-[11px] text-[#737373] space-y-1">
                    <div>
                      Requisitos: <span className="text-[#A3A3A3]">{method.requirements[0]}</span>
                    </div>
                    <div>
                      Especialista: <span className="text-[#A3A3A3]">{method.instructor}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#1F1F1F] space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#A3A3A3]">
                    <span>Nivel: {method.level}</span>
                    <span className="font-mono tabular-nums">
                      {method.modulesCount} módulos · {method.duration}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      {method.isFree ? (
                        <span className="font-mono text-sm font-semibold text-white">
                          Gratuito
                        </span>
                      ) : (
                        <CurrencyAmount
                          currency={method.currency}
                          amount={method.priceAmount}
                          size="md"
                        />
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-[#A3A3A3]">
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

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onNavigate(`/metodos/${method.slug}`)}
                      className="nt-btn nt-btn--sm text-xs"
                    >
                      <span>Ver detalles</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onUnlockOrOpenMethod(method)}
                      className={`nt-btn nt-btn--sm text-xs ${
                        isOwned ? '' : 'nt-btn--primary'
                      }`}
                    >
                      <span>{isOwned ? 'Continuar' : 'Acceder'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
};
