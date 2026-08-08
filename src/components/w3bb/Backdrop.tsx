import React from 'react';

/**
 * Fixed page backdrop: near-black base, faint mesh grid and slow floating
 * gradient orbs. Purely decorative.
 */
export const Backdrop: React.FC = () => (
  <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <div className="absolute inset-0 bg-[#07080C]" />
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(1200px 700px at 50% -10%, rgba(124,77,255,0.22), transparent 65%), radial-gradient(900px 600px at 88% 22%, rgba(34,211,238,0.13), transparent 62%), radial-gradient(900px 700px at 6% 68%, rgba(245,196,81,0.08), transparent 60%)',
      }}
    />
    <div className="absolute inset-0 mesh-grid mesh-fade opacity-70" />
    <div
      className="orb animate-float-slow"
      style={{
        top: '-8rem',
        left: '-6rem',
        width: '32rem',
        height: '32rem',
        background: 'radial-gradient(circle, rgba(124,77,255,0.55), transparent 70%)',
      }}
    />
    <div
      className="orb animate-float-slower"
      style={{
        top: '38%',
        right: '-10rem',
        width: '30rem',
        height: '30rem',
        background: 'radial-gradient(circle, rgba(34,211,238,0.4), transparent 70%)',
      }}
    />
    <div
      className="orb animate-float-slow"
      style={{
        bottom: '-10rem',
        left: '30%',
        width: '28rem',
        height: '28rem',
        background: 'radial-gradient(circle, rgba(245,196,81,0.28), transparent 70%)',
        animationDelay: '-6s',
      }}
    />
    <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#07080C] to-transparent" />
  </div>
);

export default Backdrop;
