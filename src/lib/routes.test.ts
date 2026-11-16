import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { APP_ROUTES, matchesAppRoute } from './routes';

const SRC = path.resolve(__dirname, '..');

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    if (!/\.(tsx|ts)$/.test(entry) || /\.test\.tsx?$/.test(entry)) return [];
    return [full];
  });
}

function internalHrefs(source: string): string[] {
  const found: string[] = [];
  const pattern = /(?:\bto|\bhref)=["'](\/[^"']*)["']/g;
  let match = pattern.exec(source);
  while (match) {
    found.push(match[1]);
    match = pattern.exec(source);
  }
  return found;
}

describe('internal card and page links', () => {
  it('resolves every static internal href to a registered route', () => {
    const hrefs = sourceFiles(SRC).flatMap((file) => internalHrefs(readFileSync(file, 'utf8')));
    const unique = [...new Set(hrefs)];
    expect(unique.length).toBeGreaterThan(10);
    const missing = unique.filter((href) => !matchesAppRoute(href));
    expect(missing).toEqual([]);
  });

  it('does not use a bare hash as a link destination', () => {
    const offenders = sourceFiles(SRC).filter((file) => /(?:\bto|\bhref)=["']#["']/.test(readFileSync(file, 'utf8')));
    expect(offenders).toEqual([]);
  });

  it('covers the founder deep links and the existing program routes', () => {
    const required = [
      '/launch/assess?step=skills',
      '/launch/results#founder-readiness',
      '/launch/blueprint?model=saas',
      '/launch/certifications#business-foundations',
      '/launch/funding#sample-community-start',
      '/build/brand-kit',
      '/businesses/whichcraft',
      '/community#volunteer',
      '/mint',
      '/certification',
      '/builder/naming-branding',
      '/builder/launch-preparation',
      '/launchpad',
      '/zero-dollar-startup',
    ];
    for (const href of required) {
      expect(matchesAppRoute(href), href).toBe(true);
    }
    expect(APP_ROUTES).toContain('/launch/dashboard');
    expect(matchesAppRoute('https://whichcraft.shop')).toBe(false);
  });
});