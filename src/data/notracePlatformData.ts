import { CYBER_COURSES, CyberCourse } from './cyberData';
import { CurrencyType, OperatorRankId } from '../components/CurrencyIcons';

export interface NotraceMethod {
  id: string;
  slug: string;
  title: string;
  category:
    | 'Hacking ético'
    | 'Ciberseguridad defensiva'
    | 'Linux'
    | 'Redes'
    | 'Privacidad digital'
    | 'OSINT responsable'
    | 'Criptografía'
    | 'Seguridad web';
  level: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Especialista';
  duration: string;
  durationHours: number;
  modulesCount: number;
  isFree: boolean;
  currency: CurrencyType;
  priceAmount: number;
  rewardByte: number;
  featured: boolean;
  isRecent?: boolean;
  instructor: string;
  remotionTheme: CyberCourse['remotionTheme'];
  shortDescription: string;
  requirements: string[];
  resourcesIncluded: string[];
  outcomes: string[];
  courseRef: CyberCourse;
}

export interface ToolkitItem {
  id: string;
  slug: string;
  name: string;
  category: 'PRIVACY LAB' | 'NETWORK LAB' | 'CRYPTO LAB' | 'SECURITY LAB' | 'PRACTICE LAB';
  lucideIcon: string;
  shortDescription: string;
  purpose: string;
  status: 'Disponible' | 'Interactivo' | 'Próximamente';
  tier: 'Gratuita' | 'NØBYTE' | 'NØCORE';
  costAmount: number;
  costCurrency?: CurrencyType;
  route: string;
  featuredInHome?: boolean;
}

export interface OperationMission {
  id: string;
  title: string;
  type:
    | 'Misión educativa'
    | 'Reto semanal'
    | 'Laboratorio'
    | 'Evento especial'
    | 'Evaluación'
    | 'Desafío CTF autorizado';
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Especialista';
  description: string;
  requirements: string;
  progressCurrent: number;
  progressTarget: number;
  rewardAmount: number;
  rewardCurrency: CurrencyType;
  xpReward: number;
  status:
    | 'Disponible'
    | 'En progreso'
    | 'Completada'
    | 'Recompensa disponible'
    | 'Recompensa reclamada'
    | 'Finalizada';
  deadline?: string;
}

export interface VaultMovement {
  id: string;
  date: string;
  time: string;
  type:
    | 'Recompensa educativa'
    | 'Adquisición de Método'
    | 'Uso de herramienta'
    | 'Recarga'
    | 'Recompensa de evento'
    | 'Ajuste administrativo'
    | 'Operación pendiente';
  currency: CurrencyType;
  amount: number; // positive or negative
  status: 'Confirmado (Demo)' | 'Pendiente (Demo)' | 'Ilustrativo';
  concept: string;
}

export interface RechargePackage {
  id: string;
  code: string;
  currency: CurrencyType;
  amount: number;
  subtitle: string;
  targetAudience: string;
  highlights: string[];
}

export interface FuturePaymentMethod {
  id: string;
  name: string;
  category: 'Criptomonedas' | 'Plataformas';
  networkOrProvider: string;
  description: string;
  availability: 'Próximamente' | 'Integración en arquitectura';
  securityNote: string;
}

export interface OperatorRankSpec {
  id: OperatorRankId;
  code: string;
  name: string;
  minXp: number;
  description: string;
  capabilities: string[];
}

export const NOTRACE_METHODS: NotraceMethod[] = [
  {
    id: CYBER_COURSES[0].id,
    slug: 'fundamentos-hacking-etico-redteam',
    title: 'Hacking Ético & Operaciones Red Team',
    category: 'Hacking ético',
    level: 'Avanzado',
    duration: '34h 20m',
    durationHours: 34,
    modulesCount: 18,
    isFree: false,
    currency: 'NOCORE',
    priceAmount: 120,
    rewardByte: 100,
    featured: true,
    instructor: CYBER_COURSES[0].instructor,
    remotionTheme: 'pentest',
    shortDescription: CYBER_COURSES[0].shortDescription,
    requirements: [
      'Conocimientos fundamentales de redes TCP/IP y modelo OSI',
      'Manejo básico de terminal Linux y línea de comandos',
    ],
    resourcesIncluded: [
      '18 módulos estructurados y documentación técnica',
      'Entorno de laboratorio CLI aislado (Nmap / SYN Audit)',
      'Guías de reporte ejecutivo y remediación verificable',
    ],
    outcomes: CYBER_COURSES[0].outcomes,
    courseRef: CYBER_COURSES[0],
  },
  {
    id: CYBER_COURSES[1].id,
    slug: 'arquitectura-vpn-multihop-wireguard',
    title: 'Arquitectura VPN Multi-Hop, WireGuard & Túneles Ciegos',
    category: 'Privacidad digital',
    level: 'Especialista',
    duration: '26h 45m',
    durationHours: 27,
    modulesCount: 14,
    isFree: false,
    currency: 'NOCORE',
    priceAmount: 110,
    rewardByte: 100,
    featured: true,
    instructor: CYBER_COURSES[1].instructor,
    remotionTheme: 'vpn-tunnel',
    shortDescription: CYBER_COURSES[1].shortDescription,
    requirements: [
      'Administración intermedia de sistemas Linux',
      'Conceptos de enrutamiento IP, tablas de ruteo y DNS',
    ],
    resourcesIncluded: [
      '14 módulos técnicos con esquemas de topología multi-hop',
      'Laboratorio CLI de verificación de interfaces WireGuard',
      'Integración directa con NØTRACE VPN Inspector',
    ],
    outcomes: CYBER_COURSES[1].outcomes,
    courseRef: CYBER_COURSES[1],
  },
  {
    id: CYBER_COURSES[2].id,
    slug: 'blindaje-servidores-linux-zero-trust',
    title: 'Blindaje de Servidores Linux, Redes & Defensas Zero-Trust',
    category: 'Linux',
    level: 'Intermedio',
    duration: '29h 10m',
    durationHours: 29,
    modulesCount: 16,
    isFree: true,
    currency: 'NOBYTE',
    priceAmount: 0,
    rewardByte: 80,
    featured: true,
    isRecent: true,
    instructor: CYBER_COURSES[2].instructor,
    remotionTheme: 'server-grid',
    shortDescription: CYBER_COURSES[2].shortDescription,
    requirements: [
      'Familiaridad con distribuciones Linux (Debian/Ubuntu/RHEL)',
      'Conceptos básicos de puertos y servicios de red',
    ],
    resourcesIncluded: [
      '16 módulos de acceso abierto sobre hardening de kernel y nftables',
      'Laboratorio práctico de reglas de firewall en consola',
      'Plantillas de configuración sysctl y mTLS',
    ],
    outcomes: CYBER_COURSES[2].outcomes,
    courseRef: CYBER_COURSES[2],
  },
  {
    id: CYBER_COURSES[3].id,
    slug: 'proxies-socks5-cadenas-dinamicas',
    title: 'Proxies SOCKS5, Cadenas Dinámicas & Redes de Anonimato',
    category: 'Redes',
    level: 'Avanzado',
    duration: '21h 30m',
    durationHours: 21,
    modulesCount: 12,
    isFree: false,
    currency: 'NOBYTE',
    priceAmount: 240,
    rewardByte: 90,
    featured: true,
    instructor: CYBER_COURSES[3].instructor,
    remotionTheme: 'proxy-chain',
    shortDescription: CYBER_COURSES[3].shortDescription,
    requirements: [
      'Comprensión de protocolos de transporte TCP/UDP y DNS',
      'Uso de túneles SSH y configuración en terminal',
    ],
    resourcesIncluded: [
      '12 módulos de enrutamiento SOCKS5 y ProxyChains-NG',
      'Laboratorio CLI de verificación de resolución DNS remota',
      'Manual de aislamiento de huella digital en navegadores',
    ],
    outcomes: CYBER_COURSES[3].outcomes,
    courseRef: CYBER_COURSES[3],
  },
  {
    id: CYBER_COURSES[4].id,
    slug: 'ciberseguridad-defensiva-threat-hunting',
    title: 'Ciberseguridad Defensiva, Threat Hunting & Análisis Forense',
    category: 'Ciberseguridad defensiva',
    level: 'Avanzado',
    duration: '31h 15m',
    durationHours: 31,
    modulesCount: 15,
    isFree: false,
    currency: 'NOCORE',
    priceAmount: 130,
    rewardByte: 110,
    featured: true,
    isRecent: true,
    instructor: CYBER_COURSES[4].instructor,
    remotionTheme: 'zero-trust',
    shortDescription: CYBER_COURSES[4].shortDescription,
    requirements: [
      'Conocimiento de procesos del sistema operativo Linux y memoria',
      'Lectura de registros de sistema y conexiones de red',
    ],
    resourcesIncluded: [
      '15 módulos sobre telemetría eBPF y respuesta ante incidentes',
      'Laboratorio CLI de inspección de sockets y procesos anómalos',
      'Protocolos de contención forense sin pérdida de evidencia',
    ],
    outcomes: CYBER_COURSES[4].outcomes,
    courseRef: CYBER_COURSES[4],
  },
  {
    id: CYBER_COURSES[5].id,
    slug: 'inteligencia-fuentes-abiertas-osint-opsec',
    title: 'Inteligencia de Fuentes Abiertas (OSINT) & Contramedidas OPSEC',
    category: 'OSINT responsable',
    level: 'Principiante',
    duration: '19h 40m',
    durationHours: 20,
    modulesCount: 11,
    isFree: true,
    currency: 'NOBYTE',
    priceAmount: 0,
    rewardByte: 75,
    featured: true,
    isRecent: true,
    instructor: CYBER_COURSES[5].instructor,
    remotionTheme: 'osint',
    shortDescription: CYBER_COURSES[5].shortDescription,
    requirements: [
      'No requiere experiencia previa en programación',
      'Interés en investigación digital ética y protección de privacidad',
    ],
    resourcesIncluded: [
      '11 módulos sobre transparencia de certificados TLS y metadatos',
      'Laboratorio CLI de verificación criptográfica de certificados',
      'Guía práctica de higiene digital y compartimentación OPSEC',
    ],
    outcomes: CYBER_COURSES[5].outcomes,
    courseRef: CYBER_COURSES[5],
  },
];

export const TOOLKIT_CATALOG: ToolkitItem[] = [
  // PRIVACY LAB
  {
    id: 'vpn-inspector',
    slug: 'vpn-inspector',
    name: 'VPN Inspector',
    category: 'PRIVACY LAB',
    lucideIcon: 'globe',
    shortDescription: 'Verifica la ubicación pública de tu conexión, ASN y cambios frente a una referencia.',
    purpose: 'Comprobación de IP pública, operador ASN y comparación geográfica sobre cartografía Natural Earth.',
    status: 'Disponible',
    tier: 'Gratuita',
    costAmount: 0,
    route: '/herramientas/vpn-inspector',
    featuredInHome: true,
  },
  {
    id: 'timezone-check',
    slug: 'timezone-check',
    name: 'Timezone & Locale Check',
    category: 'PRIVACY LAB',
    lucideIcon: 'clock',
    shortDescription: 'Compara la zona horaria e idioma expuestos por tu navegador con tu región de red.',
    purpose: 'Inspección local pasiva mediante Intl API para detectar discrepancias horarias al usar túneles VPN.',
    status: 'Interactivo',
    tier: 'Gratuita',
    costAmount: 0,
    route: '/herramientas/privacy-lab',
    featuredInHome: true,
  },
  {
    id: 'browser-privacy-audit',
    slug: 'browser-privacy-audit',
    name: 'Browser Privacy Audit',
    category: 'PRIVACY LAB',
    lucideIcon: 'shield-check',
    shortDescription: 'Evalúa señales locales del navegador como Do Not Track, Global Privacy Control y cookies.',
    purpose: 'Auditoría local en memoria de las cabeceras y propiedades de privacidad expuestas por el cliente web.',
    status: 'Interactivo',
    tier: 'Gratuita',
    costAmount: 0,
    route: '/herramientas/privacy-lab',
    featuredInHome: true,
  },
  {
    id: 'dns-leak-test',
    slug: 'dns-leak-test',
    name: 'DNS Leak Test',
    category: 'PRIVACY LAB',
    lucideIcon: 'network',
    shortDescription: 'Diagnóstico de resolutores DNS para identificar consultas fuera del túnel VPN.',
    purpose: 'Verificación de servidores DNS autoritativos que procesan las solicitudes del cliente.',
    status: 'Próximamente',
    tier: 'NØBYTE',
    costAmount: 5,
    costCurrency: 'NOBYTE',
    route: '/herramientas/privacy-lab',
    featuredInHome: true,
  },
  {
    id: 'webrtc-leak-test',
    slug: 'webrtc-leak-test',
    name: 'WebRTC Leak Test',
    category: 'PRIVACY LAB',
    lucideIcon: 'shield-alert',
    shortDescription: 'Comprobación de exposición de direcciones locales o públicas mediante candidatos ICE.',
    purpose: 'Análisis de descriptores SDP en el navegador para prevenir fugas de IP por canales multimedia.',
    status: 'Próximamente',
    tier: 'Gratuita',
    costAmount: 0,
    route: '/herramientas/privacy-lab',
  },
  {
    id: 'ipv4-ipv6-test',
    slug: 'ipv4-ipv6-test',
    name: 'IPv4 / IPv6 Test',
    category: 'PRIVACY LAB',
    lucideIcon: 'route',
    shortDescription: 'Comparación de conectividad de doble pila para detectar fugas por IPv6.',
    purpose: 'Diagnóstico separado de alcanzabilidad IPv4 e IPv6.',
    status: 'Próximamente',
    tier: 'Gratuita',
    costAmount: 0,
    route: '/herramientas/privacy-lab',
  },
  {
    id: 'browser-fingerprint',
    slug: 'browser-fingerprint',
    name: 'Browser Fingerprint',
    category: 'PRIVACY LAB',
    lucideIcon: 'fingerprint',
    shortDescription: 'Análisis educativo de entropía y características únicas expuestas por el navegador.',
    purpose: 'Evaluación de superficie de huella digital (pantalla, hardwareConcurrency, WebGL).',
    status: 'Próximamente',
    tier: 'NØBYTE',
    costAmount: 5,
    costCurrency: 'NOBYTE',
    route: '/herramientas/privacy-lab',
  },
  {
    id: 'privacy-report',
    slug: 'privacy-report',
    name: 'Privacy Report',
    category: 'PRIVACY LAB',
    lucideIcon: 'file-check',
    shortDescription: 'Informe consolidado en memoria con las señales observadas durante la sesión.',
    purpose: 'Generación local de resumen técnico sin almacenamiento en servidor.',
    status: 'Próximamente',
    tier: 'NØCORE',
    costAmount: 10,
    costCurrency: 'NOCORE',
    route: '/herramientas/privacy-lab',
  },

  // CRYPTO LAB
  {
    id: 'hash-generator',
    slug: 'hash-generator',
    name: 'Hash Generator',
    category: 'CRYPTO LAB',
    lucideIcon: 'hash',
    shortDescription: 'Generación criptográfica local de resúmenes SHA-256, SHA-384 y SHA-512 mediante Web Crypto API.',
    purpose: 'Cálculo determinista en el navegador sin enviar el contenido a servidores externos.',
    status: 'Interactivo',
    tier: 'Gratuita',
    costAmount: 0,
    route: '/herramientas/crypto-lab',
    featuredInHome: true,
  },
  {
    id: 'hash-comparator',
    slug: 'hash-comparator',
    name: 'Hash Comparator',
    category: 'CRYPTO LAB',
    lucideIcon: 'equal',
    shortDescription: 'Comparación de integridad entre dos resúmenes criptográficos en tiempo constante.',
    purpose: 'Verificación de sumas de comprobación de archivos y paquetes.',
    status: 'Interactivo',
    tier: 'Gratuita',
    costAmount: 0,
    route: '/herramientas/crypto-lab',
  },
  {
    id: 'password-generator',
    slug: 'password-generator',
    name: 'Password & Entropy Generator',
    category: 'CRYPTO LAB',
    lucideIcon: 'key-round',
    shortDescription: 'Generación local de claves de alta entropía utilizando crypto.getRandomValues().',
    purpose: 'Creación segura de contraseñas y cálculo de bits de entropía en memoria.',
    status: 'Interactivo',
    tier: 'Gratuita',
    costAmount: 0,
    route: '/herramientas/crypto-lab',
  },
  {
    id: 'base64-toolkit',
    slug: 'base64-toolkit',
    name: 'Base64 & Hex Toolkit',
    category: 'CRYPTO LAB',
    lucideIcon: 'binary',
    shortDescription: 'Codificación y decodificación local de cadenas en formatos Base64, UTF-8 y Hexadecimal.',
    purpose: 'Inspección y transformación reversible de cargas de datos.',
    status: 'Interactivo',
    tier: 'Gratuita',
    costAmount: 0,
    route: '/herramientas/crypto-lab',
  },
  {
    id: 'password-strength',
    slug: 'password-strength',
    name: 'Password Strength Analyzer',
    category: 'CRYPTO LAB',
    lucideIcon: 'shield-check',
    shortDescription: 'Evaluación local de fortaleza, longitud y variedad de conjuntos de caracteres.',
    purpose: 'Estimación educativa de resistencia frente a ataques de fuerza bruta.',
    status: 'Interactivo',
    tier: 'Gratuita',
    costAmount: 0,
    route: '/herramientas/crypto-lab',
  },
  {
    id: 'encryption-playground',
    slug: 'encryption-playground',
    name: 'Encryption Playground',
    category: 'CRYPTO LAB',
    lucideIcon: 'lock-keyhole',
    shortDescription: 'Demostraciones educativas de cifrado simétrico AES-GCM y derivación PBKDF2.',
    purpose: 'Laboratorio visual de vectores de inicialización (IV) y cifrado autenticado.',
    status: 'Próximamente',
    tier: 'NØBYTE',
    costAmount: 5,
    costCurrency: 'NOBYTE',
    route: '/herramientas/crypto-lab',
  },

  // NETWORK LAB
  {
    id: 'ip-calculator',
    slug: 'ip-calculator',
    name: 'IP & CIDR Subnet Calculator',
    category: 'NETWORK LAB',
    lucideIcon: 'calculator',
    shortDescription: 'Cálculo exacto de máscaras de subred, rangos de hosts, dirección de red y broadcast.',
    purpose: 'Planificación y auditoría de segmentación de redes IPv4.',
    status: 'Interactivo',
    tier: 'Gratuita',
    costAmount: 0,
    route: '/herramientas/network-lab',
  },
  {
    id: 'network-visualizer',
    slug: 'network-visualizer',
    name: 'Network Visualizer',
    category: 'NETWORK LAB',
    lucideIcon: 'network',
    shortDescription: 'Visualización interactiva de topologías de red segmentadas y saltos de enrutamiento.',
    purpose: 'Comprensión gráfica de arquitecturas DMZ, bastiones y túneles cifrados.',
    status: 'Interactivo',
    tier: 'Gratuita',
    costAmount: 0,
    route: '/herramientas/network-lab',
    featuredInHome: true,
  },
  {
    id: 'tls-inspector',
    slug: 'tls-inspector',
    name: 'TLS Inspector',
    category: 'NETWORK LAB',
    lucideIcon: 'lock',
    shortDescription: 'Consulta educativa de cadenas de certificados, protocolos TLS 1.3 y suites de cifrado.',
    purpose: 'Auditoría de configuración criptográfica en transporte.',
    status: 'Próximamente',
    tier: 'NØBYTE',
    costAmount: 5,
    costCurrency: 'NOBYTE',
    route: '/herramientas/network-lab',
    featuredInHome: true,
  },
  {
    id: 'asn-intelligence',
    slug: 'asn-intelligence',
    name: 'ASN Intelligence',
    category: 'NETWORK LAB',
    lucideIcon: 'server',
    shortDescription: 'Información de sistemas autónomos, prefijos BGP y clasificación de operadores.',
    purpose: 'Identificación de infraestructura de tránsito, centros de datos e ISPs.',
    status: 'Próximamente',
    tier: 'NØBYTE',
    costAmount: 5,
    costCurrency: 'NOBYTE',
    route: '/herramientas/network-lab',
  },
  {
    id: 'dns-lookup',
    slug: 'dns-lookup',
    name: 'DNS Lookup',
    category: 'NETWORK LAB',
    lucideIcon: 'search',
    shortDescription: 'Consulta de registros públicos A, AAAA, MX, TXT y CAA.',
    purpose: 'Verificación de políticas SPF/DMARC y configuración de zonas.',
    status: 'Próximamente',
    tier: 'Gratuita',
    costAmount: 0,
    route: '/herramientas/network-lab',
  },

  // SECURITY LAB
  {
    id: 'security-headers',
    slug: 'security-headers',
    name: 'Security Headers Guide',
    category: 'SECURITY LAB',
    lucideIcon: 'shield',
    shortDescription: 'Evaluación educativa de cabeceras CSP, HSTS, X-Frame-Options y Referrer-Policy.',
    purpose: 'Referencia técnica para endurecimiento de aplicaciones web.',
    status: 'Próximamente',
    tier: 'Gratuita',
    costAmount: 0,
    route: '/herramientas',
  },
  {
    id: 'cve-explorer',
    slug: 'cve-explorer',
    name: 'CVE Explorer',
    category: 'SECURITY LAB',
    lucideIcon: 'database',
    shortDescription: 'Consulta de boletines públicos de vulnerabilidades y métricas CVSS.',
    purpose: 'Investigación defensiva y gestión de parches.',
    status: 'Próximamente',
    tier: 'NØBYTE',
    costAmount: 5,
    costCurrency: 'NOBYTE',
    route: '/herramientas',
  },

  // PRACTICE LAB
  {
    id: 'linux-playground',
    slug: 'linux-playground',
    name: 'Linux CLI Playground',
    category: 'PRACTICE LAB',
    lucideIcon: 'terminal',
    shortDescription: 'Práctica guiada de comandos de auditoría y defensa en consola aislada.',
    purpose: 'Ejecución segura de ejercicios incluidos en los Métodos de NØTRACE.',
    status: 'Disponible',
    tier: 'Gratuita',
    costAmount: 0,
    route: '/campus',
  },
  {
    id: 'ctf-arena',
    slug: 'ctf-arena',
    name: 'CTF Arena',
    category: 'PRACTICE LAB',
    lucideIcon: 'flag',
    shortDescription: 'Desafíos educativos autorizados de captura de bandera por categorías técnicas.',
    purpose: 'Validación práctica de habilidades en entornos controlados.',
    status: 'Próximamente',
    tier: 'NØCORE',
    costAmount: 20,
    costCurrency: 'NOCORE',
    route: '/misiones',
  },
];

export const OPERATIONS_MISSIONS: OperationMission[] = [
  {
    id: 'op-vpn-audit',
    title: 'Verificación de Salida y Huella de Red',
    type: 'Misión educativa',
    difficulty: 'Principiante',
    description:
      'Ejecuta una comprobación real en el VPN Inspector, guarda una IP de referencia en memoria y compara el país esperado.',
    requirements: 'Acceder a NØTRACE Toolkit → VPN Inspector',
    progressCurrent: 1,
    progressTarget: 1,
    rewardAmount: 25,
    rewardCurrency: 'NOBYTE',
    xpReward: 120,
    status: 'Recompensa disponible',
  },
  {
    id: 'op-linux-nftables',
    title: 'Endurecimiento de Cortafuegos con nftables',
    type: 'Laboratorio',
    difficulty: 'Intermedio',
    description:
      'Completa el laboratorio CLI del Método "Blindaje de Servidores Linux" verificando la política DROP por defecto.',
    requirements: 'Método: Blindaje de Servidores Linux, Redes & Defensas Zero-Trust',
    progressCurrent: 1,
    progressTarget: 1,
    rewardAmount: 40,
    rewardCurrency: 'NOBYTE',
    xpReward: 180,
    status: 'Completada',
  },
  {
    id: 'op-wireguard-multihop',
    title: 'Auditoría de Circuito Multi-Hop WireGuard',
    type: 'Reto semanal',
    difficulty: 'Especialista',
    description:
      'Completa los 3 módulos del Método de Arquitectura VPN Multi-Hop y valida el handshake ChaCha20-Poly1305 en consola.',
    requirements: 'Método: Arquitectura VPN Multi-Hop, WireGuard & Túneles Ciegos',
    progressCurrent: 2,
    progressTarget: 3,
    rewardAmount: 100,
    rewardCurrency: 'NOBYTE',
    xpReward: 320,
    status: 'En progreso',
    deadline: 'Ciclo semanal · Domingo 23:59 UTC',
  },
  {
    id: 'op-crypto-integrity',
    title: 'Verificación Criptográfica SHA-256 sin Servidor',
    type: 'Evaluación',
    difficulty: 'Principiante',
    description:
      'Utiliza el Hash Generator y el Hash Comparator del Crypto Lab para validar la integridad de un bloque de datos en local.',
    requirements: 'Acceder a NØTRACE Toolkit → Crypto Lab',
    progressCurrent: 0,
    progressTarget: 1,
    rewardAmount: 15,
    rewardCurrency: 'NOBYTE',
    xpReward: 90,
    status: 'Disponible',
  },
  {
    id: 'op-redteam-syn',
    title: 'Reconocimiento Sigiloso en Subred Autorizada',
    type: 'Desafío CTF autorizado',
    difficulty: 'Avanzado',
    description:
      'Identifica el servicio expuesto en el puerto 8443 dentro del entorno simulado del Método de Hacking Ético.',
    requirements: 'Método: Hacking Ético & Operaciones Red Team',
    progressCurrent: 0,
    progressTarget: 1,
    rewardAmount: 50,
    rewardCurrency: 'NOBYTE',
    xpReward: 250,
    status: 'Disponible',
  },
  {
    id: 'op-event-zero-trust',
    title: 'Simposio Técnico: Arquitectura Zero-Trust & eBPF',
    type: 'Evento especial',
    difficulty: 'Avanzado',
    description:
      'Actividad especial del ecosistema NØTRACE enfocada en detección temprana de procesos anómalos en memoria volátil.',
    requirements: 'Rango mínimo sugerido: 02 — OPERATOR',
    progressCurrent: 1,
    progressTarget: 1,
    rewardAmount: 15,
    rewardCurrency: 'NOCORE',
    xpReward: 400,
    status: 'Recompensa reclamada',
    deadline: 'Evento de temporada',
  },
];

export const DEMO_VAULT_MOVEMENTS: VaultMovement[] = [
  {
    id: 'NTV-2026-0894',
    date: '2026-11-26',
    time: '14:22:10',
    type: 'Recompensa educativa',
    currency: 'NOBYTE',
    amount: 40,
    status: 'Confirmado (Demo)',
    concept: 'Laboratorio completado: Blindaje de Servidores Linux (nftables)',
  },
  {
    id: 'NTV-2026-0891',
    date: '2026-11-25',
    time: '19:05:44',
    type: 'Adquisición de Método',
    currency: 'NOCORE',
    amount: -110,
    status: 'Confirmado (Demo)',
    concept: 'Desbloqueo de Método: Arquitectura VPN Multi-Hop & WireGuard',
  },
  {
    id: 'NTV-2026-0887',
    date: '2026-11-24',
    time: '11:14:02',
    type: 'Recompensa de evento',
    currency: 'NOCORE',
    amount: 15,
    status: 'Confirmado (Demo)',
    concept: 'Participación verificada: Simposio Técnico Zero-Trust & eBPF',
  },
  {
    id: 'NTV-2026-0882',
    date: '2026-11-23',
    time: '17:48:30',
    type: 'Recompensa educativa',
    currency: 'NOBYTE',
    amount: 100,
    status: 'Confirmado (Demo)',
    concept: 'Finalización de Método: Inteligencia de Fuentes Abiertas (OSINT)',
  },
  {
    id: 'NTV-2026-0879',
    date: '2026-11-22',
    time: '09:30:00',
    type: 'Recarga',
    currency: 'NOCORE',
    amount: 250,
    status: 'Ilustrativo',
    concept: 'Asignación inicial de prototipo NØTRACE VAULT (Paquete OPERATOR)',
  },
  {
    id: 'NTV-2026-0875',
    date: '2026-11-21',
    time: '16:12:19',
    type: 'Uso de herramienta',
    currency: 'NOBYTE',
    amount: -5,
    status: 'Ilustrativo',
    concept: 'Consulta extendida de diagnóstico en laboratorio técnico',
  },
];

export const RECHARGE_PACKAGES: RechargePackage[] = [
  // NØCORE PACKAGES
  {
    id: 'core-starter',
    code: 'STARTER',
    currency: 'NOCORE',
    amount: 100,
    subtitle: 'Acceso inicial a Métodos premium individuales',
    targetAudience: 'Para estudiantes que desean adquirir su primer Método especializado',
    highlights: [
      '100 unidades de crédito interno NØCORE',
      'Aplicable a Métodos premium y laboratorios avanzados',
      'Configuración comercial en fase de prototipo (sin cobro real)',
    ],
  },
  {
    id: 'core-operator',
    code: 'OPERATOR',
    currency: 'NOCORE',
    amount: 250,
    subtitle: 'Capacidad para 2 Métodos premium y laboratorios',
    targetAudience: 'Para operadores en formación continua dentro del Campus',
    highlights: [
      '250 unidades de crédito interno NØCORE',
      'Cubre hasta 2 Métodos completos de nivel Avanzado o Especialista',
      'Acceso futuro a informes consolidados en NØTRACE Toolkit',
    ],
  },
  {
    id: 'core-advanced',
    code: 'ADVANCED',
    currency: 'NOCORE',
    amount: 500,
    subtitle: 'Reserva técnica para rutas completas de especialización',
    targetAudience: 'Para perfiles técnicos que cursan múltiples ramas del catálogo',
    highlights: [
      '500 unidades de crédito interno NØCORE',
      'Permite desbloquear colecciones de Métodos y desafíos CTF futuros',
      'Administración centralizada desde NØTRACE VAULT',
    ],
  },
  {
    id: 'core-elite',
    code: 'ELITE',
    currency: 'NOCORE',
    amount: 1000,
    subtitle: 'Capacidad integral para todo el ecosistema NØTRACE',
    targetAudience: 'Para formación intensiva en todas las disciplinas de la plataforma',
    highlights: [
      '1.000 unidades de crédito interno NØCORE',
      'Cobertura amplia para catálogo actual y próximas publicaciones',
      'Prototipo visual sujeto a definición comercial definitiva',
    ],
  },

  // NØBYTE PACKAGES
  {
    id: 'byte-pack',
    code: 'BYTE PACK',
    currency: 'NOBYTE',
    amount: 500,
    subtitle: 'Unidades educativas para herramientas y recursos',
    targetAudience: 'Complemento opcional (también obtenible gratis mediante estudio)',
    highlights: [
      '500 unidades de NØBYTE',
      'Recuerda: puedes obtener NØBYTE completando módulos y misiones',
      'Destinado a consultas de herramientas básicas y recursos complementarios',
    ],
  },
  {
    id: 'data-pack',
    code: 'DATA PACK',
    currency: 'NOBYTE',
    amount: 1500,
    subtitle: 'Reserva intermedia para uso frecuente del Toolkit',
    targetAudience: 'Para usuarios activos en laboratorios básicos y eventos',
    highlights: [
      '1.500 unidades de NØBYTE',
      'Aplicable a Métodos seleccionados en NØBYTE y utilidades del Toolkit',
      'Sin caducidad dentro del modelo conceptual del ecosistema',
    ],
  },
  {
    id: 'system-pack',
    code: 'SYSTEM PACK',
    currency: 'NOBYTE',
    amount: 5000,
    subtitle: 'Capacidad extendida para actividades y personalización',
    targetAudience: 'Cobertura completa de utilidades de consumo NØBYTE',
    highlights: [
      '5.000 unidades de NØBYTE',
      'Compatible con eventos educativos y desbloqueo de recursos técnicos',
      'Prototipo de interfaz sin procesamiento financiero activo',
    ],
  },
];

export const FUTURE_PAYMENT_METHODS: FuturePaymentMethod[] = [
  {
    id: 'pm-usdt',
    name: 'USDT (Tether)',
    category: 'Criptomonedas',
    networkOrProvider: 'Redes previstas: TRC-20 / ERC-20 / Polygon',
    description: 'Liquidación mediante stablecoin con confirmación verificada por webhook en servidor.',
    availability: 'Próximamente',
    securityNote: 'No se generan direcciones ni códigos QR en esta fase para evitar envíos accidentales.',
  },
  {
    id: 'pm-usdc',
    name: 'USDC (USD Coin)',
    category: 'Criptomonedas',
    networkOrProvider: 'Redes previstas: ERC-20 / Base / Arbitrum',
    description: 'Integración planificada mediante pasarela cripto auditable sin custodia de claves privadas.',
    availability: 'Próximamente',
    securityNote: 'NØTRACE nunca solicitará frases semilla ni claves privadas.',
  },
  {
    id: 'pm-btc',
    name: 'Bitcoin (BTC)',
    category: 'Criptomonedas',
    networkOrProvider: 'Red principal Bitcoin / Lightning Network',
    description: 'Soporte previsto para confirmaciones on-chain y liquidación instantánea vía Lightning.',
    availability: 'Próximamente',
    securityNote: 'Integración pendiente de activación del motor contable backend.',
  },
  {
    id: 'pm-eth',
    name: 'Ethereum (ETH)',
    category: 'Criptomonedas',
    networkOrProvider: 'Red Ethereum / L2 compatibles',
    description: 'Pasarela prevista con verificación automática de transacciones en el servidor.',
    availability: 'Próximamente',
    securityNote: 'Sin contratos inteligentes ni direcciones activas durante la fase de diseño.',
  },
  {
    id: 'pm-binance',
    name: 'Binance Pay',
    category: 'Plataformas',
    networkOrProvider: 'API Comercial Oficial de Binance Pay',
    description: 'Pago directo desde cuenta Binance mediante orden firmada criptográficamente en backend.',
    availability: 'Próximamente',
    securityNote: 'Nunca introduzcas credenciales de Binance fuera del flujo OAuth/comercial oficial.',
  },
  {
    id: 'pm-paypal',
    name: 'PayPal',
    category: 'Plataformas',
    networkOrProvider: 'PayPal Orders API v2',
    description: 'Procesamiento comercial internacional con protección al comprador y confirmación por webhook.',
    availability: 'Próximamente',
    securityNote: 'Sujeto a validación de políticas regionales y términos del proveedor.',
  },
  {
    id: 'pm-cards',
    name: 'Tarjetas Bancarias',
    category: 'Plataformas',
    networkOrProvider: 'Procesador compatible PCI-DSS (3D Secure)',
    description: 'Pago con tarjeta de débito o crédito tokenizado directamente por el proveedor certificado.',
    availability: 'Próximamente',
    securityNote: 'NØTRACE no almacena números de tarjeta ni códigos CVV.',
  },
  {
    id: 'pm-telegram',
    name: 'Integración vía Telegram',
    category: 'Plataformas',
    networkOrProvider: 'Pasarela autorizada compatible con Telegram Bot Payments API',
    description: 'Canal asistido mediante proveedor de pago externo conectado al ecosistema NØTRACE.',
    availability: 'Integración en arquitectura',
    securityNote: 'Telegram actúa únicamente como interfaz de comunicación hacia un procesador autorizado.',
  },
];

export const OPERATOR_RANKS: OperatorRankSpec[] = [
  {
    id: 1,
    code: '01 — INITIATE',
    name: 'Initiate',
    minXp: 0,
    description: 'Nivel de ingreso al ecosistema. Comprensión de fundamentos, higiene digital y entorno CLI.',
    capabilities: ['Acceso a Métodos gratuitos', 'Uso de herramientas base en NØTRACE Toolkit'],
  },
  {
    id: 2,
    code: '02 — OPERATOR',
    name: 'Operator',
    minXp: 400,
    description: 'Dominio operativo de terminal Linux, configuración de túneles VPN y análisis de exposición IP.',
    capabilities: ['Participación en Retos Semanales', 'Insignia vectorial 02 — OPERATOR en perfil'],
  },
  {
    id: 3,
    code: '03 — ANALYST',
    name: 'Analyst',
    minXp: 900,
    description: 'Capacidad probada en diagnóstico de redes, correlación OSINT responsable y endurecimiento de servicios.',
    capabilities: ['Acceso a misiones de análisis forense', 'Prioridad en eventos técnicos del Campus'],
  },
  {
    id: 4,
    code: '04 — SPECIALIST',
    name: 'Specialist',
    minXp: 1600,
    description: 'Especialización técnica en arquitecturas multi-hop, auditoría ofensiva autorizada o defensa eBPF.',
    capabilities: ['Desafíos CTF de nivel avanzado', 'Reconocimiento curricular en expediente académico'],
  },
  {
    id: 5,
    code: '05 — ARCHITECT',
    name: 'Architect',
    minXp: 2500,
    description: 'Diseño integral de infraestructuras Zero-Trust, segmentación de redes críticas y criptografía aplicada.',
    capabilities: ['Laboratorios de arquitectura compleja', 'Evaluaciones de diseño de sistemas'],
  },
  {
    id: 6,
    code: '06 — SENTINEL',
    name: 'Sentinel',
    minXp: 3800,
    description: 'Maestría en detección de amenazas persistentes, respuesta ante incidentes y protección de privacidad.',
    capabilities: ['Operaciones especiales del ecosistema', 'Mentoría técnica en actividades comunitarias'],
  },
  {
    id: 7,
    code: '07 — ZERO',
    name: 'Zero',
    minXp: 5500,
    description: 'Máxima distinción académica de NØTRACE. Dominio transversal de los Métodos y laboratorios.',
    capabilities: ['Distinción 07 — ZERO en el ecosistema', 'Acceso completo a simposios de investigación'],
  },
];
