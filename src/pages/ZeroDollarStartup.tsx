import React from 'react';
import { Sprout, Check } from 'lucide-react';
import PageShell from '@/components/PageShell';
import ProgramHero from '@/components/w3bb/ProgramHero';
import ProgramClosing from '@/components/w3bb/ProgramClosing';
import IconCardGrid from '@/components/w3bb/IconCardGrid';
import Reveal from '@/components/w3bb/Reveal';
import { ZERO_DOLLAR } from '@/data/partnerships';
import { usePageMeta } from '@/hooks/usePageMeta';

const ZeroDollarStartup: React.FC = () => {
  usePageMeta('Zero-Dollar Startup Path', ZERO_DOLLAR.body);

  return (
    <PageShell>
      <ProgramHero
        icon={Sprout}
        eyebrow={ZERO_DOLLAR.eyebrow}
        heading={<>Zero-Dollar <span className="gradient-text">Startup Path</span></>}
        sub={ZERO_DOLLAR.sub}
        body={ZERO_DOLLAR.body}
        ctaLabel={ZERO_DOLLAR.ctaLabel}
      />

      <IconCardGrid heading="What You'll Learn" items={ZERO_DOLLAR.whatYoullLearn} columns={2} tinted />

      <section className="relative py-20 sm:py-24">
        <div className="container">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">Why This Works</h2>
            <p className="mt-4 text-base text-white/65">
              Most people never start because they think they need money first. We flip the script.
            </p>
            <p className="mt-6 font-display text-sm font-semibold text-white/85">You start with:</p>
            <div className="mt-5 grid gap-3 text-left sm:grid-cols-2">
              {ZERO_DOLLAR.startWith.map((item) => (
                <div key={item} className="glass flex items-center gap-3 px-5 py-4">
                  <Check className="h-4 w-4 shrink-0 text-cyan" strokeWidth={2.5} aria-hidden="true" />
                  <span className="text-sm text-white/80">{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-base text-white/65">And together, we build something real.</p>
          </Reveal>
        </div>
      </section>

      <ProgramClosing heading={ZERO_DOLLAR.closingHeading} body={ZERO_DOLLAR.closingBody} ctaLabel={ZERO_DOLLAR.ctaLabel} />
    </PageShell>
  );
};

export default ZeroDollarStartup;
