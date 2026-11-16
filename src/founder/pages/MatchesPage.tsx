import React, { useState } from 'react';
import CardLink from '@/components/w3bb/CardLink';
import { requestAdvisor } from '../ai';
import { FounderFrame, PrimaryLink } from '../components';
import { useFounder } from '../useFounder';

const MatchesPage: React.FC = () => {
  const { state, selectModel } = useFounder();
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!state.matches.length) {
    return (
      <FounderFrame title="Business matches" description="Recommended business models based on your founder assessment.">
        <h1 className="font-display text-4xl font-semibold text-white">Matches wait on the assessment.</h1>
        <p className="mt-4 max-w-xl text-white/75">Finish the assessment and the rules engine will rank nine models. A hosted advisor is optional.</p>
        <div className="mt-8"><PrimaryLink to="/launch/assess">Take the assessment</PrimaryLink></div>
      </FounderFrame>
    );
  }

  const explain = async () => {
    setBusy(true);
    setNote(null);
    const top = state.matches.slice(0, 3).map((match) => ({
      name: match.name,
      score: match.matchScore,
      reasons: match.reasons,
    }));
    const text = await requestAdvisor([
      {
        role: 'system',
        content: 'Explain these W3BB business matches in under 140 words. Do not invent revenue numbers. Say that the scores came from rules and the founder can choose a different model. Mention the Business Builder as the place the business gets built.',
      },
      { role: 'user', content: JSON.stringify({ archetype: state.scores?.archetype.name, matches: top }) },
    ]);
    setBusy(false);
    setNote(text ?? 'The hosted advisor is not configured. The matches below are from the on-device rules, and those reasons stay visible either way.');
  };

  return (
    <FounderFrame title="Business matches" description="Rules-based business model recommendations for W3BB founders.">
      <p className="micro-label text-cyan">Business matching</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">Models that fit how you work</h1>
      <p className="mt-4 max-w-2xl text-white/75">
        Ranked by fixed rules from your assessment. Difficulty, budget, revenue, and timeline are planning bands, not quotes or forecasts. Choose one to carry into a blueprint.
      </p>
      <button type="button" className="mt-5 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/85 disabled:opacity-50" disabled={busy} onClick={() => void explain()}>
        {busy ? 'Asking the advisor…' : 'Ask the advisor to explain the top matches'}
      </button>
      {note ? <p className="mt-4 max-w-2xl whitespace-pre-wrap text-sm leading-relaxed text-white/80" role="status">{note}</p> : null}

      <ul className="mt-8 grid gap-4">
        {state.matches.map((match, index) => {
          const selected = state.selectedModelId === match.id;
          return (
            <li key={match.id}>
              <CardLink
                to={`/launch/blueprint?model=${match.id}`}
                onClick={() => selectModel(match.id)}
                className={`p-5 sm:p-6 ${selected ? 'ring-1 ring-cyan/50' : ''}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">Match {index + 1}</p>
                    <h2 className="mt-1 font-display text-2xl font-semibold text-white">{match.name}</h2>
                  </div>
                  <p className="font-display text-3xl font-semibold text-white">
                    <span className="sr-only">{match.name} match score </span>
                    {match.matchScore}
                    <span className="sr-only"> out of 100</span>
                  </p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/75">{match.summary}</p>
                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-white/80">
                  {match.reasons.map((reason) => <li key={reason}>{reason}</li>)}
                </ul>
                <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                  <div><dt className="text-white/70">Difficulty</dt><dd className="text-white/90">{match.difficulty}</dd></div>
                  <div><dt className="text-white/70">Launch timeline</dt><dd className="text-white/90">{match.timeline}</dd></div>
                  <div><dt className="text-white/70">Budget</dt><dd className="text-white/90">{match.budgetBand}</dd></div>
                  <div><dt className="text-white/70">Revenue potential</dt><dd className="text-white/90">{match.revenuePotential}</dd></div>
                </dl>
                <span className="mt-5 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#07080C]">
                  {selected ? 'Open this blueprint' : 'Choose and open the blueprint'}
                </span>
              </CardLink>
            </li>
          );
        })}
      </ul>
    </FounderFrame>
  );
};

export default MatchesPage;
