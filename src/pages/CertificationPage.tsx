import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, CheckCircle2, Loader2 } from 'lucide-react';
import PageShell from '@/components/PageShell';
import HoneypotField from '@/components/HoneypotField';
import ConsentCheckbox from '@/components/ConsentCheckbox';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';
import TrustBadge from '@/components/w3bb/TrustBadge';
import { CERTIFICATION } from '@/data/site';
import { useLeadCapture } from '@/hooks/useLeadCapture';
import { usePageMeta } from '@/hooks/usePageMeta';

const fieldClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-base text-white placeholder:text-white/35 transition-colors duration-300 hover:border-white/20 focus:border-violet focus:bg-white/[0.06] focus:outline-none';

const labelClass = 'block font-display text-sm font-medium text-white/75';

const CertificationPage: React.FC = () => {
  usePageMeta(
    'Apply for Trust Certification',
    'Apply for the W3BB Trust-Approved badge, backed by the Webb Family Dynasty Trust.',
  );
  const { status, error, submit, reset } = useLeadCapture();
  const [honeypot, setHoneypot] = useState('');
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState({
    businessName: '',
    website: '',
    description: '',
    name: '',
    email: '',
  });

  const update = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    await submit({
      name: form.name,
      email: form.email,
      organization: form.businessName,
      interest: 'Trust Certification',
      source: 'w3bb-certification-page',
      message: `Website/link: ${form.website || 'n/a'}\n\n${form.description.trim()}`,
      metadata: { businessName: form.businessName, website: form.website },
      honeypot,
    });
  };

  return (
    <PageShell>
      <section className="relative scroll-mt-24 py-28 pt-36 sm:py-32 sm:pt-40">
        <div className="container">
          <SectionHeading
            label={CERTIFICATION.label}
            heading="Apply for Trust Certification"
            intro={CERTIFICATION.paragraph}
          />

          <div className="mt-16 grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
            <Reveal className="order-2 lg:order-1">
              <h3 className="font-display text-lg font-medium text-white/60">
                {CERTIFICATION.signalsTitle}
              </h3>
              <ul className="mt-5 space-y-3">
                {CERTIFICATION.signals.map((signal) => (
                  <li key={signal}>
                    <span className="flex items-center gap-3.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3.5">
                      <BadgeCheck className="h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
                      <span className="font-display text-base font-medium text-white/90">{signal}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="glass relative mt-10 overflow-hidden p-6 sm:p-9">
                <span
                  className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gold/15 blur-3xl"
                  aria-hidden="true"
                />

                {status === 'success' ? (
                  <div className="relative flex flex-col items-center py-8 text-center">
                    <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-gold/30 to-violet/20 ring-1 ring-inset ring-white/15">
                      <CheckCircle2 className="h-8 w-8 text-gold" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <h3 className="mt-6 font-display text-2xl font-semibold text-white">
                      Application received.
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
                      {CERTIFICATION.closing} We'll review {form.businessName || 'your business'} and
                      follow up at {form.email}.
                    </p>
                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                      <Link
                        to="/build"
                        className="cta-primary group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display text-sm font-semibold text-white"
                      >
                        Continue Building
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setForm({ businessName: '', website: '', description: '', name: '', email: '' });
                          setConsent(false);
                          reset();
                        }}
                        className="glass-soft rounded-full px-6 py-3 font-display text-sm font-semibold text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white"
                      >
                        Apply for another business
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="relative space-y-5">
                    <HoneypotField value={honeypot} onChange={setHoneypot} />
                    <div>
                      <label htmlFor="cert-business" className={labelClass}>
                        Business name
                      </label>
                      <input
                        id="cert-business"
                        required
                        value={form.businessName}
                        onChange={update('businessName')}
                        placeholder="Your business name"
                        className={`${fieldClass} mt-2`}
                      />
                    </div>
                    <div>
                      <label htmlFor="cert-website" className={labelClass}>
                        Website or brand link <span className="text-white/40">(optional)</span>
                      </label>
                      <input
                        id="cert-website"
                        value={form.website}
                        onChange={update('website')}
                        placeholder="https://…"
                        className={`${fieldClass} mt-2`}
                      />
                    </div>
                    <div>
                      <label htmlFor="cert-description" className={labelClass}>
                        Tell us about the business
                      </label>
                      <textarea
                        id="cert-description"
                        rows={4}
                        value={form.description}
                        onChange={update('description')}
                        placeholder="Structure, products, and why it's ready for certification."
                        className={`${fieldClass} mt-2 resize-y`}
                      />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="cert-name" className={labelClass}>
                          Your name
                        </label>
                        <input
                          id="cert-name"
                          required
                          autoComplete="name"
                          value={form.name}
                          onChange={update('name')}
                          placeholder="Your full name"
                          className={`${fieldClass} mt-2`}
                        />
                      </div>
                      <div>
                        <label htmlFor="cert-email" className={labelClass}>
                          Email
                        </label>
                        <input
                          id="cert-email"
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

                    <ConsentCheckbox id="cert-consent" checked={consent} onChange={setConsent} />

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
                          Submit Application
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </Reveal>

            <Reveal className="order-1 lg:order-2" delay={100}>
              <TrustBadge />
            </Reveal>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default CertificationPage;
