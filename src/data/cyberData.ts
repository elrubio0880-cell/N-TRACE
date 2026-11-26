export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  summary: string;
  keyCommand: string;
  transcript: string;
}

export interface LabChallenge {
  prompt: string;
  expectedCommand: string;
  hint: string;
  outputLines: string[];
}

export interface CyberCourse {
  id: string;
  title: string;
  category: 'Hacking Ético' | 'Ciberseguridad' | 'Redes & Servidores' | 'VPN & Proxies';
  level: 'Intermedio' | 'Avanzado' | 'Especialista';
  duration: string;
  lessonsCount: number;
  priceUsd: number;
  priceUsdt: number;
  studentsCount: number;
  instructor: string;
  coverImage: string;
  remotionTheme: 'pentest' | 'vpn-tunnel' | 'server-grid' | 'zero-trust' | 'proxy-chain' | 'osint';
  shortDescription: string;
  outcomes: string[];
  lessons: CourseLesson[];
  lab: LabChallenge;
}

export interface VpnWorldNode {
  id: string;
  city: string;
  country: string;
  code: string;
  ip: string;
  x: number; // SVG 0-1000 coordinate
  y: number; // SVG 0-500 coordinate
  lat: number;
  lon: number;
  baseLatencyMs: number;
  loadPercent: number;
  encryption: string;
  role: 'Entry Guard' | 'Core Relay' | 'Exit Node';
}

export const CYBER_COURSES: CyberCourse[] = [
  {
    id: 'ethical-hacking-redteam',
    title: 'Hacking Ético & Operaciones Red Team',
    category: 'Hacking Ético',
    level: 'Avanzado',
    duration: '34h 20m',
    lessonsCount: 18,
    priceUsd: 89,
    priceUsdt: 89,
    studentsCount: 3420,
    instructor: 'K. Vance (OSCP, GXPN)',
    coverImage: '/assets/aistudio/image_6a542d32.png',
    remotionTheme: 'pentest',
    shortDescription:
      'Auditoría de intrusión profesional, enumeración silenciosa de activos, evasión de IDS y explotación controlada en entornos empresariales.',
    outcomes: [
      'Reconocimiento pasivo y activo sin disparar alertas SIEM',
      'Explotación de servicios expuestos y escalada de privilegios en Linux',
      'Reportes ejecutivos de vulnerabilidades con remediación verificable',
    ],
    lessons: [
      {
        id: 'eh-1',
        title: '01. Reconocimiento Silencioso y Huella Digital de Red',
        duration: '22:15',
        summary: 'Mapeo de subdominios, ASN y puertos abiertos utilizando técnicas de fragmentación de paquetes.',
        keyCommand: 'nmap -sS -T2 -f --data-length 24 10.14.88.0/24',
        transcript:
          'En esta sesión configuramos escaneos SYN fragmentados para identificar servicios críticos manteniendo el tráfico por debajo del umbral de detección heurística del firewall perimetral.',
      },
      {
        id: 'eh-2',
        title: '02. Análisis de Superficie Web y Bypass de Filtros',
        duration: '28:40',
        summary: 'Inspección de cabeceras HTTP, tokens JWT mal firmados y validación de entradas en APIs REST.',
        keyCommand: 'curl -i -H "X-Forwarded-For: 127.0.0.1" https://target.notrace.lab/api/v2/admin',
        transcript:
          'Analizamos cómo las arquitecturas de microservicios confían erróneamente en cabeceras de proxy inverso cuando el balanceador no sanea la procedencia del paquete.',
      },
      {
        id: 'eh-3',
        title: '03. Escalada de Privilegios y Persistencia Ética',
        duration: '35:10',
        summary: 'Auditoría de binarios SUID, capacidades de kernel y contenedores Docker mal aislados.',
        keyCommand: 'find / -perm -4000 -type f 2>/dev/null',
        transcript:
          'Demostramos cómo un binario con permisos SUID mal asignados permite obtener una shell de superusuario para documentar el impacto real de la brecha.',
      },
    ],
    lab: {
      prompt: 'Ejecuta un escaneo SYN sigiloso sobre la subred del laboratorio para descubrir el servidor vulnerable:',
      expectedCommand: 'nmap -sS 10.14.88.24',
      hint: 'Escribe: nmap -sS 10.14.88.24',
      outputLines: [
        'Starting NØTRACE Stealth Scanner 7.94 at 2026-11-26 UTC',
        'Nmap scan report for vault-node.notrace.lab (10.14.88.24)',
        'Host is up (0.0042s latency).',
        'PORT     STATE SERVICE       VERSION',
        '22/tcp   open  ssh           OpenSSH 9.6p1 (protocol 2.0)',
        '443/tcp  open  ssl/https     nginx/1.26.1 (TLSv1.3 ChaCha20-Poly1305)',
        '8443/tcp open   custom-api   NØTRACE Auth Gateway v4.2',
        '[+] VULNERABILIDAD DETECTADA: Endpoint /api/debug expuesto en puerto 8443.',
      ],
    },
  },
  {
    id: 'vpn-multi-hop-architecture',
    title: 'Arquitectura VPN Multi-Hop, WireGuard & Túneles Ciegos',
    category: 'VPN & Proxies',
    level: 'Especialista',
    duration: '26h 45m',
    lessonsCount: 14,
    priceUsd: 74,
    priceUsdt: 74,
    studentsCount: 2890,
    instructor: 'S. Lindqvist (Network Architect)',
    coverImage: '/assets/aistudio/image_4d88411a.png',
    remotionTheme: 'vpn-tunnel',
    shortDescription:
      'Diseña y despliega redes VPN encadenadas (Double/Triple Hop) con WireGuard, ofuscación Shadowsocks, prevención de fugas WebRTC/DNS y Kill-Switch en kernel.',
    outcomes: [
      'Despliegue de nodos de entrada y salida en jurisdicciones sin registros (RAM-only)',
      'Encapsulamiento de tráfico WireGuard sobre TLS para atravesar firewalls restrictivos',
      'Auditoría completa de fugas DNS, IPv6, WebRTC y correlación de zona horaria',
    ],
    lessons: [
      {
        id: 'vpn-1',
        title: '01. Criptografía ChaCha20-Poly1305 y Handshake WireGuard',
        duration: '19:50',
        summary: 'Intercambio de claves Noise_IK y configuración de interfaces virtuales sin estado.',
        keyCommand: 'wg set wg0 peer 9F3a...7xQ= allowed-ips 0.0.0.0/0 endpoint 185.220.101.4:51820',
        transcript:
          'A diferencia de los protocolos heredados, WireGuard opera directamente en el espacio del kernel con menos de 4,000 líneas de código auditable y rotación automática de claves efímeras.',
      },
      {
        id: 'vpn-2',
        title: '02. Enrutamiento Multi-Hop (Suiza -> Islandia -> Panamá)',
        duration: '31:15',
        summary: 'Encadenamiento de tablas de ruteo con policy routing y reglas nftables.',
        keyCommand: 'ip route add default dev wg-exit table 51820',
        transcript:
          'Separamos el nodo que conoce tu IP de origen del nodo que accede al destino final, garantizando que ningún servidor individual posea los metadatos completos del circuito.',
      },
      {
        id: 'vpn-3',
        title: '03. Detección y Mitigación de Fugas WebRTC, DNS y Timezone',
        duration: '24:05',
        summary: 'Cómo los sistemas anti-fraude detectan el uso de VPN y cómo blindar la huella del navegador.',
        keyCommand: 'resolvectl status wg0 && nft list table inet vpn_killswitch',
        transcript:
          'Veremos exactamente el mismo algoritmo que utiliza nuestro detector NØTRACE: comparar el ASN del proveedor y la discrepancia entre la zona horaria del sistema y la geolocalización de la IP.',
      },
    ],
    lab: {
      prompt: 'Verifica el estado del túnel WireGuard y comprueba la ruta multi-hop activa:',
      expectedCommand: 'wg show wg0',
      hint: 'Escribe: wg show wg0',
      outputLines: [
        'interface: wg0',
        '  public key: x8K9vP2mN4qR7tW1yZ5cB3nM6kL0jH8gF4dS2aP9eR0=',
        '  private key: (hidden)',
        '  listening port: 51820',
        'peer: Zurich-Entry-01 (178.209.52.14:51820)',
        '  latest handshake: 2 seconds ago',
        '  transfer: 148.42 MiB received, 64.19 MiB sent',
        '[+] TÚNEL ACTIVO: Cifrado ChaCha20-Poly1305 verificado sin fugas DNS.',
      ],
    },
  },
  {
    id: 'linux-servers-hardening',
    title: 'Blindaje de Servidores Linux, Redes & Defensas Zero-Trust',
    category: 'Redes & Servidores',
    level: 'Intermedio',
    duration: '29h 10m',
    lessonsCount: 16,
    priceUsd: 69,
    priceUsdt: 69,
    studentsCount: 4150,
    instructor: 'M. Orellana (CISSP, RHCA)',
    coverImage: '/assets/aistudio/image_d6850073.png',
    remotionTheme: 'server-grid',
    shortDescription:
      'Asegura infraestructuras críticas en producción: firewalls nftables, aislamiento con namespaces, mTLS, detección de intrusos en tiempo real y mitigación DDoS.',
    outcomes: [
      'Hardening de kernel Linux mediante parámetros sysctl contra ataques de red',
      'Autenticación mutua por certificados (mTLS) y bastiones SSH con llaves FIDO2',
      'Monitoreo de integridad de binarios y respuesta automatizada ante anomalías',
    ],
    lessons: [
      {
        id: 'srv-1',
        title: '01. Arquitectura de Red Segmentada y Subredes Aisladas',
        duration: '25:00',
        summary: 'Diseño de VLANs, DMZ inversa y políticas de mínimo privilegio entre microservicios.',
        keyCommand: 'nft add rule inet filter input tcp dport { 22, 443 } ct state new accept',
        transcript:
          'Todo puerto que no tenga una justificación criptográfica y de negocio debe permanecer descartado por defecto a nivel de paquete antes de llegar a la capa de aplicación.',
      },
      {
        id: 'srv-2',
        title: '02. Parámetros de Kernel y Protección Anti-Spoofing',
        duration: '21:30',
        summary: 'Activación de SYN cookies, filtrado de ruta inversa y desactivación de redirecciones ICMP.',
        keyCommand: 'sysctl -w net.ipv4.tcp_syncookies=1 net.ipv4.conf.all.rp_filter=1',
        transcript:
          'Ajustamos la pila TCP/IP del kernel para resistir inundaciones SYN y evitar que atacantes en la misma red local falsifiquen paquetes de enrutamiento.',
      },
    ],
    lab: {
      prompt: 'Aplica las reglas de firewall nftables para bloquear tráfico no autorizado en el nodo:',
      expectedCommand: 'nft list ruleset',
      hint: 'Escribe: nft list ruleset',
      outputLines: [
        'table inet notrace_shield {',
        '  chain inbound {',
        '    type filter hook input priority 0; policy drop;',
        '    ct state established,related accept',
        '    tcp dport 443 ct state new limit rate 120/second accept',
        '  }',
        '}',
        '[+] FIREWALL VERIFICADO: Política DROP activa para paquetes no autenticados.',
      ],
    },
  },
  {
    id: 'proxies-tor-anonymity',
    title: 'Proxies SOCKS5, Cadenas Dinámicas & Redes de Anonimato',
    category: 'VPN & Proxies',
    level: 'Avanzado',
    duration: '21h 30m',
    lessonsCount: 12,
    priceUsd: 64,
    priceUsdt: 64,
    studentsCount: 1980,
    instructor: 'E. Volkov (Privacy Researcher)',
    coverImage: '/assets/aistudio/image_635203a9.png',
    remotionTheme: 'proxy-chain',
    shortDescription:
      'Domina el enrutamiento por capas: configuración de ProxyChains-NG, túneles SSH inversos, puentes ofuscados y aislamiento de identidad para investigaciones OSINT.',
    outcomes: [
      'Encadenamiento dinámico de proxies SOCKS5 con tolerancia a nodos caídos',
      'Túneles SSH dinámicos y reenvío de puertos seguro sin exponer servicios',
      'Aislamiento de huella digital del navegador (Canvas, WebGL, AudioContext)',
    ],
    lessons: [
      {
        id: 'prx-1',
        title: '01. Protocolo SOCKS5 con Autenticación y DNS Remoto',
        duration: '18:45',
        summary: 'Diferencias críticas entre SOCKS4, SOCKS5 y proxies HTTP transparentes.',
        keyCommand: 'curl --socks5-hostname 127.0.0.1:9050 https://check.notrace.network/ip',
        transcript:
          'Usar --socks5-hostname en lugar de --socks5 fuerza a que la resolución DNS ocurra al final del túnel y no en el router de tu proveedor local.',
      },
      {
        id: 'prx-2',
        title: '02. ProxyChains-NG en Modo Dynamic y Strict Chain',
        duration: '27:10',
        summary: 'Enrutamiento de herramientas CLI a través de múltiples saltos internacionales.',
        keyCommand: 'proxychains4 -q nmap -sT -Pn 192.0.2.15',
        transcript:
          'Configuramos cadenas dinámicas que saltan automáticamente cualquier proxy lento o inactivo sin interrumpir la sesión de auditoría.',
      },
    ],
    lab: {
      prompt: 'Comprueba la salida de tu cadena SOCKS5 resolviendo el DNS en el nodo remoto:',
      expectedCommand: 'proxychains4 curl ifconfig.me',
      hint: 'Escribe: proxychains4 curl ifconfig.me',
      outputLines: [
        '[proxychains] config file found: /etc/proxychains4.conf',
        '[proxychains] Dynamic chain  ...  127.0.0.1:9050  ...  185.220.101.4:1080  ...  OK',
        '[proxychains] Strict DNS resolution via remote exit node enabled',
        'Exit IP Reported: 185.220.101.4 (Reykjavik Privacy Relay #04)',
        '[+] ANONIMATO CONFIRMADO: Cero fugas DNS en interfaz local.',
      ],
    },
  },
  {
    id: 'soc-threat-hunting-siem',
    title: 'Ciberseguridad Defensiva, Threat Hunting & Análisis Forense',
    category: 'Ciberseguridad',
    level: 'Avanzado',
    duration: '31h 15m',
    lessonsCount: 15,
    priceUsd: 79,
    priceUsdt: 79,
    studentsCount: 2640,
    instructor: 'A. Morales (DFIR Lead)',
    coverImage: '/assets/aistudio/image_241f253f.png',
    remotionTheme: 'zero-trust',
    shortDescription:
      'Detecta actores avanzados en tiempo real: análisis de memoria volátil, correlación de telemetría eBPF, caza de amenazas y respuesta ante incidentes ransomware.',
    outcomes: [
      'Inspección de procesos ocultos y conexiones huérfanas con sensores eBPF',
      'Decodificación de payloads ofuscados y análisis de tráfico C2 encriptado',
      'Contención quirúrgica de nodos comprometidos sin destruir evidencia en RAM',
    ],
    lessons: [
      {
        id: 'soc-1',
        title: '01. Telemetría de Kernel con eBPF y Detección de Rootkits',
        duration: '26:30',
        summary: 'Monitoreo de llamadas al sistema (syscalls) execve y connect en tiempo real.',
        keyCommand: 'ss -tulnp | grep -E "ESTAB|LISTEN"',
        transcript:
          'Cuando un atacante modifica binarios de espacio de usuario, la única fuente de verdad inalterable reside en los eventos trazados directamente desde el kernel.',
      },
    ],
    lab: {
      prompt: 'Inspecciona los sockets activos para localizar conexiones salientes sospechosas:',
      expectedCommand: 'ss -tulnp',
      hint: 'Escribe: ss -tulnp',
      outputLines: [
        'Netid State  Recv-Q Send-Q Local Address:Port  Peer Address:Port Process',
        'tcp   LISTEN 0      511    0.0.0.0:443         0.0.0.0:*         users:(("nginx",pid=1102))',
        'tcp   ESTAB  0      0      10.14.88.24:49182   198.51.100.77:4444 users:(("kworker_sync",pid=4819))',
        '[!] ALERTA SOC: Proceso anómalo (PID 4819) transmitiendo al puerto 4444.',
      ],
    },
  },
  {
    id: 'osint-digital-footprint',
    title: 'Inteligencia de Fuentes Abiertas (OSINT) & Contramedidas OPSEC',
    category: 'Ciberseguridad',
    level: 'Intermedio',
    duration: '19h 40m',
    lessonsCount: 11,
    priceUsd: 59,
    priceUsdt: 59,
    studentsCount: 3790,
    instructor: 'D. Kováč (OSINT Analyst)',
    coverImage: '/assets/aistudio/image_3abd0dc4.png',
    remotionTheme: 'osint',
    shortDescription:
      'Metodologías de investigación digital, rastreo de infraestructura cripto, correlación de metadatos y protocolos OPSEC para eliminar tu rastro en internet.',
    outcomes: [
      'Auditoría de exposición de dominios, certificados TLS históricos y fugas de credenciales',
      'Extracción y limpieza profunda de metadatos EXIF/XMP en documentos y medios',
      'Diseño de compartimentación de identidades digitales (Protocolo NØTRACE)',
    ],
    lessons: [
      {
        id: 'osint-1',
        title: '01. Transparencia de Certificados TLS y Mapeo de Infraestructura',
        duration: '20:15',
        summary: 'Descubrimiento de servidores internos a través de registros públicos CT.',
        keyCommand: 'openssl s_client -connect notrace.network:443 -servername notrace.network',
        transcript:
          'Cada certificado emitido públicamente queda registrado en logs inmutables; aprenderemos a consultarlos para descubrir entornos de staging olvidados.',
      },
    ],
    lab: {
      prompt: 'Inspecciona el certificado TLS del nodo objetivo para verificar su huella SHA-256:',
      expectedCommand: 'openssl s_client -connect node.notrace.lab:443',
      hint: 'Escribe: openssl s_client -connect node.notrace.lab:443',
      outputLines: [
        'CONNECTED(00000003)',
        'depth=2 C = CH, O = NØTRACE Root Authority, CN = NØTRACE Zero-Knowledge Root CA',
        'verify return:1',
        'Protocol  : TLSv1.3',
        'Cipher    : TLS_CHACHA20_POLY1305_SHA256',
        '[+] CERTIFICADO VALIDADO: Huella criptográfica íntegra (0% interceptación MitM).',
      ],
    },
  },
];

export const VPN_WORLD_NODES: VpnWorldNode[] = [
  {
    id: 'zurich-ch',
    city: 'Zúrich',
    country: 'Suiza',
    code: 'CH',
    ip: '178.209.52.14',
    x: 505,
    y: 148,
    lat: 47.3769,
    lon: 8.5417,
    baseLatencyMs: 18,
    loadPercent: 34,
    encryption: 'WireGuard · ChaCha20-Poly1305',
    role: 'Entry Guard',
  },
  {
    id: 'reykjavik-is',
    city: 'Reikiavik',
    country: 'Islandia',
    code: 'IS',
    ip: '185.220.101.4',
    x: 432,
    y: 96,
    lat: 64.1466,
    lon: -21.9426,
    baseLatencyMs: 36,
    loadPercent: 22,
    encryption: 'WireGuard · RAM-Disk Blind Node',
    role: 'Core Relay',
  },
  {
    id: 'panama-pa',
    city: 'Ciudad de Panamá',
    country: 'Panamá',
    code: 'PA',
    ip: '190.14.211.89',
    x: 265,
    y: 268,
    lat: 8.9824,
    lon: -79.5199,
    baseLatencyMs: 62,
    loadPercent: 41,
    encryption: 'OpenVPN DCO · AES-256-GCM',
    role: 'Exit Node',
  },
  {
    id: 'frankfurt-de',
    city: 'Fráncfort',
    country: 'Alemania',
    code: 'DE',
    ip: '195.201.88.112',
    x: 512,
    y: 138,
    lat: 50.1109,
    lon: 8.6821,
    baseLatencyMs: 21,
    loadPercent: 58,
    encryption: 'WireGuard · Multi-Hop Ready',
    role: 'Entry Guard',
  },
  {
    id: 'newyork-us',
    city: 'Nueva York',
    country: 'Estados Unidos',
    code: 'US',
    ip: '198.51.100.42',
    x: 288,
    y: 168,
    lat: 40.7128,
    lon: -74.006,
    baseLatencyMs: 44,
    loadPercent: 49,
    encryption: 'WireGuard · Obfs4 Bridge',
    role: 'Core Relay',
  },
  {
    id: 'tokyo-jp',
    city: 'Tokio',
    country: 'Japón',
    code: 'JP',
    ip: '103.152.220.19',
    x: 842,
    y: 182,
    lat: 35.6762,
    lon: 139.6503,
    baseLatencyMs: 118,
    loadPercent: 37,
    encryption: 'WireGuard · Quantum-Safe Hybrid',
    role: 'Exit Node',
  },
  {
    id: 'singapore-sg',
    city: 'Singapur',
    country: 'Singapur',
    code: 'SG',
    ip: '139.99.44.205',
    x: 765,
    y: 286,
    lat: 1.3521,
    lon: 103.8198,
    baseLatencyMs: 134,
    loadPercent: 31,
    encryption: 'Shadowsocks-2022 + WireGuard',
    role: 'Exit Node',
  },
  {
    id: 'santiago-cl',
    city: 'Santiago',
    country: 'Chile',
    code: 'CL',
    ip: '200.89.75.33',
    x: 298,
    y: 398,
    lat: -33.4489,
    lon: -70.6693,
    baseLatencyMs: 74,
    loadPercent: 27,
    encryption: 'WireGuard · ChaCha20-Poly1305',
    role: 'Entry Guard',
  },
];
