import { BADGE_CATALOG, PATHWAYS } from './catalog';
import type { FounderProfile, FounderState, XpEvent } from './types';

export const LEVELS = [
  { id: 'explorer', name: 'Explorer', minXp: 0 },
  { id: 'builder', name: 'Builder', minXp: 100 },
  { id: 'founder', name: 'Founder', minXp: 250 },
  { id: 'launcher', name: 'Launcher', minXp: 500 },
  { id: 'operator', name: 'Operator', minXp: 800 },
  { id: 'visionary', name: 'Visionary', minXp: 1200 },
  { id: 'certified_leader', name: 'Certified Leader', minXp: 1800 },
] as const;

export function totalXp(events: Pick<XpEvent, 'xp'>[]): number {
  return events.reduce((sum, event) => sum + event.xp, 0);
}

export function levelFor(xp: number) {
  let current: (typeof LEVELS)[number] = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.minXp) current = level;
  }
  const index = LEVELS.findIndex((level) => level.id === current.id);
  const next = LEVELS[index + 1] ?? null;
  const percent = next ? Math.round(((xp - current.minXp) / (next.minXp - current.minXp)) * 100) : 100;
  return { current, next, percent: Math.max(0, Math.min(100, percent)), xp };
}

export function credibilityScore(completed: number, total: number): number {
  if (total <= 0) return 0;
  const safe = Math.max(0, Math.min(completed, total));
  return Math.round((safe / total) * 100);
}

export function pathwayComplete(progress: FounderState['certProgress'], pathwayId: string): boolean {
  const pathway = PATHWAYS.find((item) => item.id === pathwayId);
  if (!pathway) return false;
  return pathway.modules.every((module) => progress[pathwayId]?.modules?.[module.id]);
}

export function completedPathwayCount(progress: FounderState['certProgress']): number {
  return PATHWAYS.filter((pathway) => pathwayComplete(progress, pathway.id)).length;
}

export function nextPathwayName(progress: FounderState['certProgress']): string | null {
  const next = PATHWAYS.find((pathway) => !pathwayComplete(progress, pathway.id));
  return next?.name ?? null;
}

export interface ProgressItem {
  id: string;
  label: string;
  done: boolean;
}

export function profileChecklist(profile: FounderProfile): ProgressItem[] {
  return [
    { id: 'name', label: 'Name', done: profile.displayName.trim().length > 1 },
    { id: 'story', label: 'Story of at least a few sentences', done: profile.story.trim().length >= 40 },
    { id: 'skills', label: 'At least one skill', done: profile.skills.length > 0 },
    { id: 'interests', label: 'At least one interest', done: profile.interests.length > 0 },
    { id: 'media', label: 'Photo or intro video', done: Boolean(profile.imageDataUrl || profile.videoUrl.trim()) },
    { id: 'location', label: 'Location', done: profile.location.trim().length > 1 },
    { id: 'venture', label: 'A venture or a milestone', done: profile.ventures.length > 0 || profile.milestones.length > 0 },
    { id: 'achievement', label: 'An achievement', done: profile.achievements.some((item) => item.trim()) },
  ];
}

export function profileProgress(profile: FounderProfile): { percent: number; items: ProgressItem[] } {
  const items = profileChecklist(profile);
  const done = items.filter((item) => item.done).length;
  return { percent: Math.round((done / items.length) * 100), items };
}

export function isProfileComplete(profile: FounderProfile): boolean {
  return profileProgress(profile).percent === 100;
}

function grant(events: XpEvent[], earned: Set<string>, id: string, xp: number, reason: string, badgeId?: string) {
  if (!events.some((event) => event.id === id)) {
    events.push({ id, xp, reason, at: new Date().toISOString() });
  }
  if (badgeId) earned.add(badgeId);
}

export function applyDerived(state: FounderState): FounderState {
  const events = state.xpEvents.map((event) => ({ ...event }));
  const earned = new Set(state.earnedBadgeIds);

  if (state.scores && state.assessment.status === 'complete') {
    grant(events, earned, 'assessment_done', 150, 'Completed the Founder Discovery Assessment', 'assessment_done');
  }
  if (state.blueprint) {
    grant(events, earned, 'blueprint_created', 200, 'Created a Business Blueprint', 'blueprint_created');
  }
  if (isProfileComplete(state.profile)) {
    grant(events, earned, 'profile_complete', 120, 'Completed your founder profile', 'profile_complete');
  }

  const done = completedPathwayCount(state.certProgress);
  if (done > 0) {
    grant(events, earned, 'pathway_complete', 180, 'Completed a certification pathway', 'pathway_complete');
  }
  for (let index = 1; index < done; index += 1) {
    grant(events, earned, `certification_extra_${index}`, 80, 'Completed another certification pathway', 'pathway_complete');
  }

  for (const task of state.tasks) {
    if (task.done) grant(events, earned, `task:${task.id}`, 25, `Finished a launch task: ${task.title}`);
  }
  for (const goal of state.goals) {
    grant(events, earned, `goal:${goal.id}`, 15, `Set a weekly goal: ${goal.title}`);
  }

  return {
    ...state,
    xpEvents: events,
    earnedBadgeIds: [...earned].sort(),
  };
}

export function badgeCatalog() {
  return BADGE_CATALOG;
}

export function currentWeekOf(date = new Date()): string {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  const month = String(copy.getMonth() + 1).padStart(2, '0');
  const dateNumber = String(copy.getDate()).padStart(2, '0');
  return `${copy.getFullYear()}-${month}-${dateNumber}`;
}
