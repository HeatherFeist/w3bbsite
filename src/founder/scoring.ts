import { ARCHETYPES, ARCHETYPE_TIE_BREAK, type ArchetypeId } from './catalog';
import type { Answers, ArchetypeResult, Factor, ScoreReport } from './types';

/** Each map is the share of that factor's weight. Weights themselves sum to 100. */
export const READINESS_WEIGHTS = {
  experience: 20,
  skills: 15,
  time: 15,
  tech: 10,
  workStyle: 10,
  personality: 10,
  capital: 10,
  focus: 10,
} as const;

export const LAUNCH_WEIGHTS = {
  time: 20,
  skills: 15,
  goalFit: 20,
  presence: 10,
  experience: 15,
  tech: 10,
  industry: 10,
} as const;

export const FUNDING_WEIGHTS = {
  experience: 25,
  capital: 15,
  revenueClarity: 15,
  skillSignals: 15,
  time: 10,
  industry: 10,
  structure: 10,
} as const;

const EXPERIENCE: Record<string, number> = { none: 15, some: 45, operator: 75, founder: 100 };
const TIME: Record<string, number> = { side_5: 25, side_15: 50, part_25: 75, full_40: 100 };
const TECH: Record<string, number> = { beginner: 30, comfortable: 60, builder: 85, advanced: 100 };
const WORK: Record<string, number> = { solo_deep: 90, systems: 100, collaborative: 75, client_facing: 80 };
const PERSONALITY: Record<string, number> = {
  operator: 100,
  builder: 90,
  visionary: 75,
  creator: 70,
  teacher: 75,
  connector: 70,
};
const CAPITAL: Record<string, number> = {
  none: 35,
  under_1k: 55,
  '1k_10k': 75,
  '10k_50k': 90,
  over_50k: 100,
};
const REVENUE: Record<string, number> = { explore: 40, side_income: 70, replace_job: 85, scale: 100 };

const FUNDING_SKILLS = new Set(['finance', 'sales', 'operations', 'legal']);

export function contribute(percent: number, weight: number): number {
  return (percent * weight) / 100;
}

export function clampScore(sum: number): number {
  if (!Number.isFinite(sum)) return 0;
  return Math.round(Math.min(100, Math.max(0, sum)));
}

export function sumWeights(weights: Record<string, number>): number {
  return Object.values(weights).reduce((sum, value) => sum + value, 0);
}

function lookup(map: Record<string, number>, value: string | undefined): number {
  if (!value) return 0;
  return map[value] ?? 0;
}

function listPercent(values: string[] | undefined, each: number): number {
  return Math.min(100, (values?.length ?? 0) * each);
}

export function focusPercent(answers: Answers): number {
  const industries = listPercent(answers.industries, 50);
  const interests = listPercent(answers.interests, 50);
  return Math.round(industries * 0.6 + interests * 0.4);
}

export function goalFitPercent(answers: Answers): number {
  const goal = answers.revenueGoal;
  if (!goal) return 0;
  if (goal === 'explore') return 90;
  if (goal === 'side_income') {
    if (!answers.time) return 40;
    return answers.time === 'side_5' ? 55 : 85;
  }
  if (goal === 'replace_job') {
    const enoughTime = answers.time === 'part_25' || answers.time === 'full_40';
    const someCapital = Boolean(answers.capital && answers.capital !== 'none');
    if (enoughTime && someCapital) return 80;
    if (enoughTime || someCapital) return 55;
    return 35;
  }
  if (goal === 'scale') {
    const proven = answers.experience === 'operator' || answers.experience === 'founder';
    const funded = answers.capital === '1k_10k' || answers.capital === '10k_50k' || answers.capital === 'over_50k';
    const full = answers.time === 'full_40';
    if (proven && funded && full) return 85;
    if (proven && (funded || full)) return 60;
    return 40;
  }
  return 0;
}

export function fundingSkillPercent(skills: string[] | undefined): number {
  const count = (skills ?? []).filter((id) => FUNDING_SKILLS.has(id)).length;
  return Math.min(100, count * 25);
}

export function structurePercent(answers: Answers): number {
  if (answers.workStyle === 'systems') return 100;
  if (answers.personality === 'operator') return 90;
  if (answers.workStyle || answers.personality) return 60;
  return 0;
}

function factor(id: string, label: string, weight: number, percent: number): Factor {
  const safe = Math.max(0, Math.min(100, percent));
  return {
    id,
    label,
    weight,
    percent: safe,
    points: contribute(safe, weight),
  };
}

function sumPoints(factors: Factor[]): number {
  return factors.reduce((sum, item) => sum + item.points, 0);
}

const SKILL_SIGNALS: Record<string, [ArchetypeId, number, string][]> = {
  engineering: [['technical_founder', 2, 'Software is one of your skills.']],
  design: [['creative_innovator', 2, 'Design is one of your skills.']],
  content: [
    ['creative_innovator', 2, 'Story and content are part of your skill set.'],
    ['educator', 1, 'Content skills also support teaching.'],
  ],
  sales: [
    ['service_entrepreneur', 2, 'Sales points toward direct client work.'],
    ['business_operator', 1, 'Sales is also an operating skill.'],
  ],
  marketing: [
    ['creative_innovator', 1, 'Marketing overlaps with creative work.'],
    ['service_entrepreneur', 1, 'Marketing supports a service offer.'],
  ],
  operations: [['business_operator', 2, 'Operations is a core operator skill.']],
  finance: [['business_operator', 2, 'Finance is a core operator skill.']],
  teaching: [['educator', 2, 'Teaching is one of your skills.']],
  community: [['community_builder', 2, 'Community building is one of your skills.']],
  trades: [['service_entrepreneur', 2, 'A trade or local skill points to service work.']],
  product: [
    ['technical_founder', 1, 'Product work supports a technical founder path.'],
    ['business_operator', 1, 'Product work also supports operating a business.'],
    ['visionary_builder', 1, 'Product work starts from a picture of what to build.'],
  ],
  legal: [['business_operator', 1, 'Compliance basics support an operator.']],
};

const INTEREST_SIGNALS: Record<string, [ArchetypeId, number, string][]> = {
  strategy: [
    ['visionary_builder', 2, 'You want strategy and new ideas.'],
    ['business_operator', 1, 'Strategy also feeds an operator.'],
  ],
  making: [
    ['technical_founder', 2, 'You want to make products.'],
    ['creative_innovator', 1, 'Making also feeds creative work.'],
  ],
  teaching: [['educator', 2, 'Teaching is an interest, not only a skill.']],
  community: [['community_builder', 2, 'Community is one of your interests.']],
  local: [['service_entrepreneur', 2, 'Local service is one of your interests.']],
  commerce: [
    ['business_operator', 1, 'Commerce needs an operator’s eye.'],
    ['service_entrepreneur', 1, 'Commerce can also be a direct service.'],
  ],
  creative: [['creative_innovator', 2, 'Creative work is one of your interests.']],
  research: [
    ['visionary_builder', 1, 'Research feeds a longer vision.'],
    ['technical_founder', 1, 'Research also feeds building.'],
  ],
  helping: [
    ['educator', 1, 'Helping people directly overlaps with teaching.'],
    ['community_builder', 1, 'Helping people directly overlaps with community.'],
    ['service_entrepreneur', 1, 'Helping people directly overlaps with service.'],
  ],
};

const INDUSTRY_SIGNALS: Record<string, [ArchetypeId, number, string][]> = {
  technology: [['technical_founder', 2, 'Technology is an industry you chose.']],
  education: [['educator', 2, 'Education is an industry you chose.']],
  health: [
    ['service_entrepreneur', 1, 'Health and care often starts as a service.'],
    ['educator', 1, 'Health and care also has a teaching path.'],
  ],
  food: [['service_entrepreneur', 2, 'Food and hospitality points to service.']],
  'home-services': [['service_entrepreneur', 2, 'Home services points to local service work.']],
  creative: [['creative_innovator', 2, 'A creative field is one of your industries.']],
  retail: [
    ['business_operator', 1, 'Retail needs operating discipline.'],
    ['service_entrepreneur', 1, 'Retail is also customer-facing service.'],
  ],
  'professional-services': [
    ['service_entrepreneur', 2, 'Professional services is client work.'],
    ['business_operator', 1, 'Professional services also needs operations.'],
  ],
  community: [['community_builder', 2, 'Community and nonprofit is an industry you chose.']],
  sustainability: [
    ['visionary_builder', 1, 'Sustainability often starts with a long vision.'],
    ['community_builder', 1, 'Sustainability also lives in community work.'],
  ],
};

export function pickArchetype(scores: Record<string, number>): ArchetypeId {
  const max = Math.max(...ARCHETYPE_TIE_BREAK.map((id) => scores[id] ?? 0));
  if (max <= 0) return 'visionary_builder';
  return ARCHETYPE_TIE_BREAK.find((id) => (scores[id] ?? 0) === max) ?? 'visionary_builder';
}

export function scoreArchetype(answers: Answers): ArchetypeResult {
  const scores = Object.fromEntries(ARCHETYPE_TIE_BREAK.map((id) => [id, 0])) as Record<ArchetypeId, number>;
  const reasons: { id: ArchetypeId; points: number; reason: string }[] = [];

  const add = (id: ArchetypeId, points: number, reason: string) => {
    if (points <= 0) return;
    scores[id] += points;
    reasons.push({ id, points, reason });
  };

  if (answers.personality === 'visionary') add('visionary_builder', 4, 'You described a visionary way of starting.');
  if (answers.personality === 'builder') add('technical_founder', 3, 'You described yourself as a builder.');
  if (answers.personality === 'connector') add('community_builder', 4, 'You start with people and connection.');
  if (answers.personality === 'teacher') add('educator', 4, 'You start by helping people learn.');
  if (answers.personality === 'operator') add('business_operator', 4, 'You start with the system.');
  if (answers.personality === 'creator') add('creative_innovator', 4, 'You start with the work itself.');

  if (answers.techComfort === 'builder' || answers.techComfort === 'advanced') {
    add('technical_founder', 3, 'You are comfortable building with technology.');
  } else if (answers.techComfort === 'comfortable') {
    add('technical_founder', 1, 'You are comfortable with everyday tools.');
  }

  if (answers.workStyle === 'systems') add('business_operator', 3, 'Systems and routines are your best work setting.');
  if (answers.workStyle === 'client_facing') add('service_entrepreneur', 3, 'You do your best work with clients.');
  if (answers.workStyle === 'collaborative') add('community_builder', 2, 'Collaboration is your best work setting.');
  if (answers.workStyle === 'solo_deep') {
    add('technical_founder', 1, 'Solo deep work fits building.');
    add('creative_innovator', 1, 'Solo deep work also fits creative practice.');
  }

  if (answers.presence === 'local') add('service_entrepreneur', 3, 'You want the business to be local first.');
  if (answers.presence === 'hybrid') add('service_entrepreneur', 1, 'A hybrid presence still has a local side.');
  if (answers.presence === 'online') {
    add('technical_founder', 1, 'An online-first business fits a product path.');
    add('creative_innovator', 1, 'An online-first business fits creative distribution.');
  }

  if (answers.experience === 'operator') add('business_operator', 2, 'You have already operated a team or function.');
  if (answers.experience === 'founder') {
    add('business_operator', 1, 'You have founded something before.');
    add('visionary_builder', 1, 'Founding experience also feeds a visionary path.');
  }

  if (answers.revenueGoal === 'scale') {
    add('visionary_builder', 1, 'A scale goal needs a longer picture.');
    add('business_operator', 1, 'A scale goal also needs operating discipline.');
  }
  if (answers.revenueGoal === 'replace_job') add('business_operator', 1, 'Replacing a job rewards a reliable operation.');

  for (const skill of answers.skills ?? []) {
    for (const signal of SKILL_SIGNALS[skill] ?? []) add(signal[0], signal[1], signal[2]);
  }
  for (const interest of answers.interests ?? []) {
    for (const signal of INTEREST_SIGNALS[interest] ?? []) add(signal[0], signal[1], signal[2]);
  }
  for (const industry of answers.industries ?? []) {
    for (const signal of INDUSTRY_SIGNALS[industry] ?? []) add(signal[0], signal[1], signal[2]);
  }

  const id = pickArchetype(scores);
  const meta = ARCHETYPES.find((item) => item.id === id) ?? ARCHETYPES[0];
  const rationale = reasons
    .filter((reason) => reason.id === id)
    .sort((a, b) => b.points - a.points)
    .slice(0, 3)
    .map((reason) => reason.reason);

  if (rationale.length === 0) {
    rationale.push('There is not enough signal yet. The rest of the assessment will sharpen this.');
  }

  return { id, name: meta.name, summary: meta.summary, rationale, scores };
}

export function scoreAssessment(answers: Answers): ScoreReport {
  const readinessFactors = [
    factor('experience', 'Experience', READINESS_WEIGHTS.experience, lookup(EXPERIENCE, answers.experience)),
    factor('skills', 'Skills', READINESS_WEIGHTS.skills, listPercent(answers.skills, 25)),
    factor('time', 'Time commitment', READINESS_WEIGHTS.time, lookup(TIME, answers.time)),
    factor('tech', 'Tech comfort', READINESS_WEIGHTS.tech, lookup(TECH, answers.techComfort)),
    factor('workStyle', 'Work style', READINESS_WEIGHTS.workStyle, lookup(WORK, answers.workStyle)),
    factor('personality', 'Personality', READINESS_WEIGHTS.personality, lookup(PERSONALITY, answers.personality)),
    factor('capital', 'Startup capital', READINESS_WEIGHTS.capital, lookup(CAPITAL, answers.capital)),
    factor('focus', 'Industry and interest focus', READINESS_WEIGHTS.focus, focusPercent(answers)),
  ];

  const launchFactors = [
    factor('time', 'Time commitment', LAUNCH_WEIGHTS.time, lookup(TIME, answers.time)),
    factor('skills', 'Skills', LAUNCH_WEIGHTS.skills, listPercent(answers.skills, 25)),
    factor('goalFit', 'Revenue goal fit', LAUNCH_WEIGHTS.goalFit, goalFitPercent(answers)),
    factor('presence', 'Online or local clarity', LAUNCH_WEIGHTS.presence, answers.presence ? 100 : 0),
    factor('experience', 'Experience', LAUNCH_WEIGHTS.experience, lookup(EXPERIENCE, answers.experience)),
    factor('tech', 'Tech comfort', LAUNCH_WEIGHTS.tech, lookup(TECH, answers.techComfort)),
    factor('industry', 'Industry focus', LAUNCH_WEIGHTS.industry, listPercent(answers.industries, 50)),
  ];

  const fundingFactors = [
    factor('experience', 'Experience', FUNDING_WEIGHTS.experience, lookup(EXPERIENCE, answers.experience)),
    factor('capital', 'Capital on hand', FUNDING_WEIGHTS.capital, lookup(CAPITAL, answers.capital)),
    factor('revenueClarity', 'Revenue goal clarity', FUNDING_WEIGHTS.revenueClarity, lookup(REVENUE, answers.revenueGoal)),
    factor('skillSignals', 'Finance, sales, and operations skills', FUNDING_WEIGHTS.skillSignals, fundingSkillPercent(answers.skills)),
    factor('time', 'Time commitment', FUNDING_WEIGHTS.time, lookup(TIME, answers.time)),
    factor('industry', 'Industry focus', FUNDING_WEIGHTS.industry, listPercent(answers.industries, 50)),
    factor('structure', 'Operating structure', FUNDING_WEIGHTS.structure, structurePercent(answers)),
  ];

  return {
    founderReadiness: clampScore(sumPoints(readinessFactors)),
    businessLaunch: clampScore(sumPoints(launchFactors)),
    fundingReadiness: clampScore(sumPoints(fundingFactors)),
    readinessFactors,
    launchFactors,
    fundingFactors,
    archetype: scoreArchetype(answers),
  };
}
