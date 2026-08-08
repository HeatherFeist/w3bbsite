import { useEffect, useState } from 'react';

/**
 * Tracks which section id is currently in view for navbar highlighting.
 */
export function useScrollSpy(ids: string[], offset = 140): string {
  const [active, setActive] = useState<string>(ids[0] ?? '');

  useEffect(() => {
    const handler = () => {
      let current = ids[0] ?? '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - offset <= 0) current = id;
      }
      // Pin the last section when the page bottom is reached.
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 8) {
        current = ids[ids.length - 1] ?? current;
      }
      setActive(current);
    };

    handler();
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, [ids, offset]);

  return active;
}

/** Smoothly scrolls to a section id, accounting for the sticky navbar. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const top = el.getBoundingClientRect().top + window.scrollY - 84;
  window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
}
