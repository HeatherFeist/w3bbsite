import { MODELS, type ArchetypeId } from './catalog';
import type { Answers, ModelMatch } from './types';

export interface MatchInput {
  answers: Answers;
  archetypeId: string;
  orgType?: string;
}

function clamp(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function matchBusinesses(input: MatchInput): ModelMatch[] {
  const { answers, archetypeId, orgType } = input;
  const skills = new Set(answers.skills ?? []);
  const interests = new Set(answers.interests ?? []);
  const industries = new Set(answers.industries ?? []);
  const tech = answers.techComfort;
  const techHigh = tech === 'builder' || tech === 'advanced';
  const techMid = techHigh || tech === 'comfortable';

  return MODELS.map((model) => {
    let score = 12;
    const reasons: string[] = [];
    const add = (points: number, reason: string) => {
      score += points;
      if (points > 0) reasons.push(reason);
    };

    if (model.id === 'saas') {
      if (techHigh) add(22, 'You are comfortable building software.');
      else if (tech === 'comfortable') add(8, 'You can work with software tools, with a narrower first version.');
      if (answers.presence === 'online' || answers.presence === 'hybrid') add(10, 'An online or hybrid presence fits software.');
      if (skills.has('engineering') || skills.has('product')) add(14, 'Engineering or product skills match a software business.');
      if (answers.time === 'full_40' || answers.time === 'part_25') add(10, 'You have enough weekly time to shape a product.');
      if (archetypeId === 'technical_founder') add(12, 'Your archetype is a Technical Founder.');
      if (answers.capital && answers.capital !== 'none') add(6, 'Some capital makes a product build easier to sustain.');
      if (answers.capital === 'none') score -= 6;
    }

    if (model.id === 'ai_agency') {
      if (techMid) add(14, 'You can use tools well enough to deliver with AI in the loop.');
      if (skills.has('sales') || skills.has('marketing')) add(12, 'Sales or marketing helps an agency find the first clients.');
      if (answers.workStyle === 'client_facing' || answers.workStyle === 'collaborative') {
        add(10, 'Your work style fits client delivery.');
      }
      if (answers.presence === 'online' || answers.presence === 'hybrid') add(8, 'The work can be delivered online.');
      if (archetypeId === 'technical_founder' || archetypeId === 'service_entrepreneur') {
        add(8, 'Your archetype fits a specialized service.');
      }
      if (interests.has('making') || interests.has('helping')) add(6, 'You want to make things or help people directly.');
    }

    if (model.id === 'coaching') {
      if (skills.has('teaching')) add(18, 'Teaching and coaching are already skills you named.');
      if (answers.personality === 'teacher' || answers.personality === 'connector') {
        add(12, 'You start with people or with teaching.');
      }
      if (archetypeId === 'educator') add(12, 'Your archetype is Educator.');
      if (interests.has('teaching') || interests.has('helping')) add(8, 'Teaching or direct help is an interest.');
      if (answers.capital === 'none' || answers.capital === 'under_1k') {
        add(6, 'Coaching can start before you buy infrastructure.');
      }
      if (answers.time && answers.time !== 'side_5') add(6, 'You have more than a sliver of weekly time.');
    }

    if (model.id === 'ecommerce') {
      if (interests.has('commerce')) add(14, 'Commerce is an interest you chose.');
      if (industries.has('retail') || industries.has('food')) add(10, 'Retail or food fits a product catalog.');
      if (answers.presence === 'online' || answers.presence === 'hybrid') add(8, 'You can sell beyond a single location.');
      if (answers.capital && answers.capital !== 'none') add(10, 'Some capital helps a product catalog.');
      if (skills.has('marketing') || skills.has('sales')) add(8, 'Marketing or sales helps a store find buyers.');
      if (archetypeId === 'business_operator' || archetypeId === 'creative_innovator') {
        add(6, 'Your archetype can carry a catalog.');
      }
    }

    if (model.id === 'digital_products') {
      if (skills.has('content') || skills.has('design') || skills.has('teaching')) {
        add(14, 'Content, design, or teaching can become a product.');
      }
      if (answers.personality === 'creator') add(12, 'You start with the work itself.');
      if (archetypeId === 'creative_innovator' || archetypeId === 'educator') {
        add(12, 'Your archetype fits a packaged product.');
      }
      if (answers.presence === 'online') add(10, 'You want the business online first.');
      if (answers.capital === 'none' || answers.capital === 'under_1k') {
        add(8, 'A digital product can start with time and a simple checkout.');
      }
      if (interests.has('creative') || interests.has('teaching')) add(8, 'Creative work or teaching is an interest.');
    }

    if (model.id === 'membership') {
      if (skills.has('community')) add(16, 'Community building is a skill you named.');
      if (archetypeId === 'community_builder') add(12, 'Your archetype is Community Builder.');
      if (interests.has('community')) add(12, 'Community is an interest you chose.');
      if (answers.workStyle === 'collaborative') add(8, 'You do your best work with other people.');
      if (answers.personality === 'connector') add(8, 'You start with people.');
      if (answers.presence && answers.presence !== 'local') add(6, 'A membership can gather online or in a hybrid way.');
      if (answers.presence === 'local') add(4, 'A local circle can still be a membership.');
    }

    if (model.id === 'local_service') {
      if (answers.presence === 'local') add(20, 'You want the business to be local first.');
      if (answers.presence === 'hybrid') add(10, 'A hybrid plan still has a local side.');
      if (skills.has('trades') || skills.has('sales')) add(12, 'A trade or sales skill fits local service.');
      if (industries.has('home-services') || industries.has('food') || industries.has('professional-services')) {
        add(10, 'Your industry interest is delivered in person.');
      }
      if (archetypeId === 'service_entrepreneur') add(12, 'Your archetype is Service Entrepreneur.');
      if (tech === 'beginner') add(6, 'A local service does not depend on shipping software.');
      if (answers.workStyle === 'client_facing') add(8, 'Client-facing work is your strength.');
    }

    if (model.id === 'nonprofit') {
      if (interests.has('community') || interests.has('helping')) add(14, 'Community or direct help is an interest.');
      if (industries.has('community') || industries.has('education') || industries.has('sustainability')) {
        add(10, 'Your industry interest fits a mission program.');
      }
      if (orgType === 'nonprofit') add(12, 'You described a nonprofit or fiscal-sponsor path.');
      if (archetypeId === 'community_builder' || archetypeId === 'educator') {
        add(8, 'Your archetype fits mission-led work.');
      }
      if (answers.revenueGoal === 'explore') add(6, 'You are designing the mission before a sales target.');
      if (answers.capital === 'none') add(4, 'A nonprofit path can start with people and a program, not a budget.');
    }

    if (model.id === 'education_platform') {
      if (skills.has('teaching')) add(12, 'Teaching is one of your skills.');
      if (industries.has('education')) add(14, 'Education is an industry you chose.');
      if (archetypeId === 'educator') add(12, 'Your archetype is Educator.');
      if (techMid) add(10, 'You can host a cohort with everyday tools.');
      if (interests.has('teaching')) add(10, 'Teaching is an interest, not only a skill.');
      if (answers.presence === 'online' || answers.presence === 'hybrid') add(8, 'A learning offer can reach people online.');
      if (answers.personality === 'teacher') add(8, 'You start by helping people learn.');
    }

    const uniqueReasons = reasons.filter((reason, index) => reasons.indexOf(reason) === index).slice(0, 4);
    if (uniqueReasons.length === 0) {
      uniqueReasons.push('Possible, but fewer of your answers point here than at the models ranked above.');
    }

    return {
      id: model.id,
      name: model.name,
      summary: model.summary,
      matchScore: clamp(score),
      reasons: uniqueReasons,
      difficulty: model.difficulty,
      budgetBand: model.budgetBand,
      revenuePotential: model.revenuePotential,
      timeline: model.timeline,
      stack: model.stack,
    };
  }).sort((a, b) => b.matchScore - a.matchScore || a.name.localeCompare(b.name));
}
