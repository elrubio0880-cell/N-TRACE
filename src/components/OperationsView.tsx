import React, { useState } from 'react';
import {
  Target,
  Gift,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  OPERATIONS_MISSIONS,
  OPERATOR_RANKS,
  OperationMission,
} from '../data/notracePlatformData';
import {
  CurrencyAmount,
  RankInsignia,
  ByteIcon,
  CoreIcon,
} from './CurrencyIcons';

interface OperationsViewProps {
  initialSection?: 'misiones' | 'recompensas' | 'eventos';
  onNavigate: (path: string) => void;
}

export const OperationsView: React.FC<OperationsViewProps> = ({
  initialSection = 'misiones',
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'misiones' | 'recompensas' | 'eventos'>(
    initialSection
  );
  const [statusFilter, setStatusFilter] = useState<string>('Todas');
  const [claimedDemoIds, setClaimedDemoIds] = useState<string[]>([]);
  const [claimBanner, setClaimBanner] = useState<string | null>(null);

  const handleDemoClaim = (mission: OperationMission) => {
    if (!claimedDemoIds.includes(mission.id)) {
      setClaimedDemoIds((prev) => [...prev, mission.id]);
    }
    setClaimBanner(
      `Demostración visual de recompensa: "${mission.title}" (+${mission.rewardAmount} ${mission.rewardCurrency} y +${mission.xpReward} XP académicos). En producción, la validación y acreditación se ejecutan de forma atómica en el servidor.`
    );
  };

  const filteredMissions = OPERATIONS_MISSIONS.filter((m) => {
    if (activeTab === 'eventos') {
      return m.type === 'Evento especial' || m.type === 'Reto semanal';
    }
    if (statusFilter === 'Todas') return true;
    const effectiveStatus = claimedDemoIds.includes(m.id)
      ? 'Recompensa reclamada'
      : m.status;
    return effectiveStatus === statusFilter;
  });

  return (
    <main className="py-8 space-y-8" aria-label="NØTRACE Operations">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
        <div>
          <div className="text-xs font-mono text-[#737373] uppercase tracking-wider mb-1">
            NØTRACE OPERATIONS // PROGRESIÓN Y ACTIVIDADES
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Misiones, Recompensas y Eventos
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-2 max-w-2xl">
            Desarrolla habilidades prácticas verificables en laboratorios y
            herramientas. Obtén experiencia académica para tu rango y unidades
            <strong className="text-white"> NØBYTE</strong> como incentivo
            educativo.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#0A0A0A] border border-[#2E2E2E]">
          <button
            type="button"
            onClick={() => {
              setActiveTab('misiones');
              onNavigate('/misiones');
            }}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'misiones'
                ? 'bg-white text-black'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Misiones</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('recompensas');
              onNavigate('/recompensas');
            }}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'recompensas'
                ? 'bg-white text-black'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Recompensas y Rangos</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('eventos');
              onNavigate('/eventos');
            }}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'eventos'
                ? 'bg-white text-black'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Eventos y Retos</span>
          </button>
        </div>
      </div>

      {/* Reward Claim Visual Confirmation Notification */}
      {claimBanner && (
        <div
          role="status"
          className="rounded-xl bg-[#121212] border border-white p-4 flex items-start justify-between gap-4 text-xs"
        >
          <div className="flex items-start gap-3">
            <ByteIcon size={28} animated />
            <div className="space-y-1">
              <div className="font-semibold text-white">
                Confirmación Visual de Recompensa (Modo Demostración)
              </div>
              <p className="text-[#A3A3A3] leading-relaxed">{claimBanner}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setClaimBanner(null)}
            className="text-[#A3A3A3] hover:text-white font-mono cursor-pointer shrink-0"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* TAB 1 & 3: MISIONES / EVENTOS */}
      {(activeTab === 'misiones' || activeTab === 'eventos') && (
        <div className="space-y-6">
          {/* Status Filter Bar */}
          {activeTab === 'misiones' && (
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                'Todas',
                'Disponible',
                'En progreso',
                'Recompensa disponible',
                'Completada',
                'Recompensa reclamada',
              ].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    statusFilter === st
                      ? 'bg-white text-black'
                      : 'bg-[#0A0A0A] text-[#A3A3A3] border border-[#2E2E2E] hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          )}

          {/* Missions List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMissions.map((mission) => {
              const isClaimed =
                claimedDemoIds.includes(mission.id) ||
                mission.status === 'Recompensa reclamada';
              const effectiveStatus = isClaimed
                ? 'Recompensa reclamada'
                : mission.status;
              const pct = Math.round(
                (mission.progressCurrent / mission.progressTarget) * 100
              );

              return (
                <article
                  key={mission.id}
                  className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-5 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 text-[#A3A3A3]">
                        <span className="font-mono text-white">
                          {mission.type}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{mission.difficulty}</span>
                      </div>

                      <span className="font-mono text-[11px] text-white border border-[#383838] bg-[#141414] px-2 py-0.5 rounded">
                        {effectiveStatus}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-base font-semibold text-white">
                        {mission.title}
                      </h2>
                      <p className="mt-1.5 text-xs text-[#A3A3A3] leading-relaxed">
                        {mission.description}
                      </p>
                    </div>

                    <div className="text-[11px] text-[#737373] space-y-1">
                      <div>
                        Requisito:{' '}
                        <span className="text-[#A3A3A3]">
                          {mission.requirements}
                        </span>
                      </div>
                      {mission.deadline && (
                        <div className="flex items-center gap-1 text-[#A3A3A3]">
                          <Clock className="w-3 h-3" />
                          <span>{mission.deadline}</span>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#A3A3A3]">
                        <span>Progreso de la actividad</span>
                        <span>
                          {mission.progressCurrent} / {mission.progressTarget} ({pct}%)
                        </span>
                      </div>
                      <div
                        className="nt-progress"
                        style={{ '--progress': `${pct}%` } as React.CSSProperties}
                      >
                        <span />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3.5 border-t border-[#1F1F1F] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <CurrencyAmount
                        currency={mission.rewardCurrency}
                        amount={mission.rewardAmount}
                        size="sm"
                        plusSign
                      />
                      <span className="text-xs font-mono text-[#737373]">
                        +{mission.xpReward} XP
                      </span>
                    </div>

                    {effectiveStatus === 'Recompensa disponible' ? (
                      <button
                        type="button"
                        onClick={() => handleDemoClaim(mission)}
                        className="nt-btn nt-btn--primary nt-btn--sm text-xs"
                      >
                        <Gift className="w-3.5 h-3.5" />
                        <span>Reclamar recompensa (Demo)</span>
                      </button>
                    ) : effectiveStatus === 'Recompensa reclamada' ||
                      effectiveStatus === 'Completada' ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#4ADE80]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{effectiveStatus}</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          onNavigate(
                            mission.id === 'op-crypto-integrity'
                              ? '/herramientas/crypto-lab'
                              : mission.id === 'op-vpn-audit'
                              ? '/herramientas/vpn-inspector'
                              : '/campus'
                          )
                        }
                        className="nt-btn nt-btn--sm text-xs"
                      >
                        <span>Ir a actividad</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: RECOMPENSAS Y ESCALAFÓN DE RANGOS (01 — INITIATE to 07 — ZERO) */}
      {activeTab === 'recompensas' && (
        <div className="space-y-8">
          {/* Separation of 3 Concepts Notice */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-5 space-y-2">
              <Award className="w-5 h-5 text-white" />
              <h2 className="text-sm font-semibold text-white">
                1. Experiencia Educativa (XP & Rangos)
              </h2>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                Refleja tu mérito académico real desde <strong>01 — INITIATE</strong>{' '}
                hasta <strong>07 — ZERO</strong>. No tiene valor monetario ni
                puede comprarse con saldo.
              </p>
            </div>

            <div className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-5 space-y-2">
              <ByteIcon size={22} />
              <h2 className="text-sm font-semibold text-white">
                2. Moneda Común (NØBYTE)
              </h2>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                Incentivo de participación por finalizar Métodos, laboratorios
                y misiones. Aplicable a utilidades del Toolkit y recursos
                educativos.
              </p>
            </div>

            <div className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-5 space-y-2">
              <CoreIcon size={22} />
              <h2 className="text-sm font-semibold text-white">
                3. Moneda Premium (NØCORE)
              </h2>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                Crédito interno comercial destinado a Métodos premium y
                laboratorios avanzados con mayor requerimiento de
                infraestructura.
              </p>
            </div>
          </div>

          {/* 7 Ranks Vector Hierarchy */}
          <section className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-xs font-mono text-[#737373] uppercase">
                  SISTEMA DE PROGRESIÓN DEL USUARIO
                </div>
                <h2 className="text-lg font-semibold text-white mt-0.5">
                  Escalafón Oficial NØTRACE (01 — INITIATE a 07 — ZERO)
                </h2>
              </div>
              <span className="text-xs font-mono text-white">
                Rango actual en sesión: 02 — OPERATOR (620 XP)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {OPERATOR_RANKS.map((rank) => {
                const isCurrent = rank.id === 2;
                const isReached = rank.id <= 2;

                return (
                  <article
                    key={rank.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                      isCurrent
                        ? 'bg-[#171717] border-white'
                        : 'bg-[#121212] border-[#2E2E2E]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <RankInsignia
                          rankNumber={rank.id}
                          size={40}
                          active={isReached}
                        />
                        <div>
                          <div className="text-xs font-mono font-bold text-white">
                            {rank.code}
                          </div>
                          <div className="text-[11px] font-mono text-[#A3A3A3] tabular-nums">
                            Requisito: {rank.minXp.toLocaleString('es-ES')} XP
                          </div>
                        </div>
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] font-mono bg-white text-black font-semibold px-2 py-0.5 rounded">
                          ACTUAL
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#A3A3A3] leading-relaxed">
                      {rank.description}
                    </p>

                    <ul className="pt-2 border-t border-[#262626] space-y-1 text-[11px] text-[#737373]">
                      {rank.capabilities.map((cap, idx) => (
                        <li key={idx}>· {cap}</li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </section>

          <div className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-4 flex items-center gap-3 text-xs text-[#A3A3A3]">
            <Info className="w-4 h-4 text-white shrink-0" />
            <span>
              NØTRACE no utiliza cajas de recompensa aleatorias, mecánicas de
              azar ni permite comprar rangos académicos o certificados.
            </span>
          </div>
        </div>
      )}
    </main>
  );
};
