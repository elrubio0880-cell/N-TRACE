import React, { useState, useMemo, useEffect } from 'react';
import {
  Globe,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Network,
  Route,
  Fingerprint,
  FileCheck,
  Server,
  Search,
  Calculator,
  Terminal,
  Lock,
  Activity,
  Workflow,
  Hash,
  Equal,
  KeyRound,
  Binary,
  LockKeyhole,
  ArrowLeftRight,
  ChartNoAxesColumn,
  Shield,
  Database,
  FileSearch,
  Link,
  FileText,
  ListChecks,
  Radar,
  Code,
  Boxes,
  Flag,
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';
import { TOOLKIT_CATALOG, ToolkitItem } from '../data/notracePlatformData';
import { NetworkCommandCenter } from './NetworkCommandCenter';
import { CurrencyAmount } from './CurrencyIcons';

interface ToolkitViewProps {
  subRoute?: string | null; // null | 'vpn-inspector' | 'privacy-lab' | 'network-lab' | 'crypto-lab'
  onNavigate: (path: string) => void;
}

const LAB_CATEGORIES = [
  'Todos',
  'PRIVACY LAB',
  'NETWORK LAB',
  'CRYPTO LAB',
  'SECURITY LAB',
  'PRACTICE LAB',
] as const;

export const ToolkitView: React.FC<ToolkitViewProps> = ({
  subRoute = null,
  onNavigate,
}) => {
  const [selectedLab, setSelectedLab] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Crypto Lab local state (100% browser Web Crypto API)
  const [hashInput, setHashInput] = useState<string>('NØTRACE-ZERO-KNOWLEDGE-2026');
  const [hashAlgo, setHashAlgo] = useState<'SHA-256' | 'SHA-384' | 'SHA-512'>('SHA-256');
  const [hashDigest, setHashDigest] = useState<string>('');
  const [compareTarget, setCompareTarget] = useState<string>('');
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  const [pwdLength, setPwdLength] = useState<number>(24);
  const [pwdSymbols, setPwdSymbols] = useState<boolean>(true);
  const [generatedPwd, setGeneratedPwd] = useState<string>('');
  const [copiedPwd, setCopiedPwd] = useState<boolean>(false);

  const [b64Input, setB64Input] = useState<string>('NØTRACE // PRIVACY & SECURITY');
  const [b64Mode, setB64Mode] = useState<'encode' | 'decode'>('encode');

  // Network Lab CIDR Calculator state
  const [cidrIp, setCidrIp] = useState<string>('10.14.88.24');
  const [cidrMask, setCidrMask] = useState<number>(24);

  // Compute real Web Crypto SHA digest
  useEffect(() => {
    let active = true;
    const compute = async () => {
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(hashInput);
        const buf = await window.crypto.subtle.digest(hashAlgo, data);
        if (!active) return;
        const hex = Array.from(new Uint8Array(buf))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
        setHashDigest(hex);
      } catch {
        if (active) setHashDigest('Web Crypto API no disponible en este contexto.');
      }
    };
    compute();
    return () => {
      active = false;
    };
  }, [hashInput, hashAlgo]);

  // Generate high-entropy password with crypto.getRandomValues
  const generateLocalPassword = () => {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' +
      (pwdSymbols ? '!@#$%^&*()-_=+[]{};:,.<>?' : '');
    const arr = new Uint32Array(pwdLength);
    window.crypto.getRandomValues(arr);
    let out = '';
    for (let i = 0; i < pwdLength; i++) {
      out += chars[arr[i] % chars.length];
    }
    setGeneratedPwd(out);
  };

  useEffect(() => {
    generateLocalPassword();
  }, [pwdLength, pwdSymbols]);

  const b64Output = useMemo(() => {
    try {
      if (b64Mode === 'encode') {
        const bytes = new TextEncoder().encode(b64Input);
        let bin = '';
        bytes.forEach((b) => (bin += String.fromCharCode(b)));
        return window.btoa(bin);
      } else {
        const bin = window.atob(b64Input.trim());
        const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
        return new TextDecoder().decode(bytes);
      }
    } catch {
      return 'Entrada no válida para decodificación Base64.';
    }
  }, [b64Input, b64Mode]);

  // Compute IPv4 Subnet details
  const subnetDetails = useMemo(() => {
    const parts = cidrIp.trim().split('.').map(Number);
    if (
      parts.length !== 4 ||
      parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)
    ) {
      return null;
    }
    const ipNum =
      ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
    const maskNum =
      cidrMask === 0 ? 0 : (0xffffffff << (32 - cidrMask)) >>> 0;
    const netNum = (ipNum & maskNum) >>> 0;
    const bcastNum = (netNum | (~maskNum >>> 0)) >>> 0;
    const toIp = (n: number) =>
      [
        (n >>> 24) & 255,
        (n >>> 16) & 255,
        (n >>> 8) & 255,
        n & 255,
      ].join('.');

    const usableHosts =
      cidrMask >= 31 ? (cidrMask === 31 ? 2 : 1) : Math.pow(2, 32 - cidrMask) - 2;

    return {
      network: `${toIp(netNum)}/${cidrMask}`,
      netmask: toIp(maskNum),
      broadcast: toIp(bcastNum),
      firstHost: cidrMask >= 31 ? toIp(netNum) : toIp((netNum + 1) >>> 0),
      lastHost: cidrMask >= 31 ? toIp(bcastNum) : toIp((bcastNum - 1) >>> 0),
      usableHosts: usableHosts.toLocaleString('es-ES'),
    };
  }, [cidrIp, cidrMask]);

  const renderIcon = (name: string) => {
    switch (name) {
      case 'globe':
        return <Globe className="w-5 h-5 text-white" />;
      case 'clock':
        return <Clock className="w-5 h-5 text-white" />;
      case 'shield-check':
        return <ShieldCheck className="w-5 h-5 text-white" />;
      case 'shield-alert':
        return <ShieldAlert className="w-5 h-5 text-white" />;
      case 'network':
        return <Network className="w-5 h-5 text-white" />;
      case 'route':
        return <Route className="w-5 h-5 text-white" />;
      case 'fingerprint':
        return <Fingerprint className="w-5 h-5 text-white" />;
      case 'file-check':
        return <FileCheck className="w-5 h-5 text-white" />;
      case 'server':
        return <Server className="w-5 h-5 text-white" />;
      case 'search':
        return <Search className="w-5 h-5 text-white" />;
      case 'calculator':
        return <Calculator className="w-5 h-5 text-white" />;
      case 'terminal':
        return <Terminal className="w-5 h-5 text-white" />;
      case 'lock':
        return <Lock className="w-5 h-5 text-white" />;
      case 'activity':
        return <Activity className="w-5 h-5 text-white" />;
      case 'workflow':
        return <Workflow className="w-5 h-5 text-white" />;
      case 'hash':
        return <Hash className="w-5 h-5 text-white" />;
      case 'equal':
        return <Equal className="w-5 h-5 text-white" />;
      case 'key-round':
        return <KeyRound className="w-5 h-5 text-white" />;
      case 'binary':
        return <Binary className="w-5 h-5 text-white" />;
      case 'lock-keyhole':
        return <LockKeyhole className="w-5 h-5 text-white" />;
      case 'arrow-left-right':
        return <ArrowLeftRight className="w-5 h-5 text-white" />;
      case 'chart-no-axes-column':
        return <ChartNoAxesColumn className="w-5 h-5 text-white" />;
      case 'shield':
        return <Shield className="w-5 h-5 text-white" />;
      case 'database':
        return <Database className="w-5 h-5 text-white" />;
      case 'file-search':
        return <FileSearch className="w-5 h-5 text-white" />;
      case 'link':
        return <Link className="w-5 h-5 text-white" />;
      case 'file-text':
        return <FileText className="w-5 h-5 text-white" />;
      case 'list-checks':
        return <ListChecks className="w-5 h-5 text-white" />;
      case 'radar':
        return <Radar className="w-5 h-5 text-white" />;
      case 'code':
        return <Code className="w-5 h-5 text-white" />;
      case 'flag':
        return <Flag className="w-5 h-5 text-white" />;
      default:
        return <Boxes className="w-5 h-5 text-white" />;
    }
  };

  // SUB-VIEW 1: Dedicated VPN Inspector Page (/herramientas/vpn-inspector)
  if (subRoute === 'vpn-inspector') {
    return (
      <main className="py-8 space-y-6" aria-label="NØTRACE VPN Inspector">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1F1F1F]">
          <button
            type="button"
            onClick={() => onNavigate('/herramientas')}
            className="nt-btn nt-btn--sm text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a NØTRACE TOOLKIT</span>
          </button>

          <div className="flex items-center gap-3 text-xs font-mono text-[#A3A3A3]">
            <span>PRIVACY LAB</span>
            <span aria-hidden="true">/</span>
            <span className="text-white">VPN INSPECTOR</span>
          </div>
        </div>

        <NetworkCommandCenter />
      </main>
    );
  }

  // SUB-VIEW 2: Dedicated Crypto Lab Page (/herramientas/crypto-lab)
  if (subRoute === 'crypto-lab') {
    const entropyBits = Math.round(
      pwdLength * Math.log2(pwdSymbols ? 86 : 62)
    );
    const hashMatches =
      compareTarget.trim().length > 0 &&
      compareTarget.trim().toLowerCase() === hashDigest.toLowerCase();

    return (
      <main className="py-8 space-y-8" aria-label="NØTRACE Crypto Lab">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1F1F1F]">
          <button
            type="button"
            onClick={() => onNavigate('/herramientas')}
            className="nt-btn nt-btn--sm text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a NØTRACE TOOLKIT</span>
          </button>

          <span className="text-xs font-mono text-white">
            CRYPTO LAB · EJECUCIÓN LOCAL WEB CRYPTO API
          </span>
        </div>

        <div>
          <div className="text-xs font-mono text-[#737373] uppercase mb-1">
            NØTRACE TOOLKIT // CRYPTO LAB
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Laboratorio de Criptografía e Integridad Local
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-1 max-w-2xl">
            Todas las operaciones se calculan localmente en la memoria de tu
            navegador mediante Web Crypto API. Ninguna cadena ni clave se
            transmite por la red.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tool 1: Hash Generator & Comparator */}
          <section className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-4 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="nt-icon-tile">
                  <Hash className="w-4 h-4 text-white" />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-white">
                    Hash Generator & Comparator
                  </h2>
                  <p className="text-xs text-[#737373]">
                    Cálculo determinista SHA-256 / SHA-384 / SHA-512
                  </p>
                </div>
              </div>

              <select
                aria-label="Algoritmo Hash"
                value={hashAlgo}
                onChange={(e) => setHashAlgo(e.target.value as any)}
                className="nt-input w-full sm:w-auto text-xs py-1.5"
              >
                <option value="SHA-256">SHA-256</option>
                <option value="SHA-384">SHA-384</option>
                <option value="SHA-512">SHA-512</option>
              </select>
            </div>

            <label className="nt-field text-xs text-[#A3A3A3]">
              <span>Texto o carga de entrada</span>
              <input
                type="text"
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                className="nt-input font-mono text-xs"
              />
            </label>

            <div className="p-3.5 rounded-lg bg-[#000000] border border-[#2E2E2E] space-y-2">
              <div className="flex items-center justify-between text-xs text-[#737373]">
                <span>Resumen {hashAlgo} generado:</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(hashDigest);
                    setCopiedHash(true);
                    setTimeout(() => setCopiedHash(false), 1600);
                  }}
                  className="text-white hover:text-[#A3A3A3] flex items-center gap-1 cursor-pointer"
                >
                  {copiedHash ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
              <div className="font-mono text-xs text-white break-all select-all">
                {hashDigest}
              </div>
            </div>

            <label className="nt-field text-xs text-[#A3A3A3]">
              <span>Comparador de integridad (pega un hash para verificar coincidencia)</span>
              <input
                type="text"
                value={compareTarget}
                onChange={(e) => setCompareTarget(e.target.value)}
                placeholder="Pega aquí un hash SHA para comparar..."
                className="nt-input font-mono text-xs"
              />
            </label>

            {compareTarget.trim().length > 0 && (
              <div className="p-3 rounded-lg bg-[#121212] border border-[#2E2E2E] text-xs font-mono">
                {hashMatches ? (
                  <span className="text-[#4ADE80]">
                    ✓ INTEGRIDAD VERIFICADA: Ambos resúmenes coinciden exactamente.
                  </span>
                ) : (
                  <span className="text-[#EF4444]">
                    ✕ DISCREPANCIA DETECTADA: El hash proporcionado no coincide.
                  </span>
                )}
              </div>
            )}
          </section>

          {/* Tool 2: High-Entropy Password Generator & Base64 Toolkit */}
          <div className="space-y-6">
            <section className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="nt-icon-tile">
                    <KeyRound className="w-4 h-4 text-white" />
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-white">
                      Password & Entropy Generator
                    </h2>
                    <p className="text-xs text-[#737373]">
                      CSPRNG local mediante crypto.getRandomValues()
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs text-white tabular-nums">
                  ~{entropyBits} bits de entropía
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#000000] border border-[#2E2E2E] flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-white break-all">
                  {generatedPwd}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={generateLocalPassword}
                    className="nt-btn nt-btn--sm text-xs"
                    title="Generar nueva clave"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(generatedPwd);
                      setCopiedPwd(true);
                      setTimeout(() => setCopiedPwd(false), 1600);
                    }}
                    className="nt-btn nt-btn--sm text-xs"
                  >
                    {copiedPwd ? 'Copiada' : 'Copiar'}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-3 sm:gap-4 text-xs text-[#A3A3A3]">
                <label className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                  <span>Longitud: {pwdLength} caracteres</span>
                  <input
                    type="range"
                    min={12}
                    max={48}
                    value={pwdLength}
                    onChange={(e) => setPwdLength(Number(e.target.value))}
                    className="w-full sm:w-36"
                  />
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pwdSymbols}
                    onChange={(e) => setPwdSymbols(e.target.checked)}
                  />
                  <span>Incluir símbolos especiales</span>
                </label>
              </div>
            </section>

            {/* Base64 Toolkit */}
            <section className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="nt-icon-tile">
                    <Binary className="w-4 h-4 text-white" />
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-white">
                      Base64 UTF-8 Toolkit
                    </h2>
                    <p className="text-xs text-[#737373]">
                      Codificación y decodificación reversible sin servidor
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 p-1 rounded-lg bg-[#121212] border border-[#2E2E2E]">
                  <button
                    type="button"
                    onClick={() => setB64Mode('encode')}
                    className={`px-2.5 py-1 rounded text-xs cursor-pointer ${
                      b64Mode === 'encode'
                        ? 'bg-white text-black font-semibold'
                        : 'text-[#A3A3A3]'
                    }`}
                  >
                    Codificar
                  </button>
                  <button
                    type="button"
                    onClick={() => setB64Mode('decode')}
                    className={`px-2.5 py-1 rounded text-xs cursor-pointer ${
                      b64Mode === 'decode'
                        ? 'bg-white text-black font-semibold'
                        : 'text-[#A3A3A3]'
                    }`}
                  >
                    Decodificar
                  </button>
                </div>
              </div>

              <input
                type="text"
                value={b64Input}
                onChange={(e) => setB64Input(e.target.value)}
                aria-label="Entrada Base64"
                className="nt-input font-mono text-xs"
              />

              <div className="p-3 rounded-lg bg-[#000000] border border-[#2E2E2E] font-mono text-xs text-white break-all">
                {b64Output}
              </div>
            </section>
          </div>
        </div>
      </main>
    );
  }

  // SUB-VIEW 3: Dedicated Network Lab Page (/herramientas/network-lab)
  if (subRoute === 'network-lab') {
    return (
      <main className="py-8 space-y-8" aria-label="NØTRACE Network Lab">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1F1F1F]">
          <button
            type="button"
            onClick={() => onNavigate('/herramientas')}
            className="nt-btn nt-btn--sm text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a NØTRACE TOOLKIT</span>
          </button>
          <span className="text-xs font-mono text-white">
            NETWORK LAB · CÁLCULO DE SUBREDES Y TOPOLOGÍA
          </span>
        </div>

        <div>
          <div className="text-xs font-mono text-[#737373] uppercase mb-1">
            NØTRACE TOOLKIT // NETWORK LAB
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Laboratorio de Redes y Segmentación IPv4
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-1 max-w-2xl">
            Calcula rangos CIDR, máscaras de subred y capacidad de hosts para
            diseñar arquitecturas segmentadas y reglas de firewall nftables.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-6 rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-4 sm:p-6 space-y-5">
            <div className="flex items-center gap-2.5">
              <span className="nt-icon-tile">
                <Calculator className="w-4 h-4 text-white" />
              </span>
              <div>
                <h2 className="text-base font-semibold text-white">
                  IP & CIDR Subnet Calculator
                </h2>
                <p className="text-xs text-[#737373]">
                  Cálculo bit a bit de bloques de red IPv4
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="sm:col-span-2 nt-field text-xs text-[#A3A3A3]">
                <span>Dirección IPv4</span>
                <input
                  type="text"
                  value={cidrIp}
                  onChange={(e) => setCidrIp(e.target.value)}
                  className="nt-input font-mono text-xs"
                />
              </label>

              <label className="nt-field text-xs text-[#A3A3A3]">
                <span>Prefijo CIDR (/{cidrMask})</span>
                <input
                  type="number"
                  min={8}
                  max={32}
                  value={cidrMask}
                  onChange={(e) =>
                    setCidrMask(Math.max(8, Math.min(32, Number(e.target.value))))
                  }
                  className="nt-input font-mono text-xs"
                />
              </label>
            </div>

            {subnetDetails ? (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-2 text-xs">
                <div className="p-3 rounded-lg bg-[#121212] border border-[#2E2E2E]">
                  <dt className="text-[#737373]">Bloque de Red</dt>
                  <dd className="font-mono text-sm font-semibold text-white mt-0.5 break-all">
                    {subnetDetails.network}
                  </dd>
                </div>
                <div className="p-3 rounded-lg bg-[#121212] border border-[#2E2E2E]">
                  <dt className="text-[#737373]">Máscara Decimal</dt>
                  <dd className="font-mono text-sm font-semibold text-white mt-0.5 break-all">
                    {subnetDetails.netmask}
                  </dd>
                </div>
                <div className="p-3 rounded-lg bg-[#121212] border border-[#2E2E2E]">
                  <dt className="text-[#737373]">Primer Host Útil</dt>
                  <dd className="font-mono text-sm text-white mt-0.5 break-all">
                    {subnetDetails.firstHost}
                  </dd>
                </div>
                <div className="p-3 rounded-lg bg-[#121212] border border-[#2E2E2E]">
                  <dt className="text-[#737373]">Último Host Útil</dt>
                  <dd className="font-mono text-sm text-white mt-0.5 break-all">
                    {subnetDetails.lastHost}
                  </dd>
                </div>
                <div className="p-3 rounded-lg bg-[#121212] border border-[#2E2E2E]">
                  <dt className="text-[#737373]">Dirección Broadcast</dt>
                  <dd className="font-mono text-sm text-white mt-0.5 break-all">
                    {subnetDetails.broadcast}
                  </dd>
                </div>
                <div className="p-3 rounded-lg bg-[#121212] border border-[#2E2E2E]">
                  <dt className="text-[#737373]">Hosts Asignables</dt>
                  <dd className="font-mono text-sm font-semibold text-white mt-0.5 tabular-nums">
                    {subnetDetails.usableHosts}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="text-xs text-[#EF4444]">
                Introduce una dirección IPv4 válida (ej. 10.14.88.24).
              </p>
            )}
          </section>

          <section className="lg:col-span-6 rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-4 sm:p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-mono text-[#737373]">
                REGLA NFTABLES GENERADA PARA ESTE BLOQUE
              </div>
              <h2 className="text-base font-semibold text-white">
                Plantilla de Segmentación Zero-Trust
              </h2>
              <p className="text-xs text-[#A3A3A3]">
                Sintaxis lista para aplicar en el laboratorio de blindaje de
                servidores Linux de NØTRACE Campus:
              </p>
            </div>

            <pre className="p-3.5 sm:p-4 rounded-lg bg-[#000000] border border-[#2E2E2E] font-mono text-xs text-white overflow-x-auto">
              <code>
                {`table inet notrace_segment {\n  chain forward {\n    ip saddr ${
                  subnetDetails?.network || '10.14.88.0/24'
                } tcp dport 443 ct state new accept\n    ip saddr ${
                  subnetDetails?.network || '10.14.88.0/24'
                } counter drop\n  }\n}`}
              </code>
            </pre>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <span className="text-xs text-[#737373]">
                ¿Quieres verificar tu salida de red pública actual?
              </span>
              <button
                type="button"
                onClick={() => onNavigate('/herramientas/vpn-inspector')}
                className="nt-btn nt-btn--sm text-xs w-full sm:w-auto justify-center"
              >
                <span>Abrir VPN Inspector →</span>
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  // SUB-VIEW 4: Dedicated Privacy Lab Page (/herramientas/privacy-lab)
  if (subRoute === 'privacy-lab') {
    const browserTz =
      Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const browserLocale = navigator.language || 'es-ES';
    const dntEnabled =
      navigator.doNotTrack === '1' ||
      (window as any).doNotTrack === '1';
    const cookiesEnabled = navigator.cookieEnabled;
    const cores = navigator.hardwareConcurrency || 'No reportado';

    return (
      <main className="py-8 space-y-8" aria-label="NØTRACE Privacy Lab">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1F1F1F]">
          <button
            type="button"
            onClick={() => onNavigate('/herramientas')}
            className="nt-btn nt-btn--sm text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a NØTRACE TOOLKIT</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/herramientas/vpn-inspector')}
            className="nt-btn nt-btn--primary nt-btn--sm text-xs"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Abrir Mapa VPN Inspector →</span>
          </button>
        </div>

        <div>
          <div className="text-xs font-mono text-[#737373] uppercase mb-1">
            NØTRACE TOOLKIT // PRIVACY LAB
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Diagnóstico de Señales Locales del Navegador
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-1 max-w-2xl">
            Inspección pasiva en memoria de los parámetros que tu navegador
            expone a los sitios web. Compáralos con la ubicación reportada por
            el VPN Inspector.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <article className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-5 space-y-2">
            <div className="text-xs font-mono text-[#737373]">
              ZONA HORARIA (INTL API)
            </div>
            <div className="text-lg font-bold font-mono text-white">
              {browserTz}
            </div>
            <p className="text-xs text-[#A3A3A3]">
              Debe coincidir con el país de salida de tu VPN para evitar
              correlación horaria.
            </p>
          </article>

          <article className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-5 space-y-2">
            <div className="text-xs font-mono text-[#737373]">
              IDIOMA Y REGIÓN PREFERIDA
            </div>
            <div className="text-lg font-bold font-mono text-white">
              {browserLocale}
            </div>
            <p className="text-xs text-[#A3A3A3]">
              Cabecera Accept-Language enviada en las peticiones estándar.
            </p>
          </article>

          <article className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-5 space-y-2">
            <div className="text-xs font-mono text-[#737373]">
              SEÑAL DO NOT TRACK / COOKIES
            </div>
            <div className="text-lg font-bold font-mono text-white">
              DNT: {dntEnabled ? 'Activo' : 'No activo'}
            </div>
            <p className="text-xs text-[#A3A3A3]">
              Cookies habilitadas: {cookiesEnabled ? 'Sí' : 'No'}
            </p>
          </article>

          <article className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-5 space-y-2">
            <div className="text-xs font-mono text-[#737373]">
              CONCURRENCIA HARDWARE
            </div>
            <div className="text-lg font-bold font-mono text-white tabular-nums">
              {cores} hilos lógicos
            </div>
            <p className="text-xs text-[#A3A3A3]">
              Expuesto por navigator.hardwareConcurrency.
            </p>
          </article>
        </div>
      </main>
    );
  }

  // MAIN VIEW: Full NØTRACE TOOLKIT Catalog (/herramientas)
  const filteredTools = TOOLKIT_CATALOG.filter((t) => {
    const matchesLab = selectedLab === 'Todos' || t.category === selectedLab;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.shortDescription.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q);
    return matchesLab && matchesSearch;
  });

  return (
    <main className="py-8 space-y-8" aria-label="Catálogo NØTRACE TOOLKIT">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
        <div>
          <div className="text-xs font-mono text-[#737373] uppercase tracking-wider mb-1">
            NØTRACE TOOLKIT // CENTRO DE UTILIDADES
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Herramientas de Ciberseguridad y Privacidad
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-2 max-w-2xl">
            Utilidades técnicas organizadas en 5 laboratorios especializados.
            Las herramientas activas operan con datos verificables o ejecución
            local; las herramientas futuras se muestran con su estado real de
            hoja de ruta.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('/herramientas/vpn-inspector')}
            className="nt-btn nt-btn--primary text-xs"
          >
            <Globe className="w-4 h-4" />
            <span>Abrir VPN Inspector</span>
          </button>
        </div>
      </div>

      {/* Quick Lab Launchers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl bg-[#0A0A0A] border border-[#404040] p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-white">
              01 · PRIVACY LAB DESTACADO
            </div>
            <h2 className="text-lg font-semibold text-white mt-1">
              VPN Inspector (Cartografía Natural Earth)
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-1">
              Verificación real de IP pública, operador ASN, país esperado y
              referencia de sesión en memoria.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/herramientas/vpn-inspector')}
            className="nt-btn nt-btn--primary text-xs w-full"
          >
            <span>Entrar a VPN Inspector →</span>
          </button>
        </div>

        <div className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-[#A3A3A3]">
              02 · CRYPTO LAB LOCAL
            </div>
            <h2 className="text-lg font-semibold text-white mt-1">
              Hash, Entropía & Base64 sin Servidor
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-1">
              Generación SHA-256/512, comparador de integridad y generador de
              claves CSPRNG mediante Web Crypto API.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/herramientas/crypto-lab')}
            className="nt-btn text-xs w-full"
          >
            <span>Abrir Crypto Lab →</span>
          </button>
        </div>

        <div className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-[#A3A3A3]">
              03 · NETWORK & PRIVACY LAB
            </div>
            <h2 className="text-lg font-semibold text-white mt-1">
              Calculadora CIDR & Señales de Navegador
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-1">
              Cálculo de subredes IPv4, plantillas nftables y auditoría local de
              zona horaria Intl API.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onNavigate('/herramientas/network-lab')}
              className="nt-btn nt-btn--sm text-xs"
            >
              <span>Network Lab →</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/herramientas/privacy-lab')}
              className="nt-btn nt-btn--sm text-xs"
            >
              <span>Privacy Lab →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
          {LAB_CATEGORIES.map((lab) => (
            <button
              key={lab}
              type="button"
              onClick={() => setSelectedLab(lab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selectedLab === lab
                  ? 'bg-white text-black'
                  : 'bg-[#121212] text-[#A3A3A3] hover:text-white border border-[#2E2E2E]'
              }`}
            >
              {lab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar herramienta..."
            aria-label="Filtrar herramienta"
            className="nt-input pl-10 text-xs"
          />
        </div>
      </div>

      {/* Full Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool: ToolkitItem) => {
          const isReady =
            tool.status === 'Disponible' || tool.status === 'Interactivo';

          return (
            <article
              key={tool.id}
              className="rounded-xl bg-[#0A0A0A] border border-[#2E2E2E] hover:border-[#525252] transition-colors p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="nt-icon-tile">
                    {renderIcon(tool.lucideIcon)}
                  </span>
                  <div className="text-right">
                    <div className="text-[11px] font-mono text-[#A3A3A3]">
                      {tool.category}
                    </div>
                    <div className="text-[11px] font-mono text-[#737373]">
                      {isReady ? 'Disponible' : 'Próximamente'}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white">
                    {tool.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-[#A3A3A3] leading-relaxed">
                    {tool.shortDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#171717] text-[11px] text-[#737373]">
                  Finalidad: <span className="text-[#A3A3A3]">{tool.purpose}</span>
                </div>
              </div>

              <div className="pt-3.5 border-t border-[#1F1F1F] flex flex-wrap items-center justify-between gap-3">
                <div>
                  {tool.tier === 'Gratuita' ? (
                    <span className="text-xs font-mono text-white">
                      Uso Gratuito
                    </span>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-[#A3A3A3]">
                      <span>Costo futuro:</span>
                      <CurrencyAmount
                        currency={tool.costCurrency || 'NOBYTE'}
                        amount={tool.costAmount}
                        size="sm"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate(tool.route)}
                  className={`nt-btn nt-btn--sm text-xs ${
                    isReady ? 'nt-btn--primary' : ''
                  }`}
                >
                  <span>{isReady ? 'Abrir' : 'Explorar'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
};
