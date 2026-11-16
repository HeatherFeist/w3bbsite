import type { Answers, OrgType } from './types';

export const ARCHETYPE_TIE_BREAK = [
  'business_operator',
  'technical_founder',
  'service_entrepreneur',
  'educator',
  'community_builder',
  'creative_innovator',
  'visionary_builder',
] as const;

export type ArchetypeId = (typeof ARCHETYPE_TIE_BREAK)[number];

export const ARCHETYPES: { id: ArchetypeId; name: string; summary: string }[] = [
  {
    id: 'visionary_builder',
    name: 'Visionary Builder',
    summary: 'You start with a picture of what should exist, then pull people and tools toward it.',
  },
  {
    id: 'technical_founder',
    name: 'Technical Founder',
    summary: 'You are most at home making the product real: systems, software, and the craft of building.',
  },
  {
    id: 'service_entrepreneur',
    name: 'Service Entrepreneur',
    summary: 'You create value in direct relationships, client work, and problems you can solve hands-on.',
  },
  {
    id: 'creative_innovator',
    name: 'Creative Innovator',
    summary: 'You turn taste, story, and original work into something people want to keep.',
  },
  {
    id: 'community_builder',
    name: 'Community Builder',
    summary: 'You gather people around a shared purpose and make the group itself valuable.',
  },
  {
    id: 'educator',
    name: 'Educator',
    summary: 'You teach, coach, and package what you know so other people can move faster.',
  },
  {
    id: 'business_operator',
    name: 'Business Operator',
    summary: 'You make the machine run: the offer, the numbers, and a business that works on an ordinary Tuesday.',
  },
];

export interface Choice {
  id: string;
  label: string;
  hint?: string;
}

export interface StepDef {
  key: keyof Answers;
  title: string;
  prompt: string;
  help: string;
  type: 'single' | 'multi';
  options: Choice[];
}

export const STEPS: StepDef[] = [
  {
    key: 'skills',
    title: 'Skills',
    prompt: 'Which skills can you use in a business this year?',
    help: 'Choose every skill you could honestly offer. This is about what you can do, not a job title.',
    type: 'multi',
    options: [
      { id: 'engineering', label: 'Software and engineering' },
      { id: 'design', label: 'Design' },
      { id: 'content', label: 'Content and storytelling' },
      { id: 'sales', label: 'Sales' },
      { id: 'marketing', label: 'Marketing' },
      { id: 'operations', label: 'Operations' },
      { id: 'finance', label: 'Finance and bookkeeping' },
      { id: 'teaching', label: 'Teaching and coaching' },
      { id: 'community', label: 'Community building' },
      { id: 'trades', label: 'Hands-on trades or local service' },
      { id: 'product', label: 'Product management' },
      { id: 'legal', label: 'Legal or compliance basics' },
    ],
  },
  {
    key: 'interests',
    title: 'Interests',
    prompt: 'What kind of work do you want more of?',
    help: 'Pick the interests you would still choose if nobody was watching.',
    type: 'multi',
    options: [
      { id: 'strategy', label: 'Strategy and new ideas' },
      { id: 'making', label: 'Making products' },
      { id: 'teaching', label: 'Teaching' },
      { id: 'community', label: 'Community' },
      { id: 'local', label: 'Local service' },
      { id: 'commerce', label: 'Commerce' },
      { id: 'creative', label: 'Creative work' },
      { id: 'research', label: 'Research' },
      { id: 'helping', label: 'Helping people directly' },
    ],
  },
  {
    key: 'experience',
    title: 'Experience',
    prompt: 'How close have you been to running a venture?',
    help: 'There is no preferred answer. The score uses this as one signal among many.',
    type: 'single',
    options: [
      { id: 'none', label: 'I have not run a business' },
      { id: 'some', label: 'I have work experience I can use' },
      { id: 'operator', label: 'I have operated a team or a business function' },
      { id: 'founder', label: 'I have founded or co-founded something' },
    ],
  },
  {
    key: 'capital',
    title: 'Startup capital',
    prompt: 'What can you put into the business without borrowing?',
    help: 'These are self-reported brackets for planning. They are not a budget you must raise.',
    type: 'single',
    options: [
      { id: 'none', label: 'I cannot put money in yet' },
      { id: 'under_1k', label: 'A small amount, under about $1,000' },
      { id: '1k_10k', label: 'Roughly $1,000 to $10,000' },
      { id: '10k_50k', label: 'Roughly $10,000 to $50,000' },
      { id: 'over_50k', label: 'More than about $50,000' },
    ],
  },
  {
    key: 'time',
    title: 'Time commitment',
    prompt: 'How many hours a week can you protect for this?',
    help: 'Count hours you can keep, not hours you wish you had.',
    type: 'single',
    options: [
      { id: 'side_5', label: 'About 5 hours a week' },
      { id: 'side_15', label: 'About 15 hours a week' },
      { id: 'part_25', label: 'About 25 hours a week' },
      { id: 'full_40', label: 'About 40 hours a week' },
    ],
  },
  {
    key: 'revenueGoal',
    title: 'Revenue goal',
    prompt: 'What is the business for, right now?',
    help: 'A smaller goal is not a lower score by itself. The launch score checks whether the goal fits your time and capital.',
    type: 'single',
    options: [
      { id: 'explore', label: 'I am exploring' },
      { id: 'side_income', label: 'Side income' },
      { id: 'replace_job', label: 'Replace my job' },
      { id: 'scale', label: 'Build something that scales' },
    ],
  },
  {
    key: 'personality',
    title: 'Personality',
    prompt: 'How do you naturally start?',
    help: 'Pick the description that sounds like your default, not your aspiration.',
    type: 'single',
    options: [
      { id: 'visionary', label: 'Visionary — I start with the big picture' },
      { id: 'builder', label: 'Builder — I want to make the thing' },
      { id: 'connector', label: 'Connector — I start with people' },
      { id: 'teacher', label: 'Teacher — I start by helping people learn' },
      { id: 'operator', label: 'Operator — I start with the system' },
      { id: 'creator', label: 'Creator — I start with the work itself' },
    ],
  },
  {
    key: 'workStyle',
    title: 'Work style',
    prompt: 'Where do you do your best work?',
    help: 'This shapes the archetype and the kind of model that will feel sustainable.',
    type: 'single',
    options: [
      { id: 'solo_deep', label: 'Solo deep work' },
      { id: 'collaborative', label: 'Collaborative' },
      { id: 'client_facing', label: 'Client-facing' },
      { id: 'systems', label: 'Systems and routines' },
    ],
  },
  {
    key: 'industries',
    title: 'Industry interests',
    prompt: 'Which fields pull you in?',
    help: 'Choose the industries you would actually want customers in.',
    type: 'multi',
    options: [
      { id: 'technology', label: 'Technology' },
      { id: 'education', label: 'Education' },
      { id: 'health', label: 'Health and care' },
      { id: 'food', label: 'Food and hospitality' },
      { id: 'home-services', label: 'Home services' },
      { id: 'creative', label: 'Creative fields' },
      { id: 'retail', label: 'Retail' },
      { id: 'professional-services', label: 'Professional services' },
      { id: 'community', label: 'Community and nonprofit' },
      { id: 'sustainability', label: 'Sustainability' },
    ],
  },
  {
    key: 'techComfort',
    title: 'Tech comfort',
    prompt: 'How comfortable are you with technology?',
    help: 'Beginner is a valid way to start. Some models need less software than others.',
    type: 'single',
    options: [
      { id: 'beginner', label: 'Beginner' },
      { id: 'comfortable', label: 'Comfortable with everyday tools' },
      { id: 'builder', label: 'I can build simple products' },
      { id: 'advanced', label: 'Advanced' },
    ],
  },
  {
    key: 'presence',
    title: 'Online or local',
    prompt: 'Where should the business show up first?',
    help: 'Online, local, and hybrid are all real businesses inside W3BB.',
    type: 'single',
    options: [
      { id: 'online', label: 'Primarily online' },
      { id: 'local', label: 'Primarily local' },
      { id: 'hybrid', label: 'Hybrid — online and local' },
    ],
  },
];

export function labelFor(key: keyof Answers, id: string): string {
  const step = STEPS.find((item) => item.key === key);
  return step?.options.find((option) => option.id === id)?.label ?? id;
}

export interface ModelDef {
  id: string;
  name: string;
  summary: string;
  difficulty: 'Low' | 'Moderate' | 'High';
  budgetBand: string;
  revenuePotential: string;
  timeline: string;
  stack: string[];
}

export const MODELS: ModelDef[] = [
  {
    id: 'saas',
    name: 'SaaS',
    summary: 'Software people pay for on a repeating basis because it does a job for them.',
    difficulty: 'High',
    budgetBand: 'Planning band: product time before revenue. A tool budget helps. This is not a quote.',
    revenuePotential: 'Planning band: recurring revenue is possible after the product is useful. Nothing here is a forecast.',
    timeline: 'Often a few months to a first useful version.',
    stack: ['Web app', 'Accounts', 'Billing', 'A simple analytics view'],
  },
  {
    id: 'ai_agency',
    name: 'AI Agency',
    summary: 'A service business that uses AI to deliver client work faster, with a human still responsible for the result.',
    difficulty: 'Moderate',
    budgetBand: 'Planning band: mostly time, plus the tools you already use. This is not a quote.',
    revenuePotential: 'Planning band: project or retainer income once a niche offer is clear. Not a forecast.',
    timeline: 'A first paid offer can be shaped in a few weeks.',
    stack: ['A one-page offer', 'A proposal template', 'A delivery checklist', 'The AI tools you already trust'],
  },
  {
    id: 'coaching',
    name: 'Coaching',
    summary: 'Paid guidance for a specific person and a specific change, delivered live or in a short program.',
    difficulty: 'Low',
    budgetBand: 'Planning band: time and a way to talk to clients. Little infrastructure is required to start.',
    revenuePotential: 'Planning band: session or package income. The ceiling depends on your time.',
    timeline: 'A first conversation offer can be ready in 2–6 weeks.',
    stack: ['A scheduling link', 'A short curriculum', 'Notes', 'Invoices'],
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    summary: 'Products sold online, with the work of sourcing, presentation, and fulfillment made explicit.',
    difficulty: 'Moderate',
    budgetBand: 'Planning band: inventory or samples usually need some cash. Start narrower if cash is tight.',
    revenuePotential: 'Planning band: product margin after costs. Not a forecast, and not a promised margin.',
    timeline: 'A small catalog can be tested in 1–3 months.',
    stack: ['A product page', 'Checkout', 'Fulfillment notes', 'Support email'],
  },
  {
    id: 'digital_products',
    name: 'Digital Products',
    summary: 'Guides, templates, workshops, or files someone can buy without you delivering each copy by hand.',
    difficulty: 'Low',
    budgetBand: 'Planning band: mostly time. A publishing tool is enough to test.',
    revenuePotential: 'Planning band: product sales that are not tied to your hours. Early sales are usually small.',
    timeline: 'A first product can ship in 2–6 weeks.',
    stack: ['A draft', 'A checkout page', 'Delivery email', 'A feedback form'],
  },
  {
    id: 'membership',
    name: 'Membership Community',
    summary: 'A group people pay to stay in because the peers, rhythm, or access are worth it.',
    difficulty: 'Moderate',
    budgetBand: 'Planning band: time to host. Tools can stay simple until people show up.',
    revenuePotential: 'Planning band: recurring dues. Retention matters more than a launch spike.',
    timeline: 'A first cohort can be invited within 1–2 months.',
    stack: ['A gathering place', 'A welcome ritual', 'A monthly rhythm', 'Member records'],
  },
  {
    id: 'local_service',
    name: 'Local Service',
    summary: 'Work delivered in a place: homes, shops, studios, or a neighborhood.',
    difficulty: 'Low',
    budgetBand: 'Planning band: tools you may already own. Spend after the first customers, not before.',
    revenuePotential: 'Planning band: job or route income. Capacity is limited by your calendar.',
    timeline: 'A first service offer can be tested in 2–6 weeks.',
    stack: ['A service menu', 'A booking method', 'Proof of work', 'Invoices'],
  },
  {
    id: 'nonprofit',
    name: 'Nonprofit',
    summary: 'A mission organization. Money supports the work. It is still a designed operation.',
    difficulty: 'Moderate',
    budgetBand: 'Planning band: time and a fiscal sponsor or structure conversation. Do not invent a grant to start.',
    revenuePotential: 'Planning band: donations, programs, and earned income. No amount is promised here.',
    timeline: 'A clear program and the people it serves can be defined in 1–3 months.',
    stack: ['A one-page program', 'A budget in hours', 'A partner list', 'CDI and community links'],
  },
  {
    id: 'education_platform',
    name: 'Educational Platform',
    summary: 'A structured place to learn: lessons, practice, and a path from beginner to capable.',
    difficulty: 'High',
    budgetBand: 'Planning band: curriculum time first. A full platform can wait until a cohort works.',
    revenuePotential: 'Planning band: tuition, cohorts, or licensing. Start with one cohort before a platform.',
    timeline: 'A first cohort outline takes 1–3 months. A platform takes longer.',
    stack: ['A syllabus', 'Lesson drafts', 'Practice tasks', 'A place to host the cohort'],
  },
];

export interface PathwayModule {
  id: string;
  label: string;
}

export interface Pathway {
  id: string;
  name: string;
  summary: string;
  modules: PathwayModule[];
}

/**
 * New learning tracks inside Launch. W3BB does not have individual course
 * certifications today. These tracks prepare a founder to use the Business
 * Builder and, later, to apply for Trust-Approved Certification.
 */
export const PATHWAYS: Pathway[] = [
  {
    id: 'business-foundations',
    name: 'Business Foundations',
    summary: 'The offer, the customer, and how the business earns. This track prepares you for the Business Builder. It is not a separate W3BB course.',
    modules: [
      { id: 'offer', label: 'Write the offer in one sentence' },
      { id: 'customer', label: 'Name the customer and the problem' },
      { id: 'earn', label: 'Choose how the business earns' },
    ],
  },
  {
    id: 'ai-entrepreneurship',
    name: 'AI Entrepreneurship',
    summary: 'How to use AI as a tool inside a real offer, with a person still accountable for the work.',
    modules: [
      { id: 'use', label: 'Name one task AI will do and one task you will keep' },
      { id: 'offer', label: 'Describe the customer result, not the model' },
      { id: 'review', label: 'Decide how you will check the work before a customer sees it' },
    ],
  },
  {
    id: 'sales-marketing',
    name: 'Sales & Marketing',
    summary: 'A simple way to be found and a simple way to ask for the sale.',
    modules: [
      { id: 'channel', label: 'Pick one channel you will actually use' },
      { id: 'proof', label: 'Write the proof you can show today' },
      { id: 'ask', label: 'Write the sentence you will use to invite a customer' },
    ],
  },
  {
    id: 'operations',
    name: 'Operations',
    summary: 'The weekly rhythm that keeps delivery from depending on memory.',
    modules: [
      { id: 'delivery', label: 'List the steps from yes to delivered' },
      { id: 'week', label: 'Block the weekly operating hour' },
      { id: 'handoff', label: 'Note what the Business Builder still needs to capture' },
    ],
  },
  {
    id: 'financial-literacy',
    name: 'Financial Literacy',
    summary: 'Enough money sense to price, track, and avoid pretending a sample grant is income.',
    modules: [
      { id: 'price', label: 'Price the offer in time as well as money' },
      { id: 'costs', label: 'List the costs you already know' },
      { id: 'records', label: 'Choose where payments and expenses will be written down' },
    ],
  },
  {
    id: 'business-technology',
    name: 'Business Technology',
    summary: 'The smallest stack that lets you sell and deliver. The Business Builder holds the real asset work.',
    modules: [
      { id: 'stack', label: 'Write the tools you will use in the first 90 days' },
      { id: 'account', label: 'Decide who owns each account' },
      { id: 'backup', label: 'Note where the blueprint and customer list live' },
    ],
  },
  {
    id: 'startup-launch-readiness',
    name: 'Startup Launch Readiness',
    summary: 'A final pass before you ask W3BB to review the business for Trust-Approved Certification.',
    modules: [
      { id: 'builder', label: 'Move the plan into the Business Builder' },
      { id: 'proof', label: 'Collect one piece of real-world proof' },
      { id: 'capstone', label: 'Read the Trust Certification page and decide if you are ready to apply' },
    ],
  },
];

export interface FundingOpportunity {
  id: string;
  name: string;
  sample: true;
  summary: string;
  industries: string[];
  locations: string[];
  businessTypes: string[];
  stages: string[];
  revenueGoals: string[];
  orgTypes: string[];
  amountLabel: string;
  deadlineLabel: string;
}

export const FUNDING_OPPORTUNITIES: FundingOpportunity[] = [
  {
    id: 'sample-community-start',
    name: 'Sample: Community start support',
    sample: true,
    summary: 'An illustrative record for a neighborhood or education program that needs a plan more than a finished company.',
    industries: ['community', 'education'],
    locations: ['local', 'hybrid'],
    businessTypes: ['nonprofit', 'local_service'],
    stages: ['idea', 'pre-revenue'],
    revenueGoals: ['explore', 'side_income'],
    orgTypes: ['nonprofit', 'individual'],
    amountLabel: 'Not a real amount — sample record',
    deadlineLabel: 'No deadline — sample record',
  },
  {
    id: 'sample-local-service',
    name: 'Sample: Local service starter',
    sample: true,
    summary: 'An illustrative record for a founder offering a service in a specific place.',
    industries: ['home-services', 'food', 'professional-services'],
    locations: ['local', 'hybrid'],
    businessTypes: ['local_service'],
    stages: ['idea', 'pre-revenue', 'operating'],
    revenueGoals: ['side_income', 'replace_job'],
    orgTypes: ['individual', 'sole_prop', 'llc'],
    amountLabel: 'Not a real amount — sample record',
    deadlineLabel: 'No deadline — sample record',
  },
  {
    id: 'sample-digital-offer',
    name: 'Sample: Digital offer practice match',
    sample: true,
    summary: 'An illustrative record for an online product, template, or coaching offer.',
    industries: ['creative', 'education', 'technology'],
    locations: ['online', 'hybrid'],
    businessTypes: ['digital_products', 'coaching', 'education_platform'],
    stages: ['idea', 'pre-revenue'],
    revenueGoals: ['explore', 'side_income'],
    orgTypes: ['individual', 'sole_prop'],
    amountLabel: 'Not a real amount — sample record',
    deadlineLabel: 'No deadline — sample record',
  },
  {
    id: 'sample-software-tools',
    name: 'Sample: Software tools match',
    sample: true,
    summary: 'An illustrative record for a founder already able to build and looking at a software or AI service model.',
    industries: ['technology'],
    locations: ['online', 'hybrid'],
    businessTypes: ['saas', 'ai_agency'],
    stages: ['pre-revenue', 'operating'],
    revenueGoals: ['side_income', 'replace_job', 'scale'],
    orgTypes: ['individual', 'llc'],
    amountLabel: 'Not a real amount — sample record',
    deadlineLabel: 'No deadline — sample record',
  },
  {
    id: 'sample-membership',
    name: 'Sample: Membership and community',
    sample: true,
    summary: 'An illustrative record for someone gathering a group, cohort, or membership.',
    industries: ['community', 'education', 'creative'],
    locations: ['online', 'hybrid', 'local'],
    businessTypes: ['membership', 'education_platform', 'nonprofit'],
    stages: ['idea', 'pre-revenue'],
    revenueGoals: ['explore', 'side_income', 'scale'],
    orgTypes: ['individual', 'nonprofit', 'llc'],
    amountLabel: 'Not a real amount — sample record',
    deadlineLabel: 'No deadline — sample record',
  },
  {
    id: 'sample-operating-business',
    name: 'Sample: Operating business paperwork',
    sample: true,
    summary: 'An illustrative record for a founder who has already operated something and is organizing proof, not hunting a headline grant.',
    industries: ['professional-services', 'retail', 'food', 'technology'],
    locations: ['local', 'online', 'hybrid'],
    businessTypes: ['ecommerce', 'local_service', 'saas', 'ai_agency'],
    stages: ['operating'],
    revenueGoals: ['replace_job', 'scale'],
    orgTypes: ['llc', 'sole_prop', 'nonprofit'],
    amountLabel: 'Not a real amount — sample record',
    deadlineLabel: 'No deadline — sample record',
  },
];

export const ORG_TYPES: { id: OrgType; label: string }[] = [
  { id: 'individual', label: 'Individual — not formed yet' },
  { id: 'sole_prop', label: 'Sole proprietor' },
  { id: 'llc', label: 'LLC or corporation' },
  { id: 'nonprofit', label: 'Nonprofit or fiscal sponsorship path' },
  { id: 'other', label: 'Other' },
];

export const BADGE_CATALOG = [
  {
    id: 'assessment_done',
    name: 'Assessment complete',
    detail: 'You finished the Founder Discovery Assessment.',
  },
  {
    id: 'blueprint_created',
    name: 'Blueprint created',
    detail: 'You saved a business blueprint.',
  },
  {
    id: 'profile_complete',
    name: 'Profile complete',
    detail: 'Your founder profile is filled in.',
  },
  {
    id: 'pathway_complete',
    name: 'Certification pathway earned',
    detail: 'You finished a learning pathway. This is not the Trust-Approved badge.',
  },
] as const;

export function modelById(id: string | null | undefined): ModelDef | undefined {
  return MODELS.find((model) => model.id === id);
}
