import { BUILDER } from '@/data/site';

export interface BuilderLink {
  label: string;
  to: string;
}

export interface BuilderStepDetail {
  n: string;
  slug: string;
  /** What the step is. */
  summary: string;
  /** Why it matters, in the language of the existing builder. */
  why: string;
  /** How long to plan for. A planning note, not a promise. */
  time: string;
  tasks: { id: string; label: string }[];
  deliverables: string[];
  /** How the founder platform and existing tools help. */
  help: string;
  pathway: BuilderLink;
  /** Existing tool the primary button opens. */
  tool: BuilderLink;
  related: BuilderLink[];
}

/**
 * One detail page per Business Builder step. Titles stay in BUILDER.steps.
 * Every link is an existing route.
 */
export const BUILDER_STEP_DETAILS: BuilderStepDetail[] = [
  {
    n: '01',
    slug: 'naming-branding',
    summary: 'Naming and branding is the first step of the Business Builder: the name, the story, and the look of the business, gathered into one identity.',
    why: 'Inside W3BB you can create a complete business identity — name, story, and positioning — and a brand kit so the business looks consistent everywhere. Without that, later assets do not belong to the same company.',
    time: 'Plan one focused sitting to choose a working name and describe the look. A full visual system can take longer.',
    tasks: [
      { id: 'names', label: 'Write three working names, or choose from the blueprint suggestions' },
      { id: 'who', label: 'Say who the name is for, in one sentence' },
      { id: 'story', label: 'Draft the short story and positioning' },
      { id: 'look', label: 'Note the colors, type, and feeling the brand should keep' },
    ],
    deliverables: [
      'A working name',
      'A one-sentence description of who it is for',
      'A short story and positioning',
      'A first pass at the visual system',
    ],
    help: 'The blueprint can suggest names from your assessment. The launch coach can pressure-test the name against your archetype. Business Foundations is the learning track that prepares this step. The identity and brand kit are still created in the builder.',
    pathway: { label: 'Business Foundations pathway', to: '/launch/certifications#business-foundations' },
    tool: { label: 'Start naming and branding', to: '/build/business-identity' },
    related: [
      { label: 'Blueprint name ideas', to: '/launch/blueprint' },
      { label: 'Brand kits and visual systems', to: '/build/brand-kit' },
    ],
  },
  {
    n: '02',
    slug: 'product-development',
    summary: 'Product development turns the idea into the thing a customer actually receives: a product or a service, written clearly enough to list.',
    why: 'The builder’s product step is where a catalog becomes real. W3BB’s product catalogs are structured listings ready to sell, sync, and scale. One honest offer is enough to start.',
    time: 'Plan a few working sessions. The first version is one offer, not a full catalog.',
    tasks: [
      { id: 'offer', label: 'Name the one product or service you will deliver first' },
      { id: 'gets', label: 'Write what the customer gets, and what they do not get' },
      { id: 'effort', label: 'Note the work it takes you to deliver it once' },
      { id: 'list', label: 'Put that offer into a product listing' },
    ],
    deliverables: [
      'One defined offer',
      'A plain description of what is included',
      'A note of the effort to deliver it',
      'A first product or service listing',
    ],
    help: 'Your blueprint already names revenue streams and a target customer. Use those as the brief. The coach can help you cut the offer down. Business Foundations covers how the business earns.',
    pathway: { label: 'Business Foundations pathway', to: '/launch/certifications#business-foundations' },
    tool: { label: 'Start the product catalog', to: '/build/product-catalog' },
    related: [
      { label: 'Your blueprint', to: '/launch/blueprint' },
      { label: 'Revenue models', to: '/build/revenue-models' },
    ],
  },
  {
    n: '03',
    slug: 'asset-generation',
    summary: 'Asset generation is the set of files that make the business understandable: the offer in writing, the brand materials, and the proof you already have.',
    why: 'Marketing assets on W3BB are campaign-ready copy, graphics, and materials so the business can be promoted from day one. Generate what the first offer needs. Minting a Franchise Bundle comes after the assets exist.',
    time: 'Plan a few working sessions for the first set. You do not need every future asset now.',
    tasks: [
      { id: 'list', label: 'List the assets the first offer needs' },
      { id: 'copy', label: 'Write the one-page offer' },
      { id: 'proof', label: 'Gather one piece of proof you can show today' },
      { id: 'hold', label: 'Leave minting until a real person has used the offer' },
    ],
    deliverables: [
      'A short asset list',
      'A one-page offer',
      'One piece of proof',
      'Brand or marketing files started in the builder',
    ],
    help: 'The blueprint’s marketing notes and tech stack tell you which files matter first. Business Technology is the track for the smallest useful stack. The coach can help you drop assets you do not need yet.',
    pathway: { label: 'Business Technology pathway', to: '/launch/certifications#business-technology' },
    tool: { label: 'Start the marketing assets', to: '/build/marketing-assets' },
    related: [
      { label: 'Brand kits and visual systems', to: '/build/brand-kit' },
      { label: 'Mint a Franchise Bundle', to: '/mint' },
    ],
  },
  {
    n: '04',
    slug: 'business-logic',
    summary: 'Business logic is how the business earns, what it will not do, and why a customer would choose it. It is the structure of the offer, not a revenue forecast.',
    why: 'W3BB revenue models are pricing, packaging, and monetization built to fit how the business earns. The blueprint already drafts streams and an advantage. This step makes them specific enough to operate.',
    time: 'Plan one or two sittings to write the logic. Do not treat any figure here as a forecast.',
    tasks: [
      { id: 'earn', label: 'Choose how the first offer earns, using your blueprint streams as a draft' },
      { id: 'edge', label: 'Write the advantage in one sentence' },
      { id: 'no', label: 'Name what the business will not promise' },
      { id: 'record', label: 'Record the model in the builder' },
    ],
    deliverables: [
      'A chosen way the first offer earns',
      'A one-sentence advantage',
      'A short list of promises you will not make',
      'A revenue model started in the builder',
    ],
    help: 'Financial Literacy is the pathway for pricing in time as well as money. The coach can compare the model with your time and capital answers. Sample funding records are not income.',
    pathway: { label: 'Financial Literacy pathway', to: '/launch/certifications#financial-literacy' },
    tool: { label: 'Start the revenue model', to: '/build/revenue-models' },
    related: [
      { label: 'Blueprint', to: '/launch/blueprint' },
      { label: 'Funding practice', to: '/launch/funding' },
    ],
  },
  {
    n: '05',
    slug: 'customer-journey',
    summary: 'Customer journey design is the path from first hearing about the business to receiving the offer, and coming back.',
    why: 'W3BB customer experience flows are the journeys customers take, from first touch to loyal repeat business. One channel, one ask, and one delivery is a complete first journey.',
    time: 'Plan one focused sitting to draw the first journey. More channels can wait.',
    tasks: [
      { id: 'touch', label: 'Name the first place someone hears about you' },
      { id: 'ask', label: 'Write the sentence you will use to invite them' },
      { id: 'deliver', label: 'Describe how they receive the offer' },
      { id: 'return', label: 'Note what would bring them back' },
    ],
    deliverables: [
      'A first-touch channel',
      'An invitation sentence',
      'A delivery step',
      'A customer-experience flow started in the builder',
    ],
    help: 'Sales & Marketing is the pathway for one channel and one ask. The blueprint’s marketing strategy is the draft. The coach can cut steps the customer does not need.',
    pathway: { label: 'Sales & Marketing pathway', to: '/launch/certifications#sales-marketing' },
    tool: { label: 'Start the customer journey', to: '/build/customer-experience' },
    related: [
      { label: 'Marketing assets', to: '/build/marketing-assets' },
      { label: 'Blueprint', to: '/launch/blueprint' },
    ],
  },
  {
    n: '06',
    slug: 'operational-structure',
    summary: 'Operational structure is the weekly work that keeps the business running when you are not inventing it again.',
    why: 'Operational workflows on W3BB are the day-to-day processes that keep a business running smoothly. The 90-day plan in the blueprint is a draft of that rhythm, not a second operating system.',
    time: 'Plan a few working sessions to write the path from yes to delivered, then one repeating hour to run it.',
    tasks: [
      { id: 'path', label: 'List the steps from a yes to a delivered offer' },
      { id: 'hour', label: 'Choose the weekly hour you will protect for operations' },
      { id: 'owner', label: 'Note who does each step, even if that is only you' },
      { id: 'record', label: 'Move the routine into the builder' },
    ],
    deliverables: [
      'A delivery checklist',
      'A weekly operating hour',
      'A note of who owns each step',
      'An operational workflow started in the builder',
    ],
    help: 'The Operations pathway asks you to write delivery, block the weekly hour, and note what the builder still needs. The coach can turn the 90-day plan into that list.',
    pathway: { label: 'Operations pathway', to: '/launch/certifications#operations' },
    tool: { label: 'Start the operating workflow', to: '/build/operational-workflows' },
    related: [
      { label: '90-day plan in the blueprint', to: '/launch/blueprint' },
      { label: 'Business Foundations pathway', to: '/launch/certifications#business-foundations' },
    ],
  },
  {
    n: '07',
    slug: 'multimedia',
    summary: 'Multimedia creation is the photo, video, or audio that shows the work, instead of only describing it.',
    why: 'W3BB includes AI-powered multimedia so a brand can be seen and heard across channels. One honest piece is more useful than a library you will not finish. An intro video can also live on your founder profile.',
    time: 'Plan one or two sittings for a single piece of media. More pieces can follow the first proof.',
    tasks: [
      { id: 'pick', label: 'Choose the one format that proves the offer: photo, video, or audio' },
      { id: 'make', label: 'Make or gather that piece' },
      { id: 'profile', label: 'Add an intro video URL to your founder profile if you have one' },
      { id: 'builder', label: 'Create the multimedia asset in the builder' },
    ],
    deliverables: [
      'One piece of media that shows the work',
      'A place it will be seen or heard',
      'An optional intro video on your founder profile',
      'A multimedia asset started in the builder',
    ],
    help: 'AI Entrepreneurship is the track for using AI inside a real offer, with you still accountable for what a customer sees. The coach should not be asked to invent proof you do not have.',
    pathway: { label: 'AI Entrepreneurship pathway', to: '/launch/certifications#ai-entrepreneurship' },
    tool: { label: 'Start the multimedia', to: '/build/multimedia-content' },
    related: [
      { label: 'Founder profile', to: '/launch/profile' },
      { label: 'Marketing assets', to: '/build/marketing-assets' },
    ],
  },
  {
    n: '08',
    slug: 'launch-preparation',
    summary: 'Launch preparation is the last builder step: the offer is ready to meet a real person, and you know the next container for the business.',
    why: 'The builder ends at launch preparation so a beginner and a seasoned creator can both put a professional offer into the world. The blueprint checklist, the Entrepreneur Launchpad, and Trust-Approved Certification each have a different job.',
    time: 'Plan a few working sessions. Show the offer to someone before you treat the business as finished.',
    tasks: [
      { id: 'check', label: 'Work the launch checklist from your blueprint' },
      { id: 'person', label: 'Put the offer in front of one real person' },
      { id: 'zero', label: 'Use the Launchpad if you are starting without capital' },
      { id: 'capstone', label: 'Read Trust Certification only when the business can show the work' },
    ],
    deliverables: [
      'A completed launch checklist, or a short list of what is still open',
      'One real conversation about the offer',
      'A decision about Launchpad, the builder intake, or certification',
      'The business record continued in the builder',
    ],
    help: 'Startup Launch Readiness is the pathway that sits just before Trust-Approved Certification. The coach can tell you which of those is actually next. Checking a pathway does not award the Trust-Approved badge.',
    pathway: { label: 'Startup Launch Readiness pathway', to: '/launch/certifications#startup-launch-readiness' },
    tool: { label: 'Continue in the Business Builder', to: '/build' },
    related: [
      { label: 'Launch checklist in the blueprint', to: '/launch/blueprint' },
      { label: 'Entrepreneur Launchpad', to: '/launchpad' },
      { label: 'Trust-Approved Certification', to: '/certification' },
    ],
  },
];

export function builderStepByNumber(n: string): BuilderStepDetail | undefined {
  return BUILDER_STEP_DETAILS.find((step) => step.n === n);
}

export function builderStepBySlug(slug: string | null | undefined): BuilderStepDetail | undefined {
  if (!slug) return undefined;
  return BUILDER_STEP_DETAILS.find((step) => step.slug === slug);
}

export function builderStepPath(nOrSlug: string): string {
  const step = builderStepByNumber(nOrSlug) ?? builderStepBySlug(nOrSlug);
  return step ? `/builder/${step.slug}` : '/#builder';
}

export function builderStepTitle(n: string): string {
  return BUILDER.steps.find((step) => step.n === n)?.title ?? n;
}

export function builderStepsInOrder(): { n: string; title: string; slug: string; to: string }[] {
  return BUILDER.steps.map((step) => {
    const detail = builderStepByNumber(step.n);
    return {
      n: step.n,
      title: step.title,
      slug: detail?.slug ?? '',
      to: detail ? `/builder/${detail.slug}` : '/#builder',
    };
  });
}
