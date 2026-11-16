import React from 'react';
import { Link } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';
import { SITE } from '@/data/site';
import { usePageMeta } from '@/hooks/usePageMeta';

const DRAFT = 'DRAFT — needs lawyer review before publication. This page is not a claim of legal compliance.';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Reveal className="mt-10">
    <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">{title}</h2>
    <div className="mt-3 space-y-3 text-sm leading-relaxed text-white/75 sm:text-base">{children}</div>
  </Reveal>
);

const TermsOfUse: React.FC = () => {
  usePageMeta('Terms of Use', `Draft terms for using the ${SITE.fullName} website, founder tools, and related services.`);

  return (
    <PageShell>
      <section className="relative scroll-mt-24 py-28 pt-36 sm:py-32 sm:pt-40">
        <div className="container">
          <SectionHeading
            label="LEGAL DRAFT"
            heading="Terms of Use"
            intro="Last updated November 16, 2026. These terms are a draft for counsel to review. They are not legal advice and they are not a certification of compliance."
            align="left"
            className="max-w-3xl"
          />
          <p className="mt-6 max-w-3xl rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm leading-relaxed text-white/85" role="note">
            {DRAFT}
          </p>

          <div className="mx-auto mt-4 max-w-3xl">
            <Section title="Using the site">
              <p>
                {SITE.fullName} publishes w3bbworldwide.com, including the Business Builder, founder assessment, blueprint, launch coach, and program pages. By using the site you agree to these draft terms and the{' '}
                <Link to="/privacy" className="text-cyan underline-offset-4 hover:underline">Privacy Policy</Link>.
              </p>
            </Section>
            <Section title="Accounts and demo mode">
              <p>You may use the founder tools in this browser without an account. That demo copy stays on your device until you clear it. If you create a founder account, you are responsible for the email and password you choose.</p>
            </Section>
            <Section title="What the tools are">
              <p>Scores, business matches, blueprints, sample funding records, and coach replies are planning aids. They are not a promise of revenue, funding, certification, or legal status. Trust-Approved Certification is a separate review. Learning pathways do not grant that badge.</p>
              <p>Sample funding records are practice data. They are not live grants and they have no award amounts or deadlines.</p>
            </Section>
            <Section title="Your content">
              <p>You keep what you submit: assessment answers, profile text, and messages to the coach. You give {SITE.fullName} permission to store that material so the product can show it back to you, and to send a coach prompt to an AI provider when a server key is configured.</p>
            </Section>
            <Section title="Acceptable use">
              <p>Do not misuse the site, attempt to break into another person’s founder account, or present sample funding records as live awards.</p>
            </Section>
            <Section title="Programs and paid services">
              <p>
                Partner-service prices published on the{' '}
                <Link to="/partner-services" className="text-cyan underline-offset-4 hover:underline">U.S. Business Partner Services</Link>{' '}
                page are the prices of those services. Other pages do not add a fee by these terms.
              </p>
            </Section>
            <Section title="Contact">
              <p>
                Questions about these terms: <a className="text-cyan underline-offset-4 hover:underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>.
              </p>
            </Section>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default TermsOfUse;
