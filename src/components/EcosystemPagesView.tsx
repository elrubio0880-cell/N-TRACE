import React, { useState } from 'react';
import {
  HelpCircle,
  Sliders,
  Lock,
  Eye,
  LogOut,
  LogIn,
} from 'lucide-react';
import { QualityTier } from './AsciiHackerArt';
import { OperatorProfile } from './AuthGateway';
import {
  CurrencyIcon,
  CurrencyAmount,
  RankInsignia,
} from './CurrencyIcons';
import {
  OPERATOR_RANKS,
  RECHARGE_PACKAGES,
  OPERATIONS_MISSIONS,
  DEMO_VAULT_MOVEMENTS,
} from '../data/notracePlatformData';

export type EcosystemSubPage = 'nosotros' | 'ayuda' | 'perfil' | 'admin';

interface EcosystemPagesViewProps {
  page: EcosystemSubPage;
  operator: OperatorProfile;
  onUpdateOperator: (profile: OperatorProfile) => void;
  quality: QualityTier;
  onChangeQuality: (tier: QualityTier) => void;
  onOpenLoaderPreview: () => void;
  byteBalance: number;
  coreBalance: number;
  xpBalance: number;
  enrolledMethodCount: number;
  onNavigate: (path: string) => void;
}

const SECURITY_ARCHITECTURE_INVARIANTS = [
  'Ningún saldo autoritativo puede modificarse directamente desde el cliente.',
  'Toda operación futura de economía debe validarse en backend mediante transacciones atómicas.',
  'Los precios reales siempre deben verificarse en servidor, nunca desde el payload del navegador.',
  'Las recompensas deben ser idempotentes con claves únicas por misión/evento.',
  'Los webhooks de pasarelas futuras deben verificar firma criptográfica HMAC/Ed25519.',
  'Las transacciones deben registrarse en un libro mayor (ledger) append-only auditable.',
  'Los tokens y claves de API deben almacenarse exclusivamente en variables de entorno seguras del servidor.',
  'Las cantidades monetarias deben almacenarse en enteros atómicos (evitando errores de coma flotante).',
  'Los códigos promocionales deben validar expiración, límite global y uso único por cuenta.',
  'Las misiones deben verificar condiciones reales completadas en servidor antes de acreditar NØBYTE.',
  'Las compras de Métodos con NØBYTE o NØCORE deben ser atómicas (cargo + desbloqueo en una sola transacción).',
  'Los reembolsos deben generar asientos inversos trazables en el historial sin borrar registros previos.',
  'Los paquetes con bonus deben calcularse mediante reglas deterministas en el servidor.',
  'Los accesos administrativos deben requerir control de acceso basado en roles (RBAC) y MFA.',
  'Los endpoints sensibles deben aplicar rate limiting estricto por IP y cuenta.',
  'Los logs de auditoría nunca deben exponer secretos, tokens ni datos sensibles de pago.',
  'Las sesiones deben invalidarse inmediatamente ante cambios de privilegios o cierre de sesión.',
];

export const EcosystemPagesView: React.FC<EcosystemPagesViewProps> = ({
  page,
  operator,
  onUpdateOperator,
  quality,
  onChangeQuality,
  onOpenLoaderPreview,
  byteBalance,
  coreBalance,
  xpBalance,
  enrolledMethodCount,
  onNavigate,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<
    | 'general'
    | 'monedas'
    | 'paquetes'
    | 'precios'
    | 'recompensas'
    | 'misiones'
    | 'eventos'
    | 'transacciones'
    | 'auditoria'
  >('general');

  // 1. SOBRE NØTRACE (/nosotros)
  if (page === 'nosotros') {
    return (
      <div className="space-y-12 pb-16">
        <section className="pt-8 pb-8 border-b border-[#171717]">
          <div className="max-w-3xl space-y-4">
            <span className="nt-chip">
              <span className="nt-mono">//</span> SOBRE NØTRACE · ECOSISTEMA DIGITAL
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              El conocimiento no tiene límites.
              <br />
              La responsabilidad sí.
            </h1>
            <p className="text-[#A3A3A3] text-sm md:text-base leading-relaxed">
              NØTRACE es un ecosistema de formación técnica estructurada, diagnóstico de privacidad y
              herramientas verificables diseñado bajo una filosofía de precisión, sobriedad y ética
              defensiva.
            </p>
          </div>
        </section>

        {/* Pillars Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              tag: '01 / MISIÓN',
              title: 'Formación técnica verificable',
              body: 'Transformar conceptos complejos de ciberseguridad, arquitectura de redes y criptografía en Métodos claros, estructurados y aplicables en entornos reales y autorizados.',
            },
            {
              tag: '02 / VISIÓN',
              title: 'Autonomía y criterio técnico',
              body: 'Construir una plataforma donde el estudiante no memorice comandos aislados, sino que comprenda la topología, los protocolos y el impacto defensivo de cada decisión.',
            },
            {
              tag: '03 / METODOLOGÍA',
              title: 'Métodos estructurados paso a paso',
              body: 'Sustituimos el concepto pasivo de cursos tradicionales por Métodos operativos con objetivos medibles, arquitectura modular y validación en terminal.',
            },
            {
              tag: '04 / APRENDIZAJE PRÁCTICO',
              title: 'Laboratorios CLI y entornos controlados',
              body: 'Cada Método integra simulaciones de consola y ejercicios de diagnóstico donde puedes poner a prueba reglas de firewall, túneles WireGuard y auditoría Linux.',
            },
            {
              tag: '05 / HERRAMIENTAS',
              title: 'NØTRACE Toolkit y VPN Inspector',
              body: 'Integramos utilidades reales —como el inspector cartográfico de exposición IP/ASN y el laboratorio criptográfico Web Crypto— dentro del flujo de estudio.',
            },
            {
              tag: '06 / RESPONSABILIDAD',
              title: 'Ética defensiva e integridad',
              body: 'Promovemos exclusivamente la auditoría autorizada, el endurecimiento de infraestructura, la protección de la privacidad y el cumplimiento técnico.',
            },
          ].map((pillar) => (
            <article
              key={pillar.tag}
              className="p-6 rounded-xl bg-[#0A0A0A] border border-[#222222] flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <span className="nt-mono text-[11px] text-[#737373]">{pillar.tag}</span>
                <h2 className="text-lg font-semibold text-white">{pillar.title}</h2>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">{pillar.body}</p>
              </div>
              <div className="pt-3 border-t border-[#171717] flex items-center justify-between text-[11px] nt-mono text-[#737373]">
                <span>NØTRACE STANDARD</span>
                <span>VERIFIED</span>
              </div>
            </article>
          ))}
        </section>

        {/* Platform Evolution */}
        <section className="p-7 rounded-xl bg-[#0A0A0A] border border-[#242424] space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A] pb-5">
            <div>
              <span className="nt-mono text-xs text-[#737373]">// ARQUITECTURA 3.0</span>
              <h2 className="text-xl font-bold text-white mt-1">
                Evolución del ecosistema NØTRACE
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onNavigate('/metodos')}
                className="nt-btn nt-btn--primary text-xs"
              >
                Explorar Métodos
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/herramientas')}
                className="nt-btn text-xs"
              >
                Abrir Toolkit
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-[#050505] border border-[#1E1E1E] space-y-1.5">
              <div className="nt-mono text-[11px] text-[#737373]">FASE 1.0</div>
              <div className="text-white font-semibold"> Sistema Visual Monochrome</div>
              <p className="text-[#8A8A8A]">
                Estética Obsidian, tipografía técnica y motor gráfico ASCII procedural en Canvas 2D.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[#050505] border border-[#1E1E1E] space-y-1.5">
              <div className="nt-mono text-[11px] text-[#737373]">FASE 2.0</div>
              <div className="text-white font-semibold">VPN Inspector & Cartografía</div>
              <p className="text-[#8A8A8A]">
                Mapa vectorial Natural Earth con diagnóstico real de IP pública, ASN y comparación de nodos.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[#050505] border border-[#2E2E2E] space-y-1.5">
              <div className="nt-mono text-[11px] text-white">FASE 3.0 (ACTUAL)</div>
              <div className="text-white font-semibold">Plataforma, Métodos y Economía</div>
              <p className="text-[#8A8A8A]">
                Arquitectura multipágina, catálogo de Métodos, Toolkit interactivo y diseño conceptual NØBYTE / NØCORE.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[#050505] border border-[#1E1E1E] space-y-1.5">
              <div className="nt-mono text-[11px] text-[#737373]">HOJA DE RUTA</div>
              <div className="text-white font-semibold">Laboratorios Avanzados</div>
              <p className="text-[#8A8A8A]">
                Expansión de laboratorios de red, inspección TLS y entornos efímeros de práctica defensiva.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // 2. CENTRO DE AYUDA (/ayuda)
  if (page === 'ayuda') {
    return (
      <div className="space-y-10 pb-16">
        <section className="pt-8 pb-6 border-b border-[#171717]">
          <div className="max-w-3xl space-y-3">
            <span className="nt-chip">
              <span className="nt-mono">//</span> CENTRO DE AYUDA Y DOCUMENTACIÓN
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Guía del ecosistema NØTRACE
            </h1>
            <p className="text-[#A3A3A3] text-sm leading-relaxed">
              Respuestas claras sobre el funcionamiento de los Métodos, el uso de las herramientas
              de diagnóstico y la arquitectura conceptual de la billetera NØTRACE Vault.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              q: '¿Qué diferencia a un Método NØTRACE de un curso convencional?',
              a: 'Cada Método está diseñado como un protocolo técnico estructurado: combina fundamentos verificables, topologías claras y práctica directa en la consola interactiva del Campus Virtual.',
            },
            {
              q: '¿Cómo funciona el VPN Inspector en /herramientas/vpn-inspector?',
              a: 'El inspector consulta la IP pública observada desde el backend (/api/connection) mediante IPinfo y cruza el país, ASN y coordenadas con la cartografía vectorial Natural Earth para ayudarte a comprobar si tu túnel VPN está activo.',
            },
            {
              q: '¿Cuál es la diferencia entre NØBYTE y NØCORE?',
              a: 'NØBYTE es la unidad de utilidad interna que se obtiene mediante misiones, estudio y actividad académica. NØCORE es el núcleo de valor superior orientado a Métodos avanzados, paquetes especiales y acceso extendido.',
            },
            {
              q: '¿Los saldos y recargas de la Billetera procesan dinero real actualmente?',
              a: 'No. En esta fase 3.0, NØTRACE Vault, el Centro de Recarga y los saldos mostrados son prototipos visuales y conceptuales para demostrar la experiencia del ecosistema sin cobros reales ni generación de direcciones cripto.',
            },
            {
              q: '¿Puedo comprar un certificado o un rango académico con NØCORE?',
              a: 'Nunca. La ética de NØTRACE garantiza que los certificados y los 7 rangos de operador (desde INITIATE hasta ZERO) solo se desbloqueen mediante estudio real y finalización de laboratorios.',
            },
            {
              q: '¿Cómo puedo ajustar el rendimiento de las animaciones ASCII?',
              a: 'En la sección Perfil (/perfil) encontrarás el selector de resolución del motor Canvas 2D (Auto, Alta 176 columnas o Ligera 74 columnas). Además, el motor respeta prefers-reduced-motion automáticamente.',
            },
          ].map((faq, idx) => (
            <article
              key={idx}
              className="p-6 rounded-xl bg-[#0A0A0A] border border-[#222222] space-y-2.5"
            >
              <div className="flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-[#A3A3A3] shrink-0 mt-0.5" />
                <h2 className="text-sm font-semibold text-white">{faq.q}</h2>
              </div>
              <p className="text-xs text-[#A3A3A3] leading-relaxed pl-6">{faq.a}</p>
            </article>
          ))}
        </section>

        <section className="p-6 rounded-xl bg-[#0A0A0A] border border-[#242424] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white">
              ¿Necesitas explorar la arquitectura técnica o económica?
            </h3>
            <p className="text-xs text-[#A3A3A3]">
              Accede al panel conceptual de arquitectura o revisa directamente el catálogo de Métodos.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onNavigate('/metodos')}
              className="nt-btn nt-btn--primary text-xs"
            >
              Ver Métodos
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/admin')}
              className="nt-btn text-xs"
            >
              Arquitectura Económica
            </button>
          </div>
        </section>
      </div>
    );
  }

  // 3. PERFIL DEL OPERADOR (/perfil)
  if (page === 'perfil') {
    const currentRank = OPERATOR_RANKS[1]; // 02 — OPERATOR

    return (
      <div className="space-y-10 pb-16">
        <section className="pt-8 pb-6 border-b border-[#171717] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="nt-chip">
              <span className="nt-mono">//</span> EXPEDIENTE Y CONFIGURACIÓN DEL OPERADOR
            </span>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {operator.alias}
            </h1>
            <p className="text-xs text-[#A3A3A3] nt-mono">
              {operator.email} · {operator.role} · {operator.isGuest ? 'Sesión de Invitado' : 'Sesión Autenticada'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {operator.isGuest ? (
              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="nt-btn nt-btn--primary text-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Iniciar sesión</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  onUpdateOperator({
                    alias: 'Visitante',
                    email: 'invitado@notrace.edu',
                    role: 'Acceso Exploratorio',
                    clearance: 'Vista Previa',
                    isGuest: true,
                  })
                }
                className="nt-btn text-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cambiar a vista Invitado</span>
              </button>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column: Rank & Balances */}
          <div className="lg:col-span-7 space-y-6">
            <article className="p-6 rounded-xl bg-[#0A0A0A] border border-[#242424] space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RankInsignia rankNumber={currentRank.id} size={36} />
                  <div>
                    <div className="nt-mono text-[11px] text-[#737373]">
                      RANGO ACADÉMICO ACTUAL
                    </div>
                    <h2 className="text-lg font-bold text-white">
                      {currentRank.code} — {currentRank.name}
                    </h2>
                  </div>
                </div>
                <span className="nt-chip">{xpBalance} XP Académico</span>
              </div>

              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                {currentRank.description} Los rangos se obtienen exclusivamente completando Métodos y
                misiones verificables en el Campus Virtual.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-lg bg-[#050505] border border-[#1E1E1E]">
                  <div className="text-[11px] text-[#737373] mb-1">Saldo NØBYTE (Demo)</div>
                  <CurrencyAmount currency="NOBYTE" amount={byteBalance} size="md" />
                </div>
                <div className="p-3.5 rounded-lg bg-[#050505] border border-[#1E1E1E]">
                  <div className="text-[11px] text-[#737373] mb-1">Saldo NØCORE (Demo)</div>
                  <CurrencyAmount currency="NOCORE" amount={coreBalance} size="md" />
                </div>
                <div className="p-3.5 rounded-lg bg-[#050505] border border-[#1E1E1E]">
                  <div className="text-[11px] text-[#737373] mb-1">Métodos Activos</div>
                  <div className="text-base font-bold text-white nt-mono">
                    {enrolledMethodCount} Métodos
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('/campus')}
                  className="nt-btn nt-btn--primary text-xs"
                >
                  Ir a Mis Métodos
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('/billetera')}
                  className="nt-btn text-xs"
                >
                  Abrir NØTRACE Vault
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('/misiones')}
                  className="nt-btn nt-btn--ghost text-xs"
                >
                  Ver Misiones y Rangos
                </button>
              </div>
            </article>
          </div>

          {/* Right column: ASCII Engine & Accessibility Preferences */}
          <div className="lg:col-span-5 space-y-6">
            <article className="p-6 rounded-xl bg-[#0A0A0A] border border-[#242424] space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-[#1E1E1E]">
                <Sliders className="w-4 h-4 text-[#A3A3A3]" />
                <h2 className="text-sm font-semibold text-white">
                  Accesibilidad y Motor Gráfico ASCII
                </h2>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-[#A3A3A3]">
                  Resolución de muestreo del motor Canvas 2D
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'auto', label: 'Auto' },
                      { id: 'high', label: 'Alta (176c)' },
                      { id: 'low', label: 'Ligera (74c)' },
                    ] as const
                  ).map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => onChangeQuality(tier.id)}
                      className={`nt-btn px-2 py-2 text-[11px] sm:text-xs justify-center ${
                        quality === tier.id ? 'nt-btn--primary' : ''
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#050505] border border-[#1E1E1E] text-xs text-[#8A8A8A] space-y-1.5">
                <div className="text-white font-medium">Optimización automática</div>
                <p>
                  El motor limita el renderizado a 30 FPS y se pausa automáticamente cuando el
                  lienzo sale del viewport o si tu sistema operativo solicita movimiento reducido.
                </p>
              </div>

              <div className="pt-2 border-t border-[#1E1E1E] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs text-[#A3A3A3]">Secuencia de arranque ASCII</span>
                <button
                  type="button"
                  onClick={onOpenLoaderPreview}
                  className="nt-btn text-xs w-full sm:w-auto justify-center"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Previsualizar animación de carga</span>
                </button>
              </div>
            </article>
          </div>
        </div>
      </div>
    );
  }

  // 4. PANEL ADMINISTRATIVO CONCEPTUAL (/admin)
  return (
    <div className="space-y-10 pb-16">
      <section className="pt-8 pb-6 border-b border-[#171717] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="nt-chip">
              <span className="nt-mono">//</span> NØTRACE ADMIN · ARQUITECTURA CONCEPTUAL
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] nt-mono bg-[#141414] border border-[#2E2E2E] text-[#D4D4D4]">
              SOLO LECTURA · FASE 3.0
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Gobernanza Económica y Seguridad
          </h1>
          <p className="text-xs text-[#A3A3A3] max-w-2xl">
            Vista conceptual de los módulos administrativos para futuras fases con backend
            transaccional. En cumplimiento con la arquitectura de seguridad, ningún saldo real se
            modifica desde el cliente.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('/billetera')}
          className="nt-btn text-xs w-full md:w-auto justify-center"
        >
          Volver a NØTRACE Vault
        </button>
      </section>

      {/* Module Tabs (Section 27) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 -mx-1 px-1 sm:flex-wrap sm:overflow-visible border-b border-[#1A1A1A]">
        {(
          [
            { id: 'general', label: 'Configuración general' },
            { id: 'monedas', label: 'Monedas' },
            { id: 'paquetes', label: 'Paquetes' },
            { id: 'precios', label: 'Precios' },
            { id: 'recompensas', label: 'Recompensas' },
            { id: 'misiones', label: 'Misiones' },
            { id: 'eventos', label: 'Eventos' },
            { id: 'transacciones', label: 'Transacciones' },
            { id: 'auditoria', label: 'Auditoría y Seguridad' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveAdminTab(tab.id)}
            className={`nt-btn text-xs whitespace-nowrap shrink-0 ${
              activeAdminTab === tab.id ? 'nt-btn--primary' : 'nt-btn--ghost'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-5">
          {activeAdminTab === 'general' && (
            <article className="p-6 rounded-xl bg-[#0A0A0A] border border-[#242424] space-y-4">
              <h2 className="text-base font-bold text-white">
                Estado del Sistema Económico NØTRACE 3.0
              </h2>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                El sistema económico se encuentra en modo de demostración conceptual. Las pasarelas
                de pago externas están deshabilitadas por diseño hasta la fase de integración de
                backend con libro mayor (ledger) transaccional.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-lg bg-[#050505] border border-[#1E1E1E]">
                  <div className="nt-mono text-[11px] text-[#737373]">MODO DE OPERACIÓN</div>
                  <div className="text-white font-semibold mt-1">Prototipo Conceptual (Fase 3.0)</div>
                </div>
                <div className="p-4 rounded-lg bg-[#050505] border border-[#1E1E1E]">
                  <div className="nt-mono text-[11px] text-[#737373]">INTEGRACIÓN DE PASARELAS</div>
                  <div className="text-white font-semibold mt-1">Próximamente (Bloqueado en UI)</div>
                </div>
              </div>
            </article>
          )}

          {activeAdminTab === 'monedas' && (
            <article className="p-6 rounded-xl bg-[#0A0A0A] border border-[#242424] space-y-4">
              <h2 className="text-base font-bold text-white">Definición de Unidades Digitales</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#050505] border border-[#1E1E1E] space-y-2">
                  <div className="flex items-center gap-2">
                    <CurrencyIcon currency="NOBYTE" size={22} />
                    <span className="font-bold text-white text-sm">NØBYTE (NBT)</span>
                  </div>
                  <p className="text-xs text-[#8A8A8A]">
                    Moneda de utilidad interna y progresión. Emisión controlada mediante misiones
                    verificadas, estudio de Métodos y uso de herramientas.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-[#050505] border border-[#2E2E2E] space-y-2">
                  <div className="flex items-center gap-2">
                    <CurrencyIcon currency="NOCORE" size={22} />
                    <span className="font-bold text-white text-sm">NØCORE (NCR)</span>
                  </div>
                  <p className="text-xs text-[#8A8A8A]">
                    Núcleo de valor superior orientado a paquetes especiales, Métodos avanzados y
                    laboratorios extendidos.
                  </p>
                </div>
              </div>
            </article>
          )}

          {(activeAdminTab === 'paquetes' || activeAdminTab === 'precios') && (
            <article className="p-6 rounded-xl bg-[#0A0A0A] border border-[#242424] space-y-4">
              <h2 className="text-base font-bold text-white">
                Catálogo Conceptual de Paquetes ({RECHARGE_PACKAGES.length})
              </h2>
              <div className="nt-table-wrap">
                <table className="nt-table text-xs">
                  <thead>
                    <tr>
                      <th>Paquete</th>
                      <th>Moneda</th>
                      <th>Unidades</th>
                      <th>Perfil</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECHARGE_PACKAGES.map((pkg) => (
                      <tr key={pkg.id}>
                        <td className="font-semibold text-white">{pkg.code}</td>
                        <td>{pkg.currency === 'NOBYTE' ? 'NØBYTE' : 'NØCORE'}</td>
                        <td className="nt-mono">{pkg.amount}</td>
                        <td className="nt-mono text-[#A3A3A3]">{pkg.subtitle}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          )}

          {(activeAdminTab === 'recompensas' ||
            activeAdminTab === 'misiones' ||
            activeAdminTab === 'eventos') && (
            <article className="p-6 rounded-xl bg-[#0A0A0A] border border-[#242424] space-y-4">
              <h2 className="text-base font-bold text-white">
                Reglas de Misiones y Recompensas ({OPERATIONS_MISSIONS.length})
              </h2>
              <div className="space-y-2.5">
                {OPERATIONS_MISSIONS.map((m) => (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-lg bg-[#050505] border border-[#1E1E1E] flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 text-xs"
                  >
                    <div>
                      <div className="text-white font-medium">{m.title}</div>
                      <div className="text-[#737373]">{m.type}</div>
                    </div>
                    <div className="nt-mono text-white shrink-0">
                      +{m.rewardAmount} {m.rewardCurrency === 'NOBYTE' ? 'NØBYTE' : 'NØCORE'} · +
                      {m.xpReward} XP
                    </div>
                  </div>
                ))}
              </div>
            </article>
          )}

          {(activeAdminTab === 'transacciones' || activeAdminTab === 'auditoria') && (
            <article className="p-6 rounded-xl bg-[#0A0A0A] border border-[#242424] space-y-4">
              <h2 className="text-base font-bold text-white">
                Libro Mayor Conceptual (Movimientos de Ejemplo)
              </h2>
              <div className="nt-table-wrap">
                <table className="nt-table text-xs">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Concepto</th>
                      <th>Importe</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_VAULT_MOVEMENTS.map((mov) => (
                      <tr key={mov.id}>
                        <td className="nt-mono text-[#737373]">{mov.id}</td>
                        <td className="text-white">{mov.concept}</td>
                        <td className="nt-mono">
                          {mov.amount > 0 ? `+${mov.amount}` : mov.amount}{' '}
                          {mov.currency === 'NOBYTE' ? 'NØBYTE' : 'NØCORE'}
                        </td>
                        <td className="nt-mono text-[#A3A3A3]">{mov.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          )}
        </div>

        {/* Right Column: 17 Mandatory Security Rules (Section 28) */}
        <div className="lg:col-span-5">
          <article className="p-6 rounded-xl bg-[#0A0A0A] border border-[#242424] space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#1E1E1E]">
              <Lock className="w-4 h-4 text-white" />
              <h2 className="text-sm font-bold text-white">
                17 Invariantes de Seguridad Económica (Sección 28)
              </h2>
            </div>
            <ul className="space-y-2 text-xs text-[#A3A3A3]">
              {SECURITY_ARCHITECTURE_INVARIANTS.map((rule, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <span className="nt-mono text-[10px] text-[#737373] mt-0.5">
                    {String(index + 1).padStart(2, '0')}.
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </div>
  );
};
