import React, { useEffect, useState } from 'react';
import {
  Wallet,
  CirclePlus,
  History,
  Gift,
  BookOpen,
  Boxes,
  Info,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import {
  ByteIcon,
  CoreIcon,
  CurrencyAmount,
  CurrencyType,
} from './CurrencyIcons';
import {
  DEMO_VAULT_MOVEMENTS,
  RECHARGE_PACKAGES,
  FUTURE_PAYMENT_METHODS,
  RechargePackage,
} from '../data/notracePlatformData';

interface VaultViewProps {
  subTab?: 'overview' | 'recargar' | 'historial';
  byteBalance: number;
  coreBalance: number;
  isGuest: boolean;
  onNavigate: (path: string) => void;
}

export const VaultView: React.FC<VaultViewProps> = ({
  subTab = 'overview',
  byteBalance,
  coreBalance,
  isGuest,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'recargar' | 'historial'>(
    subTab
  );

  useEffect(() => {
    setActiveTab(subTab);
  }, [subTab]);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType>('NOCORE');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('core-operator');
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('pm-usdt');
  const [historyFilter, setHistoryFilter] = useState<'ALL' | 'NOBYTE' | 'NOCORE'>('ALL');
  const [prototypeConfirmation, setPrototypeConfirmation] = useState<boolean>(false);

  const filteredPackages = RECHARGE_PACKAGES.filter(
    (p) => p.currency === selectedCurrency
  );
  const activePackage: RechargePackage =
    filteredPackages.find((p) => p.id === selectedPackageId) ||
    filteredPackages[0];
  const activePayment =
    FUTURE_PAYMENT_METHODS.find((m) => m.id === selectedPaymentId) ||
    FUTURE_PAYMENT_METHODS[0];

  const filteredMovements = DEMO_VAULT_MOVEMENTS.filter(
    (m) => historyFilter === 'ALL' || m.currency === historyFilter
  );

  return (
    <main className="py-8 space-y-8" aria-label="NØTRACE VAULT">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
        <div>
          <div className="text-xs font-mono text-[#737373] uppercase tracking-wider mb-1">
            NØTRACE VAULT // SISTEMA ECONÓMICO INTERNO
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
            Billetera y Centro de Créditos
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-2 max-w-2xl">
            Administra tus unidades educativas <strong className="text-white">NØBYTE</strong> y
            créditos comerciales <strong className="text-white">NØCORE</strong>.
            Las monedas de NØTRACE son créditos internos de la plataforma; no
            constituyen criptomonedas externas ni activos financieros.
          </p>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="grid grid-cols-3 sm:flex items-center gap-1.5 p-1 rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] w-full lg:w-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab('overview');
              onNavigate('/billetera');
            }}
            className={`px-2 sm:px-3.5 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'overview'
                ? 'bg-white text-black'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Balances</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('recargar');
              setPrototypeConfirmation(false);
              onNavigate('/billetera/recargar');
            }}
            className={`px-2 sm:px-3.5 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'recargar'
                ? 'bg-white text-black'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            <CirclePlus className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Recargar</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('historial');
              onNavigate('/billetera/historial');
            }}
            className={`px-2 sm:px-3.5 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'historial'
                ? 'bg-white text-black'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Historial</span>
          </button>
        </div>
      </div>

      {/* Prototype / Architecture Transparency Banner */}
      <div className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#A3A3A3]">
        <div className="flex items-start sm:items-center gap-2.5">
          <Info className="w-4 h-4 text-white shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong className="text-white">Modo de Demostración Conceptual:</strong>{' '}
            Los saldos y movimientos mostrados corresponden a la vista previa de
            arquitectura NØTRACE 3.0. No se procesan cobros ni transacciones
            financieras reales en esta fase.
          </span>
        </div>
        {isGuest && (
          <button
            type="button"
            onClick={() => onNavigate('/login')}
            className="nt-btn nt-btn--sm text-xs shrink-0"
          >
            <span>Iniciar sesión</span>
          </button>
        )}
      </div>

      {/* 01. PRINCIPAL BALANCES (Always visible at top of Vault) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* NØBYTE Balance Card */}
        <article className="rounded-2xl bg-[#0A0A0A] border border-[#2E2E2E] p-4 sm:p-6 flex flex-col justify-between gap-5 sm:gap-6">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="space-y-1.5">
              <div className="text-xs font-mono text-[#A3A3A3] uppercase tracking-wider">
                BALANCE NØBYTE · MONEDA EDUCATIVA
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono text-white tabular-nums">
                {byteBalance.toLocaleString('es-ES')}{' '}
                <span className="text-base sm:text-lg font-normal text-[#A3A3A3]">NØBYTE</span>
              </div>
              <p className="text-xs text-[#A3A3A3] leading-relaxed max-w-md pt-1">
                Obtenida al completar Métodos, módulos, laboratorios CLI y
                misiones en NØTRACE Operations. Utilízala en herramientas de
                bajo consumo y Métodos seleccionados.
              </p>
            </div>

            <div className="p-2.5 sm:p-3.5 rounded-2xl bg-[#111111] border border-[#2E2E2E] shrink-0">
              <ByteIcon size={52} animated variant="detailed" />
            </div>
          </div>

          <div className="pt-4 border-t border-[#1F1F1F] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onNavigate('/misiones')}
                className="nt-btn nt-btn--sm text-xs justify-center"
              >
                <Gift className="w-3.5 h-3.5 shrink-0" />
                <span>Ganar en Misiones</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCurrency('NOBYTE');
                  setSelectedPackageId('byte-pack');
                  setActiveTab('recargar');
                }}
                className="nt-btn nt-btn--sm text-xs justify-center"
              >
                <CirclePlus className="w-3.5 h-3.5 shrink-0" />
                <span>Ver paquetes NØBYTE</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setHistoryFilter('NOBYTE');
                setActiveTab('historial');
              }}
              className="text-xs text-[#A3A3A3] hover:text-white cursor-pointer"
            >
              Ver movimientos →
            </button>
          </div>
        </article>

        {/* NØCORE Balance Card */}
        <article className="rounded-2xl bg-[#0A0A0A] border border-[#525252] p-4 sm:p-6 flex flex-col justify-between gap-5 sm:gap-6">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="space-y-1.5">
              <div className="text-xs font-mono text-white uppercase tracking-wider">
                BALANCE NØCORE · MONEDA PREMIUM
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono text-white tabular-nums">
                {coreBalance.toLocaleString('es-ES')}{' '}
                <span className="text-base sm:text-lg font-normal text-[#A3A3A3]">NØCORE</span>
              </div>
              <p className="text-xs text-[#A3A3A3] leading-relaxed max-w-md pt-1">
                Crédito interno de alto valor para acceder a Métodos premium,
                laboratorios avanzados y herramientas con mayor costo operativo.
              </p>
            </div>

            <div className="p-2.5 sm:p-3.5 rounded-2xl bg-[#141414] border border-[#737373] shrink-0">
              <CoreIcon size={52} animated variant="detailed" />
            </div>
          </div>

          <div className="pt-4 border-t border-[#1F1F1F] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setSelectedCurrency('NOCORE');
                  setSelectedPackageId('core-operator');
                  setActiveTab('recargar');
                }}
                className="nt-btn nt-btn--primary nt-btn--sm text-xs justify-center"
              >
                <CirclePlus className="w-3.5 h-3.5 shrink-0" />
                <span>Recargar NØCORE</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/metodos')}
                className="nt-btn nt-btn--sm text-xs justify-center"
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>Explorar Métodos</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setHistoryFilter('NOCORE');
                setActiveTab('historial');
              }}
              className="text-xs text-[#A3A3A3] hover:text-white cursor-pointer"
            >
              Ver movimientos →
            </button>
          </div>
        </article>
      </div>

      {/* TAB 1: OVERVIEW (Quick Actions, Economic Model & Recent Activity) */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Quick Actions Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('recargar')}
              className="p-4 rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] hover:border-[#525252] text-left space-y-2 cursor-pointer transition-colors"
            >
              <CirclePlus className="w-4 h-4 text-white" />
              <div className="text-xs font-semibold text-white">Recargar</div>
              <div className="text-[11px] text-[#737373]">Paquetes de saldo</div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/misiones')}
              className="p-4 rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] hover:border-[#525252] text-left space-y-2 cursor-pointer transition-colors"
            >
              <Gift className="w-4 h-4 text-white" />
              <div className="text-xs font-semibold text-white">Ver recompensas</div>
              <div className="text-[11px] text-[#737373]">Misiones y logros</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('historial')}
              className="p-4 rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] hover:border-[#525252] text-left space-y-2 cursor-pointer transition-colors"
            >
              <History className="w-4 h-4 text-white" />
              <div className="text-xs font-semibold text-white">Historial</div>
              <div className="text-[11px] text-[#737373]">Registro contable</div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/metodos')}
              className="p-4 rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] hover:border-[#525252] text-left space-y-2 cursor-pointer transition-colors"
            >
              <BookOpen className="w-4 h-4 text-white" />
              <div className="text-xs font-semibold text-white">Explorar Métodos</div>
              <div className="text-[11px] text-[#737373]">Catálogo formativo</div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/herramientas')}
              className="p-4 rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] hover:border-[#525252] text-left space-y-2 cursor-pointer transition-colors"
            >
              <Boxes className="w-4 h-4 text-white" />
              <div className="text-xs font-semibold text-white">Herramientas</div>
              <div className="text-[11px] text-[#737373]">NØTRACE Toolkit</div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/ayuda')}
              className="p-4 rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] hover:border-[#525252] text-left space-y-2 cursor-pointer transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-white" />
              <div className="text-xs font-semibold text-white">Seguridad</div>
              <div className="text-[11px] text-[#737373]">Reglas económicas</div>
            </button>
          </div>

          {/* Conceptual Economic Matrix Table */}
          <section className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-4 sm:p-6 space-y-4">
            <div>
              <div className="text-xs font-mono text-[#737373] uppercase">
                MODELO ECONÓMICO CONCEPTUAL
              </div>
              <h2 className="text-lg font-semibold text-white mt-0.5">
                Comparativa técnica entre NØBYTE y NØCORE
              </h2>
            </div>

            <div className="nt-table-wrap">
              <table className="nt-table text-xs">
                <thead>
                  <tr>
                    <th>Característica</th>
                    <th>NØBYTE (Educativa)</th>
                    <th>NØCORE (Premium)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-medium text-white">Categoría y Función</td>
                    <td>Moneda común de participación y estudio</td>
                    <td>Moneda comercial de infraestructura y acceso premium</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-white">Recompensas educativas</td>
                    <td>Principal (+10 por módulo, +25 evaluación, +100 Método)</td>
                    <td>Excepcional (eventos oficiales especiales)</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-white">Métodos y Laboratorios</td>
                    <td>Laboratorios básicos y Métodos seleccionados</td>
                    <td>Métodos premium y laboratorios avanzados</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-white">Transferencias o retiros externos</td>
                    <td>No permitido (crédito interno cerrado)</td>
                    <td>No permitido (crédito interno cerrado)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: RECHARGE CENTER (/billetera/recargar) */}
      {activeTab === 'recargar' && (
        <section className="space-y-6" aria-label="Centro de Recargas NØTRACE VAULT">
          <div className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-4 sm:p-6 space-y-6">
            {/* Step 1: Select Currency */}
            <div className="space-y-3">
              <div className="text-xs font-mono text-[#737373] uppercase">
                PASO 01 · SELECCIONAR MONEDA INTERNA
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCurrency('NOCORE');
                    setSelectedPackageId('core-operator');
                    setPrototypeConfirmation(false);
                  }}
                  className={`p-4 rounded-xl border text-left flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                    selectedCurrency === 'NOCORE'
                      ? 'bg-[#171717] border-white'
                      : 'bg-[#121212] border-[#2E2E2E] hover:border-[#404040]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-white">
                      Recargar NØCORE (Principal)
                    </div>
                    <p className="text-xs text-[#A3A3A3]">
                      Para adquirir Métodos premium, laboratorios avanzados y
                      recursos exclusivos.
                    </p>
                  </div>
                  <CoreIcon size={40} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCurrency('NOBYTE');
                    setSelectedPackageId('byte-pack');
                    setPrototypeConfirmation(false);
                  }}
                  className={`p-4 rounded-xl border text-left flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                    selectedCurrency === 'NOBYTE'
                      ? 'bg-[#171717] border-white'
                      : 'bg-[#121212] border-[#2E2E2E] hover:border-[#404040]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-white">
                      Paquetes NØBYTE (Opcional)
                    </div>
                    <p className="text-xs text-[#A3A3A3]">
                      También puedes obtener NØBYTE gratuitamente completando
                      actividades y Métodos.
                    </p>
                  </div>
                  <ByteIcon size={40} />
                </button>
              </div>
            </div>

            {/* Step 2: Select Package */}
            <div className="space-y-3 pt-4 border-t border-[#1F1F1F]">
              <div className="text-xs font-mono text-[#737373] uppercase">
                PASO 02 · SELECCIONAR PAQUETE ILUSTRATIVO ({selectedCurrency})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredPackages.map((pkg) => {
                  const isSelected = activePackage?.id === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => {
                        setSelectedPackageId(pkg.id);
                        setPrototypeConfirmation(false);
                      }}
                      className={`p-4 rounded-xl border flex flex-col justify-between gap-4 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#171717] border-white'
                          : 'bg-[#121212] border-[#2E2E2E] hover:border-[#404040]'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-semibold text-white">
                            {pkg.code}
                          </span>
                          <span className="text-[11px] font-mono text-[#737373]">
                            PROTOTIPO
                          </span>
                        </div>

                        <CurrencyAmount
                          currency={pkg.currency}
                          amount={pkg.amount}
                          size="lg"
                        />

                        <p className="text-xs text-[#A3A3A3] leading-relaxed">
                          {pkg.subtitle}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#262626] text-[11px] text-[#737373]">
                        {pkg.targetAudience}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Future Payment Methods Showcase */}
            <div className="space-y-3 pt-4 border-t border-[#1F1F1F]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-mono text-[#737373] uppercase">
                  PASO 03 · CENTRO DE MÉTODOS DE PAGO FUTUROS (ARQUITECTURA PREPARADA)
                </div>
                <span className="text-xs font-mono text-[#A3A3A3]">
                  Sin procesamiento de pagos reales activo
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {FUTURE_PAYMENT_METHODS.map((pm) => {
                  const isSelected = activePayment.id === pm.id;
                  return (
                    <div
                      key={pm.id}
                      onClick={() => {
                        setSelectedPaymentId(pm.id);
                        setPrototypeConfirmation(false);
                      }}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2.5 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#171717] border-white'
                          : 'bg-[#121212] border-[#2E2E2E] hover:border-[#404040]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-white">
                            {pm.name}
                          </span>
                          <span className="text-[10px] font-mono text-[#A3A3A3] border border-[#383838] rounded px-1.5 py-0.5">
                            {pm.availability}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-[#737373] mt-1">
                          {pm.networkOrProvider}
                        </div>
                      </div>
                      <p className="text-[11px] text-[#A3A3A3] leading-snug">
                        {pm.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 4 & 5: Summary & Prototype Confirmation */}
            <div className="pt-4 border-t border-[#1F1F1F] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 p-4 rounded-xl bg-[#121212] border border-[#2E2E2E] space-y-2 text-xs">
                <div className="font-mono text-[#A3A3A3] uppercase">
                  PASO 04 · RESUMEN DE CONFIGURACIÓN DEL PROTOTIPO
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white">
                  <span>
                    Paquete seleccionado:{' '}
                    <strong>
                      {activePackage.code} ({activePackage.amount}{' '}
                      {activePackage.currency})
                    </strong>
                  </span>
                  <span>
                    Pasarela consultada: <strong>{activePayment.name}</strong> (
                    {activePayment.availability})
                  </span>
                </div>
                <p className="text-[#737373]">{activePayment.securityNote}</p>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setPrototypeConfirmation(true)}
                  className="nt-btn nt-btn--primary w-full text-xs"
                >
                  <span>Revisar estado de integración</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {prototypeConfirmation && (
              <div
                role="status"
                className="p-4 rounded-xl bg-[#141414] border border-[#525252] flex items-start gap-3 text-xs"
              >
                <AlertCircle className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-semibold text-white">
                    Prototipo de Recarga Verificado — Integración Financiera No Activa
                  </div>
                  <p className="text-[#A3A3A3] leading-relaxed">
                    Has seleccionado el paquete{' '}
                    <strong className="text-white">
                      {activePackage.code} ({activePackage.amount}{' '}
                      {activePackage.currency})
                    </strong>{' '}
                    con el método{' '}
                    <strong className="text-white">{activePayment.name}</strong>.
                    De acuerdo con las directivas de seguridad de NØTRACE 3.0,
                    no se generan direcciones cripto ni códigos QR ni se alteran
                    saldos desde el frontend hasta conectar el motor contable
                    del servidor.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* TAB 3: MOVEMENT HISTORY (/billetera/historial) */}
      {activeTab === 'historial' && (
        <section className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-4 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-mono text-[#737373] uppercase">
                REGISTRO DE MOVIMIENTOS (DATOS DE DEMOSTRACIÓN IDENTIFICADOS)
              </div>
              <h2 className="text-lg font-semibold text-white mt-0.5">
                Historial de operaciones en NØTRACE VAULT
              </h2>
            </div>

            <div className="grid grid-cols-3 sm:flex items-center gap-1.5 w-full sm:w-auto">
              {(['ALL', 'NOBYTE', 'NOCORE'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setHistoryFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer text-center ${
                    historyFilter === f
                      ? 'bg-white text-black font-semibold'
                      : 'bg-[#121212] text-[#A3A3A3] border border-[#2E2E2E]'
                  }`}
                >
                  {f === 'ALL' ? 'Todas' : f === 'NOBYTE' ? 'NØBYTE' : 'NØCORE'}
                </button>
              ))}
            </div>
          </div>

          <div className="nt-table-wrap">
            <table className="nt-table text-xs">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha / Hora</th>
                  <th>Tipo</th>
                  <th>Concepto</th>
                  <th>Estado</th>
                  <th className="text-right">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovements.map((mov) => (
                  <tr key={mov.id}>
                    <td className="font-mono text-[#A3A3A3]">{mov.id}</td>
                    <td className="font-mono text-[#737373] tabular-nums">
                      {mov.date} · {mov.time}
                    </td>
                    <td className="text-white font-medium">{mov.type}</td>
                    <td className="text-[#A3A3A3]">{mov.concept}</td>
                    <td>
                      <span className="font-mono text-[11px] text-[#A3A3A3]">
                        {mov.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <CurrencyAmount
                        currency={mov.currency}
                        amount={mov.amount}
                        size="sm"
                        plusSign
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
};
