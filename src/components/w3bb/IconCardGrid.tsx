import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';
import type { IconCard } from '@/data/partnerships';

interface IconCardGridProps<T extends IconCard = IconCard> {
  label?: string;
  heading: string;
  items: (T & { featured?: boolean })[];
  columns?: 2 | 3;
  tinted?: boolean;
  accent?: 'cyan' | 'gold';
  /** When provided, each card links to this URL and shows a "Learn more" hover cue. */
  getHref?: (item: T) => string | undefined;
}

export const IconCardGrid = <T extends IconCard = IconCard>({
  heading,
  items,
  columns = 3,
  tinted = false,
  accent = 'cyan',
  getHref,
}: IconCardGridProps<T>) => (
  <section className={`relative py-20 sm:py-24 ${tinted ? 'bg-white/[0.02]' : ''}`}>
    <div className="container">
      <SectionHeading label="" heading={heading} className="max-w-none" headingClassName="text-2xl sm:text-3xl" />
      <ul className={`mt-12 grid gap-4 ${columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
        {items.map((item, i) => {
          const href = getHref?.(item);
          const cardClass = `glass glass-lift group flex h-full items-center gap-3.5 p-5 ${
            item.featured ? (accent === 'gold' ? 'ring-2 ring-gold/40' : 'ring-2 ring-cyan/40') : ''
          }`;
          const content = (
            <>
              <item.icon
                className={`h-5 w-5 shrink-0 ${accent === 'gold' ? 'text-gold' : 'text-cyan'}`}
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <p className="font-display text-sm font-semibold text-white">{item.title}</p>
              {href ? (
                <ArrowRight
                  className={`ml-auto h-4 w-4 shrink-0 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 ${
                    accent === 'gold' ? 'text-gold' : 'text-cyan'
                  }`}
                  aria-hidden="true"
                />
              ) : null}
            </>
          );
          return (
            <Reveal as="li" key={item.title} delay={(i % 3) * 70}>
              {href ? (
                <Link to={href} className={cardClass}>
                  {content}
                </Link>
              ) : (
                <div className={cardClass}>{content}</div>
              )}
            </Reveal>
          );
        })}
      </ul>
    </div>
  </section>
);

export default IconCardGrid;
