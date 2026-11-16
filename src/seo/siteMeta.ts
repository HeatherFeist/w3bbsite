export const SITE_ORIGIN = 'https://w3bbworldwide.com';

export const DEFAULT_TITLE = 'W3BB Worldwide — Build. Certify. Launch.';

export const DEFAULT_DESCRIPTION =
  'W3BB Worldwide is a trust-backed digital business ecosystem that empowers anyone to build, mint, certify, and monetize fully packaged businesses. Create your brand, generate your assets, and launch your enterprise — all inside one unified platform.';

/** Social preview image in /public, 1200×630. */
export const OG_IMAGE_PATH = '/og.jpg';

export function documentTitle(pageTitle: string): string {
  if (pageTitle === DEFAULT_TITLE || pageTitle.endsWith('— W3BB Worldwide')) return pageTitle;
  return `${pageTitle} — W3BB Worldwide`;
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return normalized === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${normalized}`;
}

export function ogImageUrl(): string {
  return absoluteUrl(OG_IMAGE_PATH);
}
