import { describe, expect, it } from 'vitest';
import { buildBlueprint } from './blueprint';
import { cleanNotebook, notebookLine } from './notebook';
import { matchBusinesses } from './matching';
import { scoreAssessment } from './scoring';
import { createEmptyState, normalizeState } from './storage';
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

describe('builder notebook', () => {
  it('shows a blueprint draft until the founder writes their own line', () => {
    const scores = scoreAssessment(technical);
    const model = matchBusinesses({ answers: technical, archetypeId: scores.archetype.id })[0];
    const blueprint = buildBlueprint({ answers: technical, scores, model, now: '2026-11-16T00:00:00.000Z' });
    const draft = notebookLine('naming-branding', {}, blueprint);
    expect(draft.text).toBe(blueprint.chosenName);
    expect(draft.fromBlueprint).toBe(true);

    const saved = notebookLine('naming-branding', { 'naming-branding': { name: 'Harbor Co' } }, blueprint);
    expect(saved).toEqual({ text: 'Harbor Co', fromBlueprint: false });

    const cleared = notebookLine('naming-branding', { 'naming-branding': { name: '   ' } }, blueprint);
    expect(cleared).toEqual({ text: 'Not written yet', fromBlueprint: false });
  });

  it('keeps notebook text in the founder record and drops anything that is not text', () => {
    const state = normalizeState({
      ...createEmptyState(),
      notebook: { 'naming-branding': { name: 'Harbor Co', extra: 4 }, nope: 'nope' },
    });
    expect(state.notebook).toEqual({ 'naming-branding': { name: 'Harbor Co' } });
    expect(cleanNotebook(null)).toEqual({});
    expect(notebookLine('product-development', {}, null).text).toBe('Not written yet');
  });
});
