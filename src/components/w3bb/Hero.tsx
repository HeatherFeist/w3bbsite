import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import { track } from '@/lib/analytics';
import { HERO, IMAGES } from '@/data/site';
import Icon from '@/components/w3bb/Icon';
import Reveal from '@/components/w3bb/Reveal';

export const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative flex min-h-[92svh] items-end overflow-hidden pb-16 pt-28 sm:pb-24"
    >
      <img
        src={IMAGES.heroAura}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_30%]"
        loading="eager"
        decoding="async"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 70% 20%, rgba(107,78,158,0.35), transparent 55%), linear-gradient(180deg, rgba(22,20,26,0.55) 0%, rgba(22,20,26,0.3) 30%, rgba(22,20,26,0.82) 72%, #16141a 100%)',
        }}
        aria-hidden="true"
      />

      <div className="container relative">
        <div className="max-w-3xl text-left">
          <Reveal>
            <span className="micro-label inline-flex items-center gap-3 text-gold before:h-px before:w-6 before:bg-gold before:opacity-70">
              {HERO.eyebrow}
            </span>
          </Reveal>

          <h1 className="mt-6 font-display uppercase leading-[1.02] text-white">
            {HERO.headlineLines.map((line, i) => (
              <Reveal key={line} delay={120 + i * 110} as="span" className="block">
                <span className="block text-[3.2rem] sm:text-[5rem] lg:text-[6.2rem]">
                  {i === 2 ? <span className="gradient-text">{line}</span> : line}
                </span>
              </Reveal>
            ))}
          </h1>

          <Reveal delay={460}>
            <p className="mt-6 max-w-xl font-sans text-lg font-medium text-white sm:text-2xl">
              {HERO.subheadline}
            </p>
          </Reveal>

          <Reveal delay={540}>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                to="/launch/assess"
                onClick={() => track('cta_click', { cta: HERO.primaryCta, location: 'hero' })}
                className="cta-primary group inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 font-sans text-base font-bold sm:w-auto"
              >
                {HERO.primaryCta}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
              <Link
                to="/build"
                onClick={() => track('cta_click', { cta: HERO.secondaryCta, location: 'hero' })}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-8 py-4 font-sans text-base font-bold text-white/85 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:text-gold sm:w-auto"
              >
                {HERO.secondaryCta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <Link
              to="/launch"
              onClick={() => track('cta_click', { cta: 'See how Launch works', location: 'hero' })}
              className="mt-5 inline-flex items-center gap-2 font-sans text-sm font-bold text-gold"
            >
              See how Launch works
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Reveal>

          <Reveal delay={620}>
            <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-white/80 sm:text-lg">
              {HERO.body}
            </p>
          </Reveal>

          <Reveal delay={680}>
            <p className="mt-4 font-display text-2xl uppercase text-gold sm:text-3xl">
              <span className="gradient-text">{HERO.closing}</span>
            </p>
          </Reveal>

          <Reveal delay={740}>
            <Link
              to="/mint"
              onClick={() => track('cta_click', { cta: HERO.marketplaceCta, location: 'hero' })}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white/75 hover:text-white"
            >
              <Compass className="h-4 w-4" aria-hidden="true" strokeWidth={1.5} />
              {HERO.marketplaceCta}
            </Link>
          </Reveal>

          <Reveal delay={800}>
            <ul className="mt-10 flex max-w-3xl flex-wrap items-center gap-2.5 sm:gap-3">
              {HERO.stats.map((stat) => (
                <li
                  key={stat.label}
                  className="glass-soft glass-lift flex items-center gap-2 rounded-full px-4 py-2.5"
                >
                  <Icon name={stat.icon} className="h-4 w-4 text-cyan" />
                  <span className="text-[0.8rem] font-medium text-white/80 sm:text-sm">
                    {stat.label}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Hero;
