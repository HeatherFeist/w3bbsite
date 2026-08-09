import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Download, Repeat } from 'lucide-react';
import { MARKETPLACE } from '@/data/site';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';
import BundleCard from '@/components/w3bb/BundleCard';

export const Marketplace: React.FC = () => (
  <section id="marketplace" className="relative scroll-mt-24 py-24 sm:py-32 lg:py-40">
    <div className="container">
      <SectionHeading
        label={MARKETPLACE.label}
        heading={MARKETPLACE.heading}
        intro={MARKETPLACE.paragraph}
      />

      <div className="mt-16 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <BundleCard />
        </Reveal>

        <div>
          <Reveal>
            <h3 className="font-display text-xl font-medium text-white/70">
              {MARKETPLACE.includesTitle}
            </h3>
          </Reveal>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {MARKETPLACE.includes.map((item, i) => (
              <Reveal as="li" key={item} delay={i * 70}>
                <span className="glass-soft glass-lift flex items-center gap-3 rounded-xl px-4 py-3.5">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet to-cyan">
                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium text-white/85 sm:text-base">{item}</span>
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {MARKETPLACE.emphasis.map((line, i) => (
          <Reveal key={line} delay={i * 110}>
            <div className="glass glass-lift group relative h-full overflow-hidden p-7 sm:p-9">
              <span
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{
                  background:
                    i === 0
                      ? 'radial-gradient(70% 100% at 0% 0%, rgba(34,211,238,0.14), transparent 70%)'
                      : 'radial-gradient(70% 100% at 100% 0%, rgba(245,196,81,0.14), transparent 70%)',
                }}
                aria-hidden="true"
              />
              <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.06] ring-1 ring-inset ring-white/10">
                {i === 0 ? (
                  <Download className="h-5 w-5 text-cyan" strokeWidth={1.5} aria-hidden="true" />
                ) : (
                  <Repeat className="h-5 w-5 text-gold" strokeWidth={1.5} aria-hidden="true" />
                )}
              </span>
              <p className="relative mt-6 font-display text-xl font-medium leading-snug text-white sm:text-2xl">
                {line}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={220} className="mt-14 flex justify-center">
        <Link
          to="/mint"
          className="cta-primary group inline-flex items-center gap-2 rounded-full px-8 py-4 font-display text-base font-semibold text-white"
        >
          Mint a Franchise Bundle
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </Reveal>
    </div>
  </section>
);

export default Marketplace;
