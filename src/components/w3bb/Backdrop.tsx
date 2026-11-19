import React from 'react';

/** Warm dark canvas with a purple and gold wash, close to a front-door landing page. */
export const Backdrop: React.FC = () => (
  <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <div className="absolute inset-0 bg-[#16141a]" />
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(85% 70% at 12% 0%, rgba(107,78,158,0.28), transparent 58%), radial-gradient(70% 60% at 100% 8%, rgba(212,162,74,0.14), transparent 55%)',
      }}
    />
  </div>
);

export default Backdrop;
