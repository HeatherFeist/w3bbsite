import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Store, ShieldCheck, Heart } from 'lucide-react';
import PageShell from '@/components/PageShell';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';
import { SPONSORED_BUSINESSES, BUSINESS_DIRECTORY } from '@/data/businesses';
import { usePageMeta } from '@/hooks/usePageMeta';

const BusinessDirectory: React.FC = () => {
  usePageMeta('Sponsored Businesses', BUSINESS_DIRECTORY.intro);

  return (
    <PageShell>
      <section className="relative scroll-mt-24 py-28 pt-36 sm:py-32 sm:pt-40">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <span className="glass-soft inline-flex items-center gap-2.5 rounded-full px-4 py-2">
                <Store className="h-4 w-4 text-cyan" strokeWidth={1.5} aria-hidden="true" />
                <span className="micro-label text-white/75">{BUSINESS_DIRECTORY.label}</span>
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-7 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl">
                {BUSINESS_DIRECTORY.heading}
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
                {BUSINESS_DIRECTORY.intro}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative pb-16">
        <div className="container">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SPONSORED_BUSINESSES.map((business, i) => (
              <Reveal as="li" key={business.slug} delay={i * 90}>
                <Link
                  to={`/businesses/${business.slug}`}
                  className="glass glass-lift group flex h-full flex-col overflow-hidden p-7"
                >
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet/30 to-cyan/15 font-display text-lg font-bold text-white ring-1 ring-inset ring-white/10">
                    {business.name.charAt(0)}
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-white">{business.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{business.tagline}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {business.supportedByCdi ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1 text-xs font-medium text-white/70">
                        <Heart className="h-3 w-3 text-gold" strokeWidth={2} aria-hidden="true" />
                        Supported by CDI
                      </span>
                    ) : null}
                    {business.certified ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan/10 px-3 py-1 text-xs font-medium text-cyan">
                        <ShieldCheck className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                        Certified by W3BB
                      </span>
                    ) : null}
                    {business.comingSoon ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
                        Coming Soon
                      </span>
                    ) : null}
                  </div>

                  <span className="mt-6 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-cyan">
                    View profile
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative bg-white/[0.02] py-24 sm:py-32">
        <div className="container">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">{BUSINESS_DIRECTORY.closingHeading}</h2>
            <p className="mt-5 text-base leading-relaxed text-white/65 sm:text-lg">{BUSINESS_DIRECTORY.closingBody}</p>
            <Link
              to="/build"
              className="cta-primary group mt-9 inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-display text-sm font-semibold text-white"
            >
              Start Building
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
};

export default BusinessDirectory;
