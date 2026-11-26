import React, { useEffect, useState } from 'react';
import {
  GraduationCap,
  ChartNoAxesColumn,
  FlaskConical,
  Award,
  BookOpen,
  Play,
  Terminal as TerminalIcon,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react';
import {
  NOTRACE_METHODS,
  OPERATOR_RANKS,
  NotraceMethod,
} from '../data/notracePlatformData';
import { CourseLesson } from '../data/cyberData';
import { CourseMotionRemotionPlayer } from './RemotionCompositions';
import { CurrencyAmount, RankInsignia } from './CurrencyIcons';

interface CampusViewProps {
  initialTab?: 'methods' | 'progreso' | 'laboratorios' | 'certificados';
  activeMethodId?: string;
  unlockedMethodIds: string[];
  onNavigate: (path: string) => void;
  onSelectMethodDetail: (method: NotraceMethod) => void;
}

export const CampusView: React.FC<CampusViewProps> = ({
  initialTab = 'methods',
  activeMethodId,
  unlockedMethodIds,
  onNavigate,
  onSelectMethodDetail,
}) => {
  const [activeTab, setActiveTab] = useState<
    'methods' | 'progreso' | 'laboratorios' | 'certificados'
  >(initialTab);

  const initialMethod =
    NOTRACE_METHODS.find((m) => m.id === activeMethodId) ||
    NOTRACE_METHODS.find((m) => unlockedMethodIds.includes(m.id)) ||
    NOTRACE_METHODS[0];

  const [selectedMethod, setSelectedMethod] =
    useState<NotraceMethod>(initialMethod);
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson>(
    initialMethod.courseRef.lessons[0]
  );
  const [playerMode, setPlayerMode] = useState<'lesson' | 'lab'>('lesson');
  const [copiedCommand, setCopiedCommand] = useState<boolean>(false);

  // Interactive CLI Sandbox state
  const [cliInput, setCliInput] = useState<string>(
    initialMethod.courseRef.lab.expectedCommand
  );

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (!activeMethodId) return;
    const found = NOTRACE_METHODS.find((m) => m.id === activeMethodId);
    if (found && found.id !== selectedMethod.id) {
      setSelectedMethod(found);
      setSelectedLesson(found.courseRef.lessons[0]);
      setCliInput(found.courseRef.lab.expectedCommand);
    }
  }, [activeMethodId, selectedMethod.id]);
  const [cliHistory, setCliHistory] = useState<
    { cmd: string; output: string[]; ok: boolean }[]
  >([
    {
      cmd: 'uname -r && id',
      output: [
        '6.11.4-notrace-amd64',
        'uid=1000(operator) gid=1000(operator) groups=1000(notrace-campus)',
      ],
      ok: true,
    },
  ]);
  const [completedLabIds, setCompletedLabIds] = useState<string[]>([
    'linux-servers-hardening',
  ]);

  const handleSwitchMethod = (
    method: NotraceMethod,
    mode: 'lesson' | 'lab' = 'lesson'
  ) => {
    setSelectedMethod(method);
    setSelectedLesson(method.courseRef.lessons[0]);
    setPlayerMode(mode);
    setCliInput(method.courseRef.lab.expectedCommand);
  };

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard?.writeText(cmd);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 1600);
  };

  const handleRunCli = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = cliInput.trim();
    if (!trimmed) return;

    const expected = selectedMethod.courseRef.lab.expectedCommand.toLowerCase();
    const isMatch =
      trimmed.toLowerCase() === expected ||
      trimmed.toLowerCase().includes(expected.split(' ')[0]);

    if (isMatch) {
      setCliHistory((prev) => [
        ...prev,
        {
          cmd: trimmed,
          output: selectedMethod.courseRef.lab.outputLines,
          ok: true,
        },
      ]);
      if (!completedLabIds.includes(selectedMethod.id)) {
        setCompletedLabIds((prev) => [...prev, selectedMethod.id]);
      }
    } else {
      setCliHistory((prev) => [
        ...prev,
        {
          cmd: trimmed,
          output: [
            `Comando '${trimmed}' no reconocido para este objetivo.`,
            `Sugerencia del instructor: ${selectedMethod.courseRef.lab.hint}`,
          ],
          ok: false,
        },
      ]);
    }
  };

  return (
    <main className="py-8 space-y-8" aria-label="NØTRACE Campus">
      {/* Header & Campus Sub-navigation */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
        <div>
          <div className="text-xs font-mono text-[#737373] uppercase tracking-wider mb-1">
            NØTRACE CAMPUS // ENTORNO DE APRENDIZAJE PRÁCTICO
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Campus Virtual y Laboratorios
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-2 max-w-2xl">
            Estudia tus Métodos activos, ejecuta prácticas guiadas en la
            terminal aislada y consulta tu expediente académico.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] w-full lg:w-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab('methods');
              onNavigate('/campus');
            }}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'methods'
                ? 'bg-white text-black'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Mis Métodos & Aula</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('laboratorios');
              setPlayerMode('lab');
            }}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'laboratorios'
                ? 'bg-white text-black'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Laboratorios CLI</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('progreso');
              onNavigate('/campus/progreso');
            }}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'progreso'
                ? 'bg-white text-black'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            <ChartNoAxesColumn className="w-3.5 h-3.5" />
            <span>Progreso</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('certificados')}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'certificados'
                ? 'bg-white text-black'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Certificados</span>
          </button>
        </div>
      </div>

      {/* TAB 1 & 2: MIS MÉTODOS & AULA VIRTUAL / LABORATORIOS CLI */}
      {(activeTab === 'methods' || activeTab === 'laboratorios') && (
        <div className="space-y-8">
          {/* Enrolled / Available Methods Switcher Strip */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#A3A3A3] uppercase">
                SELECCIONA UN MÉTODO PARA ABRIR EN EL AULA VIRTUAL
              </span>
              <button
                type="button"
                onClick={() => onNavigate('/metodos')}
                className="text-xs text-white hover:underline cursor-pointer"
              >
                Explorar catálogo completo de Métodos →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {NOTRACE_METHODS.map((m) => {
                const isSelected = selectedMethod.id === m.id;
                const isUnlocked =
                  m.isFree || unlockedMethodIds.includes(m.id);

                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() =>
                      handleSwitchMethod(
                        m,
                        activeTab === 'laboratorios' ? 'lab' : 'lesson'
                      )
                    }
                    className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#171717] border-white'
                        : 'bg-[#0A0A0A] border-[#2E2E2E] hover:border-[#525252]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                      <span className="text-[#A3A3A3]">{m.category}</span>
                      <span
                        className={
                          isUnlocked ? 'text-white' : 'text-[#737373]'
                        }
                      >
                        {isUnlocked ? 'ACTIVO EN CAMPUS' : 'VISTA PREVIA'}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-white line-clamp-1">
                      {m.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Classroom Console & CLI Laboratory */}
          <section className="rounded-2xl bg-[#0A0A0A] border border-[#2E2E2E] p-6 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#1F1F1F]">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#A3A3A3]">
                  <span className="font-mono text-white">
                    {selectedMethod.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Especialista: {selectedMethod.instructor}</span>
                  <span aria-hidden="true">·</span>
                  <span>Recompensa: +{selectedMethod.rewardByte} NØBYTE</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">
                  {selectedMethod.title}
                </h2>
              </div>

              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#121212] border border-[#2E2E2E] self-start">
                <button
                  type="button"
                  onClick={() => setPlayerMode('lesson')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
                    playerMode === 'lesson'
                      ? 'bg-white text-black'
                      : 'text-[#A3A3A3] hover:text-white'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Lección y Documentación</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPlayerMode('lab');
                    setCliInput(selectedMethod.courseRef.lab.expectedCommand);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
                    playerMode === 'lab'
                      ? 'bg-white text-black'
                      : 'text-[#A3A3A3] hover:text-white'
                  }`}
                >
                  <TerminalIcon className="w-3.5 h-3.5" />
                  <span>Laboratorio CLI</span>
                </button>
              </div>
            </div>

            {playerMode === 'lesson' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 space-y-4">
                  <CourseMotionRemotionPlayer
                    theme={selectedMethod.remotionTheme}
                    title={selectedLesson.title}
                    showControls={true}
                    autoPlay={false}
                  />

                  <div className="p-5 rounded-xl bg-[#121212] border border-[#2E2E2E] space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">
                        {selectedLesson.title}
                      </span>
                      <span className="font-mono text-[#A3A3A3] tabular-nums">
                        {selectedLesson.duration}
                      </span>
                    </div>

                    <p className="text-sm text-[#A3A3A3] leading-relaxed">
                      {selectedLesson.transcript}
                    </p>

                    <div className="pt-2">
                      <div className="flex items-center justify-between px-3 py-1.5 rounded-t-lg bg-[#171717] border border-b-0 border-[#2E2E2E] text-[11px] font-mono text-[#A3A3A3]">
                        <span>Comando de referencia técnica</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyCommand(selectedLesson.keyCommand)
                          }
                          className="flex items-center gap-1 text-white hover:text-[#A3A3A3] cursor-pointer"
                        >
                          {copiedCommand ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#4ADE80]" />
                              <span>Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-3 rounded-b-lg bg-[#000000] border border-[#2E2E2E] font-mono text-xs text-white overflow-x-auto">
                        <code>$ {selectedLesson.keyCommand}</code>
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Modules Syllabus Sidebar */}
                <div className="lg:col-span-5 rounded-xl bg-[#121212] border border-[#2E2E2E] p-5 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="text-xs font-mono text-[#A3A3A3] uppercase">
                      MÓDULOS DEL MÉTODO ({selectedMethod.courseRef.lessons.length})
                    </div>
                    <div className="space-y-2">
                      {selectedMethod.courseRef.lessons.map((lesson) => {
                        const isCur = selectedLesson.id === lesson.id;
                        return (
                          <button
                            key={lesson.id}
                            type="button"
                            onClick={() => setSelectedLesson(lesson)}
                            className={`w-full p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                              isCur
                                ? 'bg-[#1A1A1A] border-white text-white'
                                : 'bg-[#0A0A0A] border-[#2E2E2E] text-[#A3A3A3] hover:border-[#525252]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <span className="font-medium text-white truncate">
                                {lesson.title}
                              </span>
                              <span className="font-mono text-[#737373] tabular-nums shrink-0">
                                {lesson.duration}
                              </span>
                            </div>
                            <p className="text-xs text-[#737373] mt-1 line-clamp-2">
                              {lesson.summary}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#1F1F1F] flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onSelectMethodDetail(selectedMethod)}
                      className="nt-btn nt-btn--sm text-xs"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Ficha del Método</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPlayerMode('lab');
                        setCliInput(
                          selectedMethod.courseRef.lab.expectedCommand
                        );
                      }}
                      className="nt-btn nt-btn--primary nt-btn--sm text-xs"
                    >
                      <span>Ejecutar Laboratorio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* CLI Laboratory View */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 rounded-xl bg-[#121212] border border-[#2E2E2E] p-5 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="text-xs font-mono text-[#A3A3A3] uppercase">
                      LABORATORIO PRÁCTICO AISLADO
                    </div>
                    <h3 className="text-base font-semibold text-white">
                      {selectedMethod.title}
                    </h3>
                    <p className="text-xs text-[#A3A3A3] leading-relaxed">
                      {selectedMethod.courseRef.lab.prompt}
                    </p>

                    <div className="p-3 rounded-lg bg-[#000000] border border-[#2E2E2E] font-mono text-xs space-y-1">
                      <div className="text-[#737373]">Comando objetivo:</div>
                      <div className="text-white">
                        $ {selectedMethod.courseRef.lab.expectedCommand}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        setCliInput(
                          selectedMethod.courseRef.lab.expectedCommand
                        )
                      }
                      className="nt-btn nt-btn--sm w-full text-xs"
                    >
                      Insertar comando en terminal
                    </button>

                    {completedLabIds.includes(selectedMethod.id) && (
                      <div className="p-3 rounded-lg bg-[#171717] border border-[#4ADE80]/40 text-xs text-[#4ADE80] flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Laboratorio superado</span>
                        </div>
                        <CurrencyAmount
                          currency="NOBYTE"
                          amount={selectedMethod.rewardByte}
                          size="sm"
                          plusSign
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-7 rounded-xl bg-[#000000] border border-[#2E2E2E] p-4 font-mono text-xs flex flex-col justify-between min-h-[280px]">
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-2">
                    {cliHistory.map((item, i) => (
                      <div key={i} className="space-y-1">
                        <div className="text-white">
                          <span className="text-[#737373]">
                            operator@notrace-campus:~$
                          </span>{' '}
                          {item.cmd}
                        </div>
                        {item.output.map((line, j) => (
                          <div
                            key={j}
                            className={
                              line.startsWith('[+]')
                                ? 'text-[#4ADE80]'
                                : line.startsWith('[!]')
                                ? 'text-[#EAB308]'
                                : 'text-[#A3A3A3]'
                            }
                          >
                            {line}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  <form
                    onSubmit={handleRunCli}
                    className="mt-4 pt-3 border-t border-[#2E2E2E] flex items-center gap-2"
                  >
                    <span className="text-[#737373] shrink-0">
                      <span className="hidden sm:inline">operator@notrace-campus:~</span>$
                    </span>
                    <input
                      type="text"
                      value={cliInput}
                      onChange={(e) => setCliInput(e.target.value)}
                      aria-label="Consola de comandos del laboratorio"
                      className="min-w-0 flex-1 bg-transparent text-white focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="nt-btn nt-btn--primary nt-btn--sm text-xs shrink-0"
                    >
                      Ejecutar
                    </button>
                  </form>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {/* TAB 3: PROGRESO ACADÉMICO (/campus/progreso) */}
      {activeTab === 'progreso' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 nt-table-wrap">
              <table className="nt-table text-xs">
                <thead>
                  <tr>
                    <th>Método</th>
                    <th>Categoría</th>
                    <th>Avance</th>
                    <th>Recompensa</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {NOTRACE_METHODS.map((m, idx) => {
                    const isEnrolled =
                      m.isFree || unlockedMethodIds.includes(m.id);
                    const pct = isEnrolled
                      ? completedLabIds.includes(m.id)
                        ? 100
                        : idx % 2 === 0
                        ? 65
                        : 40
                      : 0;

                    return (
                      <tr key={m.id}>
                        <td className="font-medium text-white">{m.title}</td>
                        <td className="text-[#A3A3A3]">{m.category}</td>
                        <td className="w-40">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="nt-progress flex-1"
                              style={
                                { '--progress': `${pct}%` } as React.CSSProperties
                              }
                            >
                              <span />
                            </div>
                            <span className="font-mono text-[#A3A3A3] w-8 tabular-nums">
                              {pct}%
                            </span>
                          </div>
                        </td>
                        <td>
                          <CurrencyAmount
                            currency="NOBYTE"
                            amount={m.rewardByte}
                            size="sm"
                            plusSign
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => {
                              handleSwitchMethod(m, 'lesson');
                              setActiveTab('methods');
                            }}
                            className="nt-btn nt-btn--sm text-xs"
                          >
                            {isEnrolled ? 'Continuar' : 'Explorar'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="lg:col-span-4 rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-5 flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <div className="text-xs font-mono text-[#737373] uppercase">
                  RANGO ACADÉMICO ACTUAL
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#121212] border border-[#2E2E2E]">
                  <RankInsignia rankNumber={2} size={44} active />
                  <div>
                    <div className="text-sm font-mono font-bold text-white">
                      {OPERATOR_RANKS[1].code}
                    </div>
                    <div className="text-xs text-[#A3A3A3] tabular-nums">
                      620 / 900 XP hacia 03 — ANALYST
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  {OPERATOR_RANKS[1].description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('/recompensas')}
                className="nt-btn text-xs w-full"
              >
                <span>Ver los 7 rangos del ecosistema →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CERTIFICADOS */}
      {activeTab === 'certificados' && (
        <section className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-[#737373] uppercase">
                VERIFICACIÓN CURRICULAR (NO COMPRABLE)
              </div>
              <h2 className="text-lg font-semibold text-white mt-0.5">
                Certificados de finalización de Métodos
              </h2>
            </div>
            <Award className="w-5 h-5 text-white" />
          </div>

          <p className="text-xs text-[#A3A3A3] max-w-2xl leading-relaxed">
            Los certificados de NØTRACE se emiten exclusivamente al completar
            el 100% de los módulos y validar el laboratorio práctico CLI de
            cada Método. Ningún certificado puede adquirirse mediante NØBYTE o
            NØCORE.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {NOTRACE_METHODS.slice(0, 2).map((m) => {
              const isCompleted = completedLabIds.includes(m.id);
              return (
                <div
                  key={m.id}
                  className="p-4 rounded-xl bg-[#121212] border border-[#2E2E2E] flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-white">
                      {m.title}
                    </div>
                    <div className="text-[11px] font-mono text-[#737373]">
                      {isCompleted
                        ? 'Laboratorio verificado · Listo para emisión en expediente'
                        : 'En curso · Completa el laboratorio CLI para habilitar'}
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#A3A3A3] shrink-0">
                    {isCompleted ? 'VERIFICADO' : 'PENDIENTE'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
};
