import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FINAL_CTA, IMAGES } from '@/data/site';
import Reveal from '@/components/w3bb/Reveal';

export const FinalCta: React.FC = () => (
  <section className="relative py-20 sm:py-28">
    <div className="container">
      <div className="grad-border relative overflow-hidden rounded-[2rem] p-[1.5px]">
        <div className="relative overflow-hidden rounded-[1.95rem] bg-[#0B0D14] px-6 py-20 text-center sm:px-12 sm:py-28">
          <img
            src={IMAGES.ribbon}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-screen"
            loading="lazy"
            decoding="async"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(70% 90% at 50% 50%, rgba(124,77,255,0.28), transparent 70%), linear-gradient(to bottom, rgba(11,13,20,0.55), rgba(11,13,20,0.9))',
            }}
            aria-hidden="true"
          />
          <div className="mesh-grid mesh-fade pointer-events-none absolute inset-0 opacity-50" />

          <div className="relative mx-auto max-w-3xl">
            <h2 className="font-display text-[2.1rem] font-semibold leading-[1.06] tracking-[-0.04em] text-white sm:text-6xl lg:text-[4.25rem]">
              {FINAL_CTA.lines.map((line, i) => (
                <Reveal key={line} as="span" delay={i * 110} className="block">
                  <span className="block">
                    {i === 2 ? <span className="gradient-text">{line}</span> : line}
                  </span>
                </Reveal>
              ))}
            </h2>

            <Reveal delay={380}>
              <Link
                to="/build"
                onClick={() => {
                  try {
                    window.supercool?.track?.('cta_click', {
                      cta: FINAL_CTA.button,
                      location: 'final',
                    });
                  } catch {
                    /* no-op */
                  }
                }}
                className="cta-primary group mt-12 inline-flex items-center gap-2.5 rounded-full px-10 py-5 font-display text-lg font-semibold text-white"
              >
                {FINAL_CTA.button}
                <ArrowRight
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </Reveal>

            <Reveal delay={460}>
              <p className="mt-8 font-display text-base italic text-white/70 sm:text-lg">
                {FINAL_CTA.subline}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default FinalCta;
