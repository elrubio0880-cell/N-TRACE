# NØTRACE — VPN Inspector

Módulo web independiente. No crea una VPN: inspecciona la IP de la solicitud HTTP que llega al servidor de NØTRACE y compara el país geolocalizado con el seleccionado. No usa GPS ni inventa rutas. El arco punteado une observaciones, no saltos de red. Mapa Natural Earth 1:110m (dominio público): https://www.naturalearthdata.com/about/terms-of-use/ . Dataset simplificado, sin Antártida y con algunos territorios pequeños omitidos.

## Demostración
Abre `demo-offline.html` en el navegador. IP de documentación y ciudades ficticias como observaciones; sin peticiones externas. Simula un cambio de salida, modifica el país esperado, guarda una referencia y utiliza zoom o arrastre. Ctrl+rueda también acerca. El modo real requiere servidor.

## Verificación real
Node.js 22 (sin paquetes externos). Crea un token IPinfo. Lite admite país y ASN, no ciudad ni indicador de VPN. Core de pago añade ciudad/coordenadas y señal de anonimización (no prueba concluyente de VPN). https://ipinfo.io/developers/lite-api y https://ipinfo.io/developers/core-api . El token permanece en el servidor.

Linux/macOS:
```sh
IPINFO_TOKEN='TU_TOKEN' IPINFO_PLAN=lite node server.mjs
```
PowerShell:
```powershell
$env:IPINFO_TOKEN='TU_TOKEN'
$env:IPINFO_PLAN='lite'
node server.mjs
```
Abre http://127.0.0.1:8080 para la interfaz; desde localhost la consulta real se rechaza porque no se puede inferir la IP pública del visitante a partir de una petición loopback. Para verificar una VPN, publica en un servidor accesible desde Internet mediante HTTPS. No hagas la consulta desde la propia máquina del servidor al proveedor sin especificar la IP del visitante: obtendrías la IP del servidor.

## Proxy inverso y producción
El ejemplo escucha en loopback. Con Nginx en el mismo host, configura `TRUST_PROXY_IPS=127.0.0.1` y sobrescribe (no anexes) la cabecera del cliente en el proxy. No expongas el backend directamente cuando confíe en el proxy. Ejemplo dentro del vhost HTTPS, para una instancia dedicada:
```nginx
location / {
  proxy_pass http://127.0.0.1:8080;
  proxy_set_header X-NOTRACE-Client-IP $remote_addr;
  proxy_set_header Host $host;
}
```
Si hay CDN/Cloudflare u otros proxies, `$remote_addr` podría ser la IP del CDN: configura la recuperación de IP real únicamente desde rangos de proxy verificados, sobrescribe la cabecera y restringe el origen. No confíes en X-Forwarded-For ni en cabeceras arbitrarias del cliente. Usa el middleware de IP de confianza de tu framework existente. Implementa límites de cuota globales y por usuario y controles antiabuso de producción. El ejemplo incorpora límite local por IP (5 s). No registra IP en logs de aplicación; los proxies, hosting y proveedor pueden registrar solicitudes según sus propias políticas. Informa al usuario antes de iniciar la consulta externa; no envíes datos de autenticación.

## Integración en NØTRACE
- `public/world.js`: datos cartográficos vectoriales preprocesados, sin teselas ni API de mapas. Mover a `src/assets` o `public` según framework.
- `public/style.css`: adaptar tokens a los existentes, encapsular bajo `.vpn-inspector` o CSS Modules; no reemplazar estilos globales a ciegas.
- `public/index.html`: estructura de referencia para ruta `/herramientas/vpn-inspector`.
- `public/app.js`: lógica de comparación, SVG, zoom y estado. Convertir a componente con cleanup en React/Vue/etc. Cambiar `./api/connection` a la ruta absoluta de la API propia si se monta en subruta.
- `server.mjs`: ejemplo de backend. Adaptar la función de consulta al servidor existente, conservar el secreto en variables de entorno y el mecanismo de IP de confianza. No publicar dos servidores innecesariamente.
- `demo-offline.html`: prototipo autónomo, no utilizar como reemplazo del proyecto.

Contrato GET /api/connection: `{ip, countryCode, city, lat, lon, org, asn, anonymous}`. Valores desconocidos son null. Código HTTP distinto de 200 si falla; jamás sustituir silenciosamente por datos ficticios. Lite marca un punto de referencia geográfico en el país, no un servidor exacto; para territorios sin geometría puede no haber marcador. Core marca coordenadas aproximadas del proveedor. Los datos de ejemplo están separados del estado real. No se guarda historial en localStorage. El refresco es periódico (30 s, opt-in) y se omite con pestaña oculta. La medición refleja la familia IP usada por esa petición, no ambas simultáneamente.

## Protocolo de prueba
1. Desde el sitio publicado, con VPN desconectada, realiza una comprobación real y guarda la referencia voluntariamente.
2. Activa VPN, elige país esperado y vuelve a comprobar. Compara país, IP y ASN.
3. Cambia el servidor VPN y repite. Una coincidencia no verifica túnel completo, DNS, WebRTC, kill switch ni cifrado. Un cambio de IP tampoco demuestra VPN. Smart Routing puede anunciar una ubicación lógica distinta a la física. Geolocalización puede estar desactualizada.
4. En fases posteriores, implementar endpoints públicos IPv4-only y IPv6-only, prueba DNS con dominio autoritativo controlado, y prueba WebRTC opcional; no declarar resultados antes de medirlos. No obtener ubicación física por GPS sin permiso separado.

## Directiva para el agente
Sustituye la topología de polígonos ficticios por este mapa real. Mantén Monochrome Dark UI, adapta componentes al framework, integra API real y conserva el resto de funcionalidades. No copies la interfaz ni los colores de Proton. No simules rutas ni protección. Verifica autenticación existente, navegación, móvil, accesibilidad, errores, IP de cliente tras proxy, límites de cuota y datos reales desde una conexión externa. Si quieres más detalle cartográfico usa Natural Earth 1:50m/1:10m. Mantén los efectos de pulso, transición y arco como recursos visuales, no como evidencia de tráfico real. Documenta pruebas ejecutadas y pendientes.
