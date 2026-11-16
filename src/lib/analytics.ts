type EventProps = Record<string, string | number | boolean | undefined>;

interface PlausibleFn {
  (event: string, options?: { props?: EventProps }): void;
  q?: unknown[];
}

declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

/**
 * Page views: set VITE_CF_ANALYTICS_TOKEN to the Cloudflare Web Analytics
 * beacon token. Named events from track(): set VITE_PLAUSIBLE_DOMAIN to the
 * site domain configured in Plausible. Both no-op when unset.
 */
export function installAnalytics() {
  if (typeof document === 'undefined') return;
  const token = import.meta.env.VITE_CF_ANALYTICS_TOKEN?.trim();
  const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN?.trim();

  if (token && !document.querySelector('script[data-cf-beacon]')) {
    const script = document.createElement('script');
    script.defer = true;
    script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    script.setAttribute('data-cf-beacon', JSON.stringify({ token }));
    document.head.appendChild(script);
  }

  if (domain && !document.querySelector('script[data-domain]')) {
    if (!window.plausible) {
      const queued = Object.assign(
        (event: string, options?: { props?: EventProps }) => {
          queued.q = queued.q || [];
          queued.q.push([event, options]);
        },
        { q: [] as unknown[] },
      );
      window.plausible = queued;
    }
    const script = document.createElement('script');
    script.defer = true;
    script.dataset.domain = domain;
    script.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(script);
  }
}

/** Forwards an event to any loaded provider. Safe to call when nothing is configured. */
export function track(name: string, props?: EventProps) {
  try {
    window.supercool?.track?.(name, props);
  } catch {
    /* a third-party tag must not break the page */
  }
  try {
    if (import.meta.env.VITE_PLAUSIBLE_DOMAIN && typeof window.plausible === 'function') {
      window.plausible(name, { props });
    }
  } catch {
    /* analytics must not break the page */
  }
}
