# NØTRACE 3.0 — ROUTING & NAVIGATION ARCHITECTURE

## 1. Mapa de Rutas Multipágina (`src/App.tsx`)
La aplicación utiliza la API HTML5 History (`window.history.pushState` y evento `popstate`) respaldada por el servidor Express SPA (`server.ts`):

- `/` — **Home**: Presentación comercial limpia, Hero con motor ASCII, carrusel horizontal de Métodos destacados, vista previa del Toolkit, presentación de `NØBYTE` / `NØCORE`, Operaciones y Sobre NØTRACE.
- `/metodos` — **Catálogo de Métodos**: Buscador, filtros por categoría, nivel, modalidad gratuita/premium y moneda.
- `/metodos/:slug` — **Detalle de Método**: Descripción profunda, objetivos, plan modular, herramientas relacionadas y acceso al Campus.
- `/herramientas` — **NØTRACE Toolkit**: Catálogo general organizado en 5 laboratorios (`PRIVACY LAB`, `NETWORK LAB`, `CRYPTO LAB`, `SECURITY LAB`, `PRACTICE LAB`).
- `/herramientas/vpn-inspector` — **VPN Inspector**: Mapa mundial interactivo Natural Earth y telemetría IP real.
- `/herramientas/privacy-lab` — **Privacy Lab**: Inspector local de señales del navegador.
- `/herramientas/network-lab` — **Network Lab**: Calculadora IPv4 CIDR y generador de reglas `nftables`.
- `/herramientas/crypto-lab` — **Crypto Lab**: Suite criptográfica Web Crypto API (`SHA-256/384/512`, CSPRNG, Base64).
- `/campus` y `/campus/progreso` — **NØTRACE Campus**: Mis Métodos, reproductor de lecciones, consola CLI interactiva, progreso académico y certificados.
- `/billetera`, `/billetera/recargar`, `/billetera/historial` — **NØTRACE Vault**: Panel de saldos conceptuales `NØBYTE` y `NØCORE`, flujo de recarga de 5 pasos e historial de movimientos.
- `/misiones`, `/recompensas`, `/eventos` — **NØTRACE Operations**: Misiones diarias/semanales/académicas y jerarquía de 7 rangos (`01 — INITIATE` a `07 — ZERO`).
- `/nosotros` — **Sobre NØTRACE**: Filosofía, misión, visión, metodología y evolución de la plataforma.
- `/ayuda` — **Centro de Ayuda**: Preguntas frecuentes sobre Métodos, herramientas y economía conceptual.
- `/login` y `/registro` — **Autenticación**: Acceso e inscripción con arte ASCII reactivo.
- `/perfil` — **Perfil del Operador**: Rango académico actual, estado de sesión y configuración de calidad del motor ASCII.
- `/admin` — **Gobernanza Económica Conceptual**: Panel de solo lectura con los 9 módulos administrativos y los 17 invariantes de seguridad de servidor.
