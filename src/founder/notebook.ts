import type { Blueprint, BuilderNotebook } from './types';

export interface NotebookField {
  id: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
  /** The line shown on the Business Builder list. */
  summary?: boolean;
}

export const NOTEBOOK_FIELDS: Record<string, NotebookField[]> = {
  'naming-branding': [
    { id: 'name', label: 'Working name', placeholder: 'The name you are using for now', summary: true },
    { id: 'who', label: 'Who it is for', placeholder: 'One sentence about the person this name is for' },
    { id: 'story', label: 'Story and positioning', placeholder: 'The short story of the business', multiline: true },
    { id: 'look', label: 'Look and feeling', placeholder: 'Colors, type, and the feeling to keep' },
  ],
  'product-development': [
    { id: 'offer', label: 'The offer', placeholder: 'The one product or service you will deliver first', summary: true },
    { id: 'included', label: 'What is included', placeholder: 'What the customer gets, and what they do not get', multiline: true },
    { id: 'effort', label: 'Effort to deliver it once', placeholder: 'The work it takes you to deliver this once' },
  ],
  'asset-generation': [
    { id: 'list', label: 'Assets the first offer needs', placeholder: 'The files you actually need before anyone sees this', summary: true, multiline: true },
    { id: 'page', label: 'One-page offer', placeholder: 'The offer in plain writing', multiline: true },
    { id: 'proof', label: 'Proof you can show today', placeholder: 'One real thing you can already show' },
  ],
  'business-logic': [
    { id: 'earns', label: 'How the first offer earns', placeholder: 'The way this offer is paid for. Not a forecast.', summary: true },
    { id: 'advantage', label: 'Advantage', placeholder: 'Why someone would choose this, in one sentence', multiline: true },
    { id: 'wont', label: 'What you will not promise', placeholder: 'The claims this business will not make' },
  ],
  'customer-journey': [
    { id: 'customer', label: 'The customer', placeholder: 'Who hears about this and receives it', summary: true, multiline: true },
    { id: 'channel', label: 'First place they hear about you', placeholder: 'One channel, not a list' },
    { id: 'invite', label: 'Invitation sentence', placeholder: 'The sentence you will use to invite them' },
    { id: 'delivery', label: 'How they receive the offer', placeholder: 'What happens after they say yes' },
  ],
  'operational-structure': [
    { id: 'hour', label: 'Weekly operating hour', placeholder: 'The hour you will protect for operations', summary: true },
    { id: 'path', label: 'From yes to delivered', placeholder: 'The steps from a yes to a delivered offer', multiline: true },
    { id: 'owner', label: 'Who does each step', placeholder: 'Who owns the work, even if that is only you' },
  ],
  multimedia: [
    { id: 'piece', label: 'The one piece of media', placeholder: 'Photo, video, or audio that shows the work', summary: true },
    { id: 'place', label: 'Where it will be seen or heard', placeholder: 'The one place this piece will live' },
  ],
  'launch-preparation': [
    { id: 'notes', label: 'Launch notes', placeholder: 'What is ready, and what is still open', summary: true, multiline: true },
    { id: 'conversation', label: 'The real conversation', placeholder: 'What happened when you showed the offer to someone' },
    { id: 'next', label: 'What you will do next', placeholder: 'Launchpad, keep building, or wait on certification' },
  ],
};

export function notebookFields(slug: string): NotebookField[] {
  return NOTEBOOK_FIELDS[slug] ?? [];
}

function summaryField(slug: string): NotebookField | undefined {
  return notebookFields(slug).find((field) => field.summary);
}

export function cleanNotebook(input: unknown): BuilderNotebook {
  if (!input || typeof input !== 'object') return {};
  const notebook: BuilderNotebook = {};
  for (const [slug, fields] of Object.entries(input as Record<string, unknown>)) {
    if (!fields || typeof fields !== 'object') continue;
    const clean: Record<string, string> = {};
    for (const [id, value] of Object.entries(fields as Record<string, unknown>)) {
      if (typeof value === 'string') clean[id] = value;
    }
    notebook[slug] = clean;
  }
  return notebook;
}

/** Draft text from a saved blueprint. Empty when the blueprint has nothing for that field. */
export function blueprintDraft(slug: string, fieldId: string, blueprint: Blueprint | null): string {
  if (!blueprint) return '';
  const first = (items: string[] | undefined) => items?.find((item) => item.trim()) ?? '';
  const table: Record<string, Record<string, string>> = {
    'naming-branding': {
      name: blueprint.chosenName,
      who: blueprint.targetCustomer,
      story: blueprint.elevatorPitch,
    },
    'product-development': {
      offer: blueprint.elevatorPitch,
    },
    'asset-generation': {
      page: blueprint.elevatorPitch,
      list: first(blueprint.marketingStrategy),
    },
    'business-logic': {
      earns: first(blueprint.revenueStreams),
      advantage: blueprint.competitiveAdvantage,
    },
    'customer-journey': {
      customer: blueprint.targetCustomer,
      channel: first(blueprint.marketingStrategy),
    },
    'operational-structure': {
      path: blueprint.plan90[1]?.detail ?? blueprint.plan90[0]?.detail ?? '',
    },
    'launch-preparation': {
      notes: blueprint.launchChecklist[0]?.label ?? '',
    },
  };
  return table[slug]?.[fieldId]?.trim() ?? '';
}

export function fieldValue(
  slug: string,
  fieldId: string,
  notebook: BuilderNotebook,
  blueprint: Blueprint | null,
): string {
  const saved = notebook[slug]?.[fieldId];
  if (saved !== undefined) return saved;
  return blueprintDraft(slug, fieldId, blueprint);
}

export function notebookLine(
  slug: string,
  notebook: BuilderNotebook,
  blueprint: Blueprint | null,
): { text: string; fromBlueprint: boolean } {
  const field = summaryField(slug);
  if (!field) return { text: 'Not written yet', fromBlueprint: false };
  const saved = notebook[slug]?.[field.id];
  if (saved !== undefined) {
    return { text: saved.trim() || 'Not written yet', fromBlueprint: false };
  }
  const draft = blueprintDraft(slug, field.id, blueprint);
  if (draft) return { text: draft, fromBlueprint: true };
  return { text: 'Not written yet', fromBlueprint: false };
}
