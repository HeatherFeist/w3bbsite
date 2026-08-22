import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users2 } from 'lucide-react';
import PageShell from '@/components/PageShell';
import Reveal from '@/components/w3bb/Reveal';
import ProgramApplicationForm from '@/components/w3bb/ProgramApplicationForm';
import { COMMUNITY } from '@/data/community';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useHashScroll } from '@/hooks/useHashScroll';

const Community: React.FC = () => {
  usePageMeta('Community', COMMUNITY.body);
  useHashScroll();

  return (
    <PageShell>
      <section className="relative scroll-mt-24 py-28 pt-36 sm:py-32 sm:pt-40">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <span className="glass-soft inline-flex items-center gap-2.5 rounded-full px-4 py-2">
                <Users2 className="h-4 w-4 text-cyan" strokeWidth={1.5} aria-hidden="true" />
                <span className="micro-label text-white/75">{COMMUNITY.eyebrow}</span>
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-7 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl">
                {COMMUNITY.heading}
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="mx-auto mt-6 max-w-2xl font-display text-lg font-medium text-white/85 sm:text-xl">
                {COMMUNITY.sub}
              </p>
            </Reveal>
            <Reveal delay={180}>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/65">{COMMUNITY.body}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative pb-16">
        <div className="container">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {COMMUNITY.sections.map((section, i) => (
              <Reveal as="li" key={section.title} delay={(i % 3) * 80}>
                <div className="glass relative flex h-full flex-col p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/[0.06] ring-1 ring-inset ring-white/10">
                    <section.icon className="h-5 w-5 text-cyan" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-base font-semibold text-white">{section.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">{section.description}</p>
                  {section.href ? (
                    <Link
                      to={section.href}
                      className="mt-4 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-cyan"
                    >
                      {section.linkLabel}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  ) : null}
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <ProgramApplicationForm
        id="volunteer"
        heading={COMMUNITY.closingHeading}
        intro={COMMUNITY.closingBody}
        interest="Community / Volunteer Interest"
        source="w3bb-community-page"
        submitLabel="Get Involved"
        successHeading="Thanks for reaching out."
        successBody="We'll follow up at {email} with ways to get involved."
        messageLabel="How would you like to be involved?"
        messagePlaceholder="Volunteering, joining a craft group, hosting a workshop, sharing your story…"
      />
    </PageShell>
  );
};

export default Community;
