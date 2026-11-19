import React from 'react';
import { cn } from '@/lib/utils';
import Reveal from '@/components/w3bb/Reveal';

interface SectionHeadingProps {
  label: string;
  heading: React.ReactNode;
  intro?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
  headingClassName?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  label,
  heading,
  intro,
  align = 'left',
  className,
  headingClassName,
}) => {
  const centered = align === 'center';
  return (
    <div className={cn('max-w-3xl', centered && 'mx-auto text-center', className)}>
      <Reveal>
        <div className={cn('flex items-center gap-3', centered && 'justify-center')}>
          <span className="h-px w-6 bg-gold opacity-70" aria-hidden="true" />
          <span className="micro-label text-gold">{label}</span>
        </div>
      </Reveal>
      <Reveal delay={80}>
        <h2
          className={cn(
            'mt-3 text-[2.1rem] uppercase leading-[1.02] text-white sm:text-5xl lg:text-[3.4rem] text-balance',
            headingClassName,
          )}
        >
          {heading}
        </h2>
      </Reveal>
      {intro ? (
        <Reveal delay={140}>
          <p
            className={cn(
              'mt-6 text-base sm:text-lg leading-relaxed text-white/70',
              centered && 'mx-auto',
            )}
          >
            {intro}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
};

export default SectionHeading;
