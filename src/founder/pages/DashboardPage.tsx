import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CardLink from '@/components/w3bb/CardLink';
import { BADGE_CATALOG, PATHWAYS } from '../catalog';
import { FounderFrame, Meter, ScoreRing } from '../components';
import { useFounder } from '../useFounder';
import { matchFunding } from '../funding';
import { completedPathwayCount, pathwayComplete } from '../gamification';

const BADGE_TO: Record<string, string> = {
  assessment_done: '/launch/results',
  blueprint_created: '/launch/blueprint',
  profile_complete: '/launch/profile',
  pathway_complete: '/launch/certifications',
};

const SCORE_LINKS = [
  ['founder-readiness', 'founderReadiness', 'Founder Readiness'],
  ['business-launch', 'businessLaunch', 'Business Launch'],
  ['funding-readiness', 'fundingReadiness', 'Funding Readiness'],
] as const;

const DashboardPage: React.FC = () => {
  const { state, xp, levelName, levelPercent, nextLevelName, credibility, profilePercent, toggleTask, addGoal, toggleGoal } = useFounder();
  const [goal, setGoal] = useState('');
  const scores = state.scores;
  const pathwaysDone = completedPathwayCount(state.certProgress);
  const funding = scores
    ? matchFunding({
        answers: state.assessment.answers,
        orgType: state.profile.orgType,
        modelId: state.selectedModelId,
      }).slice(0, 2)
    : [];
  const latestCoach = [...state.messages].reverse().find((message) => message.role === 'assistant');
  const weekGoals = state.goals.filter((item) => item.weekOf === weekStamp());
  const lowCapital = state.assessment.answers.capital === 'none' || state.assessment.answers.capital === 'under_1k';

  return (
    <FounderFrame title="Command Center" description="Your W3BB founder command center: scores, blueprint, pathways, funding, and tasks.">
      <p className="micro-label text-cyan">Command center</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
        {state.profile.displayName.trim() ? `${state.profile.displayName.split(' ')[0]}, you are a ${levelName}.` : `You are a ${levelName}.`}
      </h1>
      <p className="mt-3 max-w-2xl text-white/75">
        {xp} XP. {nextLevelName ? `${levelPercent}% of the way to ${nextLevelName}.` : 'You have reached Certified Leader inside Launch.'} This level tracks practice in the platform. It is not the Trust-Approved badge.
      </p>
      <div className="mt-4 max-w-md">
        <Meter value={levelPercent} label={`${levelName} progress`} />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {scores ? (
          SCORE_LINKS.map(([id, key, label]) => (
            <CardLink key={id} to={`/launch/results#${id}`} className="flex justify-center p-5">
              <ScoreRing score={scores[key]} label={label} />
            </CardLink>
          ))
        ) : (
          <CardLink to="/launch/assess" className="p-5 lg:col-span-3">
            <h2 className="font-display text-xl font-semibold text-white">Assessment</h2>
            <p className="mt-2 text-sm text-white/75">No scores yet. The assessment saves your place. Continue the assessment.</p>
          </CardLink>
        )}
      </div>

      {scores ? (
        <p className="mt-4 text-sm text-white/75">
          Archetype: <span className="text-white">{scores.archetype.name}</span>. <Link to="/launch/results" className="text-cyan underline decoration-cyan/30 underline-offset-4">Read the breakdown</Link>
        </p>
      ) : null}

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <CardLink to={state.blueprint ? '/launch/blueprint' : '/launch/matches'} className="p-5">
          <h2 className="font-display text-xl font-semibold text-white">Blueprint</h2>
          {state.blueprint ? (
            <>
              <p className="mt-2 text-sm text-white/80">{state.blueprint.chosenName} · {state.blueprint.modelName}</p>
              <p className="mt-2 text-sm text-white/70">{state.blueprint.source === 'ai' ? 'Hosted advisor refined the narrative.' : 'On-device architect. Open the blueprint.'}</p>
            </>
          ) : (
            <p className="mt-2 text-sm text-white/75">No blueprint yet. Choose a model.</p>
          )}
        </CardLink>

        <CardLink to="/launch/certifications" className="p-5">
          <h2 className="font-display text-xl font-semibold text-white">Certification pathways</h2>
          <div className="mt-3"><Meter value={credibility} label="Credibility from pathways" /></div>
          <p className="mt-3 text-sm text-white/75">{pathwaysDone} of {PATHWAYS.length} new learning tracks complete. Open the pathways. They lead up to Trust-Approved Certification and do not grant it.</p>
        </CardLink>

        <CardLink to={funding[0] ? `/launch/funding#${funding[0].id}` : '/launch/funding'} className="p-5">
          <h2 className="font-display text-xl font-semibold text-white">Funding practice</h2>
          <p className="mt-2 text-sm text-white/70">Sample records only. No real amounts or deadlines.</p>
          {funding.length ? (
            <ul className="mt-3 space-y-2 text-sm text-white/85">
              {funding.map((item) => (
                <li key={item.id}>{item.name} · match {item.matchScore}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-white/75">Finish the assessment to rank the sample list.</p>
          )}
        </CardLink>

        <CardLink to="/launch/coach" className="p-5">
          <h2 className="font-display text-xl font-semibold text-white">Coach</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/75">
            {latestCoach ? latestCoach.content.slice(0, 280) : 'No coach messages yet. Open the coach after the assessment.'}
          </p>
        </CardLink>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <article className="glass p-5">
          <h2 className="font-display text-xl font-semibold text-white">Continue in W3BB</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="text-cyan underline decoration-cyan/30 underline-offset-4" to="/build">Business Builder</Link></li>
            <li><Link className="text-cyan underline decoration-cyan/30 underline-offset-4" to="/#builder">The 8 builder steps</Link></li>
            <li><Link className="text-cyan underline decoration-cyan/30 underline-offset-4" to="/launchpad">Entrepreneur Launchpad</Link></li>
            {lowCapital ? <li><Link className="text-cyan underline decoration-cyan/30 underline-offset-4" to="/zero-dollar-startup">Zero-Dollar Startup Path</Link></li> : null}
          </ul>
        </article>
        <CardLink to="/launch/profile" className="p-5">
          <h2 className="font-display text-xl font-semibold text-white">Profile</h2>
          <div className="mt-3"><Meter value={profilePercent} label="Profile progress" /></div>
          <p className="mt-4 text-sm font-semibold text-cyan">Edit profile</p>
        </CardLink>
      </div>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <article className="glass p-5">
          <h2 className="font-display text-xl font-semibold text-white">Launch tasks</h2>
          {state.tasks.length === 0 ? <p className="mt-3 text-sm text-white/75">Tasks appear when you finish the assessment.</p> : (
            <ul className="mt-3 space-y-2">
              {state.tasks.map((task) => (
                <li key={task.id} className="flex items-start gap-3">
                  <input
                    id={`task-${task.id}`}
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-cyan"
                    checked={task.done}
                    aria-label={`Mark done: ${task.title}`}
                    onChange={() => toggleTask(task.id)}
                  />
                  {task.href ? (
                    <Link to={task.href} className="text-sm text-white/85 underline decoration-white/20 underline-offset-4">{task.title}</Link>
                  ) : (
                    <span className="text-sm text-white/85">{task.title}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="glass p-5">
          <h2 className="font-display text-xl font-semibold text-white">Weekly goals</h2>
          <form
            className="mt-3 flex flex-col gap-2 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              addGoal(goal);
              setGoal('');
            }}
          >
            <label htmlFor="weekly-goal" className="sr-only">Weekly goal</label>
            <input id="weekly-goal" className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white" value={goal} onChange={(event) => setGoal(event.target.value)} placeholder="One goal for this week" />
            <button type="submit" className="rounded-full bg-white px-4 py-3 text-sm font-semibold text-[#07080C]">Add</button>
          </form>
          <ul className="mt-3 space-y-2">
            {weekGoals.length === 0 ? <li className="text-sm text-white/70">No goal for this week yet.</li> : weekGoals.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <input id={`goal-${item.id}`} type="checkbox" className="mt-1 h-4 w-4 accent-cyan" checked={item.done} onChange={() => toggleGoal(item.id)} />
                <label htmlFor={`goal-${item.id}`} className="text-sm text-white/85">{item.title}</label>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold text-white">Badges</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BADGE_CATALOG.map((badge) => {
            const earned = state.earnedBadgeIds.includes(badge.id);
            return (
              <li key={badge.id}>
                <CardLink to={BADGE_TO[badge.id]} className={`rounded-2xl p-4 ${earned ? 'border-gold/40 bg-gold/10' : ''}`}>
                  <p className="font-display font-semibold text-white">{badge.name}</p>
                  <p className="mt-1 text-sm text-white/70">{badge.detail}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.14em] text-white/60">{earned ? 'Earned' : 'Not yet'}</p>
                </CardLink>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <CardLink to="/launch/blueprint" className="p-5">
          <h2 className="font-display text-lg font-semibold text-white">Milestone progress</h2>
          {state.profile.milestones.length === 0 && !state.blueprint ? (
            <p className="mt-2 text-sm text-white/75">Record a milestone on your profile, or generate a blueprint to see the 12-month plan.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              {state.profile.milestones.map((milestone) => <li key={milestone.id}>Recorded: {milestone.title}</li>)}
              {state.blueprint?.milestones12.map((milestone) => <li key={milestone.phase}>Planned · {milestone.phase}: {milestone.title}</li>)}
            </ul>
          )}
          <p className="mt-3 text-xs text-white/60">
            Pathways marked complete: {PATHWAYS.filter((pathway) => pathwayComplete(state.certProgress, pathway.id)).map((pathway) => pathway.name).join(', ') || 'none yet'}.
          </p>
        </CardLink>
        <article className="glass p-5">
          <h2 className="font-display text-lg font-semibold text-white">Revenue tracking</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/75">
            Placeholder. No income is recorded here, and nothing is connected to payments or the marketplace in this release.
          </p>
        </article>
        <CardLink to="/community" className="p-5">
          <h2 className="font-display text-lg font-semibold text-white">Community activity</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/75">
            Activity inside Launch is not counted yet. Open the W3BB community.
          </p>
        </CardLink>
      </section>
    </FounderFrame>
  );
};

function weekStamp(): string {
  const date = new Date();
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const dayNum = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${dayNum}`;
}

export default DashboardPage;
