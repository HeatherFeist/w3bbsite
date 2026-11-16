import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/w3bb/Reveal';

/** Homepage entry to the founder platform. Existing hero actions stay in place. */
export const FounderLaunchBand: React.FC = () => (
  <section aria-labelledby="founder-launch-heading" className="relative pb-8 sm:pb-12">
    <div className="container">
      <Reveal>
        <div className="glass relative overflow-hidden px-6 py-10 sm:px-12 sm:py-14">
          <span className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-violet/20 blur-3xl" aria-hidden="true" />
          <p className="micro-label text-cyan">Start your business</p>
          <h2 id="founder-launch-heading" className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-[1.08] text-white sm:text-5xl">
            Bring an idea. Leave with a plan.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            The Founder Launch Platform scores your readiness, matches a model, and writes a blueprint. You then build the business in the existing Business Builder, with the Launchpad if you are starting from zero.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/launch/assess"
              className="cta-primary inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-display text-sm font-semibold text-white"
            >
              Take the founder assessment
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/launch"
              className="glass-soft inline-flex items-center justify-center rounded-full px-7 py-3.5 font-display text-sm font-semibold text-white/85 hover:text-white"
            >
              See how Launch works
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default FounderLaunchBand;
