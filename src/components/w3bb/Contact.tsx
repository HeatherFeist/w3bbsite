import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Mail } from 'lucide-react';
import { db } from '@/lib/db';
import { CONTACT, SITE } from '@/data/site';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';

type Status = 'idle' | 'loading' | 'success' | 'error';

const fieldClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-base text-white placeholder:text-white/35 transition-colors duration-300 hover:border-white/20 focus:border-violet focus:bg-white/[0.06] focus:outline-none';

const labelClass = 'block font-display text-sm font-medium text-white/75';

export const Contact: React.FC = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string>('');
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
    setStatus('loading');
    setError('');

    try {
      // 1. Capture the lead in the CRM so the owner can segment and follow up.
      const { error: crmError } = await db.rpc('crm_submit_contact', {
        p_email: form.email.trim(),
        p_name: form.name.trim(),
        p_phone: null,
        p_sms_opt_in: false,
        p_source: 'w3bb-contact-section',
        p_metadata: {
          organization: form.organization.trim(),
          interest: form.interest,
          message: form.message.trim(),
        },
      });
      if (crmError) throw crmError;

      // 2. Keep a full copy of the enquiry with its message body.
      await db.from('w3bb_enquiries').insert({
        name: form.name.trim(),
        email: form.email.trim(),
        organization: form.organization.trim() || null,
        interest: form.interest,
        message: form.message.trim() || null,
      });

      try {
        window.supercool?.track?.('form_submit', {
          form: 'contact',
          interest: form.interest,
        });
      } catch {
        /* no-op */
      }

      setStatus('success');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      setStatus('error');
    }
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
                    setStatus('idle');
                  }}
                  className="glass-soft mt-8 rounded-full px-6 py-3 font-display text-sm font-semibold text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative space-y-5" noValidate={false}>
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
