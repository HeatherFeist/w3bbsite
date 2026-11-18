import React from 'react';
import PageShell from '@/components/PageShell';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';
import { SITE } from '@/data/site';
import { usePageMeta } from '@/hooks/usePageMeta';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Reveal className="mt-10">
    <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">{title}</h2>
    <div className="mt-3 space-y-3 text-sm leading-relaxed text-white/70 sm:text-base">
      {children}
    </div>
  </Reveal>
);

const PrivacyPolicy: React.FC = () => {
  usePageMeta('Privacy Policy', `How ${SITE.fullName} collects, uses, and protects your information.`);

  return (
    <PageShell>
      <section className="relative scroll-mt-24 py-28 pt-36 sm:py-32 sm:pt-40">
        <div className="container">
          <SectionHeading
            label="LEGAL"
            heading="Privacy Policy"
            intro="Last updated November 16, 2026. This draft describes what we collect on w3bbworldwide.com, why, and how to reach us about it. It is not a certification of compliance."
            align="left"
            className="max-w-3xl"
          />

          <p className="mt-6 max-w-3xl rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm leading-relaxed text-white/85" role="note">
            DRAFT — needs lawyer review before publication. This page is not a claim of legal compliance.
          </p>
          <div className="mx-auto mt-4 max-w-3xl">
            <Section title="Information we collect">
              <p>When you use a form on this site — Contact, Business Builder, Certification, or Enterprise — we collect what you submit: your name, email, organization (if given), and message content.</p>
              <p>If you take the founder assessment, we collect your answers and the scores calculated from them. A founder profile can include your name, story, skills, a photo you upload, and a video URL. The launch coach stores the messages you send and the replies you receive. The Business Builder notebook stores the choices you write for each step.</p>
              <p>When you connect a wallet on the Marketplace / mint page, we collect your public wallet address and the network (chain) it's connected to. We never ask for or have access to your private keys or seed phrase — wallet connections happen entirely in your own wallet software.</p>
              <p>We do not currently use third-party advertising trackers or sell any data to advertisers.</p>
            </Section>

            <Section title="How we use it">
              <ul className="list-disc space-y-2 pl-5">
                <li>To respond to your enquiry or application.</li>
                <li>To follow up about your Business Builder progress, certification status, or enterprise inquiry.</li>
                <li>To notify a connected wallet address when Franchise Bundle minting opens.</li>
                <li>To show your assessment, blueprint, builder notebook, and coach history back to you.</li>
                <li>To improve the site and understand which pages and flows people actually use, if analytics is configured.</li>
              </ul>
            </Section>

            <Section title="How we store and share it">
              <p>Form submissions are stored in our managed database (Supabase) and are accessible to the {SITE.fullName} team. Founder accounts, when you sign in, are stored in that same Supabase project: profile fields, assessment answers, blueprint, builder notebook, and coach messages.</p>
              <p>If you stay in demo mode, that founder material is stored in this browser’s local storage. It is not sent to Supabase until you create or sign in to a founder account. Clearing the site data in your browser removes the demo copy.</p>
              <p>When a server-side AI key is configured, coach and blueprint requests are sent to an AI provider (an OpenAI-compatible API) so it can write a reply. The request includes the conversation and a summary of your assessment and blueprint. It does not include your profile photo. If no key is configured, the coach answers on your device and that text is not sent to an AI provider.</p>
              <p>We don't sell personal information to third parties. We may share information with service providers who help us operate the site (database, hosting, and, when enabled, analytics or an AI provider), bound to use it to provide those services.</p>
              <p>Analytics is off unless the site is configured with a Cloudflare Web Analytics token or a Plausible domain. When one of those is set, that provider receives the page you visit. Plausible can also receive the button and form events this site already records. No advertising tracker is loaded.</p>
            </Section>

            <Section title="A note on blockchain data">
              <p>Public wallet addresses and any transactions you make on a blockchain network are, by the nature of public blockchains, visible and permanent once submitted — that data lives on the network itself, not just with us, and we have no ability to alter or delete it.</p>
            </Section>

            <Section title="Your rights">
              <p>You can ask us to access, correct, or delete the personal information we hold about you by emailing{' '}
                <a href={`mailto:${SITE.email}`} className="text-cyan underline-offset-4 hover:underline">
                  {SITE.email}
                </a>
                . We'll respond as quickly as we reasonably can.
              </p>
            </Section>

            <Section title="Children's privacy">
              <p>This site is not directed at children under 13, and we don't knowingly collect personal information from them.</p>
            </Section>

            <Section title="Changes to this policy">
              <p>If this policy changes materially, we'll update the date at the top of this page.</p>
            </Section>

            <Section title="Contact">
              <p>
                Questions about this policy? Reach us at{' '}
                <a href={`mailto:${SITE.email}`} className="text-cyan underline-offset-4 hover:underline">
                  {SITE.email}
                </a>
                .
              </p>
            </Section>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default PrivacyPolicy;
