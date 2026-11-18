import { describe, expect, it } from 'vitest';
import { matchesAppRoute } from '@/lib/routes';
import { listPublicPages, sitemapXml } from '@/seo/publicPages';
import { SITE_ORIGIN } from '@/seo/siteMeta';

describe('public pages for search', () => {
  it('lists each public path once and only on a real route', () => {
    const pages = listPublicPages();
    const paths = pages.map((page) => page.path);
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths).toContain('/');
    expect(paths).toContain('/launch');
    expect(paths).toContain('/launch/with-ai');
    expect(paths).toContain('/build');
    expect(paths).toContain('/builder/naming-branding');
    expect(paths).toContain('/terms');
    expect(paths).not.toContain('/admin/mint');
    for (const path of paths) {
      expect(matchesAppRoute(path), path).toBe(true);
    }
  });

  it('builds a sitemap that points at the production origin', () => {
    const xml = sitemapXml(listPublicPages(), SITE_ORIGIN);
    expect(xml).toContain('<loc>https://w3bbworldwide.com/</loc>');
    expect(xml).toContain('<loc>https://w3bbworldwide.com/launch</loc>');
    expect(xml).toContain('<loc>https://w3bbworldwide.com/builder/launch-preparation</loc>');
  });
});