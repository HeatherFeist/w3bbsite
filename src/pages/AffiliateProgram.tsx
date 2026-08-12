import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Share2 } from 'lucide-react';
import PageShell from '@/components/PageShell';
import ProgramHero from '@/components/w3bb/ProgramHero';
import ProgramClosing from '@/components/w3bb/ProgramClosing';
import IconCardGrid from '@/components/w3bb/IconCardGrid';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';
import HoneypotField from '@/components/HoneypotField';
import ConsentCheckbox from '@/components/ConsentCheckbox';
import { AFFILIATE } from '@/data/partnerships';
import { useLeadCapture } from '@/hooks/useLeadCapture';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useHashScroll } from '@/hooks/useHashScroll';

const fieldClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-base text-white placeholder:text-white/35 transition-colors duration-300 hover:border-white/20 focus:border-violet focus:bg-white/[0.06] focus:outline-none';

const labelClass = 'block font-display text-sm font-medium text-white/75';

const CHANNEL_OPTIONS = [
  'Content creator',
  'Coach or consultant',
  'Influencer',
  'Community leader',
  'Newsletter or blog',
  'Other',
];

const AffiliateProgram: React.FC = () => {
  usePageMeta(
    'Affiliate Partnership Program',
    'Apply to become a W3BB Worldwide affiliate and earn recurring commissions for every entrepreneur you refer.',
  );
  useHashScroll();

  const { status, error, submit, reset } = useLeadCapture();
  const [honeypot, setHoneypot] = useState('');
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    channel: CHANNEL_OPTIONS[0],
    link: '',
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
      interest: 'Affiliate Partnership Program',
      source: 'w3bb-affiliate-page',
      message: `Primary channel: ${form.channel}\nAudience link: ${form.link.trim() || 'n/a'}\n\n${form.message.trim()}`,
      metadata: { channel: form.channel, link: form.link.trim() },
      honeypot,
    });
  };

  return (
    <PageShell>
      <ProgramHero
        icon={Share2}
        eyebrow={AFFILIATE.eyebrow}
        heading={<>Affiliate <span className="gradient-text">Partnership Program</span></>}
        sub={AFFILIATE.sub}
        body={AFFILIATE.body}
        ctaLabel={AFFILIATE.ctaLabel}
        ctaHref="#affiliate-form"
      />

      <IconCardGrid heading="What You Get" items={AFFILIATE.whatYouGet} tinted />
      <IconCardGrid heading="Who This Is For" items={AFFILIATE.whoFor} />

      <section id="affiliate-form" className="relative scroll-mt-24 py-24 sm:py-32">
        <div className="container">
          <SectionHeading
            label="APPLY NOW"
            heading="Become an Affiliate"
            intro="Tell us about your audience and how you'd like to share W3BB Worldwide. Our team reviews every application and follows up with your affiliate dashboard access."
          />
          <Reveal className="mx-auto mt-12 max-w-2xl">
            <div className="glass relative overflow-hidden p-6 sm:p-10">
              <span
                className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan/15 blur-3xl"
                aria-hidden="true"
              />
              {status === 'success' ? (
                <div className="relative flex flex-col items-center py-10 text-center">
                  <span className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-violet/30 to-cyan/20 ring-1 ring-inset ring-white/15">
                    <CheckCircle2 className="h-9 w-9 text-cyan" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <h3 className="mt-7 font-display text-2xl font-semibold text-white sm:text-3xl">
                    Application received.
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">
                    Our team will review your application and follow up at {form.email} with your affiliate
                    dashboard access.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setForm({ name: '', email: '', channel: CHANNEL_OPTIONS[0], link: '', message: '' });
                      setConsent(false);
                      reset();
                    }}
                    className="glass-soft mt-8 rounded-full px-6 py-3 font-display text-sm font-semibold text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white"
                  >
                    Submit another application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="relative space-y-5">
                  <HoneypotField value={honeypot} onChange={setHoneypot} />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="aff-name" className={labelClass}>
                        Your name
                      </label>
                      <input
                        id="aff-name"
                        required
                        autoComplete="name"
                        value={form.name}
                        onChange={update('name')}
                        placeholder="Your full name"
                        className={`${fieldClass} mt-2`}
                      />
                    </div>
                    <div>
                      <label htmlFor="aff-email" className={labelClass}>
                        Email
                      </label>
                      <input
                        id="aff-email"
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

                  <div>
                    <label htmlFor="aff-channel" className={labelClass}>
                      How do you primarily reach your audience?
                    </label>
                    <select
                      id="aff-channel"
                      value={form.channel}
                      onChange={update('channel')}
                      className={`${fieldClass} mt-2 appearance-none bg-[right_1rem_center] bg-no-repeat pr-10`}
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23ffffff88' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                      }}
                    >
                      {CHANNEL_OPTIONS.map((option) => (
                        <option key={option} value={option} className="bg-[#0B0D14] text-white">
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="aff-link" className={labelClass}>
                      Website or social profile
                    </label>
                    <input
                      id="aff-link"
                      value={form.link}
                      onChange={update('link')}
                      placeholder="https://…"
                      className={`${fieldClass} mt-2`}
                    />
                  </div>

                  <div>
                    <label htmlFor="aff-message" className={labelClass}>
                      Tell us about your audience
                    </label>
                    <textarea
                      id="aff-message"
                      rows={4}
                      value={form.message}
                      onChange={update('message')}
                      placeholder="Who follows you, and how do you plan to share W3BB Worldwide?"
                      className={`${fieldClass} mt-2 resize-y`}
                    />
                  </div>

                  <ConsentCheckbox id="aff-consent" checked={consent} onChange={setConsent} />

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
        </div>
      </section>

      <ProgramClosing
        heading={AFFILIATE.closingHeading}
        body={AFFILIATE.closingBody}
        ctaLabel={AFFILIATE.ctaLabel}
        ctaHref="#affiliate-form"
      />
    </PageShell>
  );
};

export default AffiliateProgram;
