import { describe, expect, it } from 'vitest';
import { matchesAppRoute } from '@/lib/routes';
import { RESOURCES } from '@/data/resources';

describe('resource links', () => {
  it('sends published library cards to real routes', () => {
    const linked = RESOURCES.library.filter((item) => item.to);
    expect(linked.map((item) => item.title)).toEqual([
      'Guides',
      'Templates',
      'AI Tools',
      'Business Playbooks',
      'Funding Resources',
      'Branding Kits',
    ]);
    for (const item of linked) {
      expect(item.linkLabel, item.title).toBeTruthy();
      expect(matchesAppRoute(item.to!), item.to).toBe(true);
    }
    expect(RESOURCES.library.find((item) => item.title === 'Legal Basics')?.to).toBeUndefined();
  });

  it('keeps the partner programs on existing pages', () => {
    expect(RESOURCES.growPrograms.length).toBeGreaterThan(0);
    for (const program of RESOURCES.growPrograms) {
      expect(matchesAppRoute(program.to), program.to).toBe(true);
    }
  });
});
