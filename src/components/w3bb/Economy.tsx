import React from 'react';
import { ECONOMY } from '@/data/site';
import Icon from '@/components/w3bb/Icon';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';

export const Economy: React.FC = () => (
  <section id="economy" className="relative scroll-mt-24 py-24 sm:py-32 lg:py-40">
    <div className="container">
      <SectionHeading label={ECONOMY.label} heading={ECONOMY.heading} />

      <ul className="mt-16 grid gap-6 lg:grid-cols-3">
        {ECONOMY.streams.map((stream, i) => (
          <Reveal as="li" key={stream.n} delay={i * 110}>
            <article className="glass glass-lift group relative h-full overflow-hidden p-8 sm:p-10">
              <span
                className="pointer-events-none absolute -right-6 -top-10 select-none font-display text-[9rem] font-bold leading-none text-white/[0.045] transition-all duration-700 group-hover:text-white/[0.09]"
                aria-hidden="true"
              >
                {stream.n}
              </span>
              <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet/35 via-cyan/20 to-gold/20 ring-1 ring-inset ring-white/12">
                <Icon name={stream.icon} className="h-6 w-6 text-white" />
              </span>
              <p className="relative mt-7 font-mono text-xs tracking-[0.2em] text-cyan/80">
                STREAM {stream.n}
              </p>
              <h3 className="relative mt-2 font-display text-2xl font-semibold text-white sm:text-[1.75rem]">
                {stream.title}
              </h3>
              <p className="relative mt-3 text-base leading-relaxed text-white/65">
                {stream.description}
              </p>
              <span
                className="pointer-events-none absolute inset-x-8 bottom-0 h-px origin-left scale-x-0 gradient-rule transition-transform duration-700 group-hover:scale-x-100"
                aria-hidden="true"
              />
            </article>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={140}>
        <p className="mx-auto mt-14 max-w-2xl text-center font-display text-xl font-medium text-white/85 sm:text-2xl">
          {ECONOMY.closing}
        </p>
      </Reveal>
    </div>
  </section>
);

export default Economy;
