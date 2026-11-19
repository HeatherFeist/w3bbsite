import { labelFor } from './catalog';
import { buildBlueprint, nameIdeas } from './blueprint';
import type { Answers, Blueprint, DomainSuggestion, LaunchKit, ModelMatch, ScoreReport } from './types';

const DOMAIN_NOTE = 'A spelling based on the working name. It has not been checked, and it is not registered.';

const MARK: Record<string, string> = {
  technology: 'a single arc, like a signal',
  education: 'an open page',
  health: 'a small harbor mark',
  food: 'a simple table line',
  'home-services': 'a keystone shape',
  creative: 'a folded folio corner',
  retail: 'a parcel outline',
  'professional-services': 'a short bench line',
  community: 'two overlapping circles',
  sustainability: 'a canopy curve',
};

const PALETTE = 'Ink #16141a, violet #6b4e9e, cyan #f0c674, and gold #d4a24a — the palette already used on this site.';

function slug(name: string): string {
  const compact = name.toLowerCase().replace(/[^a-z0-9]+/g, '');
  return (compact || 'venture').slice(0, 24);
}

function domainsFor(name: string): DomainSuggestion[] {
  const stem = slug(name);
  return [
    { host: `${stem}.com`, note: DOMAIN_NOTE },
    { host: `get${stem}.com`, note: DOMAIN_NOTE },
    { host: `${stem}.co`, note: DOMAIN_NOTE },
  ];
}

function channelFor(presence: string | undefined): { channel: string; steps: string[] } {
  if (presence === 'local') {
    return {
      channel: 'One neighborhood conversation, then one local post using the same sentence.',
      steps: [
        'Say the offer out loud to five people who match the customer line.',
        'Write down the words they repeat back.',
        'Post that sentence once, in the place those people already look.',
        'Ask for one reply. Stop there until someone answers.',
      ],
    };
  }
  if (presence === 'hybrid') {
    return {
      channel: 'One local conversation and one online post. Same sentence in both places.',
      steps: [
        'Have the conversation in person first.',
        'Use the customer’s words in a single online post.',
        'Point both at one way to reply.',
        'Keep every other channel closed for 30 days.',
      ],
    };
  }
  return {
    channel: 'One online profile and one post. No other channel this month.',
    steps: [
      'Create one profile with the name and bio below. Do not create five accounts.',
      'Publish the offer, not a manifesto.',
      'Give one way to reply.',
      'Wait for a real reply before you make more content.',
    ],
  };
}

function clean(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const text = value.trim();
  if (!text || text.includes('$') || /https?:\/\//i.test(text)) return null;
  return text;
}

export function buildLaunchKit(input: {
  answers: Answers;
  scores: ScoreReport;
  model: ModelMatch;
  blueprint?: Blueprint;
  now?: string;
}): LaunchKit {
  const now = input.now ?? new Date().toISOString();
  const blueprint = input.blueprint ?? buildBlueprint({
    answers: input.answers,
    scores: input.scores,
    model: input.model,
    now,
  });
  const name = blueprint.chosenName;
  const industry = input.answers.industries?.[0];
  const industryLabel = industry ? labelFor('industries', industry).toLowerCase() : 'the field you chose';
  const mark = MARK[industry ?? ''] ?? 'a simple geometric mark';
  const ideas = blueprint.nameIdeas.length ? blueprint.nameIdeas : nameIdeas(input.answers, input.model.id);
  const campaignShape = channelFor(input.answers.presence);
  const offer = `${name} delivers one ${input.model.name} offer in ${industryLabel}. The first version is small enough to finish with the time in the assessment.`;

  return {
    id: `launch-${input.model.id}`,
    modelId: input.model.id,
    modelName: input.model.name,
    source: 'rules',
    aiTried: false,
    businessName: name,
    nameOptions: ideas,
    domains: domainsFor(name),
    logos: [
      {
        name: 'Wordmark',
        mark: `The name “${name}” set in two weights, with no extra symbol.`,
        colors: PALETTE,
        type: 'A wide wordmark for a page header.',
      },
      {
        name: 'Monogram',
        mark: `The initials of “${name}” in a rounded tile.`,
        colors: 'Violet tile, gold edge, ink letters.',
        type: 'A small mark for an avatar.',
      },
      {
        name: 'Symbol',
        mark: `${mark}, drawn in one stroke beside the name.`,
        colors: 'Cyan mark on ink, with gold used only as a thin line.',
        type: 'A symbol to carry into the brand kit. This page does not draw the file.',
      },
    ],
    landing: {
      headline: `${name} helps you start.`,
      subhead: blueprint.elevatorPitch,
      body: `${blueprint.mission} ${blueprint.targetCustomer}`,
      callToAction: 'Tell me you want this',
    },
    socials: [
      {
        label: 'Profile name and bio',
        name,
        text: blueprint.elevatorPitch,
      },
      {
        label: 'About line',
        name,
        text: blueprint.mission,
      },
      {
        label: 'First post',
        name,
        text: `Working name: ${name}. Offer: one ${input.model.name} for ${blueprint.targetCustomer.charAt(0).toLowerCase()}${blueprint.targetCustomer.slice(1)} Reply if that is you.`,
      },
    ],
    campaign: {
      name: `First 30 days — ${name}`,
      channel: campaignShape.channel,
      message: blueprint.elevatorPitch,
      steps: campaignShape.steps,
    },
    businessPlan: {
      summary: `${blueprint.mission} ${blueprint.vision}`,
      offer,
      customer: blueprint.targetCustomer,
      plan90: blueprint.plan90.map((phase) => `${phase.phase}: ${phase.title}. ${phase.detail}`),
      risks: blueprint.risks,
    },
    fundingDraft: {
      title: `Draft note for ${name}`,
      body: [
        `I am building ${name}, a ${input.model.name} in ${industryLabel}.`,
        `Who it is for: ${blueprint.targetCustomer}`,
        `The offer: ${offer}`,
        `What I can show today: the assessment, this plan, and the founder archetype ${input.scores.archetype.name}. A customer conversation is still the missing proof.`,
        'I am not asking for a named award. I am writing the note I would adapt later, after the offer is real.',
      ].join('\n\n'),
      disclaimer: 'Draft only. It has not been sent. It does not name a funder, an amount, or a deadline. Sample records in the funding hub are not live awards.',
    },
    createdAt: blueprint.createdAt || now,
    updatedAt: now,
  };
}

export function launchKitAiMessages(kit: LaunchKit): { role: string; content: string }[] {
  return [
    {
      role: 'system',
      content: 'Revise a W3BB Launch With AI draft. Return one JSON object only. You may rewrite landing.headline, landing.subhead, landing.body, landing.callToAction, campaign.message, campaign.steps, and socials[].text. Keep the business name. Do not add URLs, prices, dollar amounts, testimonials, or statistics. Do not claim a domain is available or that an account or application exists.',
    },
    {
      role: 'user',
      content: JSON.stringify({
        businessName: kit.businessName,
        modelName: kit.modelName,
        landing: kit.landing,
        socials: kit.socials,
        campaign: kit.campaign,
      }),
    },
  ];
}

export function applyAiLaunchKit(base: LaunchKit, text: string): LaunchKit {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return { ...base, aiTried: true };
  try {
    const parsed = JSON.parse(match[0]) as {
      landing?: Partial<LaunchKit['landing']>;
      campaign?: { message?: unknown; steps?: unknown };
      socials?: { text?: unknown }[];
    };
    const next: LaunchKit = { ...base, source: 'ai', aiTried: true, updatedAt: new Date().toISOString() };
    const landing = { ...base.landing };
    for (const key of ['headline', 'subhead', 'body', 'callToAction'] as const) {
      const value = clean(parsed.landing?.[key]);
      if (value) landing[key] = value;
    }
    next.landing = landing;
    const message = clean(parsed.campaign?.message);
    if (message) next.campaign = { ...base.campaign, message };
    if (Array.isArray(parsed.campaign?.steps)) {
      const steps = parsed.campaign.steps.map((step) => clean(step)).filter((step): step is string => Boolean(step));
      if (steps.length) next.campaign = { ...next.campaign, steps };
    }
    if (Array.isArray(parsed.socials)) {
      next.socials = base.socials.map((social, index) => {
        const value = clean(parsed.socials?.[index]?.text);
        return value ? { ...social, text: value } : social;
      });
    }
    return next;
  } catch {
    return { ...base, aiTried: true };
  }
}
