import { describe, expect, it } from 'vitest';
import { ARCHETYPE_TIE_BREAK } from './catalog';
import {
  FUNDING_WEIGHTS,
  LAUNCH_WEIGHTS,
  READINESS_WEIGHTS,
  pickArchetype,
  scoreAssessment,
  sumWeights,
} from './scoring';
import type { Answers } from './types';

const mixed: Answers = {
  skills: ['engineering', 'teaching'],
  interests: ['teaching'],
  experience: 'some',
  capital: 'under_1k',
  time: 'side_15',
  revenueGoal: 'side_income',
  personality: 'visionary',
  workStyle: 'collaborative',
  industries: ['education'],
  techComfort: 'comfortable',
  presence: 'online',
};

const full: Answers = {
  skills: ['engineering', 'finance', 'sales', 'operations'],
  interests: ['strategy', 'making'],
  experience: 'founder',
  capital: 'over_50k',
  time: 'full_40',
  revenueGoal: 'scale',
  personality: 'operator',
  workStyle: 'systems',
  industries: ['technology', 'education'],
  techComfort: 'advanced',
  presence: 'online',
};

describe('founder scores', () => {
  it('uses weights that each sum to 100', () => {
    expect(sumWeights(READINESS_WEIGHTS)).toBe(100);
    expect(sumWeights(LAUNCH_WEIGHTS)).toBe(100);
    expect(sumWeights(FUNDING_WEIGHTS)).toBe(100);
  });

  it('scores a known mixed profile exactly', () => {
    const report = scoreAssessment(mixed);
    expect(report.founderReadiness).toBe(56);
    expect(report.businessLaunch).toBe(62);
    expect(report.fundingReadiness).toBe(46);
    expect(report.archetype.id).toBe('educator');
  });

  it('gives a fully prepared operator the top readiness band', () => {
    const report = scoreAssessment(full);
    expect(report.founderReadiness).toBe(100);
    expect(report.businessLaunch).toBe(97);
    expect(report.fundingReadiness).toBe(96);
  });

  it('rounds the factor points into the published score', () => {
    const report = scoreAssessment(mixed);
    const readiness = report.readinessFactors.reduce((sum, factor) => sum + factor.points, 0);
    const launch = report.launchFactors.reduce((sum, factor) => sum + factor.points, 0);
    const funding = report.fundingFactors.reduce((sum, factor) => sum + factor.points, 0);
    expect(report.founderReadiness).toBe(Math.round(readiness));
    expect(report.businessLaunch).toBe(Math.round(launch));
    expect(report.fundingReadiness).toBe(Math.round(funding));
  });

  it('keeps every score inside 0 to 100 for random answers', () => {
    const random = mulberry32(16011);
    const choices: Record<string, string[]> = {
      skills: ['engineering', 'design', 'sales', 'teaching', 'finance'],
      interests: ['teaching', 'making', 'community'],
      experience: ['none', 'some', 'operator', 'founder'],
      capital: ['none', 'under_1k', '1k_10k', 'over_50k'],
      time: ['side_5', 'side_15', 'part_25', 'full_40'],
      revenueGoal: ['explore', 'side_income', 'replace_job', 'scale'],
      personality: ['visionary', 'builder', 'operator', 'teacher'],
      workStyle: ['solo_deep', 'systems', 'collaborative', 'client_facing'],
      industries: ['technology', 'education', 'food'],
      techComfort: ['beginner', 'comfortable', 'builder', 'advanced'],
      presence: ['online', 'local', 'hybrid'],
    };
    for (let index = 0; index < 40; index += 1) {
      const answers: Answers = {};
      if (random() > 0.2) answers.skills = pickSome(choices.skills, random);
      if (random() > 0.2) answers.interests = pickSome(choices.interests, random);
      if (random() > 0.2) answers.industries = pickSome(choices.industries, random);
      for (const key of ['experience', 'capital', 'time', 'revenueGoal', 'personality', 'workStyle', 'techComfort', 'presence'] as const) {
        if (random() > 0.15) answers[key] = choices[key][Math.floor(random() * choices[key].length)];
      }
      const report = scoreAssessment(answers);
      for (const score of [report.founderReadiness, report.businessLaunch, report.fundingReadiness]) {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
        expect(Number.isInteger(score)).toBe(true);
      }
      expect(ARCHETYPE_TIE_BREAK).toContain(report.archetype.id);
    }
  });

  it('is deterministic and empty answers stay low', () => {
    const once = scoreAssessment({});
    const twice = scoreAssessment({});
    expect(once).toEqual(twice);
    expect(once.founderReadiness).toBe(0);
    expect(once.businessLaunch).toBe(0);
    expect(once.fundingReadiness).toBe(0);
    expect(once.archetype.id).toBe('visionary_builder');
  });

  it('breaks archetype ties in a fixed order and treats no signal as visionary', () => {
    expect(pickArchetype({ business_operator: 5, visionary_builder: 5, educator: 1 })).toBe('business_operator');
    expect(pickArchetype({ educator: 0, visionary_builder: 0 })).toBe('visionary_builder');
  });

  it('raises readiness when the founder can give the work more time', () => {
    const less = scoreAssessment({ ...mixed, time: 'side_5' });
    const more = scoreAssessment({ ...mixed, time: 'full_40' });
    expect(more.founderReadiness).toBeGreaterThan(less.founderReadiness);
    expect(more.businessLaunch).toBeGreaterThan(less.businessLaunch);
  });
});

function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function pickSome(options: string[], random: () => number): string[] {
  return options.filter(() => random() > 0.45);
}
