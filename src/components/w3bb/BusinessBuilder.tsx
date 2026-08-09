import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BUILDER } from '@/data/site';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';

export const BusinessBuilder: React.FC = () => (
  <section id="builder" className="relative scroll-mt-24 py-24 sm:py-32 lg:py-40">
    <div className="container">
      <SectionHeading label={BUILDER.label} heading={BUILDER.heading} intro={BUILDER.intro} />

      <ol className="relative mx-auto mt-16 max-w-4xl">
        {/* connecting gradient line */}
        <span
          className="absolute left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-violet via-cyan to-gold opacity-60 sm:left-[35px]"
          aria-hidden="true"
        />
        {BUILDER.steps.map((step, i) => (
          <Reveal as="li" key={step.n} delay={i * 70} className="relative block">
            <div className="group flex items-center gap-5 py-3 sm:gap-8">
              <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/10 bg-[#0B0D14] font-display text-base font-semibold text-white/80 transition-all duration-500 group-hover:border-cyan/50 group-hover:text-white sm:h-[72px] sm:w-[72px] sm:text-xl">
                <span
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet/25 to-cyan/15 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <span className="relative">{step.n}</span>
              </span>
              <div className="glass glass-lift flex-1 px-5 py-5 sm:px-8 sm:py-6">
                <h3 className="font-display text-lg font-semibold text-white sm:text-2xl">
                  {step.title}
                </h3>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>

      <Reveal delay={120}>
        <p className="mx-auto mt-16 max-w-3xl text-center text-base leading-relaxed text-white/70 sm:text-lg">
          {BUILDER.closing}
        </p>
      </Reveal>

      <Reveal delay={160} className="mt-10 flex justify-center">
        <Link
          to="/build"
          className="cta-primary group inline-flex items-center gap-2 rounded-full px-8 py-4 font-display text-base font-semibold text-white"
        >
          Start Building
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </Reveal>
    </div>
  </section>
);

export default BusinessBuilder;
