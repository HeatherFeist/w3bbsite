import { useEffect } from 'react';

const DEFAULT_TITLE = 'W3BB Worldwide — Build. Certify. Launch.';
const DEFAULT_DESCRIPTION =
  'W3BB Worldwide is a trust-backed digital business ecosystem that empowers anyone to build, mint, certify, and monetize fully packaged businesses.';

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Sets the document title and description for the current route, restoring the site defaults on unmount. */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    const fullTitle = `${title} — W3BB Worldwide`;
    document.title = fullTitle;
    setMeta('description', description ?? DEFAULT_DESCRIPTION);
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', description ?? DEFAULT_DESCRIPTION, 'property');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description ?? DEFAULT_DESCRIPTION);

    return () => {
      document.title = DEFAULT_TITLE;
      setMeta('description', DEFAULT_DESCRIPTION);
      setMeta('og:title', DEFAULT_TITLE, 'property');
      setMeta('og:description', DEFAULT_DESCRIPTION, 'property');
      setMeta('twitter:title', DEFAULT_TITLE);
      setMeta('twitter:description', DEFAULT_DESCRIPTION);
    };
  }, [title, description]);
}
