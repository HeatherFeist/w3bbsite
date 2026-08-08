import React from 'react';
import { BadgeCheck } from 'lucide-react';
import { CERTIFICATION } from '@/data/site';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';
import TrustBadge from '@/components/w3bb/TrustBadge';

export const Certification: React.FC = () => (
  <section id="certification" className="relative scroll-mt-24 py-24 sm:py-32 lg:py-40">
    <div className="container">
      <SectionHeading label={CERTIFICATION.label} heading={CERTIFICATION.heading} />

      <div className="mt-16 grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="order-2 lg:order-1">
          <p className="text-lg leading-relaxed text-white/75 sm:text-xl">
            {CERTIFICATION.paragraph}
          </p>

          <h3 className="mt-10 font-display text-lg font-medium text-white/60">
            {CERTIFICATION.signalsTitle}
          </h3>
          <ul className="mt-5 space-y-3">
            {CERTIFICATION.signals.map((signal, i) => (
              <Reveal as="li" key={signal} delay={i * 70}>
                <span className="group flex items-center gap-3.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3.5 transition-all duration-500 hover:border-gold/40 hover:bg-white/[0.06]">
                  <BadgeCheck
                    className="h-5 w-5 shrink-0 text-gold transition-transform duration-500 group-hover:scale-110"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="font-display text-base font-medium text-white/90 sm:text-lg">
                    {signal}
                  </span>
                </span>
              </Reveal>
            ))}
          </ul>
        </Reveal>

        <Reveal className="order-1 lg:order-2" delay={100}>
          <TrustBadge />
        </Reveal>
      </div>

      <Reveal delay={120}>
        <p className="mx-auto mt-16 max-w-3xl text-center text-lg leading-relaxed text-white/75">
          {CERTIFICATION.closing}
        </p>
      </Reveal>
    </div>
  </section>
);

export default Certification;
