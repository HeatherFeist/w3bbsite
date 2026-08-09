import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Mail } from 'lucide-react';
import { CONTACT, SITE } from '@/data/site';
import { useLeadCapture } from '@/hooks/useLeadCapture';
import HoneypotField from '@/components/HoneypotField';
import ConsentCheckbox from '@/components/ConsentCheckbox';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';

const fieldClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-base text-white placeholder:text-white/35 transition-colors duration-300 hover:border-white/20 focus:border-violet focus:bg-white/[0.06] focus:outline-none';

const labelClass = 'block font-display text-sm font-medium text-white/75';

export const Contact: React.FC = () => {
  const { status, error, submit, reset } = useLeadCapture();
  const [honeypot, setHoneypot] = useState('');
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    organization: '',
    interest: CONTACT.interests[0],
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
      organization: form.organization,
      interest: form.interest,
      message: form.message,
      source: 'w3bb-contact-section',
      honeypot,
    });
  };

  return (
    <section id="contact" className="relative scroll-mt-24 py-24 sm:py-32 lg:py-36">
      <div className="container">
        <SectionHeading
          label={CONTACT.label}
          heading={CONTACT.heading}
          intro={CONTACT.paragraph}
        />

        <Reveal className="mx-auto mt-14 max-w-3xl">
          <div className="glass relative overflow-hidden p-6 sm:p-10">
            <span
              className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet/20 blur-3xl"
              aria-hidden="true"
            />

            {status === 'success' ? (
              <div className="relative flex flex-col items-center py-12 text-center">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-violet/30 to-cyan/20 ring-1 ring-inset ring-white/15">
                  <CheckCircle2 className="h-9 w-9 text-cyan" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h3 className="mt-7 font-display text-3xl font-semibold text-white">
                  {CONTACT.successTitle}
                </h3>
                <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">
                  {CONTACT.successBody}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForm({
                      name: '',
                      email: '',
                      organization: '',
                      interest: CONTACT.interests[0],
                      message: '',
                    });
                    setConsent(false);
                    reset();
                  }}
                  className="glass-soft mt-8 rounded-full px-6 py-3 font-display text-sm font-semibold text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative space-y-5" noValidate={false}>
                <HoneypotField value={honeypot} onChange={setHoneypot} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className={labelClass}>
                      Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      value={form.name}
                      onChange={update('name')}
                      placeholder="Your full name"
                      className={`${fieldClass} mt-2`}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className={labelClass}>
                      Email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
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

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-org" className={labelClass}>
                      Organization <span className="text-white/40">(optional)</span>
                    </label>
                    <input
                      id="contact-org"
                      name="organization"
                      type="text"
                      autoComplete="organization"
                      value={form.organization}
                      onChange={update('organization')}
                      placeholder="Company, school or nonprofit"
                      className={`${fieldClass} mt-2`}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-interest" className={labelClass}>
                      I&apos;m interested in…
                    </label>
                    <select
                      id="contact-interest"
                      name="interest"
                      value={form.interest}
                      onChange={update('interest')}
                      className={`${fieldClass} mt-2 appearance-none bg-[right_1rem_center] bg-no-repeat pr-10`}
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23ffffff88' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                      }}
                    >
                      {CONTACT.interests.map((option) => (
                        <option key={option} value={option} className="bg-[#0B0D14] text-white">
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className={labelClass}>
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={update('message')}
                    placeholder="Tell us what you want to build."
                    className={`${fieldClass} mt-2 resize-y`}
                  />
                </div>

                {status === 'error' ? (
                  <p role="alert" className="text-sm text-red-300">
                    {error}
                  </p>
                ) : null}

                <ConsentCheckbox id="contact-consent" checked={consent} onChange={setConsent} />

                <div className="flex flex-col items-center justify-between gap-4 pt-1 sm:flex-row">
                  <p className="flex items-center gap-2 text-sm text-white/50">
                    <Mail className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                    {SITE.email}
                  </p>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="cta-primary group inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 font-display text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Enquiry
                        <ArrowRight
                          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;
