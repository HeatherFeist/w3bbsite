import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import PageShell from '@/components/PageShell';
import {
  BUILDER_STEP_DETAILS,
  builderStepBySlug,
  builderStepPath,
  builderStepTitle,
} from '@/data/builderSteps';
import NotebookForm from '@/founder/NotebookForm';
import { useFounder } from '@/founder/useFounder';
import { usePageMeta } from '@/hooks/usePageMeta';

const focus =
  'rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-[#16141a]';

function useChecklist(slug: string, idList: string) {
  const key = `w3bb.builder-check.${slug}`;
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const ids = idList ? idList.split('|') : [];
    try {
      const saved = JSON.parse(localStorage.getItem(key) ?? '{}') as Record<string, boolean>;
      const next: Record<string, boolean> = {};
      for (const id of ids) next[id] = Boolean(saved[id]);
      setDone(next);
    } catch {
      setDone({});
    }
  }, [key, idList]);

  const toggle = (id: string) => {
    setDone((current) => {
      const next = { ...current, [id]: !current[id] };
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* The checklist still works for this visit. */
      }
      return next;
    });
  };

  const ids = idList ? idList.split('|') : [];
  const finished = ids.filter((id) => done[id]).length;
  return { done, toggle, finished, total: ids.length };
}

const BuilderStep: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const step = builderStepBySlug(slug);
  const title = step ? builderStepTitle(step.n) : 'Builder step';
  usePageMeta(title, step?.summary ?? 'A step in the W3BB Business Builder.');
  const { state } = useFounder();
  const taskIds = step?.tasks.map((task) => task.id).join('|') ?? '';
  const checklist = useChecklist(step?.slug ?? 'missing', taskIds);
  const index = BUILDER_STEP_DETAILS.findIndex((item) => item.slug === slug);
  const previous = index > 0 ? BUILDER_STEP_DETAILS[index - 1] : null;
  const next = index >= 0 && index < BUILDER_STEP_DETAILS.length - 1 ? BUILDER_STEP_DETAILS[index + 1] : null;

  if (!step) {
    return (
      <PageShell>
        <section className="container py-36">
          <h1 className="font-display text-4xl font-semibold text-white">That builder step is not on this site.</h1>
          <Link to="/#builder" className={`mt-6 inline-flex text-sm font-semibold text-cyan ${focus}`}>Back to the Business Builder</Link>
        </section>
      </PageShell>
    );
  }

  const blueprint = state.blueprint;
  const cta = checklist.finished > 0 ? `Continue: ${step.tool.label.replace(/^Start /, '')}` : step.tool.label;

  return (
    <PageShell>
      <article className="container pb-24 pt-32">
        <nav aria-label="Breadcrumb" className="text-sm text-white/70">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link to="/#builder" className={`hover:text-white ${focus}`}>Business Builder</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-white" aria-current="page">{title}</li>
          </ol>
        </nav>

        <p className="mt-8 font-mono text-sm text-cyan">Step {step.n} of 08</p>
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-semibold text-white sm:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">{step.summary}</p>
        <p className="mt-3 max-w-2xl text-sm text-white/70">{step.time}</p>
        <Link to={step.tool.to} className={`cta-primary mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-display text-sm font-semibold text-white ${focus}`}>
          {cta}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <NotebookForm slug={step.slug} />
            <section className="glass p-6 sm:p-8" aria-labelledby="why-it-matters">
              <h2 id="why-it-matters" className="font-display text-2xl font-semibold text-white">Why this step matters</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">{step.why}</p>
            </section>

            <section className="glass p-6 sm:p-8" aria-labelledby="step-checklist">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="step-checklist" className="font-display text-2xl font-semibold text-white">What you do</h2>
                <p className="text-sm text-white/70">{checklist.finished} of {checklist.total} checked on this device</p>
              </div>
              <ul className="mt-5 space-y-3">
                {step.tasks.map((task) => (
                  <li key={task.id}>
                    <label className="flex items-start gap-3 text-sm leading-relaxed text-white/85">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 accent-cyan"
                        checked={Boolean(checklist.done[task.id])}
                        onChange={() => checklist.toggle(task.id)}
                      />
                      {task.label}
                    </label>
                  </li>
                ))}
              </ul>
            </section>

            {step.slug === 'naming-branding' ? (
              <section className="glass p-6 sm:p-8" aria-labelledby="name-ideas">
                <h2 id="name-ideas" className="font-display text-2xl font-semibold text-white">Name suggestions from your blueprint</h2>
                {blueprint?.nameIdeas.length ? (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {blueprint.nameIdeas.map((name) => (
                      <li key={name} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white">{name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm leading-relaxed text-white/75">Generate a blueprint and the name ideas for your industry and model will show here.</p>
                )}
                <p className="mt-3 text-sm text-white/70">Working name: {blueprint?.chosenName || 'not chosen yet'}.</p>
              </section>
            ) : null}

            {step.slug === 'launch-preparation' && blueprint?.launchChecklist.length ? (
              <section className="glass p-6 sm:p-8" aria-labelledby="launch-checklist">
                <h2 id="launch-checklist" className="font-display text-2xl font-semibold text-white">Checklist from your blueprint</h2>
                <ul className="mt-4 space-y-2">
                  {blueprint.launchChecklist.map((item) => (
                    <li key={item.id}>
                      <Link to={item.href && item.href.startsWith('/') ? item.href : '/launch/blueprint'} className={`block rounded-xl px-1 py-1 text-sm text-cyan underline decoration-cyan/30 underline-offset-4 ${focus}`}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <div className="space-y-6">
            <section className="glass p-6" aria-labelledby="deliverables">
              <h2 id="deliverables" className="font-display text-xl font-semibold text-white">What you walk away with</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-white/80">
                {step.deliverables.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>

            <section className="glass p-6" aria-labelledby="w3bb-help">
              <h2 id="w3bb-help" className="font-display text-xl font-semibold text-white">How W3BB helps</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/80">{step.help}</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link to="/launch/blueprint" className={`font-medium text-cyan underline decoration-cyan/30 underline-offset-4 ${focus}`}>Open your blueprint</Link></li>
                <li><Link to={`/launch/coach?step=${step.slug}`} className={`font-medium text-cyan underline decoration-cyan/30 underline-offset-4 ${focus}`}>Ask the coach about this step</Link></li>
                <li><Link to={step.pathway.to} className={`font-medium text-cyan underline decoration-cyan/30 underline-offset-4 ${focus}`}>{step.pathway.label}</Link></li>
              </ul>
            </section>
          </div>
        </div>

        <section className="mt-8" aria-labelledby="related-tools">
          <h2 id="related-tools" className="font-display text-2xl font-semibold text-white">Also on this site</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {step.related.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={`glass flex items-center justify-between px-4 py-3 text-sm font-medium text-white hover:border-cyan/40 ${focus}`}>
                  {link.label}
                  <ArrowRight className="h-4 w-4 text-cyan" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10">
          <Link to={step.tool.to} className={`cta-primary inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-display text-sm font-semibold text-white ${focus}`}>
            {cta}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <nav className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between" aria-label="Builder steps">
          {previous ? (
            <Link to={builderStepPath(previous.n)} className={`inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white ${focus}`}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {previous.n} {builderStepTitle(previous.n)}
            </Link>
          ) : (
            <Link to="/#builder" className={`inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white ${focus}`}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              All builder steps
            </Link>
          )}
          {next ? (
            <Link to={builderStepPath(next.n)} className={`inline-flex items-center gap-2 text-sm font-semibold text-cyan ${focus}`}>
              Next: {builderStepTitle(next.n)}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : (
            <Link to="/build" className={`inline-flex items-center gap-2 text-sm font-semibold text-cyan ${focus}`}>
              Open the builder intake
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </nav>
      </article>
    </PageShell>
  );
};

export default BuilderStep;
