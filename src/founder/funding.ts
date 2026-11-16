import { FUNDING_OPPORTUNITIES, type FundingOpportunity } from './catalog';
import type { Answers } from './types';

export interface FundingMatch extends FundingOpportunity {
  matchScore: number;
  reasons: string[];
}

export function deriveStage(answers: Answers): 'idea' | 'pre-revenue' | 'operating' {
  if (answers.experience === 'founder' || answers.experience === 'operator') return 'operating';
  if (answers.experience === 'some') return 'pre-revenue';
  return 'idea';
}

export function matchFunding(input: {
  answers: Answers;
  orgType?: string;
  modelId?: string | null;
  opportunities?: FundingOpportunity[];
}): FundingMatch[] {
  const stage = deriveStage(input.answers);
  const industry = new Set(input.answers.industries ?? []);
  const presence = input.answers.presence;
  const revenue = input.answers.revenueGoal;
  const org = input.orgType;
  const model = input.modelId;

  return (input.opportunities ?? FUNDING_OPPORTUNITIES)
    .map((opportunity) => {
      let score = 20;
      const reasons: string[] = ['Sample record for practice matching. Not a live grant.'];
      const hit = (points: number, reason: string) => {
        score += points;
        reasons.push(reason);
      };

      if (opportunity.industries.length === 0) {
        hit(8, 'Industry is open on this sample.');
      } else if ([...industry].some((item) => opportunity.industries.includes(item))) {
        hit(16, 'Industry overlaps your assessment.');
      }

      if (presence && opportunity.locations.includes(presence)) {
        hit(16, 'Location preference overlaps your online or local answer.');
      }
      if (model && opportunity.businessTypes.includes(model)) {
        hit(16, 'Business type overlaps your selected model.');
      }
      if (opportunity.stages.includes(stage)) {
        hit(16, `Stage overlap: ${stage.replace('-', ' ')}.`);
      }
      if (revenue && opportunity.revenueGoals.includes(revenue)) {
        hit(12, 'Revenue goal overlaps this sample.');
      }
      if (org && opportunity.orgTypes.includes(org)) {
        hit(12, 'Organization type overlaps your profile.');
      }

      return {
        ...opportunity,
        matchScore: Math.max(0, Math.min(100, score)),
        reasons,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore || a.name.localeCompare(b.name));
}
