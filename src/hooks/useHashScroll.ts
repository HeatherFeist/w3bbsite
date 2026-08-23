import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToId } from '@/hooks/useScrollSpy';

/**
 * Keeps navigation feeling anchored: hash links land on their section after the
 * destination route renders, and route changes without a hash start at the top.
 */
export function useHashScroll() {
  const location = useLocation();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: reduce ? 'auto' : 'smooth' });
      return;
    }

    const id = decodeURIComponent(location.hash.slice(1));
    let frame = 0;
    let timeout = 0;

    const scroll = () => {
      if (scrollToId(id)) return;
      timeout = window.setTimeout(() => scrollToId(id), 120);
    };

    frame = window.requestAnimationFrame(scroll);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [location.pathname, location.hash]);
}
