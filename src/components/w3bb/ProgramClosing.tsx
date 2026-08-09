import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/w3bb/Reveal';

interface ProgramClosingProps {
  heading: string;
  body: React.ReactNode;
  ctaLabel: string;
  accent?: 'cyan' | 'gold';
}

export const ProgramClosing: React.FC<ProgramClosingProps> = ({ heading, body, ctaLabel, accent = 'cyan' }) => (
  <section className="relative py-24 sm:py-32">
    <div className="container">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">{heading}</h2>
        <p className="mt-5 text-base leading-relaxed text-white/65 sm:text-lg">{body}</p>
        <Link
          to="/partner-services#contact"
          className={
            accent === 'gold'
              ? 'group mt-9 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-display text-sm font-semibold text-[#07080C] transition-colors hover:bg-gold/90'
              : 'cta-primary group mt-9 inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-display text-sm font-semibold text-white'
          }
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </Reveal>
    </div>
  </section>
);

export default ProgramClosing;
