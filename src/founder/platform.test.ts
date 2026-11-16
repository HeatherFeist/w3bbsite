import { describe, expect, it } from 'vitest';
import { buildBlueprint, nameIdeas } from './blueprint';
import { matchBusinesses } from './matching';
import { matchFunding } from './funding';
import { applyDerived, credibilityScore, levelFor, profileProgress } from './gamification';
import { createEmptyState } from './storage';
import { scoreAssessment } from './scoring';
import type { Answers, FounderState } from './types';

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

describe('matching, funding, and progression', () => {
  it('ranks a technical builder toward SaaS and a local founder toward service', () => {
    const techReport = scoreAssessment(technical);
    const techMatches = matchBusinesses({ answers: technical, archetypeId: techReport.archetype.id, orgType: 'individual' });
    expect(techMatches[0].id).toBe('saas');
    expect(techMatches.map((match) => match.matchScore)).toEqual([...techMatches.map((match) => match.matchScore)].sort((a, b) => b - a));
    expect(techMatches.every((match) => match.matchScore >= 0 && match.matchScore <= 100)).toBe(true);

    const localReport = scoreAssessment(local);
    const localMatches = matchBusinesses({ answers: local, archetypeId: localReport.archetype.id, orgType: 'individual' });
    expect(localMatches[0].id).toBe('local_service');
    const saas = localMatches.find((match) => match.id === 'saas');
    const service = localMatches.find((match) => match.id === 'local_service');
    expect(service && saas && service.matchScore > saas.matchScore).toBe(true);
  });

  it('matches sample funding without treating it as a real award', () => {
    const matches = matchFunding({
      answers: {
        industries: ['education'],
        presence: 'local',
        experience: 'none',
        revenueGoal: 'explore',
      },
      orgType: 'nonprofit',
      modelId: 'nonprofit',
    });
    expect(matches[0].id).toBe('sample-community-start');
    expect(matches[0].sample).toBe(true);
    expect(matches[0].amountLabel.toLowerCase()).toContain('not a real amount');
    expect(matches[0].deadlineLabel.toLowerCase()).toContain('no deadline');
    expect(matches.every((item) => item.matchScore >= 0 && item.matchScore <= 100)).toBe(true);
  });

  it('builds a stable blueprint that hands work to the existing builder', () => {
    const scores = scoreAssessment(technical);
    const model = matchBusinesses({ answers: technical, archetypeId: scores.archetype.id })[0];
    const first = buildBlueprint({ answers: technical, scores, model, now: '2026-11-16T00:00:00.000Z' });
    const second = buildBlueprint({ answers: technical, scores, model, now: '2026-11-16T00:00:00.000Z' });
    expect(first.nameIdeas).toEqual(nameIdeas(technical, model.id));
    expect(first).toEqual(second);
    expect(first.builderHandoff.map((step) => step.title)).toEqual([
      'Naming and branding',
      'Product development',
      'Asset generation',
      'Business logic',
      'Customer journey design',
      'Operational structure',
      'Multimedia creation',
      'Launch preparation',
    ]);
    expect(first.programLinks.some((link) => link.href === '/launchpad')).toBe(true);
    expect(first.programLinks.some((link) => link.href === '/certification')).toBe(true);
  });

  it('maps XP to the published levels and credibility to pathway completion', () => {
    expect(levelFor(0).current.name).toBe('Explorer');
    expect(levelFor(99).current.name).toBe('Explorer');
    expect(levelFor(100).current.name).toBe('Builder');
    expect(levelFor(250).current.name).toBe('Founder');
    expect(levelFor(500).current.name).toBe('Launcher');
    expect(levelFor(800).current.name).toBe('Operator');
    expect(levelFor(1200).current.name).toBe('Visionary');
    expect(levelFor(1799).current.name).toBe('Visionary');
    expect(levelFor(1800).current.name).toBe('Certified Leader');
    expect(credibilityScore(0, 7)).toBe(0);
    expect(credibilityScore(1, 7)).toBe(14);
    expect(credibilityScore(3, 7)).toBe(43);
    expect(credibilityScore(7, 7)).toBe(100);
  });

  it('awards each badge once', () => {
    const state = createEmptyState();
    state.assessment.status = 'complete';
    state.scores = scoreAssessment(technical);
    state.blueprint = buildBlueprint({
      answers: technical,
      scores: state.scores,
      model: matchBusinesses({ answers: technical, archetypeId: state.scores.archetype.id })[0],
      now: '2026-11-16T00:00:00.000Z',
    });
    state.profile = {
      ...state.profile,
      displayName: 'Amina Cole',
      story: 'I have been teaching neighbors how to start a small practice from the kitchen table.',
      skills: ['teaching'],
      interests: ['teaching'],
      imageDataUrl: 'data:image/jpeg;base64,abc',
      location: 'Detroit',
      ventures: [{ id: 'v1', name: 'Lantern', status: 'Idea', summary: '' }],
      achievements: ['First cohort outline'],
    };
    expect(profileProgress(state.profile).percent).toBe(100);
    const once = applyDerived(state);
    const twice = applyDerived(once);
    expect(once.earnedBadgeIds).toEqual(['assessment_done', 'blueprint_created', 'profile_complete']);
    expect(twice.xpEvents.map((event) => event.id).sort()).toEqual(once.xpEvents.map((event) => event.id).sort());
  });

  it('does not mark an empty profile complete', () => {
    const empty: FounderState = createEmptyState();
    expect(profileProgress(empty.profile).percent).toBe(0);
    expect(applyDerived(empty).earnedBadgeIds).toEqual([]);
  });
});
