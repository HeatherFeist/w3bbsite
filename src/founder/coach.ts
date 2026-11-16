import type { ChatMessage, CoachContext } from './types';

export function coachReply(message: string, ctx: CoachContext): string {
  const question = message.toLowerCase();
  const name = ctx.name ? ctx.name.split(' ')[0] : 'there';
  const lines: string[] = [`${name}, this note is from the on-device launch advisor. It uses your saved assessment, blueprint, and progress.`];

  if (!ctx.archetypeName) {
    lines.push('The Founder Discovery Assessment is still open. Finish it and I can recommend a model, a next task, and whether the Launchpad or the Business Builder should come first.');
    lines.push('I will not invent grant amounts, deadlines, or a Trust-Approved badge.');
    return lines.join('\n\n');
  }

  if (/fund|grant|capital|investor/.test(question)) {
    lines.push(`Funding readiness is ${ctx.fundingReadiness ?? 0} out of 100. That is a planning score from your answers, not a decision by a lender or a grantmaker.`);
    lines.push('The Funding Hub is sample data for practice matching. Those records are not live opportunities, and they have no real amounts or deadlines.');
    lines.push(
      (ctx.fundingReadiness ?? 0) < 60
        ? 'Write who you serve, what delivery costs in time, and what proof you have. Then keep building in the Business Builder.'
        : 'You have enough structure to prepare a real application later. Keep treating the hub as practice until you are looking at a program outside this demo.',
    );
  } else if (/builder|launchpad|zero|where do i|connect|w3bb/.test(question)) {
    lines.push('Launch plans the venture. The Business Builder is where the business is created: name, products, assets, operations, and launch prep. The eight steps already on the site stay the source of truth.');
    lines.push(
      ctx.lowCapital
        ? 'Your capital answer points to the Entrepreneur Launchpad and the Zero-Dollar Startup Path before any spending on formation.'
        : 'If money gets tight, the Entrepreneur Launchpad is the nonprofit program already on this site. You do not need a second incubator inside Launch.',
    );
  } else if (/cert|pathway|course|trust/.test(question)) {
    lines.push(`Pathway credibility is ${ctx.credibility} out of 100. It only counts the seven new learning tracks.`);
    lines.push('Trust-Approved Certification is the capstone. It is a business-level review backed by the Webb Family Dynasty Trust. Checking off a pathway does not award that badge.');
    lines.push(ctx.nextPathway ? `Next track: ${ctx.nextPathway}.` : 'All seven tracks are checked. Read the Trust Certification page and apply only if the business itself is ready.');
  } else if (/model|match|saas|why this|what business|idea/.test(question)) {
    lines.push(
      ctx.topMatch
        ? `The strongest rules match is ${ctx.topMatch}${ctx.topMatchScore != null ? ` (${ctx.topMatchScore} out of 100)` : ''}. ${ctx.topMatchReason ?? ''}`.trim()
        : 'Finish the assessment to get business matches.',
    );
    lines.push('A match is a recommendation. You can choose another model and generate a blueprint for that one. The blueprint still hands the work to the Business Builder.');
  } else if (/next|week|today|task|focus|goal/.test(question)) {
    lines.push(ctx.nextTask ? `Do this next: ${ctx.nextTask}.` : 'You have no open launch task. Set one weekly goal, then continue in the Business Builder.');
    lines.push(ctx.blueprintTitle ? `Blueprint on file: ${ctx.blueprintTitle}.` : 'Generate a blueprint after you pick a model. Until then the plan is only a score.');
  } else {
    lines.push(`You profile as a ${ctx.archetypeName}. Founder readiness ${ctx.founderReadiness ?? 0}, launch ${ctx.businessLaunch ?? 0}, funding readiness ${ctx.fundingReadiness ?? 0}.`);
    lines.push(ctx.lowestAdvice);
    lines.push(ctx.blueprintTitle ? `Blueprint on file: ${ctx.blueprintTitle}.` : 'When a model feels right, generate a blueprint, then open the Business Builder.');
  }

  lines.push(`You are at the ${ctx.levelName} level. Context on file: ${ctx.memory || 'no earlier coaching note yet'}.`);
  return lines.join('\n\n');
}

export function coachAiMessages(history: ChatMessage[], ctx: CoachContext): { role: string; content: string }[] {
  const context = {
    archetype: ctx.archetypeName ?? null,
    scores: {
      founderReadiness: ctx.founderReadiness ?? null,
      businessLaunch: ctx.businessLaunch ?? null,
      fundingReadiness: ctx.fundingReadiness ?? null,
    },
    topMatch: ctx.topMatch ?? null,
    blueprint: ctx.blueprintTitle ?? null,
    nextTask: ctx.nextTask ?? null,
    nextPathway: ctx.nextPathway ?? null,
    credibility: ctx.credibility,
    level: ctx.levelName,
    lowCapital: ctx.lowCapital,
    memory: ctx.memory,
  };
  return [
    {
      role: 'system',
      content: [
        'You are the W3BB Launch Coach, inside the W3BB Worldwide site.',
        'Use only the founder context below. Do not invent grant amounts, deadlines, revenue, or a claim that the business is Trust-Approved.',
        'The seven learning pathways are new tracks in this product. They are not existing W3BB courses.',
        'Trust-Approved Certification is a separate business-level capstone backed by the Webb Family Dynasty Trust.',
        'The Business Builder and the Entrepreneur Launchpad already exist. Point the founder to them instead of inventing a second builder.',
        'CDI is the nonprofit backbone, W3BB is the digital hub, and sponsored businesses are the network.',
        'Be concrete, calm, and brief. Plain sentences. No hype.',
        `Founder context: ${JSON.stringify(context)}`,
      ].join('\n'),
    },
    ...history.slice(-12).map((message) => ({ role: message.role, content: message.content })),
  ];
}

export function blueprintAiMessages(blueprintJson: unknown): { role: string; content: string }[] {
  return [
    {
      role: 'system',
      content: [
        'Rewrite the narrative fields of this W3BB business blueprint.',
        'Return JSON only, with any of these keys: nameIdeas, mission, vision, elevatorPitch, targetCustomer, competitiveAdvantage, revenueStreams, marketingStrategy, risks.',
        'Do not invent dollar forecasts, grant amounts, or deadlines.',
        'Do not say the business is already certified.',
        'Keep the founder pointed at the existing Business Builder.',
      ].join(' '),
    },
    { role: 'user', content: JSON.stringify(blueprintJson) },
  ];
}
