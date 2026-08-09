import React from 'react';
import { Rocket } from 'lucide-react';
import PageShell from '@/components/PageShell';
import ProgramHero from '@/components/w3bb/ProgramHero';
import ProgramClosing from '@/components/w3bb/ProgramClosing';
import IconCardGrid from '@/components/w3bb/IconCardGrid';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';
import { LAUNCHPAD } from '@/data/partnerships';
import { usePageMeta } from '@/hooks/usePageMeta';

const Launchpad: React.FC = () => {
  usePageMeta('Entrepreneur Launchpad', LAUNCHPAD.body);

  return (
    <PageShell>
      <ProgramHero
        icon={Rocket}
        eyebrow={LAUNCHPAD.eyebrow}
        heading={<>Entrepreneur <span className="gradient-text">Launchpad</span></>}
        sub={LAUNCHPAD.sub}
        body={LAUNCHPAD.body}
        ctaLabel={LAUNCHPAD.ctaLabel}
      />

      <IconCardGrid heading="Who This Is For" items={LAUNCHPAD.whoFor} columns={2} tinted />
      <IconCardGrid heading="What You Get" items={LAUNCHPAD.whatYouGet} />

      <section className="relative bg-white/[0.02] py-20 sm:py-24">
        <div className="container">
          <SectionHeading label="" heading="How It Works" className="max-w-none" headingClassName="text-2xl sm:text-3xl" />
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LAUNCHPAD.steps.map((step, i) => (
              <Reveal as="li" key={step} delay={(i % 3) * 70}>
                <div className="glass relative h-full overflow-hidden p-6">
                  <span className="absolute -right-2 -top-3 font-display text-6xl font-black text-white/[0.05]">{i + 1}</span>
                  <h3 className="relative font-display text-base font-bold text-white">{step}</h3>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <ProgramClosing heading={LAUNCHPAD.closingHeading} body={LAUNCHPAD.closingBody} ctaLabel={LAUNCHPAD.ctaLabel} />
    </PageShell>
  );
};

export default Launchpad;
