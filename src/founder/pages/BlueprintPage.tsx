import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FounderFrame, PrimaryLink } from '../components';
import { useFounder } from '../useFounder';

const BlueprintPage: React.FC = () => {
  const { state, generateBlueprint } = useFounder();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const blueprint = state.blueprint;

  const generate = async () => {
    setBusy(true);
    setError(null);
    const result = await generateBlueprint();
    setBusy(false);
    if (!result) setError('Finish the assessment and choose a model before generating a blueprint.');
  };

  if (!state.scores) {
    return (
      <FounderFrame title="Business blueprint" description="A saved business blueprint generated from your W3BB founder assessment.">
        <h1 className="font-display text-4xl font-semibold text-white">The blueprint starts with your scores.</h1>
        <div className="mt-8"><PrimaryLink to="/launch/assess">Take the assessment</PrimaryLink></div>
      </FounderFrame>
    );
  }

  return (
    <FounderFrame title="Business blueprint" description="A saved business blueprint you can carry into the W3BB Business Builder.">
      <p className="micro-label text-cyan">Business architect</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
        {blueprint ? blueprint.chosenName : 'Generate your blueprint'}
      </h1>
      <p className="mt-4 max-w-2xl text-white/75">
        The architect writes a plan from your scores and the model you selected. It is saved in this browser{state.scores ? '' : ''}. The Business Builder is still where the business gets created.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button type="button" className="cta-primary rounded-full px-6 py-3 text-sm font-semibold text-white disabled:opacity-50" disabled={busy} onClick={() => void generate()}>
          {busy ? 'Writing the blueprint…' : blueprint ? 'Regenerate blueprint' : 'Generate blueprint'}
        </button>
        <Link to="/build" className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/85">
          Continue in the Business Builder
        </Link>
      </div>
      {error ? <p className="mt-4 text-sm text-gold" role="alert">{error}</p> : null}
      {blueprint ? (
        <p className="mt-4 text-sm text-white/70" role="status">
          {blueprint.source === 'ai'
            ? 'Narrative refined by the hosted advisor. The checklist and builder handoff stay tied to W3BB.'
            : 'Saved from the on-device architect. A hosted advisor was not available, so the rules blueprint is the record.'}
        </p>
      ) : null}

      {blueprint ? (
        <div className="mt-10 space-y-6">
          <section className="glass p-6">
            <h2 className="font-display text-xl font-semibold text-white">Name ideas</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {blueprint.nameIdeas.map((name) => (
                <li key={name} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/85">{name}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-white/70">Working name: {blueprint.chosenName}. Model: {blueprint.modelName}.</p>
          </section>
          <Section title="Mission" body={blueprint.mission} />
          <Section title="Vision" body={blueprint.vision} />
          <Section title="Elevator pitch" body={blueprint.elevatorPitch} />
          <Section title="Target customer" body={blueprint.targetCustomer} />
          <Section title="Competitive advantage" body={blueprint.competitiveAdvantage} />
          <ListSection title="Revenue streams" items={blueprint.revenueStreams} />
          <ListSection title="Marketing strategy" items={blueprint.marketingStrategy} />
          <ListSection title="Launch checklist" items={blueprint.launchChecklist.map((item) => item.label)} />
          <section className="glass p-6">
            <h2 className="font-display text-xl font-semibold text-white">90-day plan</h2>
            <ol className="mt-4 space-y-4">
              {blueprint.plan90.map((phase) => (
                <li key={phase.phase}>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan">{phase.phase}</p>
                  <p className="mt-1 font-display text-lg text-white">{phase.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/75">{phase.detail}</p>
                </li>
              ))}
            </ol>
          </section>
          <section className="glass p-6">
            <h2 className="font-display text-xl font-semibold text-white">12-month milestones</h2>
            <ol className="mt-4 grid gap-4 sm:grid-cols-2">
              {blueprint.milestones12.map((item) => (
                <li key={item.phase} className="rounded-2xl border border-white/10 p-4">
                  <p className="text-xs text-cyan">{item.phase}</p>
                  <p className="mt-1 font-medium text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-white/75">{item.detail}</p>
                </li>
              ))}
            </ol>
          </section>
          <ListSection title="Risks" items={blueprint.risks} />
          <ListSection title="Tech stack" items={blueprint.techStack} />
          <section className="glass p-6">
            <h2 className="font-display text-xl font-semibold text-white">Hand this to the Business Builder</h2>
            <p className="mt-2 text-sm text-white/75">These are the existing eight steps. Launch does not redo them.</p>
            <ol className="mt-4 space-y-3">
              {blueprint.builderHandoff.map((step) => (
                <li key={step.phase} className="flex gap-3">
                  <span className="font-mono text-sm text-cyan">{step.phase}</span>
                  <span>
                    <span className="block font-medium text-white">{step.title}</span>
                    <span className="block text-sm text-white/75">{step.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
          <section className="glass p-6">
            <h2 className="font-display text-xl font-semibold text-white">Where to go next on this site</h2>
            <ul className="mt-4 space-y-2">
              {blueprint.programLinks.map((link) => (
                <li key={link.id}>
                  <Link to={link.href ?? '/build'} className="text-sm font-medium text-cyan underline decoration-cyan/30 underline-offset-4">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}
    </FounderFrame>
  );
};

function Section({ title, body }: { title: string; body: string }) {
  return (
    <section className="glass p-6">
      <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-white/80">{body}</p>
    </section>
  );
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="glass p-6">
      <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/80">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}

export default BlueprintPage;
