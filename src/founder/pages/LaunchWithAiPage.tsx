import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FounderFrame, PrimaryLink } from '../components';
import { useFounder } from '../useFounder';
import type { LaunchKit } from '../types';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="glass p-5 sm:p-6">
    <h2 className="font-display text-2xl font-semibold text-white">{title}</h2>
    <div className="mt-3 space-y-3 text-sm leading-relaxed text-white/75 sm:text-base">{children}</div>
  </section>
);

const KitView: React.FC<{ kit: LaunchKit }> = ({ kit }) => (
  <div className="mt-8 grid gap-4">
    <Section title="Business name">
      <p className="font-display text-3xl font-semibold text-white">{kit.businessName}</p>
      <p>Other names from the same answers: {kit.nameOptions.join(', ')}.</p>
      <p>This is a working name. The Business Builder is where the identity is saved.</p>
      <Link to="/build/business-identity" className="inline-flex font-semibold text-cyan">Open naming and branding</Link>
    </Section>

    <Section title="Domain suggestions">
      <ul className="space-y-3">
        {kit.domains.map((domain) => (
          <li key={domain.host}>
            <p className="font-mono text-white">{domain.host}</p>
            <p>{domain.note}</p>
          </li>
        ))}
      </ul>
    </Section>

    <Section title="Logo concepts">
      <ul className="grid gap-4 sm:grid-cols-3">
        {kit.logos.map((logo) => (
          <li key={logo.name} className="rounded-2xl border border-white/10 p-4">
            <h3 className="font-display text-lg font-semibold text-white">{logo.name}</h3>
            <p className="mt-2">{logo.mark}</p>
            <p className="mt-2">{logo.colors}</p>
            <p className="mt-2 text-white/60">{logo.type}</p>
          </li>
        ))}
      </ul>
      <Link to="/build/brand-kit" className="inline-flex font-semibold text-cyan">Take these into the brand kit</Link>
    </Section>

    <Section title="Landing page copy">
      <h3 className="font-display text-3xl font-semibold text-white">{kit.landing.headline}</h3>
      <p className="text-white/85">{kit.landing.subhead}</p>
      <p>{kit.landing.body}</p>
      <p className="inline-flex rounded-full bg-white px-4 py-2 font-semibold text-[#16141a]">{kit.landing.callToAction}</p>
    </Section>

    <Section title="Social media profiles">
      <p>Drafts to paste into an account you create. No profile has been opened.</p>
      <ul className="space-y-4">
        {kit.socials.map((social) => (
          <li key={social.label}>
            <h3 className="font-display text-lg font-semibold text-white">{social.label}</h3>
            <p className="mt-1 text-white">{social.name}</p>
            <p className="mt-1">{social.text}</p>
          </li>
        ))}
      </ul>
    </Section>

    <Section title="First marketing campaign">
      <h3 className="font-display text-xl font-semibold text-white">{kit.campaign.name}</h3>
      <p>{kit.campaign.channel}</p>
      <p className="text-white">{kit.campaign.message}</p>
      <ol className="list-decimal space-y-2 pl-5">
        {kit.campaign.steps.map((step) => <li key={step}>{step}</li>)}
      </ol>
      <Link to="/build/marketing-assets" className="inline-flex font-semibold text-cyan">Continue in marketing assets</Link>
    </Section>

    <Section title="Business plan">
      <p>{kit.businessPlan.summary}</p>
      <p>{kit.businessPlan.offer}</p>
      <p>{kit.businessPlan.customer}</p>
      <ul className="list-disc space-y-2 pl-5">
        {kit.businessPlan.plan90.map((line) => <li key={line}>{line}</li>)}
      </ul>
      <h3 className="font-display text-lg font-semibold text-white">Risks</h3>
      <ul className="list-disc space-y-2 pl-5">
        {kit.businessPlan.risks.map((risk) => <li key={risk}>{risk}</li>)}
      </ul>
      <Link to="/launch/blueprint" className="inline-flex font-semibold text-cyan">Open the full blueprint</Link>
    </Section>

    <Section title="Funding application draft">
      <h3 className="font-display text-xl font-semibold text-white">{kit.fundingDraft.title}</h3>
      <p className="rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3 text-white/85" role="note">{kit.fundingDraft.disclaimer}</p>
      {kit.fundingDraft.body.split('\n\n').map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <Link to="/launch/funding" className="inline-flex font-semibold text-cyan">Practice with sample funding records</Link>
    </Section>
  </div>
);

const LaunchWithAiPage: React.FC = () => {
  const { state, refineLaunchKit, ensureLaunchKit } = useFounder();
  const kit = state.launchKit;

  useEffect(() => {
    if (state.scores && !kit) ensureLaunchKit();
  }, [state.scores, kit, ensureLaunchKit]);

  useEffect(() => {
    if (!kit || kit.aiTried) return;
    void refineLaunchKit();
  }, [kit, refineLaunchKit]);

  if (!state.scores || !kit) {
    return (
      <FounderFrame title="Launch With AI" description="A launch draft generated from the W3BB founder assessment.">
        <h1 className="font-display text-4xl font-semibold text-white">Launch With AI starts after the assessment.</h1>
        <p className="mt-4 max-w-2xl text-white/75">Finish the assessment and this page writes a working name, domain spellings, logo concepts, landing copy, profile drafts, a first campaign, a business plan, and a funding note.</p>
        <div className="mt-8"><PrimaryLink to="/launch/assess">Take the founder assessment</PrimaryLink></div>
      </FounderFrame>
    );
  }

  return (
    <FounderFrame title="Launch With AI" description={`Launch draft for ${kit.businessName}: name, domains, logo concepts, landing copy, profiles, campaign, plan, and funding note.`}>
      <p className="micro-label text-cyan">Launch With AI</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">{kit.businessName}</h1>
      <p className="mt-4 max-w-2xl text-white/75">
        {kit.source === 'ai'
          ? 'A hosted advisor revised the wording. The name, domain spellings, and funding disclaimer stayed on the rules draft.'
          : 'Written on this device from your assessment and the selected model. If a server AI key is set, the hosted advisor may revise the wording. It does not replace this draft when no key is configured.'}
      </p>
      <p className="mt-3 max-w-2xl text-sm text-white/60">Model: {kit.modelName}. Nothing on this page registers a domain, opens a social account, draws a logo file, or submits an application.</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <PrimaryLink to="/launch/results">See the scores</PrimaryLink>
        <Link to="/launch/matches" className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/85">Change the model</Link>
      </div>
      <KitView kit={kit} />
    </FounderFrame>
  );
};

export default LaunchWithAiPage;
