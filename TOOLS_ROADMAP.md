# NØTRACE 3.0 — TOOLKIT & LABORATORIES ROADMAP

## 1. Herramientas Operativas en Fase 3.0 (`/herramientas`)
- **VPN Inspector (`/herramientas/vpn-inspector`)**: Cartografía vectorial Natural Earth con consulta real a `/api/connection` (IPinfo), detección de IP pública, ASN, operador, país y comparación de nodos.
- **Privacy Lab (`/herramientas/privacy-lab`)**: Inspección pasiva de zona horaria (`Intl`), idioma del navegador, estado de cookies y señales locales sin fingerprinting invasivo.
- **Crypto Lab (`/herramientas/crypto-lab`)**:
  - Generador y comparador de hashes criptográficos `SHA-256`, `SHA-384` y `SHA-512` mediante Web Crypto API nativa.
  - Generador CSPRNG de contraseñas con cálculo real de bits de entropía.
  - Codificador y decodificador Base64 UTF-8.
- **Network Lab (`/herramientas/network-lab`)**:
  - Calculadora de subredes IPv4 CIDR (máscara, wildcard, rango de hosts, broadcast).
  - Generador de plantillas Zero-Trust `nftables` para estaciones con túnel WireGuard.

## 2. Herramientas en Hoja de Ruta (Catálogo NØTRACE Toolkit)
- **Privacy Lab**: WebRTC Exposure Check, DNS Context View.
- **Network Lab**: DNS Lookup Inspector, HTTP Header Analyzer, TLS & Certificate Inspector, Port & Service Reference, Latency & Route Visualizer.
- **Crypto Lab**: File Integrity Verifier.
- **Security Lab**: Security Headers Checker, URL Safety Structure Inspector, CSP Analyzer, Hardening Checklist.
- **Practice Lab**: Terminal Simulator, Log Analyzer, Recon Methodology Trainer, Defensive Challenge Arena.
