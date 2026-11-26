import React from 'react';

export type CurrencyType = 'NOBYTE' | 'NOCORE';

export interface CurrencyIconProps {
  size?: number;
  animated?: boolean;
  variant?: 'default' | 'detailed' | 'minimal';
  className?: string;
}

/**
 * NØBYTE — Educational & Participation Currency Icon
 * Hexagonal obsidian-metallic geometry with silver-gray edge (#626262 -> #B3B3B3)
 * and dual binary block symbol (#E5E5E5) at the center.
 */
export const ByteIcon: React.FC<CurrencyIconProps> = ({
  size = 24,
  animated = false,
  variant = 'default',
  className = '',
}) => {
  const uid = React.useId().replace(/:/g, '');
  const isDetailed = variant === 'detailed' || size >= 40;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`nt-currency-svg nt-byte-svg ${animated ? 'is-animated' : ''} ${className}`}
      aria-label="NØBYTE"
      role="img"
    >
      <defs>
        <linearGradient id={`byte-body-${uid}`} x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2A2A2A" />
          <stop offset="50%" stopColor="#161616" />
          <stop offset="100%" stopColor="#0D0D0D" />
        </linearGradient>
        <linearGradient id={`byte-edge-${uid}`} x1="10" y1="4" x2="54" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#B3B3B3" />
          <stop offset="45%" stopColor="#626262" />
          <stop offset="100%" stopColor="#3A3A3A" />
        </linearGradient>
        <linearGradient id={`byte-sheen-${uid}`} x1="16" y1="12" x2="48" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Outer Hexagonal Metallic Frame */}
      <polygon
        points="32,4 56,18 56,46 32,60 8,46 8,18"
        fill={`url(#byte-body-${uid})`}
        stroke={`url(#byte-edge-${uid})`}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />

      {/* Inner Precision Bevel Hexagon */}
      <polygon
        points="32,10 50,21 50,43 32,54 14,43 14,21"
        fill="#111111"
        stroke="#383838"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {isDetailed && (
        <>
          {/* Subtle Corner Technical Nodes */}
          <line x1="32" y1="4" x2="32" y2="10" stroke="#737373" strokeWidth="1.2" />
          <line x1="32" y1="54" x2="32" y2="60" stroke="#737373" strokeWidth="1.2" />
          <line x1="8" y1="18" x2="14" y2="21.5" stroke="#525252" strokeWidth="1" />
          <line x1="56" y1="18" x2="50" y2="21.5" stroke="#525252" strokeWidth="1" />
          <line x1="8" y1="46" x2="14" y2="42.5" stroke="#525252" strokeWidth="1" />
          <line x1="56" y1="46" x2="50" y2="42.5" stroke="#525252" strokeWidth="1" />
        </>
      )}

      {/* Dual Binary Data Blocks (Core NØBYTE Emblem) */}
      <g className={animated ? 'nt-byte-blocks' : ''}>
        {/* Left Binary Block */}
        <rect
          x="20"
          y="21"
          width="9"
          height="22"
          rx="1.5"
          fill="#E5E5E5"
        />
        <rect
          x="22.5"
          y="25"
          width="4"
          height="5"
          fill="#111111"
        />
        <rect
          x="22.5"
          y="34"
          width="4"
          height="5"
          fill="#111111"
        />

        {/* Right Binary Block (Offset Precision Unit) */}
        <rect
          x="35"
          y="21"
          width="9"
          height="13"
          rx="1.5"
          fill="#B3B3B3"
        />
        <rect
          x="35"
          y="37"
          width="9"
          height="6"
          rx="1.5"
          fill="#E5E5E5"
        />

        {/* Center Bus Bridge */}
        <line
          x1="29"
          y1="32"
          x2="35"
          y2="32"
          stroke="#B3B3B3"
          strokeWidth="2"
        />
      </g>

      {/* Top Metallic Sheen */}
      <polygon
        points="32,10 50,21 32,32 14,21"
        fill={`url(#byte-sheen-${uid})`}
        pointerEvents="none"
      />
    </svg>
  );
};

/**
 * NØCORE — Premium Commercial & Infrastructure Currency Icon
 * Octagonal faceted processor core with luminous white/silver finish (#BFBFBF -> #FFFFFF)
 * and geometric Ø emblem at the nucleus.
 */
export const CoreIcon: React.FC<CurrencyIconProps> = ({
  size = 24,
  animated = false,
  variant = 'default',
  className = '',
}) => {
  const uid = React.useId().replace(/:/g, '');
  const isDetailed = variant === 'detailed' || size >= 40;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`nt-currency-svg nt-core-svg ${animated ? 'is-animated' : ''} ${className}`}
      aria-label="NØCORE"
      role="img"
    >
      <defs>
        <linearGradient id={`core-body-${uid}`} x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B3B3B" />
          <stop offset="48%" stopColor="#1C1C1C" />
          <stop offset="100%" stopColor="#0E0E0E" />
        </linearGradient>
        <linearGradient id={`core-edge-${uid}`} x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#BFBFBF" />
          <stop offset="100%" stopColor="#6E6E6E" />
        </linearGradient>
        <radialGradient id={`core-glow-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.32" />
          <stop offset="65%" stopColor="#FFFFFF" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer Faceted Octagon Frame */}
      <polygon
        points="21,4 43,4 60,21 60,43 43,60 21,60 4,43 4,21"
        fill={`url(#core-body-${uid})`}
        stroke={`url(#core-edge-${uid})`}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />

      {/* Processor Architecture Facet Lines */}
      {isDetailed && (
        <g stroke="#525252" strokeWidth="1.1">
          <line x1="21" y1="4" x2="25" y2="13" />
          <line x1="43" y1="4" x2="39" y2="13" />
          <line x1="60" y1="21" x2="51" y2="25" />
          <line x1="60" y1="43" x2="51" y2="39" />
          <line x1="43" y1="60" x2="39" y2="51" />
          <line x1="21" y1="60" x2="25" y2="51" />
          <line x1="4" y1="43" x2="13" y2="39" />
          <line x1="4" y1="21" x2="13" y2="25" />
        </g>
      )}

      {/* Inner Octagonal Chamber */}
      <polygon
        points="25,12 39,12 52,25 52,39 39,52 25,52 12,39 12,25"
        fill="#141414"
        stroke="#8C8C8C"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />

      {/* Luminous Core Halo */}
      <circle cx="32" cy="32" r="20" fill={`url(#core-glow-${uid})`} />

      {/* Geometric Precision Ring */}
      <circle
        cx="32"
        cy="32"
        r="14.5"
        stroke="#BFBFBF"
        strokeWidth="1.1"
        strokeDasharray={isDetailed ? '5 3' : undefined}
        className={animated ? 'nt-core-ring' : ''}
      />

      {/* Central NØCORE Emblem: Precision Ø Nucleus */}
      <g className={animated ? 'nt-core-nucleus' : ''}>
        <circle
          cx="32"
          cy="32"
          r="9"
          fill="#1B1B1B"
          stroke="#FFFFFF"
          strokeWidth="2.6"
        />
        <line
          x1="24"
          y1="40"
          x2="40"
          y2="24"
          stroke="#FFFFFF"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <circle cx="32" cy="32" r="2.6" fill="#FFFFFF" />
      </g>
    </svg>
  );
};

export const CurrencyIcon: React.FC<{
  currency: CurrencyType;
  size?: number;
  animated?: boolean;
  variant?: 'default' | 'detailed' | 'minimal';
  className?: string;
}> = ({ currency, size = 20, animated = false, variant = 'default', className = '' }) => {
  return currency === 'NOCORE' ? (
    <CoreIcon size={size} animated={animated} variant={variant} className={className} />
  ) : (
    <ByteIcon size={size} animated={animated} variant={variant} className={className} />
  );
};

export const CurrencyAmount: React.FC<{
  currency: CurrencyType;
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  plusSign?: boolean;
  className?: string;
}> = ({
  currency,
  amount,
  size = 'md',
  showName = true,
  plusSign = false,
  className = '',
}) => {
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 26 : 20;
  const textClass =
    size === 'sm'
      ? 'text-xs'
      : size === 'lg'
      ? 'text-xl font-bold'
      : 'text-sm font-semibold';

  const label = currency === 'NOCORE' ? 'NØCORE' : 'NØBYTE';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono tabular-nums text-white whitespace-nowrap ${textClass} ${className}`}
    >
      <CurrencyIcon currency={currency} size={iconSize} />
      <span>
        {plusSign && amount > 0 ? '+' : ''}
        {amount.toLocaleString('es-ES')}
      </span>
      {showName && (
        <span className="text-[0.85em] font-medium text-[#A3A3A3]">{label}</span>
      )}
    </span>
  );
};

export const CurrencyBadge: React.FC<{
  currency: CurrencyType;
  amount?: number;
  label?: string;
  onClick?: () => void;
  className?: string;
}> = ({ currency, amount, label, onClick, className = '' }) => {
  const name = currency === 'NOCORE' ? 'NØCORE' : 'NØBYTE';
  const borderClass =
    currency === 'NOCORE'
      ? 'border-[#525252] bg-[#141414] hover:border-[#BFBFBF]'
      : 'border-[#2E2E2E] bg-[#111111] hover:border-[#737373]';

  const content = (
    <>
      <CurrencyIcon currency={currency} size={16} />
      {typeof amount === 'number' && (
        <span className="font-mono font-semibold text-white tabular-nums">
          {amount.toLocaleString('es-ES')}
        </span>
      )}
      <span className="text-[11px] font-mono text-[#A3A3A3]">
        {label || name}
      </span>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0 ${borderClass} ${className}`}
      >
        {content}
      </button>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs whitespace-nowrap shrink-0 ${borderClass} ${className}`}
    >
      {content}
    </span>
  );
};

export type OperatorRankId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const RankInsignia: React.FC<{
  rankNumber: OperatorRankId;
  size?: number;
  active?: boolean;
}> = ({ rankNumber, size = 36, active = false }) => {
  const strokeColor = active ? '#FFFFFF' : '#737373';
  const fillBg = active ? '#171717' : '#0D0D0D';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer Geometric Shield / Frame */}
      <polygon
        points="24,3 43,12 43,32 24,45 5,32 5,12"
        fill={fillBg}
        stroke={strokeColor}
        strokeWidth={active ? '2' : '1.4'}
        strokeLinejoin="round"
      />
      {/* Rank Tier Chevrons / Nucleus */}
      {rankNumber >= 1 && (
        <path
          d="M15 28 L24 21 L33 28"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {rankNumber >= 2 && (
        <path
          d="M15 22 L24 15 L33 22"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {rankNumber >= 4 && (
        <polygon
          points="24,10 30,15 24,20 18,15"
          fill={active ? '#FFFFFF' : 'none'}
          stroke={strokeColor}
          strokeWidth="1.4"
        />
      )}
      {rankNumber >= 6 && (
        <circle
          cx="24"
          cy="33"
          r="3.2"
          fill={active ? '#FFFFFF' : strokeColor}
        />
      )}
      {rankNumber === 7 && (
        <circle
          cx="24"
          cy="24"
          r="14"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeDasharray="3 2"
        />
      )}
    </svg>
  );
};
