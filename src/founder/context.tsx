import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FounderContext } from './useFounder';
import { requestAdvisor } from './ai';
import { applyAiBlueprint, buildBlueprint } from './blueprint';
import { blueprintAiMessages, coachAiMessages, coachReply } from './coach';
import { matchBusinesses } from './matching';
import { scoreAssessment } from './scoring';
import {
  applyDerived,
  completedPathwayCount,
  credibilityScore,
  currentWeekOf,
  levelFor,
  nextPathwayName,
  profileProgress,
  totalXp,
} from './gamification';
import { PATHWAYS } from './catalog';
import { getFounderSupabase, isSupabaseConfigured } from './supabaseClient';
import { loadLocalState, mergeTasks, saveLocalState, starterTasks, uid } from './storage';
import { mergeStates, pullFounderState, pushFounderState } from './sync';
import type { Answers, Blueprint, ChatMessage, CoachContext, FounderProfile, FounderState, ScoreReport } from './types';

export interface FounderContextValue {
  ready: boolean;
  supabaseConfigured: boolean;
  userEmail: string | null;
  userId: string | null;
  syncNote: string | null;
  state: FounderState;
  xp: number;
  levelName: string;
  levelPercent: number;
  nextLevelName: string | null;
  credibility: number;
  profilePercent: number;
  setStep: (step: number) => void;
  updateAnswers: (partial: Partial<Answers>) => void;
  completeAssessment: () => ScoreReport;
  selectModel: (id: string) => void;
  generateBlueprint: () => Promise<Blueprint | null>;
  updateProfile: (partial: Partial<FounderProfile>) => void;
  setNotebookField: (slug: string, fieldId: string, value: string) => void;
  sendCoachMessage: (text: string) => Promise<void>;
  toggleTask: (id: string) => void;
  addGoal: (title: string) => void;
  toggleGoal: (id: string) => void;
  setCertModule: (pathwayId: string, moduleId: string, done: boolean) => void;
  saveFunding: (opportunityId: string, name: string) => void;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, name: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

function coachContext(state: FounderState): CoachContext {
  const xp = totalXp(state.xpEvents);
  const level = levelFor(xp);
  const scores = state.scores;
  const top = state.matches.find((match) => match.id === state.selectedModelId) ?? state.matches[0];
  const nextTask = state.tasks.find((task) => !task.done);
  const lowest = scores
    ? [
        { name: 'founder readiness', value: scores.founderReadiness, advice: 'Block two focused sessions this week and write the offer in one sentence.' },
        { name: 'launch', value: scores.businessLaunch, advice: 'Pick the top matched model and finish the blueprint item that takes less than a day.' },
        { name: 'funding readiness', value: scores.fundingReadiness, advice: 'Write who you serve, what delivery costs in time, and what proof you already have.' },
      ].sort((a, b) => a.value - b.value)[0]
    : null;

  return {
    name: state.profile.displayName,
    archetypeName: scores?.archetype.name,
    founderReadiness: scores?.founderReadiness,
    businessLaunch: scores?.businessLaunch,
    fundingReadiness: scores?.fundingReadiness,
    topMatch: top?.name,
    topMatchScore: top?.matchScore,
    topMatchReason: top?.reasons[0],
    blueprintTitle: state.blueprint?.chosenName,
    nextTask: nextTask?.title,
    nextPathway: nextPathwayName(state.certProgress) ?? undefined,
    credibility: credibilityScore(completedPathwayCount(state.certProgress), PATHWAYS.length),
    levelName: level.current.name,
    lowCapital: state.assessment.answers.capital === 'none' || state.assessment.answers.capital === 'under_1k',
    memory: state.coachMemory,
    lowestAdvice: lowest ? `The lower score right now is ${lowest.name} at ${lowest.value}. ${lowest.advice}` : 'Finish the assessment to get a scored recommendation.',
  };
}

export const FounderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FounderState>(() => applyDerived(loadLocalState()));
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [syncNote, setSyncNote] = useState<string | null>(null);
  const allowPush = useRef(false);
  const supabaseConfigured = isSupabaseConfigured();

  const commit = (recipe: (draft: FounderState) => void) => {
    setState((previous) => {
      const next = JSON.parse(JSON.stringify(previous)) as FounderState;
      recipe(next);
      next.updatedAt = new Date().toISOString();
      return applyDerived(next);
    });
  };

  useEffect(() => {
    if (!ready) return;
    saveLocalState(state);
  }, [state, ready]);

  useEffect(() => {
    let cancel = false;
    const local = applyDerived(loadLocalState());
    const client = getFounderSupabase();
    if (!client) {
      allowPush.current = true;
      setReady(true);
      return;
    }

    client.auth.getSession().then(async ({ data }) => {
      if (cancel) return;
      const sessionUser = data.session?.user;
      if (sessionUser) {
        setUserId(sessionUser.id);
        setUserEmail(sessionUser.email ?? null);
        try {
          const remote = await pullFounderState(sessionUser.id);
          if (!cancel) setState(applyDerived(mergeStates(local, remote)));
        } catch {
          if (!cancel) setSyncNote('Saved on this device. Cloud sync could not be read.');
        }
      }
      if (!cancel) {
        allowPush.current = true;
        setReady(true);
      }
    }).catch(() => {
      if (cancel) return;
      allowPush.current = true;
      setReady(true);
    });

    const { data: subscription } = client.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
      setUserEmail(session?.user.email ?? null);
    });

    return () => {
      cancel = true;
      subscription.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!ready || !userId || !allowPush.current) return;
    const handle = window.setTimeout(() => {
      void pushFounderState(userId, state).then((result) => {
        setSyncNote(result.ok ? 'Saved to your founder account.' : `Saved on this device. Cloud sync: ${result.message}`);
      });
    }, 800);
    return () => window.clearTimeout(handle);
  }, [state, ready, userId]);

  const value = useMemo<FounderContextValue>(() => {
    const xp = totalXp(state.xpEvents);
    const level = levelFor(xp);
    return {
      ready,
      supabaseConfigured,
      userEmail,
      userId,
      syncNote,
      state,
      xp,
      levelName: level.current.name,
      levelPercent: level.percent,
      nextLevelName: level.next?.name ?? null,
      credibility: credibilityScore(completedPathwayCount(state.certProgress), PATHWAYS.length),
      profilePercent: profileProgress(state.profile).percent,
      setStep: (step) => commit((draft) => {
        draft.assessment.step = step;
      }),
      updateAnswers: (partial) => commit((draft) => {
        draft.assessment.answers = { ...draft.assessment.answers, ...partial };
        draft.assessment.updatedAt = new Date().toISOString();
      }),
      completeAssessment: () => {
        const report = scoreAssessment(state.assessment.answers);
        commit((draft) => {
          const scored = scoreAssessment(draft.assessment.answers);
          draft.assessment.status = 'complete';
          draft.assessment.completedAt = new Date().toISOString();
          draft.scores = scored;
          draft.matches = matchBusinesses({
            answers: draft.assessment.answers,
            archetypeId: scored.archetype.id,
            orgType: draft.profile.orgType,
          });
          if (!draft.selectedModelId && draft.matches[0]) draft.selectedModelId = draft.matches[0].id;
          if (!draft.profile.skills.length) draft.profile.skills = [...(draft.assessment.answers.skills ?? [])];
          if (!draft.profile.interests.length) draft.profile.interests = [...(draft.assessment.answers.interests ?? [])];
          draft.tasks = mergeTasks(draft.tasks, starterTasks(draft.assessment.answers));
          draft.coachMemory = `${scored.archetype.name}. Top model pending review.`;
        });
        return report;
      },
      selectModel: (id) => commit((draft) => {
        draft.selectedModelId = id;
      }),
      generateBlueprint: async () => {
        const model = state.matches.find((match) => match.id === state.selectedModelId) ?? state.matches[0];
        if (!model || !state.scores) return null;
        const rules = buildBlueprint({
          answers: state.assessment.answers,
          scores: state.scores,
          model,
          profileName: state.profile.displayName,
          ventureName: state.profile.ventures[0]?.name,
        });
        const saveBlueprint = (blueprint: Blueprint) => {
          commit((draft) => {
            draft.blueprint = blueprint;
            draft.selectedModelId = blueprint.modelId;
            draft.tasks = mergeTasks(
              draft.tasks,
              blueprint.launchChecklist.map((item) => ({ id: `check-${item.id}`, title: item.label, done: false, href: item.href })),
            );
            draft.coachMemory = `${blueprint.chosenName} (${blueprint.modelName}). ${blueprint.mission}`.slice(0, 500);
          });
        };
        saveBlueprint(rules);
        const aiText = await requestAdvisor(blueprintAiMessages({
          model: rules.modelName,
          archetype: state.scores.archetype.name,
          mission: rules.mission,
          vision: rules.vision,
          elevatorPitch: rules.elevatorPitch,
          targetCustomer: rules.targetCustomer,
          competitiveAdvantage: rules.competitiveAdvantage,
          revenueStreams: rules.revenueStreams,
          marketingStrategy: rules.marketingStrategy,
          risks: rules.risks,
          nameIdeas: rules.nameIdeas,
        }));
        const blueprint = aiText ? applyAiBlueprint(rules, aiText) : rules;
        if (aiText) saveBlueprint(blueprint);
        return blueprint;
      },
      updateProfile: (partial) => commit((draft) => {
        draft.profile = { ...draft.profile, ...partial };
      }),
      setNotebookField: (slug, fieldId, value) => commit((draft) => {
        const current = draft.notebook ?? {};
        draft.notebook = { ...current, [slug]: { ...current[slug], [fieldId]: value } };
      }),
      sendCoachMessage: async (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const userMessage: ChatMessage = {
          id: uid('msg'),
          role: 'user',
          content: trimmed,
          source: 'founder',
          at: new Date().toISOString(),
        };
        const history = [...state.messages, userMessage].slice(-40);
        const context = coachContext({ ...state, messages: history });
        const rules = coachReply(trimmed, context);
        const replyId = uid('msg');
        const day = new Date().toISOString().slice(0, 10);
        commit((draft) => {
          draft.messages = [
            ...history,
            { id: replyId, role: 'assistant', content: rules, source: 'rules', at: new Date().toISOString() },
          ].slice(-40);
          draft.coachMemory = rules.slice(0, 500);
          if (!draft.xpEvents.some((event) => event.id === `coach:${day}`)) {
            draft.xpEvents.push({ id: `coach:${day}`, xp: 20, reason: 'Worked with the launch coach', at: new Date().toISOString() });
          }
        });
        const aiText = await requestAdvisor(coachAiMessages(history, context));
        if (!aiText) return;
        commit((draft) => {
          draft.messages = draft.messages.map((message) => (
            message.id === replyId ? { ...message, content: aiText, source: 'ai' } : message
          ));
          draft.coachMemory = aiText.slice(0, 500);
        });
      },
      toggleTask: (id) => commit((draft) => {
        draft.tasks = draft.tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task));
      }),
      addGoal: (title) => commit((draft) => {
        const clean = title.trim();
        if (!clean) return;
        draft.goals.push({ id: uid('goal'), title: clean, done: false, weekOf: currentWeekOf() });
      }),
      toggleGoal: (id) => commit((draft) => {
        draft.goals = draft.goals.map((goal) => (goal.id === id ? { ...goal, done: !goal.done } : goal));
      }),
      setCertModule: (pathwayId, moduleId, done) => commit((draft) => {
        const current = draft.certProgress[pathwayId]?.modules ?? {};
        draft.certProgress[pathwayId] = { modules: { ...current, [moduleId]: done } };
      }),
      saveFunding: (opportunityId, name) => commit((draft) => {
        if (draft.fundingApplications.some((item) => item.opportunityId === opportunityId)) return;
        draft.fundingApplications.push({
          id: uid('fund'),
          opportunityId,
          name,
          status: 'preparing',
          note: 'Saved for practice. This sample record was not submitted to a funder.',
          at: new Date().toISOString(),
        });
      }),
      signIn: async (email, password) => {
        const client = getFounderSupabase();
        if (!client) return 'Supabase is not configured. Continue in this browser, or add the founder env vars.';
        const { data, error } = await client.auth.signInWithPassword({ email, password });
        if (error) return error.message;
        const id = data.user?.id;
        if (!id) return 'Sign-in did not return an account.';
        setUserId(id);
        setUserEmail(data.user.email ?? email);
        const remote = await pullFounderState(id);
        setState((previous) => applyDerived(mergeStates(previous, remote)));
        return null;
      },
      signUp: async (email, password, name) => {
        const client = getFounderSupabase();
        if (!client) return 'Supabase is not configured. Continue in this browser, or add the founder env vars.';
        const { data, error } = await client.auth.signUp({
          email,
          password,
          options: { data: { display_name: name } },
        });
        if (error) return error.message;
        commit((draft) => {
          if (!draft.profile.displayName && name.trim()) draft.profile.displayName = name.trim();
          if (!draft.profile.email) draft.profile.email = email;
        });
        if (!data.session) {
          return 'Account created. Confirm the email if your project requires it, then sign in. This browser copy is still saved.';
        }
        setUserId(data.user?.id ?? null);
        setUserEmail(data.user?.email ?? email);
        return null;
      },
      signOut: async () => {
        const client = getFounderSupabase();
        if (client) await client.auth.signOut();
        setUserId(null);
        setUserEmail(null);
        setSyncNote('Signed out. This browser copy is still here.');
      },
    };
  }, [ready, supabaseConfigured, userEmail, userId, syncNote, state]);

  return <FounderContext.Provider value={value}>{children}</FounderContext.Provider>;
};

