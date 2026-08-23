import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Heart } from 'lucide-react';
import { SPONSORED_BUSINESSES } from '@/data/businesses';
import { CDI_FULL_NAME } from '@/data/ecosystem';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';

export const FeaturedBusinesses: React.FC = () => (
  <section id="businesses" className="relative scroll-mt-24 py-24 sm:py-32">
    <div className="container">
      <SectionHeading
        label="THE W3BB NETWORK"
        heading="Sponsored Businesses"
        intro={`Every business here was built inside the W3BB ecosystem — supported by CDI (${CDI_FULL_NAME}), powered by the W3BB platform.`}
      />

      <ul className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2">
        {SPONSORED_BUSINESSES.map((business, i) => {
          const cardClass = 'glass glass-lift group flex h-full flex-col p-7';
          const cardContent = (
            <>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet/30 to-cyan/15 font-display text-lg font-bold text-white ring-1 ring-inset ring-white/10">
                {business.name.charAt(0)}
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-white">{business.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">{business.tagline}</p>
              {business.website ? (
                <span className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-cyan">
                  Visit website
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" aria-hidden="true" />
                </span>
              ) : (
                <span className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-cyan">
                  View profile
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </span>
              )}
            </>
          );
          return (
            <Reveal as="li" key={business.slug} delay={i * 90}>
              {business.website ? (
                <a href={business.website} target="_blank" rel="noopener noreferrer" className={cardClass}>
                  {cardContent}
                </a>
              ) : (
                <Link to={`/businesses/${business.slug}`} className={cardClass}>
                  {cardContent}
                </Link>
              )}
            </Reveal>
          );
        })}
      </ul>

      <Reveal delay={140} className="mt-12 flex flex-col items-center gap-6 text-center">
        <span className="glass-soft inline-flex items-center gap-2.5 rounded-full px-4 py-2" title={CDI_FULL_NAME}>
          <Heart className="h-4 w-4 text-gold" strokeWidth={1.5} aria-hidden="true" />
          <span className="micro-label text-white/75">Powered by CDI</span>
        </span>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/businesses"
            className="glass-soft inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-display text-sm font-semibold text-white/85 transition-colors hover:text-white"
          >
            Join the Network
          </Link>
          <Link
            to="/build"
            className="cta-primary group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-display text-sm font-semibold text-white"
          >
            Start Building Your Business
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </Reveal>
    </div>
  </section>
);

export default FeaturedBusinesses;
