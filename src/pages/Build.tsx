import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import PageShell from '@/components/PageShell';
import HoneypotField from '@/components/HoneypotField';
import ConsentCheckbox from '@/components/ConsentCheckbox';
import Icon from '@/components/w3bb/Icon';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';
import { BUILDER, BUILD } from '@/data/site';
import { useLeadCapture } from '@/hooks/useLeadCapture';
import { usePageMeta } from '@/hooks/usePageMeta';

const INDUSTRIES = [
  'Retail & E-commerce',
  'Food & Beverage',
  'Professional Services',
  'Creative & Media',
  'Education & Coaching',
  'Technology & SaaS',
  'Nonprofit & Community',
  'Other',
];

const fieldClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-base text-white placeholder:text-white/35 transition-colors duration-300 hover:border-white/20 focus:border-violet focus:bg-white/[0.06] focus:outline-none';

const labelClass = 'block font-display text-sm font-medium text-white/75';

const Build: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const activeItem = BUILD.items.find((item) => item.slug === category);

  const heading = activeItem ? `Start Building Your ${activeItem.title}` : 'Start Building Your Business';
  const intro = activeItem ? activeItem.description : BUILDER.intro;
  const metaTitle = activeItem ? `Start Building: ${activeItem.title}` : 'Start Building Your Business';
  const metaDescription = activeItem
    ? `${activeItem.description} Tell us what you want to build and our team sets up your workspace.`
    : 'Kick off the W3BB Business Builder — name your brand, describe what you want to build, and our team sets up your workspace.';

  usePageMeta(metaTitle, metaDescription);
  const { status, error, submit, reset } = useLeadCapture();
  const [honeypot, setHoneypot] = useState('');
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState({
    businessName: '',
    industry: INDUSTRIES[0],
    description: '',
    name: '',
    email: '',
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
      organization: form.businessName,
      interest: activeItem ? activeItem.title : 'Building a business',
      source: 'w3bb-build-page',
      message: `Industry: ${form.industry}\n\n${form.description.trim()}`,
      metadata: { businessName: form.businessName, industry: form.industry, category: activeItem?.slug ?? null },
      honeypot,
    });
  };

  return (
    <PageShell>
      <section className="relative scroll-mt-24 py-28 pt-36 sm:py-32 sm:pt-40">
        <div className="container">
          {activeItem ? (
            <Reveal className="mx-auto mb-6 flex max-w-4xl justify-center">
              <span className="glass-soft inline-flex items-center gap-2.5 rounded-full px-4 py-2">
                <Icon name={activeItem.icon} className="h-4 w-4 text-cyan" />
                <span className="micro-label text-white/75">{activeItem.title}</span>
              </span>
            </Reveal>
          ) : null}

          <SectionHeading label={BUILDER.label} heading={heading} intro={intro} />

          <ol className="relative mx-auto mt-16 max-w-4xl">
            <span
              className="absolute left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-violet via-cyan to-gold opacity-60 sm:left-[35px]"
              aria-hidden="true"
            />
            {BUILDER.steps.map((step, i) => (
              <Reveal as="li" key={step.n} delay={i * 60} className="relative block">
                <div className="flex items-center gap-5 py-2.5 sm:gap-8">
                  <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-[#0B0D14] font-display text-sm font-semibold text-white/70 sm:h-14 sm:w-14 sm:text-base">
                    {step.n}
                  </span>
                  <div className="glass flex-1 px-5 py-4">
                    <h3 className="font-display text-base font-semibold text-white sm:text-lg">
                      {step.title}
                    </h3>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={120}>
            <p className="mx-auto mt-14 max-w-3xl text-center text-base leading-relaxed text-white/70 sm:text-lg">
              {BUILD.callout}
            </p>
          </Reveal>

          <Reveal delay={160} className="mx-auto mt-14 max-w-2xl">
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
                    You're queued to start building.
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">
                    Our team is setting up your Business Builder workspace and will follow up at{' '}
                    {form.email}. Once your business is certified, you can mint it as a Business
                    NFT and list it on the Marketplace.
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link
                      to="/mint"
                      className="cta-primary group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display text-sm font-semibold text-white"
                    >
                      Preview the Marketplace
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setForm({ businessName: '', industry: INDUSTRIES[0], description: '', name: '', email: '' });
                        setConsent(false);
                        reset();
                      }}
                      className="glass-soft rounded-full px-6 py-3 font-display text-sm font-semibold text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white"
                    >
                      Start another business
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="relative space-y-5">
                  <HoneypotField value={honeypot} onChange={setHoneypot} />
                  <div>
                    <label htmlFor="build-name" className={labelClass}>
                      Business or brand idea
                    </label>
                    <input
                      id="build-name"
                      required
                      value={form.businessName}
                      onChange={update('businessName')}
                      placeholder="e.g. Northside Coffee Collective"
                      className={`${fieldClass} mt-2`}
                    />
                  </div>

                  <div>
                    <label htmlFor="build-industry" className={labelClass}>
                      Industry
                    </label>
                    <select
                      id="build-industry"
                      value={form.industry}
                      onChange={update('industry')}
                      className={`${fieldClass} mt-2 appearance-none bg-[right_1rem_center] bg-no-repeat pr-10`}
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23ffffff88' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                      }}
                    >
                      {INDUSTRIES.map((option) => (
                        <option key={option} value={option} className="bg-[#0B0D14] text-white">
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="build-description" className={labelClass}>
                      What are you building?
                    </label>
                    <textarea
                      id="build-description"
                      rows={4}
                      value={form.description}
                      onChange={update('description')}
                      placeholder="A quick summary of the business you want to create."
                      className={`${fieldClass} mt-2 resize-y`}
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="build-your-name" className={labelClass}>
                        Your name
                      </label>
                      <input
                        id="build-your-name"
                        required
                        autoComplete="name"
                        value={form.name}
                        onChange={update('name')}
                        placeholder="Your full name"
                        className={`${fieldClass} mt-2`}
                      />
                    </div>
                    <div>
                      <label htmlFor="build-email" className={labelClass}>
                        Email
                      </label>
                      <input
                        id="build-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={form.email}
                        onChange={update('email')}
                        placeholder="you@company.com"
                        className={`${fieldClass} mt-2`}
                      />
                    </div>
                  </div>

                  <ConsentCheckbox id="build-consent" checked={consent} onChange={setConsent} />

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
                        Start Building
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

export default Build;
