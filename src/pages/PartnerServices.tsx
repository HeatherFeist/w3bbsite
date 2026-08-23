import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Loader2, CheckCircle2 } from 'lucide-react';
import PageShell from '@/components/PageShell';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';
import HoneypotField from '@/components/HoneypotField';
import ConsentCheckbox from '@/components/ConsentCheckbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PARTNER_SERVICES, PROGRAMS, Check } from '@/data/partnerships';
import { useLeadCapture } from '@/hooks/useLeadCapture';
import { usePageMeta } from '@/hooks/usePageMeta';

const fieldClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-base text-white placeholder:text-white/35 transition-colors duration-300 hover:border-white/20 focus:border-violet focus:bg-white/[0.06] focus:outline-none';

const labelClass = 'block font-display text-sm font-medium text-white/75';

const PLAN_OPTIONS = [
  'U.S. Address Only ($49/mo)',
  'U.S. Business Partner ($99/mo)',
  'Full U.S. Presence ($199/mo + 5%)',
  'Not sure yet',
];

const toneRing: Record<'default' | 'featured' | 'gold', string> = {
  default: '',
  featured: 'grad-border p-[1.5px]',
  gold: 'ring-2 ring-gold/40',
};

const PartnerServices: React.FC = () => {
  usePageMeta(
    'U.S. Business Partner Services',
    'A U.S. mailing address, U.S.-based customer support, returns handling, and marketplace compliance guidance for international sellers.',
  );

  const { status, error, submit, reset } = useLeadCapture();
  const [honeypot, setHoneypot] = useState('');
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState({
    businessName: '',
    country: '',
    productType: '',
    plan: PLAN_OPTIONS[1],
    email: '',
    notes: '',
  });

  const update = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    await submit({
      name: form.businessName,
      email: form.email,
      organization: form.businessName,
      interest: 'U.S. Business Partner Services',
      source: 'w3bb-partner-services-page',
      message: `Country: ${form.country}\nProduct type: ${form.productType}\nPreferred plan: ${form.plan}\n\n${form.notes.trim()}`,
      metadata: { businessName: form.businessName, country: form.country, plan: form.plan },
      honeypot,
    });
  };

  return (
    <PageShell>
      <section className="relative scroll-mt-24 py-28 pt-36 sm:py-32 sm:pt-40">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <span className="glass-soft inline-flex items-center gap-2.5 rounded-full px-4 py-2">
                <Globe className="h-4 w-4 text-cyan" strokeWidth={1.5} aria-hidden="true" />
                <span className="micro-label text-white/75">{PARTNER_SERVICES.eyebrow}</span>
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-7 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl">
                Your U.S. Presence, <span className="gradient-text">Powered by W3BB</span>
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
                {PARTNER_SERVICES.body}
              </p>
            </Reveal>
            <Reveal delay={200}>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="#packages"
                  className="cta-primary group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-display text-sm font-semibold text-white"
                >
                  View Packages
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </a>
                <a
                  href="#contact"
                  className="glass-soft inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-display text-sm font-semibold text-white/85 transition-colors hover:text-white"
                >
                  Talk to Us
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-white/[0.02] py-4">
        <p className="mx-auto max-w-4xl px-4 text-center text-xs text-white/50">
          {PARTNER_SERVICES.disclosure}
        </p>
      </section>

      <section id="what-we-do" className="relative scroll-mt-24 py-24 sm:py-32">
        <div className="container">
          <SectionHeading
            label="WHAT WE DO"
            heading="U.S. Back-Office Support for Global Sellers"
            intro="Selling into the U.S. market without a U.S. presence means slow returns, missed support windows, and marketplace policies you can't always navigate alone. We handle the U.S. side so you can focus on your product."
          />
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PARTNER_SERVICES.whatWeDo.map((item, i) => (
              <Reveal as="li" key={item.title} delay={(i % 3) * 80}>
                <article className="glass glass-lift h-full p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/[0.06] ring-1 ring-inset ring-white/10">
                    <item.icon className="h-5 w-5 text-cyan" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-base font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{item.description}</p>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="packages" className="relative scroll-mt-24 py-24 sm:py-32">
        <div className="container">
          <SectionHeading label="PACKAGES" heading="Service Packages" intro="Three tiers built to scale with your business in the U.S. market." />
          <div className="mt-14 grid items-start gap-6 lg:grid-cols-3">
            {PARTNER_SERVICES.packages.map((pkg, i) => (
              <Reveal key={pkg.name} delay={i * 90} className={pkg.tone === 'featured' ? 'grad-border rounded-2xl p-[1.5px]' : ''}>
                <div
                  className={`glass relative h-full p-7 ${pkg.tone === 'gold' ? 'ring-2 ring-gold/40' : ''} ${pkg.tone === 'featured' ? 'rounded-[calc(1.25rem-1.5px)]' : ''}`}
                >
                  {pkg.tone === 'featured' ? (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-cyan px-3 py-1 font-display text-[0.65rem] font-bold uppercase tracking-wide text-[#07080C]">
                      Most Popular
                    </span>
                  ) : null}
                  <h3 className="font-display text-lg font-bold text-white">{pkg.name}</h3>
                  <p className="mt-1 text-sm text-white/55">{pkg.tagline}</p>
                  <div className="mt-5">
                    <span className="font-display text-3xl font-extrabold text-white">{pkg.price}</span>
                    <span className="text-white/50">{pkg.suffix}</span>
                  </div>
                  <ul className="mt-6 space-y-2.5 text-sm">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex gap-2 text-white/75">
                        <Check className={`mt-0.5 h-4 w-4 shrink-0 ${pkg.tone === 'gold' ? 'text-gold' : 'text-cyan'}`} strokeWidth={2.5} aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    onClick={() => setForm((prev) => ({ ...prev, plan: PLAN_OPTIONS[i] }))}
                    className={`mt-7 flex w-full items-center justify-center rounded-full px-5 py-3 font-display text-sm font-semibold transition-colors ${
                      pkg.tone === 'default'
                        ? 'glass-soft text-white/85 hover:text-white'
                        : pkg.tone === 'gold'
                          ? 'bg-gold text-[#07080C] hover:bg-gold/90'
                          : 'cta-primary text-white'
                    }`}
                  >
                    Get Started
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-white/40">{PARTNER_SERVICES.packagesFootnote}</p>
        </div>
      </section>

      <section id="programs" className="relative scroll-mt-24 py-24 sm:py-32">
        <div className="container">
          <SectionHeading
            label="PROGRAMS"
            heading="Explore Our Programs"
            intro="Beyond our core U.S. business services, W3BB Worldwide runs a full ecosystem of pathways for entrepreneurs, partners, and creators at every stage."
          />
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PROGRAMS.map((program, i) => (
              <Reveal as="li" key={program.to} delay={(i % 3) * 80}>
                <Link to={program.to} className="glass glass-lift group flex h-full flex-col p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/[0.06] ring-1 ring-inset ring-white/10 transition-colors group-hover:ring-cyan/40">
                    <program.icon className="h-5 w-5 text-cyan" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-base font-semibold text-white">{program.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{program.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 font-display text-sm font-semibold text-cyan">
                    Learn more
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={120} className="mt-10 flex justify-center">
            <Link to="/choose-your-path" className="cta-primary group inline-flex items-center gap-2 rounded-full px-8 py-4 font-display text-base font-semibold text-white">
              Choose Your Path
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section id="how-it-works" className="relative scroll-mt-24 py-24 sm:py-32">
        <div className="container">
          <SectionHeading label="HOW IT WORKS" heading="How It Works" intro="From signup to a fully operational U.S. presence in days, not months." />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PARTNER_SERVICES.howItWorks.map((step, i) => (
              <Reveal key={step.n} delay={i * 90}>
                <div className="glass relative h-full overflow-hidden p-6">
                  <span className="absolute -right-2 -top-3 font-display text-6xl font-black text-white/[0.05]">{step.n}</span>
                  <h3 className="relative font-display text-base font-bold text-white">{step.title}</h3>
                  <p className="relative mt-2 text-sm text-white/60">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="relative scroll-mt-24 py-24 sm:py-32">
        <div className="container">
          <SectionHeading label="FAQ" heading="Frequently Asked Questions" />
          <Reveal className="mx-auto mt-12 max-w-3xl">
            <Accordion type="single" collapsible className="glass divide-y divide-white/10 px-2 sm:px-4">
              {PARTNER_SERVICES.faq.map((item) => (
                <AccordionItem key={item.q} value={item.q} className="border-white/10">
                  <AccordionTrigger className="font-display text-base font-semibold text-white hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-white/65">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      <section id="contact" className="relative scroll-mt-24 py-24 sm:py-32">
        <div className="container">
          <SectionHeading label="GET STARTED" heading="Tell Us About Your Business" intro="We'll follow up with next steps." />
          <Reveal className="mx-auto mt-12 max-w-2xl">
            <div className="glass relative overflow-hidden p-6 sm:p-10">
              <span className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan/15 blur-3xl" aria-hidden="true" />
              {status === 'success' ? (
                <div className="relative flex flex-col items-center py-10 text-center">
                  <span className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-violet/30 to-cyan/20 ring-1 ring-inset ring-white/15">
                    <CheckCircle2 className="h-9 w-9 text-cyan" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <h3 className="mt-7 font-display text-2xl font-semibold text-white sm:text-3xl">
                    Thanks — we'll follow up shortly.
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">
                    We'll reach out at {form.email} about the {form.plan} plan for {form.businessName || 'your business'}.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setForm({ businessName: '', country: '', productType: '', plan: PLAN_OPTIONS[1], email: '', notes: '' });
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
                      <label htmlFor="ps-business" className={labelClass}>Business Name</label>
                      <input id="ps-business" required value={form.businessName} onChange={update('businessName')} className={`${fieldClass} mt-2`} />
                    </div>
                    <div>
                      <label htmlFor="ps-country" className={labelClass}>Country</label>
                      <input id="ps-country" required value={form.country} onChange={update('country')} className={`${fieldClass} mt-2`} />
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="ps-product" className={labelClass}>Product Type</label>
                      <input id="ps-product" required value={form.productType} onChange={update('productType')} className={`${fieldClass} mt-2`} />
                    </div>
                    <div>
                      <label htmlFor="ps-plan" className={labelClass}>Preferred Plan</label>
                      <select
                        id="ps-plan"
                        value={form.plan}
                        onChange={update('plan')}
                        className={`${fieldClass} mt-2 appearance-none bg-[right_1rem_center] bg-no-repeat pr-10`}
                        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23ffffff88' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}
                      >
                        {PLAN_OPTIONS.map((option) => (
                          <option key={option} value={option} className="bg-[#0B0D14] text-white">{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="ps-email" className={labelClass}>Email</label>
                    <input id="ps-email" type="email" required value={form.email} onChange={update('email')} className={`${fieldClass} mt-2`} />
                  </div>
                  <div>
                    <label htmlFor="ps-notes" className={labelClass}>What do you need help with?</label>
                    <textarea id="ps-notes" rows={4} value={form.notes} onChange={update('notes')} className={`${fieldClass} mt-2 resize-y`} />
                  </div>

                  <ConsentCheckbox id="ps-consent" checked={consent} onChange={setConsent} />

                  {status === 'error' ? <p role="alert" className="text-sm text-red-300">{error}</p> : null}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="cta-primary group inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 font-display text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {status === 'loading' ? (
                      <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />Sending…</>
                    ) : (
                      <>Send Inquiry<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" /></>
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

export default PartnerServices;
