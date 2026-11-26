# NØTRACE — Motor Gráfico ASCII 2.0 (`src/visual/ascii-engine.ts`)

## 1. Arquitectura Basada en `ascii-engine.js` y `hacker-luma.png`
El motor gráfico `AsciiEngine` (`src/visual/ascii-engine.ts`) parte directamente del módulo entregado en **NØTRACE Visual & Motion Kit 2.0** y utiliza `/assets/aistudio/hacker-luma_ac410dd3.png` como matriz base de luminancia:
1. **Muestreo Dinámico en Canvas 2D**:
   - Calcula columnas adaptativas según el ancho del contenedor y el perfil de calidad (`low: 74`, `auto: 88..144`, `high: 176`), limitando `devicePixelRatio` a `2`.
   - Muestrea `hacker-luma.png` en un canvas offscreen y clasifica cada celda activa (`lum >= 0.025`) con la rampa `GLYPHS = ' .:+-=/0#%@'`.
2. **Modulación Regional Orgánica**:
   - **Capucha y hombros (`hood`)**: Respiración vertical sutil sin deformar la silueta.
   - **Ojos (`eyes`)**: Iluminación reactiva y micro-parpadeo orgánico dentro de la cavidad de la capucha.
   - **Pantalla y prompt `>_` (`prompt` / `screen`)**: Pulso de luminancia y reflejo de terminal.
   - **Manos (`hands`)**: Micro-actividad de tecleo sincronizada con la mutación de caracteres.
3. **Controles en Tiempo Real y Gobernanza de Recursos**:
   - Expone `.set({ density, speed, rain, assemble, quality })`, `.pause()`, `.resume()`, `.replay()`, `.pulseActivity()` y `.destroy()`.
   - Limita el repintado a ~30 FPS (`32ms`) y se pausa automáticamente con `IntersectionObserver`, `document.hidden` (`visibilitychange`) y `prefers-reduced-motion`.
   - Incluye fallback automático a `<img class="nt-ascii">` si falla la carga o el contexto Canvas 2D.
