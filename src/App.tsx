import { useEffect, useState } from 'react';
import {
  Compass,
  BookOpen,
  Boxes,
  GraduationCap,
  Shield,
  Wallet,
  Bell,
  User,
  Menu,
  X,
  Target,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { BootScreen } from './components/BootScreen';
import { AuthGateway, OperatorProfile } from './components/AuthGateway';
import { QualityTier } from './components/AsciiHackerArt';
import { HomeView } from './components/HomeView';
import { MethodsCatalogView } from './components/MethodsCatalogView';
import { ToolkitView } from './components/ToolkitView';
import { VaultView } from './components/VaultView';
import { OperationsView } from './components/OperationsView';
import { CampusView } from './components/CampusView';
import { EcosystemPagesView } from './components/EcosystemPagesView';
import { CurrencyBadge, CurrencyAmount } from './components/CurrencyIcons';
import { NotraceMethod } from './data/notracePlatformData';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [quality, setQuality] = useState<QualityTier>('auto');

  // Real readiness & preview loader state
  const [loaderOpen, setLoaderOpen] = useState<boolean>(true);
  const [loaderRevealing, setLoaderRevealing] = useState<boolean>(false);
  const [bootRevealTick, setBootRevealTick] = useState<number>(0);
  const [loaderPreview, setLoaderPreview] = useState<boolean>(false);
  const [initialReadiness, setInitialReadiness] = useState<Promise<unknown> | null>(null);

  // Operator session state
  const [operator, setOperator] = useState<OperatorProfile>({
    alias: 'Elena Vance',
    email: 'estudiante@notrace.edu',
    role: 'Operador NØTRACE',
    clearance: '02 — OPERATOR',
    isGuest: false,
  });

  // Conceptual demonstration balances (Section 12 & 16)
  const [byteBalance] = useState<number>(140);
  const [coreBalance] = useState<number>(250);
  const [xpBalance] = useState<number>(640);

  // Unlocked Methods & active campus method
  const [unlockedMethodIds, setUnlockedMethodIds] = useState<string[]>([
    'method-network-fundamentals',
    'method-wireguard-multihop',
  ]);
  const [activeCampusMethodId, setActiveCampusMethodId] = useState<string>(
    'method-wireguard-multihop'
  );

  // Header UI modals/popovers
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [menuGroupFilter, setMenuGroupFilter] = useState<
    'all' | 'principal' | 'labs' | 'economia' | 'cuenta'
  >('all');
  const [unlockModalMethod, setUnlockModalMethod] = useState<NotraceMethod | null>(null);

  // Lock background page scroll while overlay menu is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Real initialization readiness promise
  useEffect(() => {
    const fontsReady =
      typeof document !== 'undefined' && 'fonts' in document
        ? document.fonts.ready
        : Promise.resolve();
    const minFrameReady = new Promise((resolve) => requestAnimationFrame(() => resolve(true)));
    setInitialReadiness(Promise.all([fontsReady, minFrameReady]));
  }, []);

  // Listen to browser back/forward navigation & Escape key for modals/popovers
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setNotificationsOpen(false);
        setMobileMenuOpen(false);
        setUnlockModalMethod(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navigate = (path: string) => {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    if (typeof window !== 'undefined' && window.location.pathname !== normalized) {
      window.history.pushState({}, '', normalized);
    }
    setCurrentPath(normalized);
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUnlockOrOpenMethod = (method: NotraceMethod) => {
    if (unlockedMethodIds.includes(method.id) || method.isFree) {
      if (!unlockedMethodIds.includes(method.id)) {
        setUnlockedMethodIds((prev) => [...prev, method.id]);
      }
      setActiveCampusMethodId(method.id);
      navigate('/campus');
    } else {
      setUnlockModalMethod(method);
    }
  };

  const handleConfirmConceptualUnlock = (method: NotraceMethod) => {
    if (!unlockedMethodIds.includes(method.id)) {
      setUnlockedMethodIds((prev) => [...prev, method.id]);
    }
    setActiveCampusMethodId(method.id);
    setUnlockModalMethod(null);
    navigate('/campus');
  };

  // Active section matching for primary nav
  const isNavActive = (prefix: string) => {
    if (prefix === '/') return currentPath === '/';
    return currentPath === prefix || currentPath.startsWith(`${prefix}/`);
  };

  // Route Resolver
  const renderRouteContent = () => {
    const path = currentPath.replace(/\/+$/, '') || '/';

    // 1. HOME (/)
    if (path === '/') {
      return (
        <HomeView
          quality={quality}
          loaderOpen={loaderOpen && !loaderRevealing}
          bootRevealTick={bootRevealTick}
          unlockedMethodIds={unlockedMethodIds}
          onNavigate={navigate}
          onSelectMethod={(method) => navigate(`/metodos/${method.slug}`)}
        />
      );
    }

    // 2. MÉTODOS (/metodos & /metodos/:slug)
    if (path === '/metodos' || path.startsWith('/metodos/')) {
      const slug = path.startsWith('/metodos/')
        ? path.replace('/metodos/', '').trim()
        : null;
      return (
        <MethodsCatalogView
          selectedMethodSlug={slug}
          unlockedMethodIds={unlockedMethodIds}
          onNavigate={navigate}
          onUnlockOrOpenMethod={handleUnlockOrOpenMethod}
        />
      );
    }

    // 3. HERRAMIENTAS (/herramientas & sub-labs)
    if (path === '/herramientas' || path.startsWith('/herramientas/')) {
      const subRoute = path.startsWith('/herramientas/')
        ? path.replace('/herramientas/', '').trim()
        : null;
      return <ToolkitView subRoute={subRoute} onNavigate={navigate} />;
    }

    // 4. CAMPUS (/campus & /campus/progreso)
    if (path === '/campus' || path.startsWith('/campus/')) {
      const isProgress = path === '/campus/progreso';
      return (
        <CampusView
          key={path}
          initialTab={isProgress ? 'progreso' : 'methods'}
          activeMethodId={activeCampusMethodId}
          unlockedMethodIds={unlockedMethodIds}
          onNavigate={navigate}
          onSelectMethodDetail={(method) => navigate(`/metodos/${method.slug}`)}
        />
      );
    }

    // 5. BILLETERA / VAULT (/billetera, /billetera/recargar, /billetera/historial)
    if (path === '/billetera' || path.startsWith('/billetera/')) {
      const subTab =
        path === '/billetera/recargar'
          ? 'recargar'
          : path === '/billetera/historial'
          ? 'historial'
          : 'overview';
      return (
        <VaultView
          key={path}
          subTab={subTab}
          byteBalance={byteBalance}
          coreBalance={coreBalance}
          isGuest={operator.isGuest}
          onNavigate={navigate}
        />
      );
    }

    // 6. OPERATIONS (/misiones, /recompensas, /eventos)
    if (path === '/misiones' || path === '/recompensas' || path === '/eventos') {
      const initialSection =
        path === '/recompensas'
          ? 'recompensas'
          : path === '/eventos'
          ? 'eventos'
          : 'misiones';
      return (
        <OperationsView
          key={path}
          initialSection={initialSection}
          onNavigate={navigate}
        />
      );
    }

    // 7. NOSOTROS (/nosotros)
    if (path === '/nosotros') {
      return (
        <EcosystemPagesView
          page="nosotros"
          operator={operator}
          onUpdateOperator={setOperator}
          quality={quality}
          onChangeQuality={setQuality}
          onOpenLoaderPreview={() => {
            setLoaderRevealing(false);
            setLoaderPreview(true);
            setLoaderOpen(true);
          }}
          byteBalance={byteBalance}
          coreBalance={coreBalance}
          xpBalance={xpBalance}
          enrolledMethodCount={unlockedMethodIds.length}
          onNavigate={navigate}
        />
      );
    }

    // 8. AYUDA (/ayuda)
    if (path === '/ayuda') {
      return (
        <EcosystemPagesView
          page="ayuda"
          operator={operator}
          onUpdateOperator={setOperator}
          quality={quality}
          onChangeQuality={setQuality}
          onOpenLoaderPreview={() => {
            setLoaderRevealing(false);
            setLoaderPreview(true);
            setLoaderOpen(true);
          }}
          byteBalance={byteBalance}
          coreBalance={coreBalance}
          xpBalance={xpBalance}
          enrolledMethodCount={unlockedMethodIds.length}
          onNavigate={navigate}
        />
      );
    }

    // 9. PERFIL (/perfil)
    if (path === '/perfil') {
      return (
        <EcosystemPagesView
          page="perfil"
          operator={operator}
          onUpdateOperator={setOperator}
          quality={quality}
          onChangeQuality={setQuality}
          onOpenLoaderPreview={() => {
            setLoaderRevealing(false);
            setLoaderPreview(true);
            setLoaderOpen(true);
          }}
          byteBalance={byteBalance}
          coreBalance={coreBalance}
          xpBalance={xpBalance}
          enrolledMethodCount={unlockedMethodIds.length}
          onNavigate={navigate}
        />
      );
    }

    // 10. ADMIN (/admin)
    if (path === '/admin') {
      return (
        <EcosystemPagesView
          page="admin"
          operator={operator}
          onUpdateOperator={setOperator}
          quality={quality}
          onChangeQuality={setQuality}
          onOpenLoaderPreview={() => {
            setLoaderRevealing(false);
            setLoaderPreview(true);
            setLoaderOpen(true);
          }}
          byteBalance={byteBalance}
          coreBalance={coreBalance}
          xpBalance={xpBalance}
          enrolledMethodCount={unlockedMethodIds.length}
          onNavigate={navigate}
        />
      );
    }

    // 11. LOGIN & REGISTRO (/login, /registro)
    if (path === '/login' || path === '/registro') {
      return (
        <AuthGateway
          quality={quality}
          initialMode={path === '/registro' ? 'register' : 'login'}
          onReturnHome={() => navigate('/')}
          onAuthenticated={(profile) => {
            setOperator(profile);
            navigate('/campus');
          }}
        />
      );
    }

    // Fallback to Home
    return (
      <HomeView
        quality={quality}
        loaderOpen={loaderOpen && !loaderRevealing}
        bootRevealTick={bootRevealTick}
        unlockedMethodIds={unlockedMethodIds}
        onNavigate={navigate}
        onSelectMethod={(method) => navigate(`/metodos/${method.slug}`)}
      />
    );
  };

  const shellBootClass =
    loaderOpen && !loaderRevealing
      ? 'is-boot-waiting'
      : bootRevealTick > 0
      ? 'is-boot-entering'
      : '';

  return (
    <>
      {/* NØTRACE SVG Symbol Sprite */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'none' }}
        aria-hidden="true"
      >
        <symbol id="terminal" viewBox="0 0 24 24">
          <path d="m4 6 6 6-6 6m9 0h7" />
        </symbol>
        <symbol id="arrow" viewBox="0 0 24 24">
          <path d="M5 12h14m-6-6 6 6-6 6" />
        </symbol>
        <symbol id="shield" viewBox="0 0 24 24">
          <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
        </symbol>
        <symbol id="network" viewBox="0 0 24 24">
          <rect x="9" y="2" width="6" height="6" rx="1" />
          <rect x="2" y="16" width="6" height="6" rx="1" />
          <rect x="16" y="16" width="6" height="6" rx="1" />
          <path d="M12 8v4M5 16v-4h14v4" />
        </symbol>
      </svg>

      {/* Main Application Shell (.nt-shell) */}
      <div className={`nt-shell ${shellBootClass}`} id="app">
        {/* Global Top Navigation Bar (Section 05) */}
        <header className="nt-nav relative">
          {/* Left Zone: Brand */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            className="nt-brand"
          >
            <svg className="nt-icon" aria-hidden="true">
              <use href="#terminal" />
            </svg>
            <span>NØTRACE</span>
          </a>

          {/* Center Zone: Primary Navigation */}
          <nav
            className="hidden lg:flex items-center gap-1 text-xs font-medium"
            aria-label="Navegación principal"
          >
            {[
              { path: '/', label: 'Inicio', icon: Compass },
              { path: '/metodos', label: 'Métodos', icon: BookOpen },
              { path: '/herramientas', label: 'Herramientas', icon: Boxes },
              { path: '/campus', label: 'Campus', icon: GraduationCap },
              { path: '/nosotros', label: 'Nosotros', icon: Shield },
            ].map((item) => {
              const Icon = item.icon;
              const active = isNavActive(item.path);
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                    active
                      ? 'bg-[#141414] text-white border border-[#2E2E2E]'
                      : 'text-[#A3A3A3] hover:text-white hover:bg-[#0D0D0D]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Zone: Auth / Economy / Profile Controls */}
          <div className="nt-nav-actions">
            {!operator.isGuest ? (
              <>
                <div className="hidden sm:flex items-center gap-1.5">
                  <CurrencyBadge
                    currency="NOBYTE"
                    amount={byteBalance}
                    onClick={() => navigate('/billetera')}
                  />
                  <CurrencyBadge
                    currency="NOCORE"
                    amount={coreBalance}
                    onClick={() => navigate('/billetera')}
                  />
                </div>

                {/* Notifications Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setNotificationsOpen((v) => !v);
                    }}
                    className={`nt-btn nt-btn--ghost px-2.5 py-1.5 relative ${
                      notificationsOpen ? 'border-[#525252] text-white' : ''
                    }`}
                    aria-label="Notificaciones y Operaciones"
                    title="Notificaciones y Misiones"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white absolute top-1.5 right-1.5" />
                  </button>

                  {notificationsOpen && (
                    <div className="fixed left-3.5 right-3.5 top-[68px] sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80 rounded-xl bg-[#0A0A0A]/95 backdrop-blur-md border border-[#2E2E2E] shadow-2xl p-4 z-50 space-y-3">
                      <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-2">
                        <span className="text-xs font-semibold text-white">
                          Centro de Operaciones
                        </span>
                        <span className="nt-mono text-[10px] text-[#737373]">
                          NØTRACE // OPS
                        </span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-[#050505] border border-[#1E1E1E] space-y-1">
                          <div className="text-white font-medium">
                            Misión lista para reclamar
                          </div>
                          <p className="text-[#8A8A8A] text-[11px]">
                            Inspección de privacidad completada (+40 NØBYTE).
                          </p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#050505] border border-[#1E1E1E] space-y-1">
                          <div className="text-white font-medium">
                            VPN Inspector Operativo
                          </div>
                          <p className="text-[#8A8A8A] text-[11px]">
                            Verificación IP y ASN activa en /herramientas/vpn-inspector.
                          </p>
                        </div>
                      </div>
                      <div className="pt-1 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => navigate('/misiones')}
                          className="nt-btn nt-btn--primary text-xs w-full justify-center"
                        >
                          Ir a Misiones y Recompensas
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Button */}
                <button
                  type="button"
                  onClick={() => navigate('/perfil')}
                  className={`nt-btn text-xs ${
                    isNavActive('/perfil') ? 'nt-btn--primary' : ''
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {operator.alias.split(' ')[0] || 'Perfil'}
                  </span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/billetera')}
                  className={`nt-btn nt-btn--ghost text-xs ${
                    isNavActive('/billetera') ? 'border-[#525252] text-white' : ''
                  }`}
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Billetera</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="nt-btn text-xs"
                >
                  Acceso
                </button>
              </>
            )}

            {/* Ecosystem Command Menu Toggle (3-line button, works on Desktop & Mobile) */}
            <button
              type="button"
              onClick={() => {
                setNotificationsOpen(false);
                setMobileMenuOpen((v) => !v);
              }}
              className={`nt-btn nt-btn--ghost px-2.5 py-1.5 ${
                mobileMenuOpen ? 'bg-[#161616] border-[#404040] text-white' : ''
              }`}
              aria-label={
                mobileMenuOpen
                  ? 'Cerrar menú del ecosistema'
                  : 'Abrir menú del ecosistema'
              }
              aria-expanded={mobileMenuOpen}
              title="Menú completo del ecosistema NØTRACE"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 transition-transform duration-200 rotate-90" />
              ) : (
                <Menu className="w-4 h-4 transition-transform duration-200" />
              )}
            </button>
          </div>
        </header>

        {/* Mobile & Tablet Quick Navigation Strip (1-tap navigation on <1024px) */}
        <nav
          aria-label="Acceso rápido móvil"
          className="lg:hidden flex items-center gap-1.5 overflow-x-auto py-2 border-b border-[#171717] -mx-1 px-1"
        >
          {[
            { path: '/', label: 'Inicio', icon: Compass },
            { path: '/metodos', label: 'Métodos', icon: BookOpen },
            { path: '/herramientas', label: 'Toolkit', icon: Boxes },
            { path: '/herramientas/vpn-inspector', label: 'VPN Map', icon: Shield },
            { path: '/campus', label: 'Campus', icon: GraduationCap },
            { path: '/billetera', label: 'Vault', icon: Wallet },
            { path: '/misiones', label: 'Misiones', icon: CheckCircle2 },
          ].map((item) => {
            const Icon = item.icon;
            const active =
              item.path === '/herramientas/vpn-inspector'
                ? currentPath === '/herramientas/vpn-inspector'
                : item.path === '/herramientas'
                  ? currentPath.startsWith('/herramientas') &&
                    currentPath !== '/herramientas/vpn-inspector'
                  : isNavActive(item.path);
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 border transition-colors ${
                  active
                    ? 'bg-white text-black border-white'
                    : 'bg-[#0A0A0A] text-[#A3A3A3] border-[#1F1F1F] hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Superimposed Ecosystem Command Menu Overlay (Smooth Open & Close + Backdrop Blur) */}
        <div
          className={`nt-menu-overlay ${mobileMenuOpen ? 'is-open' : ''}`}
          aria-hidden={!mobileMenuOpen}
        >
          {/* Blurred Surrounding Backdrop (click outside to close) */}
          <div
            className="nt-menu-backdrop"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Cerrar menú al hacer clic fuera"
          />

          {/* Floating Command Panel Container */}
          <div className="nt-menu-shell">
            <div
              className="nt-menu-panel p-4 sm:p-6 space-y-5"
              role="dialog"
              aria-modal="true"
              aria-label="Menú completo del ecosistema NØTRACE"
            >
              {/* Top Status & Quick Actions Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E1E1E]">
                <div className="flex items-center justify-between sm:justify-start gap-2.5">
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />
                    <span className="nt-mono text-[11px] text-[#A3A3A3] tracking-wider truncate">
                      NØTRACE 3.0 // DIRECTORIO OPERATIVO
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#141414] border border-[#2A2A2A] text-[#D4D4D4] truncate max-w-[190px] sm:max-w-none">
                      {operator.isGuest
                        ? 'Sesión: Invitado'
                        : `${operator.alias} · ${operator.clearance}`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="sm:hidden nt-btn nt-btn--sm nt-btn--ghost text-xs border border-[#262626] shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cerrar</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <CurrencyBadge
                      currency="NOBYTE"
                      amount={byteBalance}
                      onClick={() => navigate('/billetera')}
                    />
                    <CurrencyBadge
                      currency="NOCORE"
                      amount={coreBalance}
                      onClick={() => navigate('/billetera')}
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setLoaderPreview(true);
                        setLoaderOpen(true);
                      }}
                      className="nt-btn nt-btn--sm text-xs"
                    >
                      Boot ASCII
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen(false)}
                      className="hidden sm:inline-flex nt-btn nt-btn--sm nt-btn--ghost text-xs border border-[#262626]"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Cerrar</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Quick-Filter Pill Bar (visible on mobile/tablet for fast navigation) */}
              <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
                {[
                  { id: 'all', label: 'Todo (22)' },
                  { id: 'principal', label: 'Principal' },
                  { id: 'labs', label: 'Labs en Vivo' },
                  { id: 'economia', label: 'Vault & Misiones' },
                  { id: 'cuenta', label: 'Cuenta & Sistema' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setMenuGroupFilter(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                      menuGroupFilter === tab.id
                        ? 'bg-white text-black'
                        : 'bg-[#121212] text-[#A3A3A3] border border-[#262626]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 4-Column Categorized Directory of all 22 NØTRACE Routes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Group 1: Ecosistema Principal */}
                <div
                  className={`nt-menu-col space-y-2.5 ${
                    menuGroupFilter !== 'all' && menuGroupFilter !== 'principal'
                      ? 'hidden lg:block'
                      : ''
                  }`}
                  style={{ '--col-delay': '35ms' } as React.CSSProperties}
                >
                  <div className="nt-mono text-[10px] text-[#737373] uppercase tracking-wider px-1">
                    01 // Ecosistema Principal
                  </div>
                  <div className="space-y-1.5">
                    {[
                      {
                        path: '/',
                        label: 'Inicio',
                        desc: 'Portada y centro operativo',
                        icon: Compass,
                      },
                      {
                        path: '/metodos',
                        label: 'Catálogo de Métodos',
                        desc: 'Sistemas y guías técnicas',
                        icon: BookOpen,
                      },
                      {
                        path: '/herramientas',
                        label: 'Toolkit de Herramientas',
                        desc: 'Suite de diagnóstico y red',
                        icon: Boxes,
                      },
                      {
                        path: '/campus',
                        label: 'Campus Operativo',
                        desc: 'Módulos y estudio activo',
                        icon: GraduationCap,
                      },
                      {
                        path: '/campus/progreso',
                        label: 'Progreso de Estudio',
                        desc: 'Métricas y certificaciones',
                        icon: CheckCircle2,
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      const active = currentPath === item.path;
                      return (
                        <button
                          key={item.path}
                          type="button"
                          onClick={() => navigate(item.path)}
                          className={`w-full flex items-start gap-2.5 p-2.5 rounded-lg text-left border transition-colors ${
                            active
                              ? 'bg-[#181818] text-white border-[#4A4A4A]'
                              : 'bg-[#070707] text-[#D4D4D4] border-[#1A1A1A] hover:border-[#363636] hover:bg-[#111111] hover:text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4 mt-0.5 shrink-0 text-[#A3A3A3]" />
                          <div className="min-w-0">
                            <div className="text-xs font-medium leading-tight">
                              {item.label}
                            </div>
                            <div className="text-[11px] text-[#737373] truncate mt-0.5">
                              {item.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Group 2: Laboratorios Interactivos */}
                <div
                  className={`nt-menu-col space-y-2.5 ${
                    menuGroupFilter !== 'all' && menuGroupFilter !== 'labs'
                      ? 'hidden lg:block'
                      : ''
                  }`}
                  style={{ '--col-delay': '70ms' } as React.CSSProperties}
                >
                  <div className="nt-mono text-[10px] text-[#737373] uppercase tracking-wider px-1">
                    02 // Laboratorios en Vivo
                  </div>
                  <div className="space-y-1.5">
                    {[
                      {
                        path: '/herramientas/vpn-inspector',
                        label: 'VPN & IP Inspector',
                        desc: 'Verificación real de IP y ASN',
                      },
                      {
                        path: '/herramientas/privacy-lab',
                        label: 'Privacy Lab',
                        desc: 'Huella de navegador y WebRTC',
                      },
                      {
                        path: '/herramientas/network-lab',
                        label: 'Network Lab',
                        desc: 'Subredes CIDR y firewall nftables',
                      },
                      {
                        path: '/herramientas/crypto-lab',
                        label: 'Crypto Lab',
                        desc: 'Hashes SHA-256 y entropía local',
                      },
                    ].map((item) => {
                      const active = currentPath === item.path;
                      return (
                        <button
                          key={item.path}
                          type="button"
                          onClick={() => navigate(item.path)}
                          className={`w-full flex items-start gap-2.5 p-2.5 rounded-lg text-left border transition-colors ${
                            active
                              ? 'bg-[#181818] text-white border-[#4A4A4A]'
                              : 'bg-[#070707] text-[#D4D4D4] border-[#1A1A1A] hover:border-[#363636] hover:bg-[#111111] hover:text-white'
                          }`}
                        >
                          <Boxes className="w-4 h-4 mt-0.5 shrink-0 text-[#A3A3A3]" />
                          <div className="min-w-0">
                            <div className="text-xs font-medium leading-tight">
                              {item.label}
                            </div>
                            <div className="text-[11px] text-[#737373] truncate mt-0.5">
                              {item.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Group 3: Economía & Operaciones */}
                <div
                  className={`nt-menu-col space-y-2.5 ${
                    menuGroupFilter !== 'all' && menuGroupFilter !== 'economia'
                      ? 'hidden lg:block'
                      : ''
                  }`}
                  style={{ '--col-delay': '105ms' } as React.CSSProperties}
                >
                  <div className="nt-mono text-[10px] text-[#737373] uppercase tracking-wider px-1">
                    03 // Economía & Operaciones
                  </div>
                  <div className="space-y-1.5">
                    {[
                      {
                        path: '/billetera',
                        label: 'Billetera Vault',
                        desc: 'Balances NØBYTE y NØCORE',
                        icon: Wallet,
                      },
                      {
                        path: '/billetera/recargar',
                        label: 'Recargar NØCORE',
                        desc: 'Paquetes conceptuales Vault',
                        icon: Wallet,
                      },
                      {
                        path: '/billetera/historial',
                        label: 'Historial de Movimientos',
                        desc: 'Registro auditable de unidades',
                        icon: Wallet,
                      },
                      {
                        path: '/misiones',
                        label: 'Misiones Operativas',
                        desc: 'Objetivos activos y NØBYTE',
                        icon: Target,
                      },
                      {
                        path: '/recompensas',
                        label: 'Recompensas & Rangos',
                        desc: 'Niveles y progresión NØXP',
                        icon: Target,
                      },
                      {
                        path: '/eventos',
                        label: 'Eventos Activos',
                        desc: 'Multiplicadores del ecosistema',
                        icon: Target,
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      const active = currentPath === item.path;
                      return (
                        <button
                          key={item.path}
                          type="button"
                          onClick={() => navigate(item.path)}
                          className={`w-full flex items-start gap-2.5 p-2.5 rounded-lg text-left border transition-colors ${
                            active
                              ? 'bg-[#181818] text-white border-[#4A4A4A]'
                              : 'bg-[#070707] text-[#D4D4D4] border-[#1A1A1A] hover:border-[#363636] hover:bg-[#111111] hover:text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4 mt-0.5 shrink-0 text-[#A3A3A3]" />
                          <div className="min-w-0">
                            <div className="text-xs font-medium leading-tight">
                              {item.label}
                            </div>
                            <div className="text-[11px] text-[#737373] truncate mt-0.5">
                              {item.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Group 4: Cuenta & Plataforma */}
                <div
                  className={`nt-menu-col space-y-2.5 ${
                    menuGroupFilter !== 'all' && menuGroupFilter !== 'cuenta'
                      ? 'hidden lg:block'
                      : ''
                  }`}
                  style={{ '--col-delay': '140ms' } as React.CSSProperties}
                >
                  <div className="nt-mono text-[10px] text-[#737373] uppercase tracking-wider px-1">
                    04 // Cuenta & Plataforma
                  </div>
                  <div className="space-y-1.5">
                    {[
                      {
                        path: '/perfil',
                        label: 'Perfil de Operador',
                        desc: 'Credenciales y métodos activos',
                        icon: User,
                      },
                      {
                        path: '/nosotros',
                        label: 'Sobre NØTRACE',
                        desc: 'Manifiesto y arquitectura 3.0',
                        icon: Shield,
                      },
                      {
                        path: '/ayuda',
                        label: 'Centro de Ayuda',
                        desc: 'Guía del sistema y preguntas',
                        icon: HelpCircle,
                      },
                      {
                        path: '/admin',
                        label: 'Consola Admin',
                        desc: 'Estado global de la plataforma',
                        icon: Shield,
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      const active = currentPath === item.path;
                      return (
                        <button
                          key={item.path}
                          type="button"
                          onClick={() => navigate(item.path)}
                          className={`w-full flex items-start gap-2.5 p-2.5 rounded-lg text-left border transition-colors ${
                            active
                              ? 'bg-[#181818] text-white border-[#4A4A4A]'
                              : 'bg-[#070707] text-[#D4D4D4] border-[#1A1A1A] hover:border-[#363636] hover:bg-[#111111] hover:text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4 mt-0.5 shrink-0 text-[#A3A3A3]" />
                          <div className="min-w-0">
                            <div className="text-xs font-medium leading-tight">
                              {item.label}
                            </div>
                            <div className="text-[11px] text-[#737373] truncate mt-0.5">
                              {item.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}

                    <div className="pt-2 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="nt-btn nt-btn--sm text-xs justify-center"
                      >
                        Acceso / Login
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('/registro')}
                        className="nt-btn nt-btn--sm nt-btn--primary text-xs justify-center"
                      >
                        Registro
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Page View */}
        <main id="main-content" className="min-h-[70vh]">
          {renderRouteContent()}
        </main>

        {/* Conceptual Method Acquisition Modal */}
        {unlockModalMethod && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="max-w-lg w-full rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl">
              <div className="flex items-start justify-between gap-4 border-b border-[#1E1E1E] pb-4">
                <div>
                  <span className="nt-mono text-[11px] text-[#737373]">
                    // DEMOSTRACIÓN CONCEPTUAL DE DESBLOQUEO
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                    {unlockModalMethod.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setUnlockModalMethod(null)}
                  className="text-[#737373] hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                En la arquitectura económica conceptual de NØTRACE 3.0, este Método puede
                desbloquearse mediante unidades del ecosistema. Ningún cobro real se procesa en
                esta fase de demostración.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-lg bg-[#050505] border border-[#1E1E1E]">
                <div>
                  <div className="text-[11px] text-[#737373] mb-1">Valor del Método</div>
                  <CurrencyAmount
                    currency={unlockModalMethod.currency}
                    amount={unlockModalMethod.priceAmount}
                    size="md"
                  />
                </div>
                <div>
                  <div className="text-[11px] text-[#737373] mb-1">Recompensa al completar</div>
                  <CurrencyAmount
                    currency="NOBYTE"
                    amount={unlockModalMethod.rewardByte}
                    size="md"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row flex-wrap items-stretch sm:items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setUnlockModalMethod(null);
                    navigate('/billetera');
                  }}
                  className="nt-btn nt-btn--ghost text-xs justify-center"
                >
                  Ver Billetera Vault
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmConceptualUnlock(unlockModalMethod)}
                  className="nt-btn nt-btn--primary text-xs justify-center"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Abrir Método en Campus (Demo)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Global Ecosystem Footer */}
        <footer className="mt-10 sm:mt-16 pt-8 sm:pt-10 pb-6 sm:pb-8 border-t border-[#171717] text-xs text-[#8A8A8A] space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
            <div className="col-span-2 lg:col-span-2 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <svg className="nt-icon" aria-hidden="true">
                  <use href="#terminal" />
                </svg>
                <span>NØTRACE // ECOSYSTEM 3.0</span>
              </div>
              <p className="text-xs text-[#737373] max-w-sm leading-relaxed">
                Plataforma de formación técnica estructurada, Métodos de ciberseguridad,
                diagnóstico de privacidad y arquitectura económica conceptual NØBYTE & NØCORE.
              </p>
              <div className="nt-mono text-[11px] text-[#525252]">
                SESIÓN: <strong className="text-[#A3A3A3]">{operator.alias}</strong> (
                {operator.isGuest ? 'INVITADO' : operator.clearance})
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="nt-mono text-[11px] text-white font-semibold">
                PLATAFORMA
              </div>
              <ul className="space-y-1.5">
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="hover:text-white transition-colors"
                  >
                    Inicio
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('/metodos')}
                    className="hover:text-white transition-colors"
                  >
                    Catálogo de Métodos
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('/campus')}
                    className="hover:text-white transition-colors"
                  >
                    Campus Virtual
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('/campus/progreso')}
                    className="hover:text-white transition-colors"
                  >
                    Progreso Académico
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <div className="nt-mono text-[11px] text-white font-semibold">
                TOOLKIT & LABS
              </div>
              <ul className="space-y-1.5">
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('/herramientas')}
                    className="hover:text-white transition-colors"
                  >
                    NØTRACE Toolkit
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('/herramientas/vpn-inspector')}
                    className="hover:text-white transition-colors"
                  >
                    VPN Inspector
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('/herramientas/crypto-lab')}
                    className="hover:text-white transition-colors"
                  >
                    Crypto Lab (SHA / CSPRNG)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('/herramientas/network-lab')}
                    className="hover:text-white transition-colors"
                  >
                    Network Lab (CIDR / Firewall)
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <div className="nt-mono text-[11px] text-white font-semibold">
                ECONOMÍA & SISTEMA
              </div>
              <ul className="space-y-1.5">
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('/billetera')}
                    className="hover:text-white transition-colors"
                  >
                    NØTRACE Vault
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('/misiones')}
                    className="hover:text-white transition-colors"
                  >
                    Misiones y Rangos
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('/nosotros')}
                    className="hover:text-white transition-colors"
                  >
                    Sobre NØTRACE
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('/ayuda')}
                    className="hover:text-white transition-colors"
                  >
                    Centro de Ayuda
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('/admin')}
                    className="hover:text-white transition-colors"
                  >
                    Arquitectura Económica
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[#141414] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#626262]">
            <span>NØTRACE 3.0 — Master Platform, Economy & Experience System</span>
            <span>Monochrome Dark UI · Aprendizaje Técnico Responsable</span>
          </div>
        </footer>
      </div>

      {/* Loader Overlay (.nt-loader) driven by real readiness or manual preview */}
      <BootScreen
        open={loaderOpen}
        isPreview={loaderPreview}
        quality={quality}
        readinessPromise={initialReadiness}
        onRevealStart={() => {
          setLoaderRevealing(true);
          setBootRevealTick((t) => t + 1);
        }}
        onClose={() => {
          setLoaderOpen(false);
          setLoaderRevealing(false);
          setLoaderPreview(false);
        }}
      />
    </>
  );
}
