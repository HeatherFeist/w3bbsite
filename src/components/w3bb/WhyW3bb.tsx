import React from 'react';
import { ChevronRight } from 'lucide-react';
import { WHY } from '@/data/site';
import Icon from '@/components/w3bb/Icon';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';

export const WhyW3bb: React.FC = () => (
  <section id="why" className="relative scroll-mt-24 py-24 sm:py-32 lg:py-40">
    <div className="container">
      <SectionHeading label={WHY.label} heading={WHY.heading} intro={WHY.paragraph} />

      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {WHY.pillars.map((pillar, i) => (
          <Reveal as="li" key={pillar.title} delay={i * 80}>
            <article className="glass glass-lift group flex h-full flex-col gap-5 p-6">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet/30 via-cyan/20 to-transparent ring-1 ring-inset ring-white/10 transition-transform duration-500 group-hover:-translate-y-1">
                <Icon name={pillar.icon} className="h-5 w-5 text-white" />
              </span>
              <h3 className="font-display text-base font-semibold leading-snug text-white sm:text-lg">
                {pillar.title}
              </h3>
            </article>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={120}>
        <p className="mt-14 text-center font-display text-2xl font-semibold sm:text-4xl">
          <span className="gradient-text">{WHY.emphasis}</span>
        </p>
      </Reveal>

      {/* Gradient flow strip */}
      <Reveal delay={160}>
        <div className="glass relative mt-14 overflow-hidden p-5 sm:p-7">
          <span
            className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-violet via-cyan to-gold opacity-40"
            aria-hidden="true"
          />
          <ol className="relative flex flex-wrap items-center justify-center gap-x-2 gap-y-3 sm:flex-nowrap sm:justify-between">
            {WHY.flow.map((stage, i) => (
              <React.Fragment key={stage}>
                <li className="group flex items-center">
                  <span
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0B0D14] px-3.5 py-2 transition-all duration-500 hover:border-cyan/50 hover:bg-white/[0.06] sm:px-4 sm:py-2.5"
                    style={{
                      boxShadow: `0 0 26px -12px rgba(${
                        i < 3 ? '124,77,255' : i < 5 ? '34,211,238' : '245,196,81'
                      }, 0.9)`,
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        background: i < 3 ? '#7C4DFF' : i < 5 ? '#22D3EE' : '#F5C451',
                      }}
                      aria-hidden="true"
                    />
                    <span className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-white/90 sm:text-sm">
                      {stage}
                    </span>
                  </span>
                </li>
                {i < WHY.flow.length - 1 ? (
                  <li aria-hidden="true" className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-white/25" />
                  </li>
                ) : null}
              </React.Fragment>
            ))}
          </ol>
        </div>
      </Reveal>

      <Reveal delay={200}>
        <p className="mt-10 text-center text-lg text-white/70 sm:text-xl">{WHY.closing}</p>
      </Reveal>
    </div>
  </section>
);

export default WhyW3bb;
