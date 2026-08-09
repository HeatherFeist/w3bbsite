import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import PageShell from '@/components/PageShell';
import HoneypotField from '@/components/HoneypotField';
import ConsentCheckbox from '@/components/ConsentCheckbox';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';
import Icon from '@/components/w3bb/Icon';
import { ENTERPRISE } from '@/data/site';
import { useLeadCapture } from '@/hooks/useLeadCapture';
import { usePageMeta } from '@/hooks/usePageMeta';

const fieldClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-base text-white placeholder:text-white/35 transition-colors duration-300 hover:border-white/20 focus:border-violet focus:bg-white/[0.06] focus:outline-none';

const labelClass = 'block font-display text-sm font-medium text-white/75';

const ORG_TYPES = ENTERPRISE.audiences.map((a) => a.label);

const EnterprisePage: React.FC = () => {
  usePageMeta(
    'Enterprise Tools for Organizations',
    'Bring W3BB Worldwide to your school, nonprofit, or community program.',
  );
  const { status, error, submit, reset } = useLeadCapture();
  const [honeypot, setHoneypot] = useState('');
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState({
    orgName: '',
    orgType: ORG_TYPES[0],
    name: '',
    email: '',
    message: '',
  });

  const update = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    await submit({
      name: form.name,
      email: form.email,
      organization: form.orgName,
      interest: 'Enterprise & Organizations',
      source: 'w3bb-enterprise-page',
      message: `Organization type: ${form.orgType}\n\n${form.message.trim()}`,
      metadata: { orgName: form.orgName, orgType: form.orgType },
      honeypot,
    });
  };

  return (
    <PageShell>
      <section className="relative scroll-mt-24 py-28 pt-36 sm:py-32 sm:pt-40">
        <div className="container">
          <SectionHeading
            label={ENTERPRISE.label}
            heading="Bring W3BB to Your Organization"
            intro={ENTERPRISE.intro}
          />

          <ul className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2.5 sm:gap-3">
            {ENTERPRISE.audiences.map((a) => (
              <li key={a.label}>
                <span className="glass-soft flex items-center gap-2 rounded-full px-4 py-2.5 sm:px-5">
                  <Icon name={a.icon} className="h-4 w-4 text-violet-soft" />
                  <span className="text-sm font-medium text-white/85">{a.label}</span>
                </span>
              </li>
            ))}
          </ul>

          <ul className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {ENTERPRISE.provide.map((item) => (
              <li key={item.title}>
                <article className="glass flex h-full flex-col items-center gap-3 px-4 py-6 text-center">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet/25 to-cyan/15 ring-1 ring-inset ring-white/10">
                    <Icon name={item.icon} className="h-5 w-5 text-white" />
                  </span>
                  <h4 className="font-display text-sm font-semibold leading-snug text-white">
                    {item.title}
                  </h4>
                </article>
              </li>
            ))}
          </ul>

          <Reveal className="mx-auto mt-14 max-w-2xl">
            <div className="glass relative overflow-hidden p-6 sm:p-10">
              <span
                className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet/20 blur-3xl"
                aria-hidden="true"
              />

              {status === 'success' ? (
                <div className="relative flex flex-col items-center py-10 text-center">
                  <span className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-violet/30 to-cyan/20 ring-1 ring-inset ring-white/15">
                    <CheckCircle2 className="h-9 w-9 text-cyan" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <h3 className="mt-7 font-display text-2xl font-semibold text-white sm:text-3xl">
                    Thanks — we'll be in touch.
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">
                    Our team will reach out to {form.name} at {form.email} about bringing W3BB
                    Worldwide to {form.orgName || 'your organization'}.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setForm({ orgName: '', orgType: ORG_TYPES[0], name: '', email: '', message: '' });
                      setConsent(false);
                      reset();
                    }}
                    className="glass-soft mt-8 rounded-full px-6 py-3 font-display text-sm font-semibold text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="relative space-y-5">
                  <HoneypotField value={honeypot} onChange={setHoneypot} />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="ent-org" className={labelClass}>
                        Organization name
                      </label>
                      <input
                        id="ent-org"
                        required
                        value={form.orgName}
                        onChange={update('orgName')}
                        placeholder="School, nonprofit, or trust name"
                        className={`${fieldClass} mt-2`}
                      />
                    </div>
                    <div>
                      <label htmlFor="ent-type" className={labelClass}>
                        Organization type
                      </label>
                      <select
                        id="ent-type"
                        value={form.orgType}
                        onChange={update('orgType')}
                        className={`${fieldClass} mt-2 appearance-none bg-[right_1rem_center] bg-no-repeat pr-10`}
                        style={{
                          backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23ffffff88' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                        }}
                      >
                        {ORG_TYPES.map((option) => (
                          <option key={option} value={option} className="bg-[#0B0D14] text-white">
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="ent-name" className={labelClass}>
                        Your name
                      </label>
                      <input
                        id="ent-name"
                        required
                        autoComplete="name"
                        value={form.name}
                        onChange={update('name')}
                        placeholder="Your full name"
                        className={`${fieldClass} mt-2`}
                      />
                    </div>
                    <div>
                      <label htmlFor="ent-email" className={labelClass}>
                        Email
                      </label>
                      <input
                        id="ent-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={form.email}
                        onChange={update('email')}
                        placeholder="you@organization.org"
                        className={`${fieldClass} mt-2`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="ent-message" className={labelClass}>
                      What are you hoping to build?
                    </label>
                    <textarea
                      id="ent-message"
                      rows={4}
                      value={form.message}
                      onChange={update('message')}
                      placeholder="Program size, goals, timeline — whatever's useful."
                      className={`${fieldClass} mt-2 resize-y`}
                    />
                  </div>

                  <ConsentCheckbox id="ent-consent" checked={consent} onChange={setConsent} />

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
                        {ENTERPRISE.cta}
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
    </PageShell>
  );
};

export default EnterprisePage;
