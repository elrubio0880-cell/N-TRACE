import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Player } from '@remotion/player';

export interface CourseMotionProps {
  theme: 'pentest' | 'vpn-tunnel' | 'server-grid' | 'zero-trust' | 'proxy-chain' | 'osint';
  title: string;
}

/**
 * Monochrome Domain-Specific Technical Course Cover Compositions (Section 12)
 * Creates specialized geometric & character-based monochrome diagrams per topic:
 * - pentest: ASCII silhouette & terminal HTTP/SYN inspection
 * - vpn-tunnel: Node topology & encrypted tunnel routing
 * - server-grid: Linux directory hierarchy & kernel filter layers
 * - proxy-chain: Multi-hop SOCKS5 request structure
 * - zero-trust: Layered concentric defensive shields & eBPF telemetry
 * - osint: Relational entity graph & certificate transparency nodes
 */
export const CourseTopologyRemotionScene: React.FC<CourseMotionProps> = ({ theme }) => {
  const frame = useCurrentFrame();
  const progress = (frame % 90) / 90;
  const pulse = interpolate(frame % 60, [0, 30, 60], [0.4, 1, 0.4]);
  const packetX = interpolate(progress, [0, 1], [75, 525]);

  const meta: Record<
    CourseMotionProps['theme'],
    { tag: string; code: string; spec: string }
  > = {
    pentest: {
      tag: 'OFFENSIVE SECURITY // SYN_AUDIT',
      code: '01',
      spec: 'TCP/IP · PAYLOAD · PRIVILEGE',
    },
    'vpn-tunnel': {
      tag: 'CRYPTOGRAPHY // MULTI-HOP',
      code: '02',
      spec: 'WIREGUARD · CHACHA20 · RFC8439',
    },
    'server-grid': {
      tag: 'LINUX INFRASTRUCTURE // HARDENING',
      code: '03',
      spec: 'KERNEL · NFTABLES · NAMESPACES',
    },
    'proxy-chain': {
      tag: 'ROUTING // SOCKS5_TOPOLOGY',
      code: '04',
      spec: 'PROXYCHAINS · DNS_REMOTE · TUNNEL',
    },
    'zero-trust': {
      tag: 'DEFENSIVE SOC // EBPF_TELEMETRY',
      code: '05',
      spec: 'SYSCALLS · MEMORY · CONTAINMENT',
    },
    osint: {
      tag: 'INTELLIGENCE // ENTITY_GRAPH',
      code: '06',
      spec: 'CT_LOGS · ASN_MAP · OPSEC',
    },
  };

  const current = meta[theme] || meta.pentest;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0A0A',
        color: '#FFFFFF',
        fontFamily: "'JetBrains Mono', monospace",
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Subtle Monochrome Technical Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Specification Header */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 10,
          color: '#A3A3A3',
          borderBottom: '1px solid #2E2E2E',
          paddingBottom: 8,
        }}
      >
        <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{current.tag}</span>
        <span>MOD_{current.code}</span>
      </div>

      {/* Specialized Technical Graphic per Theme */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {theme === 'pentest' && (
          <svg viewBox="0 0 600 130" style={{ width: '100%', height: '100%' }}>
            {/* Terminal Window & ASCII Silhouette */}
            <rect
              x="55"
              y="18"
              width="210"
              height="94"
              rx="4"
              fill="#000000"
              stroke="#404040"
              strokeWidth="1.2"
            />
            <text x="70" y="42" fill="#FFFFFF" fontSize="10" fontFamily="JetBrains Mono">
              $ nmap -sS -T2 10.14.88.24
            </text>
            <text x="70" y="62" fill="#A3A3A3" fontSize="9.5" fontFamily="JetBrains Mono">
              PORT     STATE SERVICE
            </text>
            <text x="70" y="80" fill="#FFFFFF" fontSize="9.5" fontFamily="JetBrains Mono">
              443/tcp  open  tls/nginx
            </text>
            <text x="70" y="96" fill="#737373" fontSize="9.5" fontFamily="JetBrains Mono">
              8443/tcp open  auth-gw
            </text>

            <line
              x1="265"
              y1="65"
              x2="415"
              y2="65"
              stroke="#404040"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />
            <circle cx={265 + progress * 150} cy="65" r="4" fill="#FFFFFF" />

            <rect
              x="415"
              y="26"
              width="130"
              height="78"
              rx="4"
              fill="#121212"
              stroke="#FFFFFF"
              strokeWidth="1.2"
            />
            <text
              x="480"
              y="58"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="10"
              fontFamily="JetBrains Mono"
            >
              [TARGET_NODE]
            </text>
            <text
              x="480"
              y="76"
              textAnchor="middle"
              fill="#A3A3A3"
              fontSize="9"
              fontFamily="JetBrains Mono"
            >
              10.14.88.24:8443
            </text>
          </svg>
        )}

        {theme === 'vpn-tunnel' && (
          <svg viewBox="0 0 600 130" style={{ width: '100%', height: '100%' }}>
            {/* Encrypted Tunnel Cylinder / Multi-Hop */}
            <rect
              x="145"
              y="38"
              width="310"
              height="54"
              rx="27"
              fill="rgba(255,255,255,0.03)"
              stroke="#2E2E2E"
              strokeWidth="1"
              strokeDasharray="6 4"
            />
            <line x1="75" y1="65" x2="525" y2="65" stroke="#404040" strokeWidth="1.5" />
            <circle cx={packetX} cy="65" r="5" fill="#FFFFFF" />
            {[
              { x: 75, label: 'ORIGIN' },
              { x: 225, label: 'WG0_CH' },
              { x: 375, label: 'RELAY_IS' },
              { x: 525, label: 'EXIT_PA' },
            ].map((n) => (
              <g key={n.label} transform={`translate(${n.x}, 65)`}>
                <circle cx="0" cy="0" r="14" fill="#000000" stroke="#FFFFFF" strokeWidth="1.3" />
                <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
                <text
                  x="0"
                  y="30"
                  textAnchor="middle"
                  fill="#A3A3A3"
                  fontSize="9.5"
                  fontFamily="JetBrains Mono"
                >
                  {n.label}
                </text>
              </g>
            ))}
          </svg>
        )}

        {theme === 'server-grid' && (
          <svg viewBox="0 0 600 130" style={{ width: '100%', height: '100%' }}>
            {/* Linux Kernel & File Tree Structure */}
            {[
              { x: 110, title: '/etc/nftables', sub: 'policy drop' },
              { x: 300, title: '/proc/sys/net', sub: 'rp_filter = 1' },
              { x: 490, title: 'mTLS_BASTION', sub: 'ED25519_FIDO2' },
            ].map((box, i) => (
              <g key={box.title} transform={`translate(${box.x}, 65)`}>
                <rect
                  x="-72"
                  y="-30"
                  width="144"
                  height="60"
                  rx="6"
                  fill="#000000"
                  stroke={i === 1 ? '#FFFFFF' : '#404040'}
                  strokeWidth="1.2"
                />
                <text
                  x="0"
                  y="-6"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                >
                  {box.title}
                </text>
                <text
                  x="0"
                  y="14"
                  textAnchor="middle"
                  fill="#737373"
                  fontSize="9.5"
                  fontFamily="JetBrains Mono"
                >
                  {box.sub}
                </text>
              </g>
            ))}
            <line x1="182" y1="65" x2="228" y2="65" stroke="#525252" strokeWidth="1.2" />
            <line x1="372" y1="65" x2="418" y2="65" stroke="#525252" strokeWidth="1.2" />
          </svg>
        )}

        {(theme === 'proxy-chain' || theme === 'zero-trust' || theme === 'osint') && (
          <svg viewBox="0 0 600 130" style={{ width: '100%', height: '100%' }}>
            {/* Concentric Graph / Node Matrix */}
            <line x1="110" y1="65" x2="300" y2="30" stroke="#404040" strokeWidth="1.2" />
            <line x1="110" y1="65" x2="300" y2="100" stroke="#404040" strokeWidth="1.2" />
            <line x1="300" y1="30" x2="490" y2="65" stroke="#404040" strokeWidth="1.2" />
            <line x1="300" y1="100" x2="490" y2="65" stroke="#404040" strokeWidth="1.2" />
            <line
              x1="300"
              y1="30"
              x2="300"
              y2="100"
              stroke="#2E2E2E"
              strokeWidth="1"
              strokeDasharray="3 3"
            />

            <circle
              cx="300"
              cy="65"
              r="26"
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1"
              opacity={pulse}
            />

            {[
              { x: 110, y: 65, label: theme === 'osint' ? 'CT_LOG' : 'INGRESS' },
              { x: 300, y: 30, label: theme === 'osint' ? 'ASN_NODE' : 'HOP_01' },
              { x: 300, y: 100, label: theme === 'osint' ? 'TLS_HASH' : 'HOP_02' },
              { x: 490, y: 65, label: theme === 'osint' ? 'VERIFIED' : 'REMOTE_OUT' },
            ].map((pt) => (
              <g key={pt.label} transform={`translate(${pt.x}, ${pt.y})`}>
                <rect
                  x="-42"
                  y="-13"
                  width="84"
                  height="26"
                  rx="4"
                  fill="#000000"
                  stroke="#FFFFFF"
                  strokeWidth="1.1"
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="9.5"
                  fontFamily="JetBrains Mono"
                >
                  {pt.label}
                </text>
              </g>
            ))}
          </svg>
        )}
      </div>

      {/* Bottom Technical Specification Footer */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 9.5,
          color: '#737373',
          borderTop: '1px solid #171717',
          paddingTop: 6,
        }}
      >
        <span>{current.spec}</span>
        <span>NØTRACE // LAB</span>
      </div>
    </AbsoluteFill>
  );
};

export const CourseMotionRemotionPlayer: React.FC<
  CourseMotionProps & { showControls?: boolean; autoPlay?: boolean }
> = ({ theme, title, showControls = false, autoPlay = false }) => {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-[#2E2E2E] bg-[#0A0A0A]">
      <Player
        component={CourseTopologyRemotionScene}
        inputProps={{ theme, title }}
        durationInFrames={90}
        compositionWidth={600}
        compositionHeight={185}
        fps={30}
        autoPlay={autoPlay}
        loop
        controls={showControls}
        style={{ width: '100%', height: 'auto', aspectRatio: '600 / 185' }}
      />
    </div>
  );
};
