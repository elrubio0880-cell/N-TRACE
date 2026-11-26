import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { NT_WORLD, WorldCountry } from '../data/worldData';

export interface ConnectionSnapshot {
  ip: string;
  countryCode: string;
  city: string | null;
  lat: number | null;
  lon: number | null;
  org: string | null;
  asn: string | null;
  anonymous: boolean | null;
  checkedAt?: string;
}

interface SessionLogEntry {
  t: string;
  msg: string;
}

interface ViewBoxState {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface PrivacyLabModuleSpec {
  id: string;
  title: string;
  status: string;
  description: string;
}

const PRIVACY_LAB_MODULES: PrivacyLabModuleSpec[] = [
  {
    id: 'dns-leak',
    title: 'DNS Leak Test',
    status: 'ARQUITECTURA PREPARADA',
    description:
      'Módulo planificado para verificar qué resolutores DNS procesan las consultas del navegador cuando existe un túnel activo.',
  },
  {
    id: 'webrtc-leak',
    title: 'WebRTC Leak Test',
    status: 'ARQUITECTURA PREPARADA',
    description:
      'Inspección local de candidatos ICE/STUN del navegador para comprobar si se exponen direcciones locales o públicas fuera del túnel.',
  },
  {
    id: 'ipv4-ipv6-leak',
    title: 'IPv4 / IPv6 Dual-Stack Test',
    status: 'ARQUITECTURA PREPARADA',
    description:
      'Comprobación separada de alcanzabilidad IPv4 e IPv6 para detectar fugas por doble pila cuando la VPN solo enruta IPv4.',
  },
  {
    id: 'timezone-check',
    title: 'Timezone & Locale Coherence',
    status: 'ARQUITECTURA PREPARADA',
    description:
      'Comparación pasiva entre la zona horaria expuesta por Intl API del navegador y la región geográfica de la IP de salida.',
  },
  {
    id: 'asn-intel',
    title: 'ASN Intelligence',
    status: 'ARQUITECTURA PREPARADA',
    description:
      'Clasificación técnica del sistema autónomo observado (residencial, hosting, tránsito o proveedor de anonimización).',
  },
  {
    id: 'privacy-report',
    title: 'Privacy Session Report',
    status: 'ARQUITECTURA PREPARADA',
    description:
      'Resumen exportable en memoria con las observaciones reales de la sesión sin almacenamiento persistente en servidor.',
  },
];

function proj(lat: number, lon: number): [number, number] {
  return [((lon + 180) * 1000) / 360, ((84 - lat) * 1000) / 360];
}

function ipFamily(ip = ''): string {
  return ip.includes(':') ? 'IPv6' : ip.includes('.') ? 'IPv4' : 'Formato no identificado';
}

export const NetworkCommandCenter: React.FC = () => {
  const [expected, setExpected] = useState<string>('');
  const [current, setCurrent] = useState<ConnectionSnapshot | null>(null);
  const [baseline, setBaseline] = useState<ConnectionSnapshot | null>(null);
  const [busy, setBusy] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const [notice, setNotice] = useState<string>(
    'Iniciando verificación real de tu conexión pública...'
  );
  const [liveErrorDetail, setLiveErrorDetail] = useState<string | null>(null);
  const [logs, setLogs] = useState<SessionLogEntry[]>([]);

  // Map ViewBox & Interaction State
  const [vb, setVb] = useState<ViewBoxState>({ x: 0, y: 0, w: 1000, h: 410 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragRef = useRef<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    moved: boolean;
  } | null>(null);
  const mapSvgRef = useRef<SVGSVGElement | null>(null);
  const mapAreaRef = useRef<HTMLDivElement | null>(null);
  const busyRef = useRef<boolean>(false);

  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    text: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    text: '',
  });

  // Country index by ISO code
  const byCode = useMemo(() => {
    const map = new Map<string, WorldCountry>();
    for (const c of NT_WORLD) {
      if (c.code) {
        map.set(c.code, c);
      }
    }
    return map;
  }, []);

  const regionNames = useMemo(() => {
    try {
      return new Intl.DisplayNames(['es'], { type: 'region' });
    } catch {
      return null;
    }
  }, []);

  const countryName = useCallback(
    (code: string): string => {
      if (!code) return 'Sin datos';
      try {
        return regionNames?.of(code) || byCode.get(code)?.name || code;
      } catch {
        return byCode.get(code)?.name || code;
      }
    },
    [regionNames, byCode]
  );

  // Full list of ISO 3166-1 alpha-2 codes + NT_WORLD countries
  const countryOptions = useMemo(() => {
    const codes = new Set<string>(
      NT_WORLD.map((c) => c.code).filter((code) => Boolean(code))
    );
    for (let i = 65; i <= 90; i++) {
      for (let j = 65; j <= 90; j++) {
        const code = String.fromCharCode(i, j);
        if (
          ['AA', 'QM', 'QN', 'QP', 'QQ', 'QR', 'QS', 'QT', 'QU', 'QV', 'QW', 'QX', 'QY', 'QZ', 'XA', 'XB', 'XC', 'XD', 'XE', 'XF', 'XG', 'XH', 'XI', 'XJ', 'XK', 'XL', 'XM', 'XN', 'XO', 'XP', 'XQ', 'XR', 'XS', 'XT', 'XU', 'XV', 'XW', 'XX', 'XY', 'XZ', 'ZZ'].includes(
            code
          )
        ) {
          continue;
        }
        try {
          const label = regionNames?.of(code);
          if (label && label !== code && !/^[A-Z]{2}$/.test(label)) {
            codes.add(code);
          }
        } catch {
          // Ignore invalid region code
        }
      }
    }

    return [...codes]
      .filter((code) => Boolean(code))
      .map((code) => ({
        code,
        name: countryName(code),
        mapped: byCode.has(code),
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'es'));
  }, [byCode, countryName, regionNames]);

  const addLog = useCallback((msg: string) => {
    const t = new Date().toLocaleTimeString('es-ES', { hour12: false });
    setLogs((prev) => [{ t, msg }, ...prev].slice(0, 5));
  }, []);

  // Clamp ViewBox
  const clampViewBox = useCallback((next: ViewBoxState): ViewBoxState => {
    const w = Math.max(170, Math.min(1000, next.w));
    const h = w * 0.41;
    const x = Math.max(0, Math.min(1000 - w, next.x));
    const y = Math.max(0, Math.min(410 - h, next.y));
    return { x, y, w, h };
  }, []);

  const zoom = useCallback(
    (factor: number, cx?: number, cy?: number) => {
      setVb((prev) => {
        const centerX = cx ?? prev.x + prev.w / 2;
        const centerY = cy ?? prev.y + prev.h / 2;
        const nw = Math.max(170, Math.min(1000, prev.w * factor));
        const nh = nw * 0.41;
        const nx = centerX - ((centerX - prev.x) / prev.w) * nw;
        const ny = centerY - ((centerY - prev.y) / prev.h) * nh;
        return clampViewBox({ x: nx, y: ny, w: nw, h: nh });
      });
    },
    [clampViewBox]
  );

  const resetZoom = useCallback(() => {
    setVb({ x: 0, y: 0, w: 1000, h: 410 });
  }, []);

  // Attach non-passive wheel listener for Ctrl/Meta + wheel zoom
  useEffect(() => {
    const svg = mapSvgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      zoom(e.deltaY < 0 ? 0.82 : 1.22);
    };
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, [zoom]);

  const pointFor = useCallback(
    (
      item:
        | ConnectionSnapshot
        | { countryCode?: string; lat?: number | null; lon?: number | null }
        | null
    ): [number, number] | null => {
      if (!item) return null;
      if (
        Number.isFinite(item.lat) &&
        Number.isFinite(item.lon) &&
        item.lat !== null &&
        item.lon !== null
      ) {
        return proj(Number(item.lat), Number(item.lon));
      }
      const c = item.countryCode ? byCode.get(item.countryCode) : undefined;
      return c ? proj(c.lat, c.lon) : null;
    },
    [byCode]
  );

  // Real Live Connection Check via /api/connection
  // If the preview reverse proxy strips visitor IP headers, resolves visitor public IP first and passes it to /api/connection?ip=... so the backend uses IPINFO_TOKEN
  const checkLive = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setLiveErrorDetail(null);
    setNotice(
      'Verificando tu dirección IP pública y ubicación de salida en tiempo real...'
    );

    try {
      let res: Response | null = null;
      let data: any = {};
      try {
        res = await fetch('/api/connection', {
          headers: { accept: 'application/json' },
          cache: 'no-store',
        });
        data = await res.json().catch(() => ({}));
      } catch {
        res = null;
      }

      // If the preview proxy sent a local socket IP (400) or /api/connection is unavailable on a static host,
      // detect the visitor's real public IP and query /api/connection?ip=... or use the live payload directly
      if (!res || !res.ok || !data?.ip) {
        let detectedIp = '';
        let clientFallbackPayload: ConnectionSnapshot | null = null;

        try {
          const ipRes = await fetch('https://ipwho.is/', {
            headers: { accept: 'application/json' },
            cache: 'no-store',
          });
          if (ipRes.ok) {
            const ipJson = await ipRes.json();
            if (ipJson && ipJson.ip && ipJson.success !== false) {
              detectedIp = String(ipJson.ip).trim();
              const lat = Number(ipJson.latitude);
              const lon = Number(ipJson.longitude);
              clientFallbackPayload = {
                ip: detectedIp,
                countryCode: String(ipJson.country_code || '').toUpperCase(),
                city: ipJson.city || null,
                lat: Number.isFinite(lat) ? lat : null,
                lon: Number.isFinite(lon) ? lon : null,
                org:
                  ipJson.connection?.isp ||
                  ipJson.connection?.org ||
                  null,
                asn: ipJson.connection?.asn
                  ? `AS${ipJson.connection.asn}`
                  : null,
                anonymous:
                  ipJson.security &&
                  (typeof ipJson.security.vpn === 'boolean' ||
                    typeof ipJson.security.proxy === 'boolean' ||
                    typeof ipJson.security.tor === 'boolean' ||
                    typeof ipJson.security.hosting === 'boolean')
                    ? Boolean(
                        ipJson.security.vpn ||
                          ipJson.security.proxy ||
                          ipJson.security.tor ||
                          ipJson.security.hosting
                      )
                    : null,
                checkedAt: new Date().toISOString(),
              };
            }
          }
        } catch {
          // Try secondary public IP resolver
        }

        if (!detectedIp) {
          try {
            const ipifyRes = await fetch('https://api64.ipify.org?format=json', {
              cache: 'no-store',
            });
            if (ipifyRes.ok) {
              const ipifyJson = await ipifyRes.json();
              if (ipifyJson?.ip) {
                detectedIp = String(ipifyJson.ip).trim();
              }
            }
          } catch {
            // Ignore
          }
        }

        if (detectedIp) {
          try {
            res = await fetch(
              `/api/connection?ip=${encodeURIComponent(detectedIp)}`,
              {
                headers: { accept: 'application/json' },
                cache: 'no-store',
              }
            );
            data = await res.json().catch(() => ({}));
          } catch {
            res = null;
          }

          if ((!res || !res.ok || !data?.ip) && clientFallbackPayload) {
            data = clientFallbackPayload;
            res = new Response(JSON.stringify(data), { status: 200 });
          }
        }
      }

      if (!res || !res.ok) {
        throw new Error(data.error || `HTTP ${res?.status ?? 500}`);
      }

      setCurrent(data);
      setNotice(
        `Verificación en vivo completada: IP pública ${data.ip} localizada en ${
          data.city ? `${data.city}, ` : ''
        }${data.countryCode}.`
      );
      addLog(
        `Comprobación real: ${data.ip || 'IP'} (${data.countryCode || '??'})`
      );
    } catch (err: any) {
      setCurrent(null);
      const errMsg = err?.message || 'Error de conexión';
      setLiveErrorDetail(
        `No se pudo completar la verificación de red: ${errMsg}.`
      );
      setNotice(
        'No se pudo obtener la información de tu IP pública en este intento. Pulsa "Comprobar conexión" para reintentar.'
      );
      addLog(`Error en comprobación real: ${errMsg}`);
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }, [addLog]);

  // Run live verification automatically on mount
  useEffect(() => {
    checkLive();
  }, [checkLive]);

  // Periodic 30-second refresh when enabled
  useEffect(() => {
    if (!autoRefresh) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      checkLive();
    }, 30000);
    return () => window.clearInterval(timer);
  }, [autoRefresh, checkLive]);

  const handleSaveBaseline = () => {
    if (!current) return;
    setBaseline({ ...current });
    addLog(
      `Referencia guardada en memoria: ${current.ip} (${current.countryCode})`
    );
  };

  // Pointer drag handlers for pan
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    dragRef.current = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      vx: vb.x,
      vy: vb.y,
      moved: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragRef.current || dragRef.current.id !== e.pointerId) return;
    const svg = mapSvgRef.current;
    if (!svg) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;

    if (!dragRef.current.moved && Math.hypot(dx, dy) > 4) {
      dragRef.current.moved = true;
      setIsDragging(true);
      try {
        svg.setPointerCapture(e.pointerId);
      } catch {
        // Ignore pointer capture errors
      }
    }
    if (!dragRef.current.moved) return;

    const rect = svg.getBoundingClientRect();
    const nextX = dragRef.current.vx - (dx / rect.width) * vb.w;
    const nextY = dragRef.current.vy - (dy / rect.height) * vb.h;
    setVb((prev) => clampViewBox({ ...prev, x: nextX, y: nextY }));
  };

  const handlePointerUpOrCancel = () => {
    dragRef.current = null;
    setIsDragging(false);
  };

  const handleCountryClick = (code: string) => {
    if (dragRef.current?.moved || !code) return;
    setExpected(code);
    addLog(`País esperado seleccionado: ${countryName(code)} (${code})`);
  };

  const handleCountryMouseMove = (
    e: React.MouseEvent<SVGPathElement>,
    c: WorldCountry
  ) => {
    const area = mapAreaRef.current;
    if (!area) return;
    const r = area.getBoundingClientRect();
    const label = c.code ? `${countryName(c.code)} · ${c.code}` : c.name;
    setTooltip({
      visible: true,
      x: Math.min(r.width - 150, Math.max(8, e.clientX - r.left)),
      y: Math.max(28, e.clientY - r.top),
      text: label,
    });
  };

  // Derived states for UI
  const curPoint = pointFor(current);
  const basePoint = pointFor(baseline);
  const expCountry = expected ? byCode.get(expected) : undefined;
  const expPoint = expCountry ? proj(expCountry.lat, expCountry.lon) : null;

  let verdictText = busy ? 'Verificando…' : 'Sin verificar';
  let detailText =
    liveErrorDetail ||
    'Pulsa "Comprobar conexión" para consultar tu IP pública y país de salida actual.';
  let mapBadgeText = busy ? 'VERIFICANDO…' : 'Sin datos verificados';
  let vpnSignalText = '—';
  let diffSignalText = 'Sin referencia';

  if (current) {
    const cname = countryName(current.countryCode);
    const sameBase = baseline ? baseline.ip === current.ip : null;
    const matchExpected = expected ? current.countryCode === expected : null;

    if (current.anonymous === true) {
      vpnSignalText = 'Sí (VPN / Proxy / Hosting)';
    } else if (current.anonymous === false) {
      vpnSignalText = 'No detectado';
    } else {
      vpnSignalText = 'No reportado por plan actual';
    }

    if (baseline) {
      diffSignalText = sameBase
        ? 'Misma IP que la referencia'
        : `Cambió (${baseline.countryCode} → ${current.countryCode})`;
    }

    if (expected) {
      if (matchExpected) {
        verdictText = 'País coincidente';
        detailText = `La IP pública observada aparece en ${cname}, que coincide con el país esperado. Esto no certifica por sí solo el cifrado ni la ausencia de fugas DNS/WebRTC.`;
      } else {
        verdictText = 'País no coincidente';
        detailText = `La salida observada aparece en ${cname} (${current.countryCode}), mientras que seleccionaste ${countryName(expected)} (${expected}).`;
      }
    } else {
      verdictText = 'IP observada';
      detailText = `Tu conexión pública observada sale por ${cname}${
        current.city ? ` (${current.city})` : ''
      }. Selecciona un país esperado o guarda una referencia antes de conectar tu VPN para comparar cambios.`;
    }

    mapBadgeText = `EN VIVO · ${cname} (${current.countryCode})`;
  }

  const lastCheckedTime = current
    ? new Date(current.checkedAt || Date.now()).toLocaleTimeString('es-ES', {
        hour12: false,
      })
    : '—';

  const zoomRatio = (1000 / vb.w).toFixed(1);

  return (
    <section className="vpn-inspector" aria-label="NØTRACE VPN Inspector">
      {/* Header */}
      <div className="head">
        <div>
          <div className="kicker">HERRAMIENTAS / PRIVACIDAD</div>
          <h2 className="vpn-title">Inspección de conexión</h2>
          <p>
            Detecta tu dirección IP pública real, operador de red y país de
            salida actual, y compáralos antes y después de activar tu VPN.
          </p>
        </div>

        <div className="badge">VERIFICACIÓN REAL ACTIVA</div>
      </div>

      {/* Status Notice */}
      <div className="notice" role="status">
        {notice}
      </div>

      {/* Main Workspace: Cartographic Map + Verification Panel */}
      <div className="workspace">
        <div className="card mapcard">
          <div className="maphead">
            <div>
              <div className="label">MAPA DE OBSERVACIÓN</div>
              <div className="title">Ubicación aproximada de la IP pública</div>
            </div>
            <div className="badge">{mapBadgeText}</div>
          </div>

          <div className="maparea" ref={mapAreaRef}>
            <svg
              id="map"
              ref={mapSvgRef}
              viewBox={`${vb.x.toFixed(1)} ${vb.y.toFixed(1)} ${vb.w.toFixed(1)} ${vb.h.toFixed(1)}`}
              role="img"
              aria-label="Mapa mundial de verificación de salida IP"
              className={isDragging ? 'dragging' : ''}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUpOrCancel}
              onPointerCancel={handlePointerUpOrCancel}
            >
              <defs>
                <radialGradient id="ntVpnHalo" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.34" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Layer 1: Real Natural Earth Country Vectors */}
              <g id="countries">
                {NT_WORLD.map((c, idx) => {
                  const isObserved = Boolean(
                    c.code && current?.countryCode === c.code
                  );
                  const isExpected = Boolean(c.code && expected === c.code);
                  const cls = [
                    'country',
                    isObserved ? 'observed' : '',
                    isExpected ? 'expected' : '',
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <path
                      key={c.code || `${c.name}-${idx}`}
                      d={c.path}
                      data-code={c.code}
                      className={cls}
                      onMouseMove={(e) => handleCountryMouseMove(e, c)}
                      onMouseLeave={() =>
                        setTooltip((prev) => ({ ...prev, visible: false }))
                      }
                      onClick={() => handleCountryClick(c.code)}
                    />
                  );
                })}
              </g>

              {/* Layer 2: Geographic Comparison Arc (Route Flow) */}
              <g id="routes">
                {curPoint &&
                  basePoint &&
                  baseline &&
                  current &&
                  (baseline.ip !== current.ip ||
                    baseline.countryCode !== current.countryCode) &&
                  (() => {
                    const [x1, y1] = basePoint;
                    const [x2, y2] = curPoint;
                    const mx = (x1 + x2) / 2;
                    const my =
                      Math.min(y1, y2) -
                      Math.min(70, Math.hypot(x2 - x1, y2 - y1) * 0.22);
                    return (
                      <path
                        className="route"
                        d={`M${x1.toFixed(1)},${y1.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`}
                      />
                    );
                  })()}
              </g>

              {/* Layer 3: Dynamic Markers & Pulse Rings */}
              <g id="markers">
                {/* Expected Country Target Ring (when different from observed) */}
                {expPoint &&
                  (!current || current.countryCode !== expected) && (
                    <g
                      className="marker-in"
                      transform={`translate(${expPoint[0].toFixed(1)} ${expPoint[1].toFixed(1)})`}
                    >
                      <circle
                        r="5.5"
                        fill="none"
                        stroke="#bdbdbd"
                        strokeWidth="1.3"
                        strokeDasharray="2 2"
                      />
                      <text className="marker-sub" x="9" y="3">
                        Esperado: {expected}
                      </text>
                    </g>
                  )}

                {/* Reference Baseline Marker (when different from current) */}
                {basePoint &&
                  baseline &&
                  (!current ||
                    baseline.ip !== current.ip ||
                    baseline.countryCode !== current.countryCode) && (
                    <g
                      className="marker-in"
                      transform={`translate(${basePoint[0].toFixed(1)} ${basePoint[1].toFixed(1)})`}
                    >
                      <circle
                        r="4"
                        fill="#0a0a0a"
                        stroke="#a3a3a3"
                        strokeWidth="1.4"
                      />
                      <text className="marker-sub" x="8" y="3">
                        Referencia ({baseline.countryCode})
                      </text>
                    </g>
                  )}

                {/* Observed Exit IP Marker with Pulse Rings */}
                {curPoint &&
                  current &&
                  (() => {
                    const [x, y] = curPoint;
                    const right = x > 820;
                    const lx = right ? -10 : 10;
                    const anchor = right ? 'end' : 'start';
                    const place = current.city
                      ? `${current.city}, ${current.countryCode}`
                      : `${countryName(current.countryCode)} (${current.countryCode})`;

                    return (
                      <g
                        className="marker-in"
                        transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}
                      >
                        <circle r="22" fill="url(#ntVpnHalo)" />
                        <circle className="pulse" r="8" />
                        <circle className="pulse pulse2" r="8" />
                        <circle
                          r="4.2"
                          fill="#ffffff"
                          stroke="#050505"
                          strokeWidth="1.5"
                        />
                        <text
                          className="marker-label"
                          x={lx}
                          y="-2"
                          textAnchor={anchor}
                        >
                          {place}
                        </text>
                        <text
                          className="marker-sub"
                          x={lx}
                          y="9"
                          textAnchor={anchor}
                        >
                          {current.ip}
                        </text>
                      </g>
                    );
                  })()}
              </g>
            </svg>

            {/* Map Zoom Controls */}
            <div className="maptools" aria-label="Controles del mapa">
              <button
                type="button"
                onClick={() => zoom(0.78)}
                aria-label="Acercar mapa"
                title="Acercar"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => zoom(1.28)}
                aria-label="Alejar mapa"
                title="Alejar"
              >
                −
              </button>
              <button
                type="button"
                onClick={resetZoom}
                aria-label="Restablecer vista"
                title="Restablecer vista"
              >
                ⌖
              </button>
            </div>

            {/* Map Legend */}
            <div className="maplegend" aria-label="Leyenda">
              <span>
                <i className="dot live" /> IP observada
              </span>
              <span>
                <i className="dot target" /> País esperado
              </span>
              <span>
                <i className="line" /> Comparación visual
              </span>
            </div>

            {/* Hover Tooltip */}
            {tooltip.visible && (
              <div
                className="maptip"
                role="tooltip"
                style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
              >
                {tooltip.text}
              </div>
            )}
          </div>

          <div className="mapfoot">
            <span>
              Haz clic en un país para definirlo como país esperado de tu VPN.
              Arrastra el mapa cuando uses zoom.
            </span>
            <span className="mono">Zoom {zoomRatio}×</span>
          </div>
        </div>

        {/* Right Side Panel */}
        <aside className="side">
          <div className="card">
            <div className="label">RESULTADO DE VERIFICACIÓN</div>
            <div className="verdict">{verdictText}</div>
            <p className="muted" aria-live="polite">
              {detailText}
            </p>

            <label className="field">
              <span>País esperado en tu cliente VPN</span>
              <select
                value={expected}
                onChange={(e) => {
                  const val = e.target.value;
                  setExpected(val);
                  if (val) {
                    addLog(
                      `País esperado seleccionado: ${countryName(val)} (${val})`
                    );
                  } else {
                    addLog('País esperado limpiado');
                  }
                }}
              >
                <option value="">Sin país esperado</option>
                {countryOptions.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code}){c.mapped ? '' : ' · sin contorno'}
                  </option>
                ))}
              </select>
            </label>

            <div className="actions">
              <button
                type="button"
                className="btn primary"
                onClick={checkLive}
                disabled={busy}
              >
                {busy ? 'Comprobando…' : '↻ Comprobar conexión'}
              </button>
              <button
                type="button"
                className="btn"
                onClick={handleSaveBaseline}
                disabled={!current}
              >
                Guardar IP de referencia
              </button>
            </div>

            <label className="check">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              <span>Actualizar cada 30 segundos</span>
            </label>
          </div>

          <div className="card">
            <div className="label">SEÑALES DE RED</div>
            <dl className="kv">
              <div>
                <dt>VPN / proxy detectado</dt>
                <dd>{vpnSignalText}</dd>
              </div>
              <div>
                <dt>IP respecto a referencia</dt>
                <dd>{diffSignalText}</dd>
              </div>
              <div>
                <dt>Última comprobación</dt>
                <dd>{lastCheckedTime}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      {/* 4 Telemetry Data Cards */}
      <div className="stats" aria-label="Datos observados">
        <article className="card">
          <div className="label">IP PÚBLICA</div>
          <div className="stat mono">{current ? current.ip : '—'}</div>
          <div className="sub">
            {current
              ? `${ipFamily(current.ip)} · observada en tiempo real`
              : 'No disponible'}
          </div>
        </article>

        <article className="card">
          <div className="label">UBICACIÓN OBSERVADA</div>
          <div className="stat">
            {current
              ? `${countryName(current.countryCode)} (${current.countryCode})`
              : '—'}
          </div>
          <div className="sub">
            {current
              ? current.city
                ? `Ciudad aproximada: ${current.city}`
                : 'Nivel país · centro geográfico'
              : 'Sin geolocalización'}
          </div>
        </article>

        <article className="card">
          <div className="label">OPERADOR DE RED</div>
          <div className="stat">
            {current ? current.org || 'No disponible' : '—'}
          </div>
          <div className="sub mono">
            {current ? current.asn || 'ASN no reportado' : 'ASN —'}
          </div>
        </article>

        <article className="card">
          <div className="label">REFERENCIA DE SESIÓN</div>
          <div className="stat mono">
            {baseline ? `${baseline.ip} (${baseline.countryCode})` : 'No guardada'}
          </div>
          <div className="sub">
            {baseline
              ? `${countryName(baseline.countryCode)} · solo en memoria`
              : 'Se conserva solo en memoria'}
          </div>
        </article>
      </div>

      {/* Session Non-Persistent Log */}
      <div className="card log">
        <div className="loghead">
          <span className="label">Actividad de la sesión</span>
          <span className="label">LOCAL / NO PERSISTENTE</span>
        </div>
        <div className="entries">
          {logs.length > 0 ? (
            logs.map((entry, idx) => (
              <div className="entry" key={`${entry.t}-${idx}`}>
                <span>{entry.msg}</span>
                <span>{entry.t}</span>
              </div>
            ))
          ) : (
            <div className="entry">
              <span>Esperando primera comprobación de red...</span>
              <span>—</span>
            </div>
          )}
        </div>
      </div>

      {/* Modular Privacy Lab Architecture (Future-Ready Roadmap) */}
      <div className="card lab-roadmap" aria-label="Arquitectura modular Privacy Lab">
        <div className="loghead">
          <div>
            <span className="label">NØTRACE PRIVACY LAB · ARQUITECTURA MODULAR</span>
            <div className="title">Módulos de diagnóstico complementarios</div>
          </div>
          <span className="badge">HOJA DE RUTA TÉCNICA</span>
        </div>
        <p className="muted">
          Estos módulos están definidos en la arquitectura del laboratorio y se
          muestran desacoplados para no simular mediciones no ejecutadas en esta
          sesión.
        </p>
        <div className="lab-grid">
          {PRIVACY_LAB_MODULES.map((mod) => (
            <div className="lab-item" key={mod.id}>
              <div className="lab-item-head">
                <span className="lab-item-title">{mod.title}</span>
                <span className="lab-item-badge">{mod.status}</span>
              </div>
              <p className="lab-item-desc">{mod.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
