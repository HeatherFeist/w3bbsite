import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { builderStepBySlug, builderStepPath, builderStepTitle } from '@/data/builderSteps';
import { fieldClass, FounderFrame } from '../components';
import { useFounder } from '../useFounder';

const SUGGESTIONS = [
  'What should I do this week?',
  'Why this business model?',
  'How do I get funding-ready?',
  'Which pathway is next?',
  'How does this connect to the Business Builder?',
];

const CoachPage: React.FC = () => {
  const { state, sendCoachMessage } = useFounder();
  const [params] = useSearchParams();
  const builderStep = builderStepBySlug(params.get('step'));
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  const send = async (value: string) => {
    const clean = value.trim();
    if (!clean || busy) return;
    setBusy(true);
    setText('');
    await sendCoachMessage(clean);
    setBusy(false);
  };

  return (
    <FounderFrame title="Launch coach" description="A launch coach that uses your W3BB assessment, blueprint, and progress.">
      <p className="micro-label text-cyan">Launch coach</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">Ask with your plan in the room.</h1>
      <p className="mt-4 max-w-2xl text-white/75">
        The coach reads your assessment, blueprint, tasks, and pathway progress. Conversation history stays saved. Without a server-side AI key, you still get the on-device advisor.
      </p>
      {builderStep ? (
        <div className="mt-6 max-w-2xl glass p-5">
          <p className="text-sm leading-relaxed text-white/80">
            This conversation is about Business Builder step {builderStep.n}, {builderStepTitle(builderStep.n)}.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="cta-primary rounded-full px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              disabled={busy}
              onClick={() => void send(`Help me with Business Builder step ${builderStep.n}, ${builderStepTitle(builderStep.n)}. Use my assessment and blueprint, and tell me the next action on that step.`)}
            >
              Ask about this step
            </button>
            <Link to={builderStepPath(builderStep.slug)} className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/85">
              Back to the step
            </Link>
          </div>
        </div>
      ) : null}

      <div className="mt-8 space-y-4" aria-live="polite">
        {state.messages.length === 0 ? (
          <p className="glass px-5 py-4 text-sm text-white/75">No messages yet. Try one of the prompts, or ask what to do next.</p>
        ) : (
          state.messages.map((message) => (
            <article key={message.id} className={`max-w-3xl rounded-2xl px-5 py-4 ${message.role === 'user' ? 'ml-auto bg-white text-[#16141a]' : 'glass text-white'}`}>
              <p className="text-xs font-medium uppercase tracking-[0.14em] opacity-70">
                {message.role === 'user' ? 'You' : message.source === 'ai' ? 'Hosted advisor' : 'On-device advisor'}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
            </article>
          ))
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <button key={suggestion} type="button" className="rounded-full border border-white/15 px-3 py-2 text-left text-sm text-white/80 hover:border-white/30" onClick={() => void send(suggestion)}>
            {suggestion}
          </button>
        ))}
      </div>

      <form
        className="mt-6"
        onSubmit={(event) => {
          event.preventDefault();
          void send(text);
        }}
      >
        <label htmlFor="coach-message" className="text-sm font-medium text-white/85">Message</label>
        <textarea
          id="coach-message"
          className={`${fieldClass} min-h-28`}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              void send(text);
            }
          }}
        />
        <button type="submit" className="cta-primary mt-3 rounded-full px-6 py-3 text-sm font-semibold text-white disabled:opacity-50" disabled={busy || !text.trim()}>
          {busy ? 'Thinking…' : 'Send'}
        </button>
      </form>
    </FounderFrame>
  );
};

export default CoachPage;
