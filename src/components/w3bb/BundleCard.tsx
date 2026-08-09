import React from 'react';
import { MARKETPLACE } from '@/data/site';

interface BundleCardProps {
  statusLabel?: string;
}

/**
 * Stylized mock "Franchise Bundle NFT" card — pure CSS/SVG, no images.
 */
export const BundleCard: React.FC<BundleCardProps> = ({ statusLabel = 'Minted' }) => (
  <div className="grad-border relative mx-auto w-full max-w-sm rounded-[1.75rem] p-[1.5px]">
    <div className="glass relative overflow-hidden rounded-[1.7rem] bg-[#0B0D14]/85 p-6 sm:p-7">
      <span
        className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-violet/30 blur-3xl"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute -bottom-20 -right-14 h-52 w-52 rounded-full bg-cyan/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex items-center justify-between">
        <span className="micro-label text-white/45">Franchise Bundle</span>
        <span className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
          <span className="font-display text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-gold">
            {statusLabel}
          </span>
        </span>
      </div>

      {/* Hex token glyph */}
      <div className="relative mt-7 grid place-items-center">
        <svg
          viewBox="0 0 200 200"
          className="h-40 w-40 animate-pulse-ring sm:h-48 sm:w-48"
          role="img"
          aria-label="Franchise Bundle token glyph"
        >
          <defs>
            <linearGradient id="w3bb-hex" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7C4DFF" />
              <stop offset="55%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#F5C451" />
            </linearGradient>
            <filter id="w3bb-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <polygon
            points="100,14 174,57 174,143 100,186 26,143 26,57"
            fill="none"
            stroke="url(#w3bb-hex)"
            strokeWidth="2"
            filter="url(#w3bb-glow)"
            opacity="0.95"
          />
          <polygon
            points="100,40 152,70 152,130 100,160 48,130 48,70"
            fill="rgba(255,255,255,0.035)"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="1"
          />
          <text
            x="100"
            y="108"
            textAnchor="middle"
            fontFamily="Space Grotesk, Inter, sans-serif"
            fontSize="30"
            fontWeight="700"
            fill="url(#w3bb-hex)"
            letterSpacing="-1"
          >
            W3BB
          </text>
        </svg>
      </div>

      <dl className="relative mt-7 space-y-px overflow-hidden rounded-xl border border-white/10">
        {MARKETPLACE.tokenMeta.map((row) => (
          <div
            key={row.key}
            className="flex items-center justify-between gap-4 bg-white/[0.03] px-4 py-2.5"
          >
            <dt className="font-mono text-[0.7rem] uppercase tracking-wider text-white/40">
              {row.key}
            </dt>
            <dd className="font-display text-sm font-medium text-white/85">{row.value}</dd>
          </div>
        ))}
      </dl>

      <p className="relative mt-5 text-center font-mono text-[0.68rem] tracking-wider text-white/30">
        0xW3BB · 7A4C · 2E91 · F0D3
      </p>
    </div>
  </div>
);

export default BundleCard;
