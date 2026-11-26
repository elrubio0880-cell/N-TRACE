# NØTRACE 3.0 — MOTION & ASCII GRAPHICS SYSTEM

## 1. Motor Gráfico ASCII (`src/visual/ascii-engine.ts`)
- Renderizado dinámico en Canvas 2D a partir de `hacker-luma.png`.
- Soporta reconstrucción progresiva (`assemble`), lluvia de caracteres (`rain`), mutación procedural y límite de 30 FPS.
- Se pausa automáticamente cuando el lienzo sale del viewport (`IntersectionObserver`) o cuando la pestaña está oculta.

## 2. Secuencia de Arranque (`src/components/BootScreen.tsx`)
- Muestra la reconstrucción del personaje ASCII durante 4.8 segundos con progreso por etapas reales.
- Al completarse, ejecuta una transición de cortina de dígitos en caída libre (`runDigitCurtainTransition`) antes de revelar la plataforma.

## 3. Micro-interacciones de Monedas y Accesibilidad
- `.nt-core-ring`: Rotación orbital suave de 18s para el anillo interno de `NØCORE`.
- `.nt-byte-blocks`: Pulso sutil de luminancia de 3.6s para los bloques binarios de `NØBYTE`.
- Soporte completo para `prefers-reduced-motion: reduce`.
