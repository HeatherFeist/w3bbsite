import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CardLinkProps {
  to: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  id?: string;
}

const focusClass =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080C]';

/** Whole-card link. External URLs open in a new tab. Internal routes use the router. */
export const CardLink: React.FC<CardLinkProps> = ({ to, className, children, onClick, id }) => {
  const classes = cn(
    'glass glass-lift group h-full rounded-[1.25rem] transition-colors hover:border-cyan/40',
    focusClass,
    className,
  );
  if (/^https?:\/\//.test(to)) {
    return (
      <a id={id} href={to} target="_blank" rel="noopener noreferrer" className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link id={id} to={to} className={classes} onClick={onClick}>
      {children}
    </Link>
  );
};

export default CardLink;
