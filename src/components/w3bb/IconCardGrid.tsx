import React from 'react';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';
import type { IconCard } from '@/data/partnerships';

interface IconCardGridProps {
  label?: string;
  heading: string;
  items: (IconCard & { featured?: boolean })[];
  columns?: 2 | 3;
  tinted?: boolean;
  accent?: 'cyan' | 'gold';
}

export const IconCardGrid: React.FC<IconCardGridProps> = ({
  heading,
  items,
  columns = 3,
  tinted = false,
  accent = 'cyan',
}) => (
  <section className={`relative py-20 sm:py-24 ${tinted ? 'bg-white/[0.02]' : ''}`}>
    <div className="container">
      <SectionHeading label="" heading={heading} className="max-w-none" headingClassName="text-2xl sm:text-3xl" />
      <ul className={`mt-12 grid gap-4 ${columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
        {items.map((item, i) => (
          <Reveal as="li" key={item.title} delay={(i % 3) * 70}>
            <div
              className={`glass glass-lift flex h-full items-center gap-3.5 p-5 ${
                item.featured ? (accent === 'gold' ? 'ring-2 ring-gold/40' : 'ring-2 ring-cyan/40') : ''
              }`}
            >
              <item.icon
                className={`h-5 w-5 shrink-0 ${accent === 'gold' ? 'text-gold' : 'text-cyan'}`}
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <p className="font-display text-sm font-semibold text-white">{item.title}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </div>
  </section>
);

export default IconCardGrid;
