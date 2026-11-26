import 'dotenv/config';
import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { isIP } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const hits = new Map<string, number>();

function getToken(): string {
  return (
    process.env.IPINFO_TOKEN ||
    process.env.IPINFO_API_KEY ||
    process.env.VITE_IPINFO_TOKEN ||
    ''
  ).trim();
}

function getPlan(): string {
  return (process.env.IPINFO_PLAN || 'lite').trim().toLowerCase();
}

function getTrustedSet(): Set<string> {
  return new Set(
    (process.env.TRUST_PROXY_IPS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  );
}

function cleanIP(raw = ''): string {
  let s = String(raw).trim();
  if (!s) return '';
  // Handle RFC 7239 / bracketed IPv6 or IPv4:port
  if (s.startsWith('[')) {
    const endIdx = s.indexOf(']');
    if (endIdx > 1) {
      s = s.slice(1, endIdx);
    }
  } else if (s.split(':').length === 2 && s.includes('.')) {
    // IPv4:port
    s = s.split(':')[0];
  }
  const ip = s.replace(/^::ffff:/i, '').split('%')[0];
  return isIP(ip) ? ip : '';
}

function nonPublic(ip: string): boolean {
  if (!ip) return true;
  if (ip === '::1') return true;
  if (/^(fc|fd|fe80:)/i.test(ip)) return true;
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return false;
  const [a, b, c] = parts;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0 && c === 2) ||
    (a === 198 && (b === 18 || b === 19)) ||
    (a === 198 && b === 51 && c === 100) ||
    (a === 203 && b === 0 && c === 113) ||
    a >= 224
  );
}

function extractHeaderIP(val: string | string[] | undefined): string {
  if (!val) return '';
  const raw = Array.isArray(val) ? val.join(',') : val;
  const parts = raw.split(',');
  for (const part of parts) {
    const cleaned = cleanIP(part);
    if (cleaned && !nonPublic(cleaned)) {
      return cleaned;
    }
  }
  return '';
}

function clientIP(req: Request): string {
  const peer = cleanIP(req.socket.remoteAddress || '');
  const trusted = getTrustedSet();

  // 1. Explicit query parameter ?ip=... (validated as a real public IP)
  const queryIpRaw = typeof req.query.ip === 'string' ? req.query.ip : '';
  if (queryIpRaw) {
    const cleanedQueryIp = cleanIP(queryIpRaw);
    if (cleanedQueryIp && !nonPublic(cleanedQueryIp)) {
      return cleanedQueryIp;
    }
  }

  // 2. If peer is explicitly trusted in TRUST_PROXY_IPS, honor x-notrace-client-ip
  if (trusted.has(peer)) {
    const forwarded = extractHeaderIP(req.headers['x-notrace-client-ip']);
    if (forwarded) return forwarded;
  }

  // 3. When running behind Cloud Run / reverse proxy where immediate peer is loopback/private
  if (!peer || nonPublic(peer)) {
    const headerCandidates = [
      req.headers['x-notrace-client-ip'],
      req.headers['x-forwarded-for'],
      req.headers['x-real-ip'],
      req.headers['cf-connecting-ip'],
      req.headers['fastly-client-ip'],
      req.headers['x-client-ip'],
      req.headers['true-client-ip'],
    ];

    for (const h of headerCandidates) {
      const candidate = extractHeaderIP(h);
      if (candidate) return candidate;
    }

    // Parse standard RFC 7239 Forwarded: for=...
    const stdForwarded = req.headers['forwarded'];
    const rawForwarded = Array.isArray(stdForwarded)
      ? stdForwarded[0]
      : stdForwarded;
    if (rawForwarded) {
      const matches = rawForwarded.match(/for=["']?([^;"',\s]+)/gi) || [];
      for (const m of matches) {
        const val = m.replace(/^for=["']?/i, '');
        const cleaned = cleanIP(val);
        if (cleaned && !nonPublic(cleaned)) {
          return cleaned;
        }
      }
    }
  }

  return peer;
}

function rateLimit(key: string): boolean {
  const now = Date.now();
  if (hits.size > 10000) {
    for (const [k, t] of hits) {
      if (now - t > 60000) hits.delete(k);
    }
  }
  const prev = hits.get(key) || 0;
  // 1.5s cooldown per IP to avoid blocking immediate user retries while preventing abuse
  if (now - prev < 1500) return false;
  hits.set(key, now);
  return true;
}

function normalizeIpinfoPayload(d: any, fallbackIp: string) {
  const loc = d.geo?.location || d.loc || '';
  let [lat, lon] = String(loc).split(',').map(Number);

  if (!Number.isFinite(lat) && Number.isFinite(Number(d.latitude))) {
    lat = Number(d.latitude);
  }
  if (!Number.isFinite(lon) && Number.isFinite(Number(d.longitude))) {
    lon = Number(d.longitude);
  }

  // Parse ASN and Org from either v2/lite object or classic ipinfo.io/ip/json format (e.g. org: "AS15169 Google LLC")
  let asn: string | null = d.as?.asn || d.asn?.asn || (typeof d.asn === 'string' ? d.asn : null);
  let org: string | null = d.as?.name || d.as_name || d.asn?.name || d.company?.name || null;

  if (!org && typeof d.org === 'string') {
    const orgMatch = d.org.match(/^(AS\d+)\s+(.+)$/i);
    if (orgMatch) {
      if (!asn) asn = orgMatch[1].toUpperCase();
      org = orgMatch[2].trim();
    } else {
      org = d.org;
    }
  }

  const anonymous =
    typeof d.is_anonymous === 'boolean'
      ? d.is_anonymous
      : typeof d.privacy?.vpn === 'boolean' ||
        typeof d.privacy?.proxy === 'boolean' ||
        typeof d.privacy?.tor === 'boolean' ||
        typeof d.privacy?.relay === 'boolean' ||
        typeof d.privacy?.hosting === 'boolean'
      ? Boolean(
          d.privacy.vpn ||
            d.privacy.proxy ||
            d.privacy.tor ||
            d.privacy.relay ||
            d.privacy.hosting
        )
      : null;

  return {
    ip: d.ip || fallbackIp,
    countryCode: String(
      d.country_code || d.geo?.country_code || d.country || ''
    ).toUpperCase(),
    city: d.geo?.city || d.city || null,
    lat: Number.isFinite(lat) ? lat : null,
    lon: Number.isFinite(lon) ? lon : null,
    org: org || null,
    asn: asn || null,
    anonymous,
    checkedAt: new Date().toISOString(),
  };
}

async function lookup(ip: string) {
  const token = getToken();
  const plan = getPlan();

  if (token) {
    const core = plan === 'core' || plan === 'plus';
    const urlsToTry = [
      // Standard IPinfo JSON endpoint (supports city, loc, org, country on all tokens)
      `https://ipinfo.io/${encodeURIComponent(ip)}/json?token=${encodeURIComponent(token)}`,
      // New IPinfo v2 Lite / Core API endpoint
      `https://api.ipinfo.io/${core ? 'lookup' : 'lite'}/${encodeURIComponent(ip)}?token=${encodeURIComponent(token)}`,
    ];

    for (const url of urlsToTry) {
      try {
        const res = await fetch(url, {
          headers: { accept: 'application/json' },
          signal: AbortSignal.timeout(8000),
        });
        if (res.ok) {
          const d: any = await res.json();
          if (d && (d.ip || d.country || d.country_code)) {
            return normalizeIpinfoPayload(d, ip);
          }
        }
      } catch {
        // Continue to next endpoint candidate
      }
    }
  }

  // Fallback server-side lookup by explicit visitor IP
  const fallbackUrl = `https://ipwho.is/${encodeURIComponent(ip)}`;
  const res = await fetch(fallbackUrl, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) {
    throw new Error(`Provider HTTP ${res.status}`);
  }

  const d: any = await res.json();
  if (!d || d.success === false) {
    throw new Error('Provider lookup failed');
  }

  const lat = Number(d.latitude);
  const lon = Number(d.longitude);

  return {
    ip: d.ip || ip,
    countryCode: String(d.country_code || '').toUpperCase(),
    city: d.city || null,
    lat: Number.isFinite(lat) ? lat : null,
    lon: Number.isFinite(lon) ? lon : null,
    org: d.connection?.isp || d.connection?.org || null,
    asn: d.connection?.asn ? `AS${d.connection.asn}` : null,
    anonymous:
      d.security &&
      (typeof d.security.vpn === 'boolean' ||
        typeof d.security.proxy === 'boolean' ||
        typeof d.security.tor === 'boolean' ||
        typeof d.security.hosting === 'boolean')
        ? Boolean(
            d.security.vpn ||
              d.security.proxy ||
              d.security.tor ||
              d.security.hosting
          )
        : null,
    checkedAt: new Date().toISOString(),
  };
}

async function startServer() {
  const app = express();
  app.disable('x-powered-by');

  app.get('/api/connection', async (req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    const ip = clientIP(req);
    if (!rateLimit(ip || 'unknown')) {
      res.status(429).json({
        error: 'Espera un momento antes de volver a comprobar.',
      });
      return;
    }

    if (nonPublic(ip)) {
      res.status(400).json({
        error:
          'El servidor recibió una IP local o privada sin cabecera pública.',
        code: 'LOCAL_OR_PRIVATE_IP',
      });
      return;
    }

    try {
      const payload = await lookup(ip);
      res.status(200).json(payload);
    } catch {
      res.status(502).json({
        error: 'El proveedor de verificación IP devolvió un error.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NØTRACE server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
