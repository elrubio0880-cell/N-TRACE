# NØTRACE — Visual & Motion Kit

Implementación reutilizable en HTML, CSS y JavaScript ES Modules, sin dependencias npm. No es una copia del repositorio real: no fue proporcionado. La demo no implementa autenticación, venta de cursos ni servicios de red. No envía credenciales.

## Ejecutar

Desde esta carpeta en PowerShell, CMD o terminal:

```sh
python -m http.server 8080
```

Abre http://localhost:8080/ (Windows también permite `py -m http.server 8080`). Usa **Ver carga** para mostrar el loader y **Acceder** para probar el login. No abras index.html directamente mediante file://: los módulos necesitan un servidor local.

## Ubicación en el proyecto

| Archivo | Destino orientativo | Función |
|---|---|---|
| css/tokens.css | src/styles/tokens.css | Paleta, tipografía, radios, espaciado y accesibilidad |
| css/components.css | src/styles/components.css | Tarjetas, botones, inputs, tablas, modales, chips, skeletons |
| css/motion.css | src/styles/motion.css | Reveal, loader y composición ASCII |
| css/pages.css | src/styles/pages.css | Layout de demostración, adaptar sin sustituir rutas existentes |
| js/ascii-engine.js | src/visual/ascii-engine.js | Motor Canvas 2D y ciclo de vida |
| assets/hacker-luma.png | src/assets/hacker-luma.png | Matriz de luminosidad derivada de la tercera referencia aportada |
| js/loader.js | src/components/loader.js | Controlador de carga real |
| index.html | referencia de markup | Hero, login, loader y tarjetas |
| js/demo.js | solo demo | Interacciones de ejemplo, NO conectar al backend directamente |

Ajusta `new URL('../assets/hacker-luma.png', import.meta.url)` si cambias la posición relativa del archivo. Las fuentes Inter/JetBrains Mono se declaran como preferidas; no se incluyen fuentes ni se solicitan recursos externos. Carga tus fuentes existentes o archivos WOFF2 con licencia adecuada para obtener la apariencia exacta.

## Integración

1. Importa tokens.css, components.css y motion.css en ese orden desde tu entrada global. Aplica `nt-theme` al body o al contenedor raíz. pages.css es opcional: adapta las clases de layout a tu proyecto.
2. Usa los componentes existentes y cambia sus clases o mapea sus estilos a las variables. Conserva el enrutamiento, autenticación, compras y datos reales.
3. Monta el motor dentro de un contenedor de ancho definido:

```html
<div class="nt-art"><canvas class="nt-ascii" id="hero-art" aria-hidden="true"></canvas></div>
```

```js
import { AsciiEngine } from './visual/ascii-engine.js';
const engine = new AsciiEngine(document.querySelector('#hero-art'), {
  density: 0.95, speed: 0.5, rain: true, assemble: true
});
await engine.ready;
// Cambiar opciones: engine.set({speed: .35, rain: false});
// Pausa: engine.pause(); / engine.resume(); / engine.replay();
// Al desmontar componente: engine.destroy();
```

En React/Vue/Svelte monta el motor en el hook de montaje del componente y ejecuta destroy() al desmontarlo. En Next.js usa un componente cliente y useEffect; no instancies el motor durante SSR. Ejemplo React (ajustar import):

```jsx
'use client';
import { useEffect, useRef } from 'react';
import { AsciiEngine } from '../visual/ascii-engine.js';
export function HackerAscii() {
  const ref = useRef(null);
  useEffect(() => {
    const engine = new AsciiEngine(ref.current, { density: .95 });
    engine.ready.catch(console.error);
    return () => engine.destroy();
  }, []);
  return <div className="nt-art"><canvas ref={ref} className="nt-ascii" aria-hidden="true" /></div>;
}
```

4. Para el loader, copia la estructura HTML de `#loader` sin el botón de demostración, y monta `createLoader` con tu promesa real de inicialización. No inventes porcentajes ni retrases el acceso para reproducir una intro. Maneja errores con una opción real de reintento y retira inert/foco de forma coherente. Ejemplo conceptual:

```js
const loader = createLoader(loaderElement, { engine: loaderEngine });
await loader.run(initializeExistingApplication());
```

5. Login: copia únicamente las clases y la composición visual de `#login`. Conserva el submit, validación, CSRF, sesión, recuperación y MFA de tu sistema existente. El código demo no autentica.
6. Las rutas de ejemplo no representan cursos reales. Integra las tarjetas con tu catálogo y URLs existentes.
7. Si se usa un canvas con contenido informativo, ofrece una alternativa textual; los canvas decorativos van con aria-hidden. Respeta reduced-motion y permite pausar animaciones ambientales.

## Arte ASCII

El PNG es un mapa monocromático de luminancia derivado de la tercera imagen aportada por el usuario, recortado con máscara de silueta. El motor muestrea su luminosidad a una cuadrícula y pinta caracteres reales por Canvas, no una imagen estática superpuesta. Incluye formación, mutación de caracteres, lluvia de datos, pulso sutil, scanline, pausa por visibilidad y versión estática por reduced motion. No hay rig de respiración o manos articuladas; serían una extensión con capas separadas. No se ha verificado la licencia de la referencia: reemplázala por una ilustración original o autorizada antes de comercializar si no posees los derechos.

El código se entrega como punto de partida de integración. No se ha modificado ni probado el repositorio real de NØTRACE; el layout es ilustrativo, no una propuesta obligatoria de estructura.

## Verificación realizada

- `node --check` en los tres módulos JavaScript: correcto.
- Chromium/Playwright en la demo autónoma: carga del canvas, pausa, apertura/cierre del loader, cambio al login, mostrar contraseña y submit de demostración: correcto.
- Vista de 1440 × 900 y 375 × 812: comprobación de desbordamiento horizontal en móvil (inicio y login), correcta.
- Preferencia de movimiento reducido activada durante la prueba sin errores de ejecución.
- No se detectaron excepciones JavaScript durante estas pruebas. No se midieron Core Web Vitals ni se probó el backend; la navegación HTTP local en el entorno de pruebas estaba bloqueada, por lo que se probó el HTML autónomo con los mismos módulos integrados.
