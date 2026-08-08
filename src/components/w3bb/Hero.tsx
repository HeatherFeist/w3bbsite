import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { HERO, IMAGES } from '@/data/site';
import { scrollToId } from '@/hooks/useScrollSpy';
import Icon from '@/components/w3bb/Icon';
import Reveal from '@/components/w3bb/Reveal';

export const Hero: React.FC = () => {
  const track = (name: string, props: Record<string, string>) => {
    try {
      window.supercool?.track?.(name, props);
    } catch {
      /* analytics must never break the page */
    }
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20 sm:pt-32"
    >
      <img
        src={IMAGES.heroAura}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 w-[130%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-45 mix-blend-screen sm:w-[110%]"
        loading="eager"
        decoding="async"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 45%, rgba(7,8,12,0.35), rgba(7,8,12,0.85) 78%)',
        }}
        aria-hidden="true"
      />

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <span className="glass-soft inline-flex items-center gap-2.5 rounded-full px-4 py-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan" />
              </span>
              <span className="micro-label text-white/75">{HERO.eyebrow}</span>
            </span>
          </Reveal>

          <h1 className="mt-8 font-display font-semibold leading-[0.92] tracking-[-0.045em] text-white">
            {HERO.headlineLines.map((line, i) => (
              <Reveal key={line} delay={120 + i * 110} as="span" className="block">
                <span className="block text-[3.4rem] sm:text-[5.5rem] lg:text-[7.5rem]">
                  {i === 2 ? <span className="gradient-text">{line}</span> : line}
                </span>
              </Reveal>
            ))}
          </h1>

          <Reveal delay={460}>
            <p className="mx-auto mt-7 max-w-2xl font-display text-lg font-medium text-white/90 sm:text-2xl">
              {HERO.subheadline}
            </p>
          </Reveal>

          <Reveal delay={540}>
            <p className="mx-auto mt-5 max-w-2xl text-[0.98rem] leading-relaxed text-white/65 sm:text-lg">
              {HERO.body}
            </p>
          </Reveal>

          <Reveal delay={620}>
            <p className="mt-6 font-display text-base italic sm:text-lg">
              <span className="gradient-text">{HERO.closing}</span>
            </p>
          </Reveal>

          <Reveal delay={700}>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <button
                type="button"
                onClick={() => {
                  track('cta_click', { cta: HERO.primaryCta, location: 'hero' });
                  scrollToId('contact');
                }}
                className="cta-primary group inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 font-display text-base font-semibold text-white sm:w-auto"
              >
                {HERO.primaryCta}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"

                />
              </button>
              <button
                type="button"
                onClick={() => {
                  track('cta_click', { cta: HERO.secondaryCta, location: 'hero' });
                  scrollToId('marketplace');
                }}
                className="glass-soft group inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 font-display text-base font-semibold text-white/85 transition-all duration-300 hover:border-cyan/50 hover:bg-white/[0.07] hover:text-white sm:w-auto"
              >
                <Compass
                  className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45"

                  aria-hidden="true"
                  strokeWidth={1.5}
                />
                {HERO.secondaryCta}
              </button>
            </div>
          </Reveal>

          <Reveal delay={800}>
            <ul className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-2.5 sm:gap-3">
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
