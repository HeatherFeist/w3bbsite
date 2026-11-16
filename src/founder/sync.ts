import { PATHWAYS } from './catalog';
import { completedPathwayCount, credibilityScore, levelFor, totalXp } from './gamification';
import { getFounderSupabase } from './supabaseClient';
import { normalizeState } from './storage';
import type { FounderState } from './types';

export function mergeStates(local: FounderState, remote: FounderState | null): FounderState {
  if (!remote) return local;
  if (!local.updatedAt) return remote;
  const localTime = Date.parse(local.updatedAt);
  const remoteTime = remote.updatedAt ? Date.parse(remote.updatedAt) : 0;
  return localTime >= remoteTime ? local : remote;
}

export async function pullFounderState(userId: string): Promise<FounderState | null> {
  const client = getFounderSupabase();
  if (!client) return null;
  const { data, error } = await client.from('founders').select('snapshot').eq('user_id', userId).maybeSingle();
  if (error || !data?.snapshot) return null;
  return normalizeState(data.snapshot);
}

async function replaceRows(
  table: string,
  userId: string,
  rows: Record<string, unknown>[],
) {
  const client = getFounderSupabase();
  if (!client) return;
  const deleted = await client.from(table).delete().eq('user_id', userId);
  if (deleted.error) throw new Error(deleted.error.message);
  if (!rows.length) return;
  const inserted = await client.from(table).insert(rows);
  if (inserted.error) throw new Error(inserted.error.message);
}

export async function pushFounderState(userId: string, state: FounderState): Promise<{ ok: boolean; message?: string }> {
  const client = getFounderSupabase();
  if (!client) return { ok: false, message: 'Supabase is not configured.' };

  try {
    const updated = state.updatedAt ?? new Date().toISOString();
    const profile = state.profile;
    const xp = totalXp(state.xpEvents);
    const credibility = credibilityScore(completedPathwayCount(state.certProgress), PATHWAYS.length);

    const profileWrite = await client.from('profiles').upsert({
      id: userId,
      email: profile.email || null,
      display_name: profile.displayName || null,
      updated_at: updated,
    });
    if (profileWrite.error) throw new Error(profileWrite.error.message);

    const founderWrite = await client.from('founders').upsert(
      {
        user_id: userId,
        location: profile.location || null,
        org_type: profile.orgType,
        image_url: profile.imageDataUrl || null,
        video_url: profile.videoUrl || null,
        story: profile.story || null,
        skills: profile.skills,
        interests: profile.interests,
        ventures: profile.ventures,
        milestones: profile.milestones,
        achievements: profile.achievements,
        credibility_score: credibility,
        xp,
        level_key: levelFor(xp).current.id,
        snapshot: state,
        state_updated_at: updated,
        updated_at: updated,
      },
      { onConflict: 'user_id' },
    );
    if (founderWrite.error) throw new Error(founderWrite.error.message);

    const assessment = await client
      .from('assessments')
      .upsert(
        {
          user_id: userId,
          status: state.assessment.status,
          step: state.assessment.step,
          completed_at: state.assessment.completedAt,
          updated_at: updated,
        },
        { onConflict: 'user_id' },
      )
      .select('id')
      .single();
    if (assessment.error) throw new Error(assessment.error.message);
    const assessmentId = assessment.data.id as string;

    await replaceRows(
      'assessment_answers',
      userId,
      Object.entries(state.assessment.answers)
        .filter(([, value]) => value != null)
        .map(([key, value]) => ({
          assessment_id: assessmentId,
          user_id: userId,
          question_key: key,
          answer: value,
        })),
    );

    if (state.scores) {
      const scores = await client.from('scores').upsert(
        {
          user_id: userId,
          assessment_id: assessmentId,
          founder_readiness: state.scores.founderReadiness,
          business_launch: state.scores.businessLaunch,
          funding_readiness: state.scores.fundingReadiness,
          breakdown: {
            readiness: state.scores.readinessFactors,
            launch: state.scores.launchFactors,
            funding: state.scores.fundingFactors,
          },
          updated_at: updated,
        },
        { onConflict: 'user_id' },
      );
      if (scores.error) throw new Error(scores.error.message);

      const archetype = await client.from('archetypes').upsert(
        {
          user_id: userId,
          archetype_key: state.scores.archetype.id,
          name: state.scores.archetype.name,
          summary: state.scores.archetype.summary,
          rationale: state.scores.archetype.rationale,
          updated_at: updated,
        },
        { onConflict: 'user_id' },
      );
      if (archetype.error) throw new Error(archetype.error.message);
    }

    await replaceRows(
      'business_matches',
      userId,
      state.matches.map((match) => ({
        user_id: userId,
        model_key: match.id,
        match_score: match.matchScore,
        payload: match,
        selected: match.id === state.selectedModelId,
      })),
    );

    if (state.blueprint) {
      const blueprint = await client.from('blueprints').upsert(
        {
          user_id: userId,
          model_key: state.blueprint.modelId,
          title: state.blueprint.chosenName,
          payload: state.blueprint,
          source: state.blueprint.source,
          updated_at: updated,
        },
        { onConflict: 'user_id' },
      );
      if (blueprint.error) throw new Error(blueprint.error.message);
    }

    const conversation = await client
      .from('coach_conversations')
      .upsert({ user_id: userId, title: 'Launch Coach', updated_at: updated }, { onConflict: 'user_id' })
      .select('id')
      .single();
    if (conversation.error) throw new Error(conversation.error.message);
    const conversationId = conversation.data.id as string;
    const removedMessages = await client.from('coach_messages').delete().eq('conversation_id', conversationId);
    if (removedMessages.error) throw new Error(removedMessages.error.message);
    if (state.messages.length) {
      const messages = await client.from('coach_messages').insert(
        state.messages.map((message) => ({
          conversation_id: conversationId,
          user_id: userId,
          role: message.role,
          content: message.content,
          created_at: message.at,
        })),
      );
      if (messages.error) throw new Error(messages.error.message);
    }

    if (state.coachMemory) {
      const memory = await client.from('coach_memory').upsert(
        {
          user_id: userId,
          summary: state.coachMemory.slice(0, 2000),
          metadata: { source: 'mvp' },
          updated_at: updated,
        },
        { onConflict: 'user_id' },
      );
      if (memory.error) throw new Error(memory.error.message);
    }

    await replaceRows(
      'tasks',
      userId,
      state.tasks.map((task, index) => ({
        user_id: userId,
        client_id: task.id,
        title: task.title,
        done: task.done,
        href: task.href ?? null,
        sort_order: index,
      })),
    );
    await replaceRows(
      'goals',
      userId,
      state.goals.map((goal) => ({
        user_id: userId,
        client_id: goal.id,
        title: goal.title,
        done: goal.done,
        week_of: goal.weekOf,
      })),
    );
    await replaceRows(
      'milestones',
      userId,
      state.profile.milestones.map((milestone) => ({
        user_id: userId,
        client_id: milestone.id,
        title: milestone.title,
        note: milestone.note,
        target_date: milestone.date || null,
        kind: 'recorded',
        progress: 100,
      })),
    );

    await replaceRows(
      'certification_progress',
      userId,
      PATHWAYS.map((pathway) => ({
        user_id: userId,
        certification_id: pathway.id,
        modules: state.certProgress[pathway.id]?.modules ?? {},
        completed: pathway.modules.every((module) => state.certProgress[pathway.id]?.modules?.[module.id]),
      })),
    );
    await replaceRows(
      'funding_applications',
      userId,
      state.fundingApplications.map((application) => ({
        user_id: userId,
        client_id: application.id,
        opportunity_id: application.opportunityId,
        status: application.status,
        note: application.note,
      })),
    );
    await replaceRows(
      'xp_events',
      userId,
      state.xpEvents.map((event) => ({
        user_id: userId,
        client_id: event.id,
        xp: event.xp,
        reason: event.reason,
        created_at: event.at,
      })),
    );
    await replaceRows(
      'founder_badges',
      userId,
      state.earnedBadgeIds.map((badgeId) => ({ user_id: userId, badge_id: badgeId })),
    );

    return { ok: true };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : 'Cloud sync failed.' };
  }
}
