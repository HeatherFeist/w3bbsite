import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToId } from '@/hooks/useScrollSpy';

/** Scrolls to the section named by the URL hash whenever it changes (e.g. arriving via a cross-page `/page#section` link). */
export function useHashScroll() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    requestAnimationFrame(() => scrollToId(id));
  }, [location.hash]);
}
