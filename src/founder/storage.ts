import type { Answers, FounderState, TaskItem } from './types';

const KEY = 'w3bb.founder.v1';

export function createEmptyState(): FounderState {
  return {
    version: 1,
    updatedAt: null,
    profile: {
      displayName: '',
      email: '',
      location: '',
      orgType: 'individual',
      imageDataUrl: '',
      videoUrl: '',
      story: '',
      skills: [],
      interests: [],
      ventures: [],
      milestones: [],
      achievements: [],
    },
    assessment: {
      status: 'in_progress',
      step: 0,
      answers: {},
      updatedAt: null,
      completedAt: null,
    },
    scores: null,
    matches: [],
    selectedModelId: null,
    blueprint: null,
    messages: [],
    coachMemory: '',
    tasks: [],
    goals: [],
    certProgress: {},
    fundingApplications: [],
    xpEvents: [],
    earnedBadgeIds: [],
  };
}

export function normalizeState(input: unknown): FounderState {
  const empty = createEmptyState();
  if (!input || typeof input !== 'object') return empty;
  const raw = input as Partial<FounderState>;
  const profile = { ...empty.profile, ...(raw.profile ?? {}) };
  profile.skills = Array.isArray(profile.skills) ? profile.skills : [];
  profile.interests = Array.isArray(profile.interests) ? profile.interests : [];
  profile.ventures = Array.isArray(profile.ventures) ? profile.ventures : [];
  profile.milestones = Array.isArray(profile.milestones) ? profile.milestones : [];
  profile.achievements = Array.isArray(profile.achievements) ? profile.achievements : [];

  return {
    ...empty,
    ...raw,
    version: 1,
    profile,
    assessment: {
      ...empty.assessment,
      ...(raw.assessment ?? {}),
      answers: { ...(raw.assessment?.answers ?? {}) },
    },
    scores: raw.scores ?? null,
    matches: Array.isArray(raw.matches) ? raw.matches : [],
    selectedModelId: raw.selectedModelId ?? null,
    blueprint: raw.blueprint ?? null,
    messages: Array.isArray(raw.messages) ? raw.messages : [],
    coachMemory: typeof raw.coachMemory === 'string' ? raw.coachMemory : '',
    tasks: Array.isArray(raw.tasks) ? raw.tasks : [],
    goals: Array.isArray(raw.goals) ? raw.goals : [],
    certProgress: raw.certProgress && typeof raw.certProgress === 'object' ? raw.certProgress : {},
    fundingApplications: Array.isArray(raw.fundingApplications) ? raw.fundingApplications : [],
    xpEvents: Array.isArray(raw.xpEvents) ? raw.xpEvents : [],
    earnedBadgeIds: Array.isArray(raw.earnedBadgeIds) ? raw.earnedBadgeIds : [],
    updatedAt: raw.updatedAt ?? null,
  };
}

export function loadLocalState(): FounderState {
  if (typeof localStorage === 'undefined') return createEmptyState();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return createEmptyState();
    return normalizeState(JSON.parse(raw));
  } catch {
    return createEmptyState();
  }
}

export function saveLocalState(state: FounderState) {
  if (typeof localStorage === 'undefined') return;
  const write = (value: FounderState) => localStorage.setItem(KEY, JSON.stringify(value));
  try {
    write(state);
  } catch {
    try {
      write({ ...state, profile: { ...state.profile, imageDataUrl: '' } });
    } catch {
      /* Private mode or a full disk. The session still works in memory. */
    }
  }
}

export function uid(prefix: string): string {
  const random = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 12);
  return `${prefix}_${random}`;
}

export function starterTasks(answers: Answers): TaskItem[] {
  const tasks: TaskItem[] = [
    { id: 'review-matches', title: 'Review your business matches', done: false, href: '/launch/matches' },
    { id: 'make-blueprint', title: 'Generate a business blueprint', done: false, href: '/launch/blueprint' },
    { id: 'open-builder', title: 'Continue in the Business Builder', done: false, href: '/build' },
    { id: 'profile', title: 'Complete your founder profile', done: false, href: '/launch/profile' },
    { id: 'foundations', title: 'Start the Business Foundations pathway', done: false, href: '/launch/certifications' },
    { id: 'coach', title: 'Ask the launch coach what to do this week', done: false, href: '/launch/coach' },
  ];
  if (answers.capital === 'none' || answers.capital === 'under_1k') {
    tasks.splice(3, 0, { id: 'launchpad', title: 'Join the Entrepreneur Launchpad', done: false, href: '/launchpad' });
    tasks.splice(4, 0, { id: 'zero-dollar', title: 'Read the Zero-Dollar Startup Path', done: false, href: '/zero-dollar-startup' });
  }
  return tasks;
}

export function mergeTasks(existing: TaskItem[], incoming: TaskItem[]): TaskItem[] {
  const map = new Map(existing.map((task) => [task.id, task]));
  for (const task of incoming) {
    if (!map.has(task.id)) map.set(task.id, task);
  }
  return [...map.values()];
}

export function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, 480 / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext('2d');
      if (!context) {
        URL.revokeObjectURL(url);
        reject(new Error('Could not read that image.'));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.72));
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read that image.'));
    };
    image.src = url;
  });
}

export function videoEmbed(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const id = parsed.searchParams.get('v');
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (host === 'vimeo.com') {
      const id = parsed.pathname.split('/').filter(Boolean)[0];
      return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}
