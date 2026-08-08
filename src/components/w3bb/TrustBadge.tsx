import React from 'react';

/**
 * Premium "TRUST-APPROVED" seal — pure SVG/CSS with gold gradient and glow.
 */
export const TrustBadge: React.FC = () => (
  <div className="relative mx-auto grid w-full max-w-sm place-items-center">
    <span
      className="pointer-events-none absolute h-64 w-64 rounded-full bg-gold/25 blur-[80px]"
      aria-hidden="true"
    />
    <svg
      viewBox="0 0 260 300"
      className="relative h-[320px] w-auto animate-float-slow drop-shadow-[0_0_45px_rgba(245,196,81,0.35)] sm:h-[380px]"
      role="img"
      aria-label="Trust-Approved certification seal, backed by the Webb Family Dynasty Trust"
    >
      <defs>
        <linearGradient id="w3bb-gold" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#FFE9AC" />
          <stop offset="45%" stopColor="#F5C451" />
          <stop offset="100%" stopColor="#B98A22" />
        </linearGradient>
        <linearGradient id="w3bb-shield-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(245,196,81,0.16)" />
          <stop offset="60%" stopColor="rgba(124,77,255,0.10)" />
          <stop offset="100%" stopColor="rgba(34,211,238,0.10)" />
        </linearGradient>
      </defs>

      {/* outer ring */}
      <circle
        cx="130"
        cy="140"
        r="122"
        fill="none"
        stroke="url(#w3bb-gold)"
        strokeWidth="1"
        opacity="0.35"
        strokeDasharray="4 9"
      />

      {/* shield */}
      <path
        d="M130 26 L226 62 V150 C226 206 182 246 130 262 C78 246 34 206 34 150 V62 Z"
        fill="url(#w3bb-shield-fill)"
        stroke="url(#w3bb-gold)"
        strokeWidth="2.5"
      />
      <path
        d="M130 44 L210 74 V150 C210 196 174 230 130 244 C86 230 50 196 50 150 V74 Z"
        fill="none"
        stroke="rgba(245,196,81,0.35)"
        strokeWidth="1"
      />

      {/* check */}
      <path
        d="M96 146 L122 172 L172 116"
        fill="none"
        stroke="url(#w3bb-gold)"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <text
        x="130"
        y="206"
        textAnchor="middle"
        fontFamily="Space Grotesk, Inter, sans-serif"
        fontSize="19"
        fontWeight="700"
        letterSpacing="2.6"
        fill="url(#w3bb-gold)"
      >
        TRUST-APPROVED
      </text>
      <text
        x="130"
        y="228"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="9.5"
        letterSpacing="2.2"
        fill="rgba(255,255,255,0.5)"
      >
        WEBB FAMILY DYNASTY TRUST
      </text>
      <text
        x="130"
        y="290"
        textAnchor="middle"
        fontFamily="Space Grotesk, Inter, sans-serif"
        fontSize="10"
        letterSpacing="4"
        fill="rgba(255,255,255,0.3)"
      >
        CERTIFIED · W3BB WORLDWIDE
      </text>
    </svg>
  </div>
);

export default TrustBadge;
