import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FactorList, FounderFrame, PrimaryLink, ScoreRing } from '../components';
import { useFounder } from '../useFounder';

const ResultsPage: React.FC = () => {
  const { state } = useFounder();
  const scores = state.scores;
  const [open, setOpen] = useState<'readiness' | 'launch' | 'funding'>('readiness');

  if (!scores) {
    return (
      <FounderFrame title="Founder scores" description="Founder readiness, launch, and funding scores from the W3BB assessment.">
        <h1 className="font-display text-4xl font-semibold text-white">Your scores appear after the assessment.</h1>
        <p className="mt-4 max-w-xl text-white/75">The assessment saves as you go. Finish it to see a founder archetype and three scores.</p>
        <div className="mt-8">
          <PrimaryLink to="/launch/assess">Continue the assessment</PrimaryLink>
        </div>
      </FounderFrame>
    );
  }

  const sections = [
    ['readiness', 'Founder Readiness', scores.readinessFactors],
    ['launch', 'Business Launch', scores.launchFactors],
    ['funding', 'Funding Readiness', scores.fundingFactors],
  ] as const;

  return (
    <FounderFrame title="Founder scores" description="Transparent founder readiness, business launch, and funding readiness scores.">
      <p className="micro-label text-cyan">Your results</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">{scores.archetype.name}</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75">{scores.archetype.summary}</p>
      <ul className="mt-4 max-w-2xl list-disc space-y-1 pl-5 text-sm text-white/75">
        {scores.archetype.rationale.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>

      <div className="mt-10 grid gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:grid-cols-3">
        <ScoreRing score={scores.founderReadiness} label="Founder Readiness" />
        <ScoreRing score={scores.businessLaunch} label="Business Launch" />
        <ScoreRing score={scores.fundingReadiness} label="Funding Readiness" />
      </div>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/70">
        Each score is 0–100. A factor contributes its weight times your signal. The weights are fixed, so the same answers always produce the same score. Nothing here is a promise of revenue or funding.
      </p>

      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Score breakdowns">
        {sections.map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={open === id}
            className={`rounded-full px-4 py-2 text-sm font-medium ${open === id ? 'bg-white text-[#07080C]' : 'border border-white/15 text-white/80'}`}
            onClick={() => setOpen(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-5 glass p-5 sm:p-6" role="tabpanel">
        <FactorList factors={sections.find(([id]) => id === open)?.[2] ?? scores.readinessFactors} />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <PrimaryLink to="/launch/matches">See business matches</PrimaryLink>
        <Link to="/launch/assess" className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/85">
          Edit answers
        </Link>
      </div>
    </FounderFrame>
  );
};

export default ResultsPage;
