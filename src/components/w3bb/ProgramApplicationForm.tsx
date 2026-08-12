import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Tag } from 'lucide-react';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';
import HoneypotField from '@/components/HoneypotField';
import ConsentCheckbox from '@/components/ConsentCheckbox';
import { useLeadCapture } from '@/hooks/useLeadCapture';

export interface ProgramFormField {
  id: string;
  label: string;
  type?: 'text' | 'select';
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

interface ProgramApplicationFormProps {
  /** Anchor id — Program CTA buttons link here via `#id`. */
  id: string;
  label?: string;
  heading: string;
  intro: string;
  /** Value stored as the lead's `interest` in the CRM. */
  interest: string;
  /** Value stored as the lead's `source` in the CRM. */
  source: string;
  fields?: ProgramFormField[];
  messageLabel?: string;
  messagePlaceholder?: string;
  submitLabel: string;
  successHeading: string;
  /** Use `{email}` as a placeholder for the submitted address. */
  successBody: string;
  accent?: 'cyan' | 'gold';
}

const fieldClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-base text-white placeholder:text-white/35 transition-colors duration-300 hover:border-white/20 focus:border-violet focus:bg-white/[0.06] focus:outline-none';

const selectClass = `${fieldClass} appearance-none bg-[right_1rem_center] bg-no-repeat pr-10`;
const selectStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23ffffff88' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
};

const labelClass = 'block font-display text-sm font-medium text-white/75';

export const ProgramApplicationForm: React.FC<ProgramApplicationFormProps> = ({
  id,
  label = 'APPLY NOW',
  heading,
  intro,
  interest,
  source,
  fields = [],
  messageLabel = 'Tell us more',
  messagePlaceholder,
  submitLabel,
  successHeading,
  successBody,
  accent = 'cyan',
}) => {
  const { status, error, submit, reset } = useLeadCapture();
  const [honeypot, setHoneypot] = useState('');
  const [consent, setConsent] = useState(false);
  const initialExtras = Object.fromEntries(fields.map((f) => [f.id, f.options?.[0] ?? '']));
  const [form, setForm] = useState<Record<string, string>>({ name: '', email: '', message: '', ...initialExtras });

  const update = (key: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const resetForm = () => {
    setForm({ name: '', email: '', message: '', ...initialExtras });
    setConsent(false);
    reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    const extraLines = fields.map((f) => `${f.label}: ${form[f.id] || 'n/a'}`).join('\n');
    await submit({
      name: form.name,
      email: form.email,
      interest,
      source,
      message: `${extraLines}${extraLines ? '\n\n' : ''}${form.message.trim()}`,
      metadata: Object.fromEntries(fields.map((f) => [f.id, form[f.id]])),
      honeypot,
    });
  };

  return (
    <section id={id} className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container">
        <SectionHeading label={label} heading={heading} intro={intro} />
        <Reveal className="mx-auto mt-12 max-w-2xl">
          <div className="glass relative overflow-hidden p-6 sm:p-10">
            <span
              className={`pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl ${
                accent === 'gold' ? 'bg-gold/15' : 'bg-cyan/15'
              }`}
              aria-hidden="true"
            />
            {status === 'success' ? (
              <div className="relative flex flex-col items-center py-10 text-center">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-violet/30 to-cyan/20 ring-1 ring-inset ring-white/15">
                  <CheckCircle2 className="h-9 w-9 text-cyan" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h3 className="mt-7 font-display text-2xl font-semibold text-white sm:text-3xl">{successHeading}</h3>
                <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">
                  {successBody.replace('{email}', form.email)}
                </p>
                <button
                  type="button"
                  onClick={resetForm}
                  className="glass-soft mt-8 rounded-full px-6 py-3 font-display text-sm font-semibold text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  Submit another application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative space-y-5">
                <HoneypotField value={honeypot} onChange={setHoneypot} />

                <div
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-display text-xs font-semibold uppercase tracking-wide ${
                    accent === 'gold'
                      ? 'bg-gold/10 text-gold ring-1 ring-inset ring-gold/30'
                      : 'bg-cyan/10 text-cyan ring-1 ring-inset ring-cyan/30'
                  }`}
                >
                  <Tag className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  Applying for: {interest}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`${id}-name`} className={labelClass}>
                      Your name
                    </label>
                    <input
                      id={`${id}-name`}
                      required
                      autoComplete="name"
                      value={form.name}
                      onChange={update('name')}
                      placeholder="Your full name"
                      className={`${fieldClass} mt-2`}
                    />
                  </div>
                  <div>
                    <label htmlFor={`${id}-email`} className={labelClass}>
                      Email
                    </label>
                    <input
                      id={`${id}-email`}
                      type="email"
                      required
                      autoComplete="email"
                      value={form.email}
                      onChange={update('email')}
                      placeholder="you@example.com"
                      className={`${fieldClass} mt-2`}
                    />
                  </div>
                </div>

                {fields.map((f) => (
                  <div key={f.id}>
                    <label htmlFor={`${id}-${f.id}`} className={labelClass}>
                      {f.label}
                    </label>
                    {f.type === 'select' ? (
                      <select
                        id={`${id}-${f.id}`}
                        value={form[f.id]}
                        onChange={update(f.id)}
                        className={`${selectClass} mt-2`}
                        style={selectStyle}
                      >
                        {f.options?.map((option) => (
                          <option key={option} value={option} className="bg-[#0B0D14] text-white">
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={`${id}-${f.id}`}
                        required={f.required}
                        value={form[f.id]}
                        onChange={update(f.id)}
                        placeholder={f.placeholder}
                        className={`${fieldClass} mt-2`}
                      />
                    )}
                  </div>
                ))}

                <div>
                  <label htmlFor={`${id}-message`} className={labelClass}>
                    {messageLabel}
                  </label>
                  <textarea
                    id={`${id}-message`}
                    rows={4}
                    value={form.message}
                    onChange={update('message')}
                    placeholder={messagePlaceholder}
                    className={`${fieldClass} mt-2 resize-y`}
                  />
                </div>

                <ConsentCheckbox id={`${id}-consent`} checked={consent} onChange={setConsent} />

                {status === 'error' ? (
                  <p role="alert" className="text-sm text-red-300">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="cta-primary group inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 font-display text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      {submitLabel}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default ProgramApplicationForm;
