import React, { useEffect, useState } from 'react';
import { AsciiHackerArt, QualityTier } from './AsciiHackerArt';

export interface OperatorProfile {
  alias: string;
  email: string;
  role: string;
  clearance: string;
  isGuest: boolean;
}

interface AuthGatewayProps {
  onAuthenticated: (profile: OperatorProfile) => void;
  onReturnHome: () => void;
  quality?: QualityTier;
  initialMode?: 'login' | 'register' | 'recovery';
}

export const AuthGateway: React.FC<AuthGatewayProps> = ({
  onAuthenticated,
  onReturnHome,
  quality = 'auto',
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'recovery'>(initialMode);
  const [fullName, setFullName] = useState('Elena Vance');
  const [email, setEmail] = useState('estudiante@notrace.edu');
  const [password, setPassword] = useState('Notrace#2026');
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>(
    'Acceso seguro al Campus Virtual, Métodos y laboratorios de ciberseguridad.'
  );
  const [statusType, setStatusType] = useState<'neutral' | 'error' | 'success'>('neutral');
  const [activityPulse, setActivityPulse] = useState(0);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const triggerPulse = () => {
    setActivityPulse((p) => (p >= 0.8 ? 0.45 : p + 0.35));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerPulse();

    if (!email.includes('@') || !email.includes('.')) {
      setStatusType('error');
      setStatusMessage('Introduce una dirección de correo electrónico válida.');
      return;
    }

    if (mode === 'recovery') {
      setStatusType('success');
      setStatusMessage(`Enlace de restablecimiento enviado a ${email}.`);
      return;
    }

    if (password.length < 6) {
      setStatusType('error');
      setStatusMessage('La contraseña debe contener al menos 6 caracteres.');
      return;
    }

    if (mode === 'register' && fullName.trim().length < 2) {
      setStatusType('error');
      setStatusMessage('Introduce tu nombre completo o identificador de estudiante.');
      return;
    }

    const derivedAlias =
      mode === 'register'
        ? fullName.trim()
        : email.split('@')[0] || 'Estudiante NØTRACE';

    setStatusType('success');
    setStatusMessage('Credenciales verificadas. Abriendo sesión…');

    onAuthenticated({
      alias: derivedAlias,
      email: email.trim(),
      role: mode === 'register' ? 'Estudiante Inscrito' : 'Miembro Academia',
      clearance: 'Campus Virtual',
      isGuest: false,
    });
  };

  const handleGuestAccess = () => {
    onAuthenticated({
      alias: 'Visitante',
      email: 'invitado@notrace.edu',
      role: 'Acceso Exploratorio',
      clearance: 'Vista Previa',
      isGuest: true,
    });
  };

  return (
    <main className="nt-login" id="login" data-view="login">
      <section className="nt-login-art nt-reveal">
        <AsciiHackerArt
          density={0.96}
          speed={0.4}
          rain={true}
          assemble={true}
          quality={quality}
          interactiveBoost={activityPulse}
        />
        <div className="nt-art-caption">
          <span>ASCII / ACCESS INTERFACE</span>
          <span>NØTRACE // 02</span>
        </div>
        <h2>Aprende. Comprende. Protege.</h2>
        <p className="nt-muted">
          Un espacio dedicado al aprendizaje responsable de la ciberseguridad, arquitectura de
          redes y auditoría práctica.
        </p>
      </section>

      <form className="nt-form nt-reveal" id="login-form" onSubmit={handleSubmit} noValidate>
        <div className="nt-form-head">
          <span className="nt-mono nt-muted">
            {mode === 'login'
              ? '// ACCESO'
              : mode === 'register'
              ? '// REGISTRO DE ESTUDIANTE'
              : '// RECUPERACIÓN'}
          </span>
          <h1>
            {mode === 'login'
              ? 'Bienvenido.'
              : mode === 'register'
              ? 'Crear cuenta.'
              : 'Restablecer.'}
          </h1>
          <p className="nt-muted">
            {mode === 'login'
              ? 'Accede a tu espacio de aprendizaje y laboratorios CLI.'
              : mode === 'register'
              ? 'Inscríbete en rutas especializadas y registra tu progreso.'
              : 'Te enviaremos instrucciones para recuperar tu acceso.'}
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setStatusType('neutral');
              setStatusMessage('Introduce tus credenciales para iniciar sesión.');
            }}
            className={`nt-btn ${mode === 'login' ? 'nt-btn--primary' : 'nt-btn--ghost'}`}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setStatusType('neutral');
              setStatusMessage('Completa tus datos para crear una cuenta académica.');
            }}
            className={`nt-btn ${mode === 'register' ? 'nt-btn--primary' : 'nt-btn--ghost'}`}
          >
            Crear cuenta
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('recovery');
              setStatusType('neutral');
              setStatusMessage('Indica tu correo registrado para recuperar tu contraseña.');
            }}
            className={`nt-btn ${mode === 'recovery' ? 'nt-btn--primary' : 'nt-btn--ghost'}`}
          >
            Recuperar
          </button>
        </div>

        {mode === 'register' && (
          <label className="nt-field" htmlFor="full-name">
            Nombre o alias académico
            <input
              className="nt-input"
              type="text"
              id="full-name"
              name="fullName"
              autoComplete="name"
              placeholder="Elena Vance"
              value={fullName}
              onFocus={triggerPulse}
              onChange={(e) => {
                setFullName(e.target.value);
                triggerPulse();
              }}
              required
            />
          </label>
        )}

        <label className="nt-field" htmlFor="email">
          Correo electrónico
          <input
            className="nt-input"
            type="email"
            id="email"
            name="email"
            autoComplete="username"
            placeholder="correo@ejemplo.com"
            value={email}
            onFocus={triggerPulse}
            onChange={(e) => {
              setEmail(e.target.value);
              triggerPulse();
            }}
            required
          />
        </label>

        {mode !== 'recovery' && (
          <>
            <label className="nt-field" htmlFor="password">
              Contraseña
            </label>
            <div className="nt-password">
              <input
                className="nt-input"
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onFocus={triggerPulse}
                onChange={(e) => {
                  setPassword(e.target.value);
                  triggerPulse();
                }}
                required
              />
              <button
                type="button"
                className="nt-btn nt-btn--ghost"
                id="show-password"
                aria-controls="password"
                aria-pressed={showPassword}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </>
        )}

        <button className="nt-btn nt-btn--primary" type="submit">
          <span>
            {mode === 'login'
              ? 'Iniciar sesión'
              : mode === 'register'
              ? 'Completar registro'
              : 'Enviar enlace'}
          </span>
          <svg className="nt-icon" aria-hidden="true">
            <use href="#arrow" />
          </svg>
        </button>

        <p
          className="nt-form-note"
          id="login-status"
          role="status"
          style={{
            color:
              statusType === 'error'
                ? 'var(--danger)'
                : statusType === 'success'
                ? 'var(--success)'
                : undefined,
          }}
        >
          {statusMessage}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#2E2E2E]">
          <button
            type="button"
            onClick={onReturnHome}
            className="nt-muted hover:text-white text-xs cursor-pointer"
          >
            Volver al inicio
          </button>

          <button
            type="button"
            onClick={handleGuestAccess}
            className="nt-btn nt-btn--ghost text-xs"
          >
            Continuar como invitado
          </button>
        </div>
      </form>
    </main>
  );
};
