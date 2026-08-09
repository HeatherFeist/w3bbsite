import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ENTERPRISE } from '@/data/site';
import Icon from '@/components/w3bb/Icon';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';

export const Enterprise: React.FC = () => (
  <section id="enterprise" className="relative scroll-mt-24 py-24 sm:py-32 lg:py-40">
    <div className="container">
      <SectionHeading label={ENTERPRISE.label} heading={ENTERPRISE.heading} intro={ENTERPRISE.intro} />

      <ul className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2.5 sm:gap-3">
        {ENTERPRISE.audiences.map((a, i) => (
          <Reveal as="li" key={a.label} delay={i * 60}>
            <span className="glass-soft glass-lift flex items-center gap-2 rounded-full px-4 py-2.5 sm:px-5">
              <Icon name={a.icon} className="h-4 w-4 text-violet-soft" />
              <span className="text-sm font-medium text-white/85">{a.label}</span>
            </span>
          </Reveal>
        ))}
      </ul>

      <Reveal className="mt-16">
        <h3 className="text-center font-display text-lg font-medium text-white/55">
          {ENTERPRISE.provideTitle}
        </h3>
      </Reveal>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {ENTERPRISE.provide.map((item, i) => (
          <Reveal as="li" key={item.title} delay={i * 80}>
            <article className="glass glass-lift group flex h-full flex-col items-center gap-4 px-5 py-8 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet/25 to-cyan/15 ring-1 ring-inset ring-white/10 transition-transform duration-500 group-hover:scale-110">
                <Icon name={item.icon} className="h-5 w-5 text-white" />
              </span>
              <h4 className="font-display text-base font-semibold leading-snug text-white">
                {item.title}
              </h4>
            </article>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={120}>
        <div className="mt-14 flex flex-col items-center gap-6 text-center">
          <p className="max-w-2xl font-display text-xl font-medium text-white/85 sm:text-2xl">
            {ENTERPRISE.closing}
          </p>
          <Link
            to="/enterprise"
            onClick={() => {
              try {
                window.supercool?.track?.('cta_click', {
                  cta: ENTERPRISE.cta,
                  location: 'enterprise',
                });
              } catch {
                /* no-op */
              }
            }}
            className="cta-primary group inline-flex items-center gap-2 rounded-full px-8 py-4 font-display text-base font-semibold text-white"
          >
            {ENTERPRISE.cta}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </Reveal>
    </div>
  </section>
);

export default Enterprise;
