export type OrgType = 'individual' | 'sole_prop' | 'llc' | 'nonprofit' | 'other';

export interface Venture {
  id: string;
  name: string;
  status: string;
  summary: string;
}

export interface ProfileMilestone {
  id: string;
  title: string;
  note: string;
  date: string;
}

export interface FounderProfile {
  displayName: string;
  email: string;
  location: string;
  orgType: OrgType;
  imageDataUrl: string;
  videoUrl: string;
  story: string;
  skills: string[];
  interests: string[];
  ventures: Venture[];
  milestones: ProfileMilestone[];
  achievements: string[];
}

export interface Answers {
  skills?: string[];
  interests?: string[];
  experience?: string;
  capital?: string;
  time?: string;
  revenueGoal?: string;
  personality?: string;
  workStyle?: string;
  industries?: string[];
  techComfort?: string;
  presence?: string;
}

export interface AssessmentState {
  status: 'in_progress' | 'complete';
  step: number;
  answers: Answers;
  updatedAt: string | null;
  completedAt: string | null;
}

export interface Factor {
  id: string;
  label: string;
  weight: number;
  percent: number;
  points: number;
}

export interface ArchetypeResult {
  id: string;
  name: string;
  summary: string;
  rationale: string[];
  scores: Record<string, number>;
}

export interface ScoreReport {
  founderReadiness: number;
  businessLaunch: number;
  fundingReadiness: number;
  readinessFactors: Factor[];
  launchFactors: Factor[];
  fundingFactors: Factor[];
  archetype: ArchetypeResult;
}

export interface ModelMatch {
  id: string;
  name: string;
  summary: string;
  matchScore: number;
  reasons: string[];
  difficulty: 'Low' | 'Moderate' | 'High';
  budgetBand: string;
  revenuePotential: string;
  timeline: string;
  stack: string[];
  narrative?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  href?: string;
}

export interface PlanPhase {
  phase: string;
  title: string;
  detail: string;
}

export interface LogoConcept {
  name: string;
  mark: string;
  colors: string;
  type: string;
}

export interface SocialDraft {
  label: string;
  name: string;
  text: string;
}

export interface LandingCopy {
  headline: string;
  subhead: string;
  body: string;
  callToAction: string;
}

export interface LaunchCampaign {
  name: string;
  channel: string;
  message: string;
  steps: string[];
}

export interface LaunchPlan {
  summary: string;
  offer: string;
  customer: string;
  plan90: string[];
  risks: string[];
}

export interface FundingDraft {
  title: string;
  body: string;
  disclaimer: string;
}

export interface DomainSuggestion {
  host: string;
  note: string;
}

/** Drafts written after the assessment. Nothing here is registered, posted, or submitted. */
export interface LaunchKit {
  id: string;
  modelId: string;
  modelName: string;
  source: 'rules' | 'ai';
  aiTried: boolean;
  businessName: string;
  nameOptions: string[];
  domains: DomainSuggestion[];
  logos: LogoConcept[];
  landing: LandingCopy;
  socials: SocialDraft[];
  campaign: LaunchCampaign;
  businessPlan: LaunchPlan;
  fundingDraft: FundingDraft;
  createdAt: string;
  updatedAt: string;
}

export interface Blueprint {
  id: string;
  modelId: string;
  modelName: string;
  source: 'rules' | 'ai';
  nameIdeas: string[];
  chosenName: string;
  mission: string;
  vision: string;
  elevatorPitch: string;
  targetCustomer: string;
  competitiveAdvantage: string;
  revenueStreams: string[];
  marketingStrategy: string[];
  launchChecklist: ChecklistItem[];
  plan90: PlanPhase[];
  milestones12: PlanPhase[];
  risks: string[];
  techStack: string[];
  builderHandoff: PlanPhase[];
  programLinks: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  source: 'founder' | 'rules' | 'ai';
  at: string;
}

export interface TaskItem {
  id: string;
  title: string;
  done: boolean;
  href?: string;
}

export interface GoalItem {
  id: string;
  title: string;
  done: boolean;
  weekOf: string;
}

export interface CertPathwayProgress {
  modules: Record<string, boolean>;
}

export interface FundingApplication {
  id: string;
  opportunityId: string;
  name: string;
  status: 'preparing';
  note: string;
  at: string;
}

export interface XpEvent {
  id: string;
  xp: number;
  reason: string;
  at: string;
}

export interface FounderState {
  version: 1;
  updatedAt: string | null;
  profile: FounderProfile;
  assessment: AssessmentState;
  scores: ScoreReport | null;
  matches: ModelMatch[];
  selectedModelId: string | null;
  blueprint: Blueprint | null;
  launchKit: LaunchKit | null;
  messages: ChatMessage[];
  coachMemory: string;
  tasks: TaskItem[];
  goals: GoalItem[];
  certProgress: Record<string, CertPathwayProgress>;
  fundingApplications: FundingApplication[];
  xpEvents: XpEvent[];
  earnedBadgeIds: string[];
}

export interface CoachContext {
  name: string;
  archetypeName?: string;
  founderReadiness?: number;
  businessLaunch?: number;
  fundingReadiness?: number;
  topMatch?: string;
  topMatchScore?: number;
  topMatchReason?: string;
  blueprintTitle?: string;
  nextTask?: string;
  nextPathway?: string;
  credibility: number;
  levelName: string;
  lowCapital: boolean;
  memory: string;
  lowestAdvice: string;
}
