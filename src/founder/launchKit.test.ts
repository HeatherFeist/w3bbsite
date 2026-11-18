import { describe, expect, it } from 'vitest';
import { buildBlueprint } from './blueprint';
import { buildLaunchKit } from './launchKit';
import { matchBusinesses } from './matching';
import { scoreAssessment } from './scoring';
import type { Answers } from './types';

const technical: Answers = {
  skills: ['engineering', 'product'],
  interests: ['making'],
  experience: 'founder',
  capital: '1k_10k',
  time: 'full_40',
  revenueGoal: 'scale',
  personality: 'builder',
  workStyle: 'solo_deep',
  industries: ['technology'],
  techComfort: 'advanced',
  presence: 'online',
};

const local: Answers = {
  skills: ['trades', 'sales'],
  interests: ['local'],
  experience: 'some',
  capital: 'none',
  time: 'side_15',
  revenueGoal: 'side_income',
  personality: 'connector',
  workStyle: 'client_facing',
  industries: ['home-services'],
  techComfort: 'beginner',
  presence: 'local',
};

function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap((item) => strings(item));
  if (value && typeof value === 'object') return Object.values(value).flatMap((item) => strings(item));
  return [];
}

describe('Launch With AI', () => {
  it('writes the same pack twice and uses the blueprint name', () => {
    const scores = scoreAssessment(technical);
    const model = matchBusinesses({ answers: technical, archetypeId: scores.archetype.id })[0];
    const blueprint = buildBlueprint({ answers: technical, scores, model, now: '2026-11-16T00:00:00.000Z' });
    const first = buildLaunchKit({ answers: technical, scores, model, blueprint, now: '2026-11-16T00:00:00.000Z' });
    const second = buildLaunchKit({ answers: technical, scores, model, blueprint, now: '2026-11-16T00:00:00.000Z' });
    expect(first).toEqual(second);
    expect(first.businessName).toBe(blueprint.chosenName);
    expect(first.nameOptions).toEqual(blueprint.nameIdeas);
    expect(first.logos).toHaveLength(3);
    expect(first.socials).toHaveLength(3);
    expect(first.domains).toHaveLength(3);
    expect(first.businessPlan.plan90.length).toBeGreaterThan(0);
    expect(first.campaign.steps.length).toBeGreaterThan(0);
  });

  it('does not claim a domain, a live account, or a submitted application', () => {
    const scores = scoreAssessment(local);
    const model = matchBusinesses({ answers: local, archetypeId: scores.archetype.id })[0];
    const kit = buildLaunchKit({ answers: local, scores, model, now: '2026-11-16T00:00:00.000Z' });
    expect(kit.domains.every((item) => item.note.toLowerCase().includes('not been checked'))).toBe(true);
    expect(kit.fundingDraft.disclaimer.toLowerCase()).toContain('has not been sent');
    expect(kit.fundingDraft.disclaimer.toLowerCase()).toContain('not live awards');
    const text = strings(kit).join('\n');
    expect(text).not.toMatch(/https?:\/\//);
    expect(text).not.toMatch(/\$\d/);
    expect(kit.campaign.channel.toLowerCase()).toContain('neighborhood');
  });
});
