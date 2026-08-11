import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Hexagon } from 'lucide-react';
import { BUILD } from '@/data/site';
import Icon from '@/components/w3bb/Icon';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';

export const WhatYouCanBuild: React.FC = () => (
  <section id="build" className="relative scroll-mt-24 py-24 sm:py-32 lg:py-40">
    <div className="container">
      <SectionHeading label={BUILD.label} heading={BUILD.heading} intro={BUILD.intro} />

      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {BUILD.items.map((item, i) => (
          <Reveal as="li" key={item.title} delay={(i % 4) * 80}>
            <Link
              to={`/build/${item.slug}`}
              className="glass glass-lift group relative block h-full overflow-hidden p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60"
            >
              <span
                className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet/25 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden="true"
              />
              <div className="relative flex items-start justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/[0.06] ring-1 ring-inset ring-white/10 transition-colors duration-500 group-hover:ring-cyan/40">
                  <Icon name={item.icon} className="h-5 w-5 text-cyan" />
                </span>
                <span className="font-mono text-[0.7rem] text-white/25">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="relative mt-6 font-display text-base font-semibold leading-snug text-white sm:text-lg">
                {item.title}
              </h3>
              <span className="relative mt-3 inline-flex items-center gap-1.5 font-display text-xs font-semibold text-cyan opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Start building
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={120}>
        <div className="grad-border glass mt-14 overflow-hidden rounded-[1.6rem] p-[1px]">
          <div className="relative flex flex-col items-center gap-5 rounded-[1.55rem] bg-[#0B0D14]/70 px-6 py-10 text-center sm:flex-row sm:gap-7 sm:px-10 sm:text-left">
            <span
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                background:
                  'radial-gradient(50% 100% at 15% 50%, rgba(124,77,255,0.22), transparent 70%)',
              }}
              aria-hidden="true"
            />
            <span className="relative grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet/40 via-cyan/25 to-gold/25 ring-1 ring-inset ring-white/15">
              <Hexagon className="h-7 w-7 text-white" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <p className="relative font-display text-lg font-medium leading-relaxed text-white sm:text-2xl">
              {BUILD.callout}
            </p>
          </div>
        </div>
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

export default WhatYouCanBuild;
