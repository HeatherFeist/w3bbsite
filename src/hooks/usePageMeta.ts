import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  absoluteUrl,
  documentTitle,
  ogImageUrl,
} from '@/seo/siteMeta';

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
}

/** Sets the document title, description, canonical URL, and social tags for the current route. */
export function usePageMeta(title: string, description?: string) {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = documentTitle(title);
    const summary = description ?? DEFAULT_DESCRIPTION;
    const url = absoluteUrl(pathname);
    const image = ogImageUrl();
    document.title = fullTitle;
    setCanonical(url);
    setMeta('description', summary);
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', summary, 'property');
    setMeta('og:url', url, 'property');
    setMeta('og:image', image, 'property');
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', summary);
    setMeta('twitter:image', image);

    return () => {
      document.title = DEFAULT_TITLE;
      setCanonical(absoluteUrl('/'));
      setMeta('description', DEFAULT_DESCRIPTION);
      setMeta('og:title', DEFAULT_TITLE, 'property');
      setMeta('og:description', DEFAULT_DESCRIPTION, 'property');
      setMeta('og:url', absoluteUrl('/'), 'property');
      setMeta('og:image', ogImageUrl(), 'property');
      setMeta('twitter:title', DEFAULT_TITLE);
      setMeta('twitter:description', DEFAULT_DESCRIPTION);
      setMeta('twitter:image', ogImageUrl());
    };
  }, [title, description, pathname]);
}
