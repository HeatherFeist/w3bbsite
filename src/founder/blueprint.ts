import { BUILDER } from '@/data/site';
import { labelFor, modelById } from './catalog';
import type { Answers, Blueprint, ChecklistItem, ModelMatch, ScoreReport } from './types';

const NAME_ROOTS: Record<string, string[]> = {
  technology: ['Northline', 'Relay', 'Signal'],
  education: ['Lantern', 'Primer', 'Kindred'],
  health: ['Harbor', 'Steady', 'Kin'],
  food: ['Hearth', 'Grove', 'Table'],
  'home-services': ['Fieldwork', 'Keystone', 'Neighbor'],
  creative: ['Atelier', 'Brightwork', 'Folio'],
  retail: ['Parcel', 'Counter', 'Market'],
  'professional-services': ['Bench', 'Counsel', 'Practice'],
  community: ['Common', 'Gather', 'Circle'],
  sustainability: ['Canopy', 'Root', 'Renew'],
};

const MODEL_SUFFIX: Record<string, string> = {
  saas: 'Lab',
  ai_agency: 'Studio',
  coaching: 'Practice',
  ecommerce: 'Supply',
  digital_products: 'Press',
  membership: 'Circle',
  local_service: 'Co',
  nonprofit: 'Project',
  education_platform: 'Academy',
};

const BUILDER_DETAIL: Record<string, string> = {
  '01': 'Use the name ideas when you name the business. The Business Builder is where the identity is created.',
  '02': 'Turn the offer and revenue notes into a real product or service in the builder.',
  '03': 'Brand and product assets are generated in the builder. This blueprint does not mint them.',
  '04': 'Carry the customer, the offer, and the advantage into the business-logic step.',
  '05': 'Use the target customer and marketing notes to design the customer journey.',
  '06': 'Turn the 90-day plan into the operating routines the builder asks for.',
  '07': 'Multimedia, including an intro video, is created in the builder.',
  '08': 'Launch preparation stays in the builder. Come back here for the coach, pathways, and the sample funding list.',
};

export function nameIdeas(answers: Answers, modelId: string): string[] {
  const industry = answers.industries?.[0] ?? 'community';
  const roots = NAME_ROOTS[industry] ?? ['Harbor', 'Kindred', 'Fieldnote'];
  const suffix = MODEL_SUFFIX[modelId] ?? 'Studio';
  return roots.map((root) => (root === suffix ? root : `${root} ${suffix}`));
}

export function programLinks(answers: Answers): ChecklistItem[] {
  const links: ChecklistItem[] = [
    {
      id: 'builder',
      label: 'Business Builder — create the business',
      href: '/build',
    },
    {
      id: 'builder-steps',
      label: 'See the 8 builder steps',
      href: '/#builder',
    },
    {
      id: 'launchpad',
      label: 'Entrepreneur Launchpad — the nonprofit starting program',
      href: '/launchpad',
    },
  ];
  if (answers.capital === 'none' || answers.capital === 'under_1k' || answers.revenueGoal === 'explore') {
    links.push({
      id: 'zero',
      label: 'Zero-Dollar Startup Path',
      href: '/zero-dollar-startup',
    });
  }
  links.push(
    { id: 'ecosystem', label: 'The W3BB ecosystem', href: '/ecosystem' },
    {
      id: 'trust',
      label: 'Trust-Approved Certification — the capstone, not the first step',
      href: '/certification',
    },
  );
  return links;
}

function customer(answers: Answers, modelName: string): string {
  const industry = answers.industries?.[0] ? labelFor('industries', answers.industries[0]) : 'your field';
  const place =
    answers.presence === 'local'
      ? 'in their local area'
      : answers.presence === 'hybrid'
        ? 'online and in their community'
        : 'online';
  return `People who need a ${modelName} offer in ${industry.toLowerCase()}, and who will meet you ${place}.`;
}

function risksFor(answers: Answers, scores: ScoreReport, modelId: string): string[] {
  const risks: string[] = [];
  if ((answers.time === 'side_5' || !answers.time) && (modelId === 'saas' || modelId === 'education_platform')) {
    risks.push('Five hours a week can start research. It will not support a full product build. Keep the first milestone small enough to finish.');
  }
  if (answers.capital === 'none' && (modelId === 'saas' || modelId === 'ecommerce')) {
    risks.push('This model is easier with a small tool or inventory budget. Use a manual first version, or switch to a service or digital product, if the budget is zero.');
  }
  if (scores.fundingReadiness < 50) {
    risks.push('Funding conversations will be weak until the offer, the costs, and some proof are written down. The sample funding list is practice, not a source of cash.');
  }
  if ((answers.techComfort === 'beginner' || !answers.techComfort) && (modelId === 'saas' || modelId === 'education_platform')) {
    risks.push('The matched model asks for more technical build than your current comfort. A service version of the same idea lowers that risk.');
  }
  if (answers.experience === 'none') {
    risks.push('A first venture needs a smaller promise. Sell one offer before you design a platform.');
  }
  if (risks.length === 0) {
    risks.push('The main risk is staying in planning. Move the blueprint into the Business Builder and talk to a real customer.');
  }
  return risks;
}

export function buildBlueprint(input: {
  answers: Answers;
  scores: ScoreReport;
  model: ModelMatch;
  profileName?: string;
  ventureName?: string;
  now?: string;
}): Blueprint {
  const { answers, scores, model } = input;
  const now = input.now ?? new Date().toISOString();
  const ideas = nameIdeas(answers, model.id);
  const chosen = input.ventureName?.trim() || ideas[0];
  const who = customer(answers, model.name);
  const archetype = scores.archetype.name;
  const lowCapital = answers.capital === 'none' || answers.capital === 'under_1k';
  const industry = answers.industries?.[0] ? labelFor('industries', answers.industries[0]).toLowerCase() : 'the field you chose';

  const checklist: ChecklistItem[] = [
    { id: 'pick-name', label: `Choose a working name. Current suggestion: ${chosen}.`, href: '/launch/blueprint' },
    { id: 'open-builder', label: 'Open the Business Builder and start the real business record.', href: '/build' },
    { id: 'customer', label: 'Have five conversations with the target customer before you add features.', href: '/build' },
    { id: 'pathway', label: 'Start the Business Foundations pathway.', href: '/launch/certifications' },
    { id: 'profile', label: 'Complete the founder profile so the coach has a person to talk to.', href: '/launch/profile' },
  ];
  if (lowCapital) {
    checklist.splice(2, 0, {
      id: 'launchpad',
      label: 'Join the Entrepreneur Launchpad and read the Zero-Dollar Startup Path before spending money.',
      href: '/launchpad',
    });
  }

  return {
    id: `blueprint-${model.id}`,
    modelId: model.id,
    modelName: model.name,
    source: 'rules',
    nameIdeas: ideas,
    chosenName: chosen,
    mission: `${chosen} helps ${who.charAt(0).toLowerCase()}${who.slice(1).replace(/\.$/, '')} take a useful step without a long, expensive setup.`,
    vision: `${chosen} becomes a clear, certifiable ${model.name} business in ${industry}, built inside W3BB and ready for Trust-Approved review when the work is real.`,
    elevatorPitch: `${chosen} is a ${model.name} for ${who.charAt(0).toLowerCase()}${who.slice(1)} I am a ${archetype}, and the first version is small enough to deliver with the time I actually have.`,
    targetCustomer: who,
    competitiveAdvantage: `The advantage is the founder’s way of working: ${scores.archetype.summary} The business is also built inside W3BB, so the identity, assets, and later certification sit in one ecosystem instead of a pile of files.`,
    revenueStreams: revenueFor(model.id),
    marketingStrategy: marketingFor(answers.presence),
    launchChecklist: checklist,
    plan90: [
      {
        phase: 'Days 1–30',
        title: 'Prove the offer',
        detail: lowCapital
          ? 'Join the Entrepreneur Launchpad. Use the Zero-Dollar Startup Path. Write the offer from this blueprint and test it in five conversations.'
          : 'Open the Business Builder at the naming and product steps. Test the offer from this blueprint in five conversations.',
      },
      {
        phase: 'Days 31–60',
        title: 'Deliver the first version',
        detail: `Deliver one ${model.name} version by hand. Do not build a platform yet. Capture what the customer actually used.`,
      },
      {
        phase: 'Days 61–90',
        title: 'Make it repeatable',
        detail: 'Write the delivery steps, the price, and one piece of proof. Then decide whether to keep going in the Business Builder toward certification.',
      },
    ],
    milestones12: [
      { phase: 'Quarter 1', title: 'Offer live', detail: 'A named offer exists in the Business Builder and at least one real person has responded.' },
      { phase: 'Quarter 2', title: 'Repeatable delivery', detail: 'You can deliver the offer without inventing the process each time.' },
      { phase: 'Quarter 3', title: 'A simple financial rhythm', detail: 'Price, costs, and payments are written down. No sample grant is treated as revenue.' },
      { phase: 'Quarter 4', title: 'Decide the next container', detail: 'Stay independent, package a Franchise Bundle, or apply for Trust-Approved Certification if the business is ready.' },
    ],
    risks: risksFor(answers, scores, model.id),
    techStack: model.stack,
    builderHandoff: BUILDER.steps.map((step) => ({
      phase: step.n,
      title: step.title,
      detail: BUILDER_DETAIL[step.n] ?? 'Continue this step in the Business Builder.',
    })),
    programLinks: programLinks(answers),
    createdAt: now,
    updatedAt: now,
  };
}

function revenueFor(modelId: string): string[] {
  const common = 'These are ways the model can earn. They are not a forecast and they are not grant income.';
  const map: Record<string, string[]> = {
    saas: ['Monthly or annual subscription for the software.', 'Setup help for the first customers.', common],
    ai_agency: ['Fixed-price client projects.', 'A monthly retainer after the first project.', common],
    coaching: ['Single sessions.', 'A short package of sessions.', common],
    ecommerce: ['Product sales after costs.', 'A small repeat order from the same customer.', common],
    digital_products: ['One-time purchase of a file, template, or workshop.', 'A bundle once the first product has buyers.', common],
    membership: ['Recurring member dues.', 'A paid gathering or workshop for members.', common],
    local_service: ['A priced job or visit.', 'A simple maintenance plan for repeat customers.', common],
    nonprofit: ['Donations and program support.', 'Earned income only where the mission allows it.', 'Sample grants in this app are not a revenue stream.', common],
    education_platform: ['Tuition for one cohort.', 'A later license of the curriculum if the cohort works.', common],
  };
  return map[modelId] ?? [common];
}

function marketingFor(presence: string | undefined): string[] {
  if (presence === 'local') {
    return [
      'Ask five people in the place you serve. Start there, not with a brand campaign.',
      'Use the W3BB community and, if you join it, the Launchpad network.',
      'Collect one photo or story of the work as proof. The Business Builder can hold the marketing assets later.',
    ];
  }
  if (presence === 'hybrid') {
    return [
      'Pick one online place and one local place. Ignore every other channel for 30 days.',
      'Point both places at the same one-sentence offer.',
      'Use proof from the local work to explain the offer online.',
    ];
  }
  return [
    'Pick one online channel you will still open in week four.',
    'Publish the offer, not a manifesto. Link it to a way to reply.',
    'Turn the first useful reply into proof before you make more content.',
  ];
}

export function applyAiBlueprint(base: Blueprint, text: string): Blueprint {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return base;
  try {
    const parsed = JSON.parse(match[0]) as Partial<Blueprint>;
    const next: Blueprint = { ...base, source: 'ai', updatedAt: new Date().toISOString() };
    const copy = ['mission', 'vision', 'elevatorPitch', 'targetCustomer', 'competitiveAdvantage'] as const;
    for (const key of copy) {
      const value = parsed[key];
      if (typeof value === 'string' && value.trim()) next[key] = value.trim();
    }
    if (Array.isArray(parsed.revenueStreams) && parsed.revenueStreams.every((item) => typeof item === 'string')) {
      next.revenueStreams = parsed.revenueStreams.filter(Boolean);
    }
    if (Array.isArray(parsed.marketingStrategy) && parsed.marketingStrategy.every((item) => typeof item === 'string')) {
      next.marketingStrategy = parsed.marketingStrategy.filter(Boolean);
    }
    if (Array.isArray(parsed.risks) && parsed.risks.every((item) => typeof item === 'string')) {
      next.risks = parsed.risks.filter(Boolean);
    }
    if (Array.isArray(parsed.nameIdeas) && parsed.nameIdeas.every((item) => typeof item === 'string') && parsed.nameIdeas.length) {
      next.nameIdeas = parsed.nameIdeas.slice(0, 5);
      if (!base.chosenName) next.chosenName = next.nameIdeas[0];
    }
    return next;
  } catch {
    return base;
  }
}

export function blueprintModelOrTop(selectedId: string | null, matches: ModelMatch[]): ModelMatch | null {
  return matches.find((match) => match.id === selectedId) ?? matches[0] ?? null;
}

export function knownModel(id: string): boolean {
  return Boolean(modelById(id));
}
