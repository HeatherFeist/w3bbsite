import React from 'react';
import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/w3bb/Reveal';
import CardLink from '@/components/w3bb/CardLink';
import { FounderFrame, PrimaryLink, QuietLink } from '../components';

const STEPS = [
  { n: '01', title: 'Discover', to: '/launch/assess', body: 'A saved assessment turns skills, time, capital, and working style into three scores and a founder archetype.' },
  { n: '02', title: 'Match', to: '/launch/matches', body: 'Rules recommend a business model. A hosted advisor can explain the match when an AI key is configured.' },
  { n: '03', title: 'Architect', to: '/launch/blueprint', body: 'A blueprint names the offer, the customer, the risks, and a 90-day plan. It does not replace the Business Builder.' },
  { n: '04', title: 'Launch', to: '/launch/dashboard', body: 'The coach, pathways, and command center stay with you. The business itself is built, certified, and packaged in W3BB.' },
];

const LaunchHome: React.FC = () => (
  <FounderFrame
    title="Start Your Business"
    description="Take the W3BB founder assessment, match a business model, and carry the plan into the Business Builder."
  >
    <Reveal>
      <p className="micro-label text-cyan">Founder Launch Platform</p>
    </Reveal>
    <Reveal delay={80}>
      <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] text-white sm:text-6xl">
        From an idea to a business you can actually build.
      </h1>
    </Reveal>
    <Reveal delay={140}>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
        Bring a rough idea. Leave with a readiness score, a model that fits how you work, and a blueprint. Then continue in the Business Builder, the Entrepreneur Launchpad, and — when the business is real — Trust-Approved Certification.
      </p>
    </Reveal>
    <Reveal delay={180}>
      <p className="mt-4 font-display text-base italic text-white/80">Entrepreneurship, simplified. Legacy, amplified.</p>
    </Reveal>
    <Reveal delay={220}>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <PrimaryLink to="/launch/assess">Take the founder assessment</PrimaryLink>
        <QuietLink to="/launch/dashboard">Open the command center</QuietLink>
      </div>
    </Reveal>

    <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STEPS.map((step) => (
        <li key={step.n}>
          <CardLink to={step.to} className="p-5">
            <p className="font-mono text-xs text-cyan">{step.n}</p>
            <h2 className="mt-3 font-display text-xl font-semibold text-white">{step.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/75">{step.body}</p>
          </CardLink>
        </li>
      ))}
    </ol>

    <section className="mt-14 grid gap-4 lg:grid-cols-3">
      <CardLink to="/ecosystem" className="p-6">
        <h2 className="font-display text-xl font-semibold text-white">It sits inside the ecosystem</h2>
        <p className="mt-3 text-sm leading-relaxed text-white/75">
          CDI is the nonprofit backbone. W3BB is the digital hub. Sponsored businesses are the network. Launch is the front door for a person who only has an idea.
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan">
          See the ecosystem <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </CardLink>
      <CardLink to="/build" className="p-6">
        <h2 className="font-display text-xl font-semibold text-white">The builder still builds</h2>
        <p className="mt-3 text-sm leading-relaxed text-white/75">
          Naming, products, assets, operations, and launch prep stay in the existing 8-step Business Builder. This platform writes the plan that you carry there.
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan">
          Open the Business Builder <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </CardLink>
      <CardLink to="/launchpad" className="p-6">
        <h2 className="font-display text-xl font-semibold text-white">Start with no capital</h2>
        <p className="mt-3 text-sm leading-relaxed text-white/75">
          If money is the blocker, the Entrepreneur Launchpad and the Zero-Dollar Startup Path are already on this site. The assessment will point you there.
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan">
          Join the Launchpad <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </CardLink>
    </section>
  </FounderFrame>
);

export default LaunchHome;
