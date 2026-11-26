import { isIP } from 'node:net';

function getToken() {
  return (
    process.env.IPINFO_TOKEN ||
    process.env.IPINFO_API_KEY ||
    process.env.VITE_IPINFO_TOKEN ||
    ''
  ).trim();
}

function getPlan() {
  return (process.env.IPINFO_PLAN || 'lite').trim().toLowerCase();
}

function cleanIP(raw = '') {
  let s = String(raw).trim();
  if (!s) return '';
  if (s.startsWith('[')) {
    const endIdx = s.indexOf(']');
    if (endIdx > 1) {
      s = s.slice(1, endIdx);
    }
  } else if (s.split(':').length === 2 && s.includes('.')) {
    s = s.split(':')[0];
  }
  const ip = s.replace(/^::ffff:/i, '').split('%')[0];
  return isIP(ip) ? ip : '';
}

function nonPublic(ip) {
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

function extractHeaderIP(val) {
  if (!val) return '';
  const raw = Array.isArray(val) ? val.join(',') : String(val);
  for (const part of raw.split(',')) {
    const cleaned = cleanIP(part);
    if (cleaned && !nonPublic(cleaned)) {
      return cleaned;
    }
  }
  return '';
}

function resolveClientIP(req) {
  const queryIpRaw = typeof req.query?.ip === 'string' ? req.query.ip : '';
  if (queryIpRaw) {
    const cleanedQuery = cleanIP(queryIpRaw);
    if (cleanedQuery && !nonPublic(cleanedQuery)) {
      return cleanedQuery;
    }
  }

  const headers = req.headers || {};
  const candidates = [
    headers['x-notrace-client-ip'],
    headers['x-vercel-forwarded-for'],
    headers['x-forwarded-for'],
    headers['x-real-ip'],
    headers['cf-connecting-ip'],
    headers['true-client-ip'],
  ];

  for (const h of candidates) {
    const found = extractHeaderIP(h);
    if (found) return found;
  }

  return cleanIP(req.socket?.remoteAddress || '');
}

function normalizeIpinfoPayload(d, fallbackIp) {
  const loc = d.geo?.location || d.loc || '';
  let [lat, lon] = String(loc).split(',').map(Number);

  if (!Number.isFinite(lat) && Number.isFinite(Number(d.latitude))) {
    lat = Number(d.latitude);
  }
  if (!Number.isFinite(lon) && Number.isFinite(Number(d.longitude))) {
    lon = Number(d.longitude);
  }

  let asn =
    d.as?.asn || d.asn?.asn || (typeof d.asn === 'string' ? d.asn : null);
  let org =
    d.as?.name || d.as_name || d.asn?.name || d.company?.name || null;

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

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  const ip = resolveClientIP(req);
  if (nonPublic(ip)) {
    res.status(400).json({
      error: 'El servidor recibió una IP local o privada sin cabecera pública.',
      code: 'LOCAL_OR_PRIVATE_IP',
    });
    return;
  }

  const token = getToken();
  const plan = getPlan();

  if (token) {
    const core = plan === 'core' || plan === 'plus';
    const urls = [
      `https://ipinfo.io/${encodeURIComponent(ip)}/json?token=${encodeURIComponent(token)}`,
      `https://api.ipinfo.io/${core ? 'lookup' : 'lite'}/${encodeURIComponent(ip)}?token=${encodeURIComponent(token)}`,
    ];

    for (const url of urls) {
      try {
        const r = await fetch(url, {
          headers: { accept: 'application/json' },
          signal: AbortSignal.timeout(8000),
        });
        if (r.ok) {
          const d = await r.json();
          if (d && (d.ip || d.country || d.country_code)) {
            res.status(200).json(normalizeIpinfoPayload(d, ip));
            return;
          }
        }
      } catch {
        // Continue to next endpoint
      }
    }
  }

  try {
    const fallbackRes = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    });
    const d = await fallbackRes.json();
    if (!fallbackRes.ok || !d || d.success === false) {
      throw new Error('Fallback provider failed');
    }

    const lat = Number(d.latitude);
    const lon = Number(d.longitude);

    res.status(200).json({
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
    });
  } catch {
    res.status(502).json({
      error: 'El proveedor de verificación IP devolvió un error.',
    });
  }
}
