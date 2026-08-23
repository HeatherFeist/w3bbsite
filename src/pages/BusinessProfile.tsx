import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ArrowUpRight, ShieldCheck, Heart, Clock } from 'lucide-react';
import PageShell from '@/components/PageShell';
import Reveal from '@/components/w3bb/Reveal';
import { SPONSORED_BUSINESSES } from '@/data/businesses';
import { usePageMeta } from '@/hooks/usePageMeta';

const BusinessProfile: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const business = SPONSORED_BUSINESSES.find((b) => b.slug === slug);

  usePageMeta(
    business ? business.name : 'Business Not Found',
    business ? business.tagline : 'This sponsored business profile could not be found.',
  );

  if (!business) {
    return (
      <PageShell>
        <section className="relative flex min-h-[60vh] items-center py-28 pt-36 sm:pt-40">
          <div className="container">
            <div className="mx-auto max-w-xl text-center">
              <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
                We couldn't find that business.
              </h1>
              <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/65">
                It may have moved, or the link might be off.
              </p>
              <Link
                to="/businesses"
                className="cta-primary group mt-9 inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-display text-sm font-semibold text-white"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to Sponsored Businesses
              </Link>
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="relative scroll-mt-24 py-28 pt-36 sm:py-32 sm:pt-40">
        <div className="container">
          <Reveal>
            <Link
              to="/businesses"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Sponsored Businesses
            </Link>
          </Reveal>

          <div className="mx-auto mt-8 max-w-3xl text-center">
            <Reveal delay={60}>
              <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-violet/30 to-cyan/15 font-display text-3xl font-bold text-white ring-1 ring-inset ring-white/10">
                {business.name.charAt(0)}
              </span>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl">
                {business.name}
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
                {business.tagline}
              </p>
            </Reveal>
            <Reveal delay={200}>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {business.supportedByCdi ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3.5 py-1.5 text-xs font-medium text-white/70">
                    <Heart className="h-3.5 w-3.5 text-gold" strokeWidth={2} aria-hidden="true" />
                    Supported by CDI
                  </span>
                ) : null}
                {business.certified ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan/10 px-3.5 py-1.5 text-xs font-medium text-cyan">
                    <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                    Certified by W3BB
                  </span>
                ) : null}
              </div>
            </Reveal>
            {business.website ? (
              <Reveal delay={240} className="mt-8 flex justify-center">
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-primary group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-display text-sm font-semibold text-white"
                >
                  Visit {business.name}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" aria-hidden="true" />
                </a>
              </Reveal>
            ) : null}
          </div>
        </div>
      </section>

      {business.comingSoon ? (
        <section className="relative pb-24 sm:pb-32">
          <div className="container">
            <Reveal className="mx-auto max-w-2xl">
              <div className="glass flex flex-col items-center gap-4 p-10 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.06] ring-1 ring-inset ring-white/10">
                  <Clock className="h-6 w-6 text-cyan" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h2 className="font-display text-xl font-semibold text-white">Full profile coming soon</h2>
                <p className="max-w-md text-sm leading-relaxed text-white/65">
                  {business.name}'s founder and services will appear here once their full profile is
                  published.
                </p>
              </div>
            </Reveal>

            <Reveal delay={80} className="mt-10 flex justify-center">
              <Link
                to="/build"
                className="cta-primary group inline-flex items-center gap-2 rounded-full px-8 py-4 font-display text-base font-semibold text-white"
              >
                Build Your Own Business
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </section>
      ) : null}
    </PageShell>
  );
};

export default BusinessProfile;
