import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { STEPS, labelFor } from '../catalog';
import { FounderFrame } from '../components';
import { useFounder } from '../useFounder';
import type { Answers } from '../types';

function isAnswered(key: keyof Answers, answers: Answers, type: 'single' | 'multi'): boolean {
  const value = answers[key];
  if (type === 'multi') return Array.isArray(value) && value.length > 0;
  return typeof value === 'string' && value.length > 0;
}

const AssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, setStep, updateAnswers, completeAssessment } = useFounder();
  const stepIndex = Math.min(state.assessment.step, STEPS.length);
  const review = stepIndex >= STEPS.length;
  const step = STEPS[Math.min(stepIndex, STEPS.length - 1)];
  const total = STEPS.length + 1;
  const current = stepIndex + 1;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  const saved = state.assessment.updatedAt && state.assessment.step > 0;

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [stepIndex]);

  const toggleMulti = (id: string) => {
    const currentValues = state.assessment.answers[step.key];
    const list = Array.isArray(currentValues) ? currentValues : [];
    const next = list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
    updateAnswers({ [step.key]: next });
  };

  const finish = () => {
    completeAssessment();
    navigate('/launch/with-ai');
  };

  return (
    <FounderFrame
      title="Founder Discovery Assessment"
      description="A saved, multi-step founder assessment covering skills, capital, time, and how you work."
    >
      <p className="micro-label text-cyan">Founder discovery</p>
      <h1 ref={headingRef} tabIndex={-1} className="mt-3 font-display text-3xl font-semibold text-white sm:text-5xl">
        {review ? 'Review your answers' : step.title}
      </h1>
      <p className="mt-3 max-w-2xl text-base text-white/75">
        {review
          ? 'You can go back and change anything. Scores are calculated on this device from the weights shown on the results page.'
          : step.prompt}
      </p>
      {saved && state.assessment.status !== 'complete' ? (
        <p className="mt-3 text-sm text-white/75" role="status">Welcome back. Your place in the assessment is saved in this browser.</p>
      ) : null}

      <div className="mt-8" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={current} aria-label="Assessment progress">
        <div className="flex items-baseline justify-between text-sm text-white/75">
          <span>Step {current} of {total}</span>
          <span>{Math.round((current / total) * 100)}%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-violet via-cyan to-gold" style={{ width: `${(current / total) * 100}%` }} />
        </div>
      </div>

      {review ? (
        <dl className="mt-8 space-y-4">
          {STEPS.map((item) => {
            const value = state.assessment.answers[item.key];
            const text = Array.isArray(value)
              ? value.map((id) => labelFor(item.key, id)).join(', ')
              : typeof value === 'string'
                ? labelFor(item.key, value)
                : 'Not answered';
            return (
              <div key={item.key} className="glass px-5 py-4">
                <dt className="text-sm text-white/70">{item.title}</dt>
                <dd className="mt-1 text-base text-white">{text}</dd>
              </div>
            );
          })}
        </dl>
      ) : (
        <fieldset className="mt-8">
          <legend className="text-base font-medium text-white">{step.prompt}</legend>
          <p id={`${step.key}-help`} className="mt-2 max-w-2xl text-sm text-white/75">{step.help}</p>
          <div className="mt-5 grid gap-3">
            {step.options.map((option) => {
              const selected = step.type === 'multi'
                ? (state.assessment.answers[step.key] as string[] | undefined)?.includes(option.id)
                : state.assessment.answers[step.key] === option.id;
              return (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                    selected ? 'border-cyan/60 bg-cyan/10' : 'border-white/10 bg-white/[0.03] hover:border-white/25'
                  }`}
                >
                  <input
                    className="mt-1 h-4 w-4 accent-cyan"
                    type={step.type === 'multi' ? 'checkbox' : 'radio'}
                    name={step.key}
                    value={option.id}
                    checked={Boolean(selected)}
                    aria-describedby={`${step.key}-help`}
                    onChange={() => {
                      if (step.type === 'multi') toggleMulti(option.id);
                      else updateAnswers({ [step.key]: option.id });
                    }}
                  />
                  <span className="text-sm text-white/90 sm:text-base">{option.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className="sticky bottom-4 z-20 mt-8 flex flex-col-reverse gap-3 rounded-2xl border border-white/10 bg-[#16141a]/90 p-3 backdrop-blur sm:flex-row sm:justify-between">
        <button
          type="button"
          className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/85 hover:border-white/30"
          onClick={() => {
            if (stepIndex === 0) navigate('/launch');
            else setStep(stepIndex - 1);
          }}
        >
          Back
        </button>
        {review ? (
          <button type="button" className="cta-primary rounded-full px-6 py-3 text-sm font-semibold text-white" onClick={finish}>
            {state.assessment.status === 'complete' ? 'Update Launch With AI' : 'Launch With AI'}
          </button>
        ) : (
          <button
            type="button"
            className="cta-primary rounded-full px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!isAnswered(step.key, state.assessment.answers, step.type)}
            onClick={() => setStep(stepIndex + 1)}
          >
            Continue
          </button>
        )}
      </div>
    </FounderFrame>
  );
};

export default AssessmentPage;
