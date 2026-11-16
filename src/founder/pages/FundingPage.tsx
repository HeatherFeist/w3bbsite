import React from 'react';
import { Link } from 'react-router-dom';
import { FounderFrame, ScoreRing } from '../components';
import { useFounder } from '../useFounder';
import { deriveStage, matchFunding } from '../funding';

const FundingPage: React.FC = () => {
  const { state, saveFunding } = useFounder();
  const matches = matchFunding({
    answers: state.assessment.answers,
    orgType: state.profile.orgType,
    modelId: state.selectedModelId ?? state.matches[0]?.id,
  });
  const stage = deriveStage(state.assessment.answers);

  return (
    <FounderFrame title="Funding and grants" description="Sample funding matches for practice. Not live grants.">
      <p className="micro-label text-gold">Sample data</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">Funding and grants hub</h1>
      <div className="mt-4 rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm leading-relaxed text-white/85" role="note">
        Every record on this page is sample data for matching practice. These are not live grants or lenders. Amounts and deadlines are intentionally absent so nothing here can be mistaken for a published award.
      </div>

      <div className="mt-8 grid items-center gap-6 lg:grid-cols-[180px_1fr]">
        <div className="glass flex justify-center p-4">
          <ScoreRing score={state.scores?.fundingReadiness ?? 0} label="Funding Readiness" />
        </div>
        <div>
          <p className="text-sm leading-relaxed text-white/75">
            {state.scores
              ? `Your funding readiness score is ${state.scores.fundingReadiness} out of 100, from the assessment weights. Stage used for matching: ${stage.replace('-', ' ')}. Organization type: ${state.profile.orgType.replace('_', ' ')}.`
              : 'Finish the assessment to calculate funding readiness. The sample list can still be browsed.'}
          </p>
          <p className="mt-3 text-sm text-white/75">
            Saved for later: {state.fundingApplications.length}. Saving a sample does not submit an application.
          </p>
          <Link to="/launch/results" className="mt-3 inline-flex text-sm font-semibold text-cyan">See how the score is weighted</Link>
        </div>
      </div>

      <ul className="mt-8 grid gap-4">
        {matches.map((item) => {
          const saved = state.fundingApplications.some((application) => application.opportunityId === item.id);
          return (
            <li key={item.id} className="glass p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Sample</p>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-white">{item.name}</h2>
                </div>
                <p className="font-display text-3xl text-white" aria-label={`Match score ${item.matchScore} out of 100`}>{item.matchScore}</p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/75">{item.summary}</p>
              <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                <div><dt className="text-white/60">Amount</dt><dd className="text-white/90">{item.amountLabel}</dd></div>
                <div><dt className="text-white/60">Deadline</dt><dd className="text-white/90">{item.deadlineLabel}</dd></div>
              </dl>
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-white/75">
                {item.reasons.map((reason) => <li key={reason}>{reason}</li>)}
              </ul>
              <button
                type="button"
                className="mt-4 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                disabled={saved}
                onClick={() => saveFunding(item.id, item.name)}
              >
                {saved ? 'Saved for practice' : 'Save for practice'}
              </button>
            </li>
          );
        })}
      </ul>
    </FounderFrame>
  );
};

export default FundingPage;
