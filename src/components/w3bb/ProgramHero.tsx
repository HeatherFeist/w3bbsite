import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import Reveal from '@/components/w3bb/Reveal';

interface ProgramHeroProps {
  icon: LucideIcon;
  eyebrow: string;
  heading: React.ReactNode;
  sub: string;
  body: string;
  ctaLabel: string;
  ctaHref?: string;
  accent?: 'cyan' | 'gold';
}

export const ProgramHero: React.FC<ProgramHeroProps> = ({
  icon: EyebrowIcon,
  eyebrow,
  heading,
  sub,
  body,
  ctaLabel,
  ctaHref = '/partner-services#contact',
  accent = 'cyan',
}) => (
  <section className="relative scroll-mt-24 py-28 pt-36 sm:py-32 sm:pt-40">
    <div className="container">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <span className="glass-soft inline-flex items-center gap-2.5 rounded-full px-4 py-2">
            <EyebrowIcon className={`h-4 w-4 ${accent === 'gold' ? 'text-gold' : 'text-cyan'}`} strokeWidth={1.5} aria-hidden="true" />
            <span className="micro-label text-white/75">{eyebrow}</span>
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-7 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl">
            {heading}
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="mx-auto mt-6 max-w-2xl font-display text-lg font-medium text-white/85 sm:text-xl">{sub}</p>
        </Reveal>
        <Reveal delay={180}>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">{body}</p>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to={ctaHref}
              className={
                accent === 'gold'
                  ? 'group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-display text-sm font-semibold text-[#07080C] transition-colors hover:bg-gold/90'
                  : 'cta-primary group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-display text-sm font-semibold text-white'
              }
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              to="/choose-your-path"
              className="glass-soft inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-display text-sm font-semibold text-white/85 transition-colors hover:text-white"
            >
              See All Paths
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

export default ProgramHero;
