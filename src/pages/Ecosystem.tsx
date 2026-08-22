import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe2, Check } from 'lucide-react';
import PageShell from '@/components/PageShell';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';
import { ECOSYSTEM } from '@/data/ecosystem';
import { usePageMeta } from '@/hooks/usePageMeta';

const Ecosystem: React.FC = () => {
  usePageMeta(
    'The W3BB Worldwide Ecosystem',
    ECOSYSTEM.body,
  );

  return (
    <PageShell>
      <section className="relative scroll-mt-24 py-28 pt-36 sm:py-32 sm:pt-40">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <span className="glass-soft inline-flex items-center gap-2.5 rounded-full px-4 py-2">
                <Globe2 className="h-4 w-4 text-cyan" strokeWidth={1.5} aria-hidden="true" />
                <span className="micro-label text-white/75">{ECOSYSTEM.eyebrow}</span>
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-7 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl">
                One Ecosystem. <span className="gradient-text">Three Layers.</span>
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="mx-auto mt-6 max-w-2xl font-display text-lg font-medium text-white/85 sm:text-xl">
                {ECOSYSTEM.sub}
              </p>
            </Reveal>
            <Reveal delay={180}>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/65">{ECOSYSTEM.body}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative pb-8">
        <div className="container">
          <div className="grid gap-6 lg:grid-cols-3">
            {ECOSYSTEM.layers.map((layer, i) => (
              <Reveal key={layer.name} delay={i * 90}>
                <div className="glass relative flex h-full flex-col overflow-hidden p-7">
                  <span className="pointer-events-none absolute -right-2 -top-3 font-display text-7xl font-black text-white/[0.04]">
                    {layer.n}
                  </span>
                  <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet/30 to-cyan/15 ring-1 ring-inset ring-white/10">
                    <layer.icon className="h-5 w-5 text-white" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <h3 className="relative mt-5 font-display text-xl font-bold text-white">{layer.name}</h3>
                  <p className="relative text-sm font-medium text-cyan">{layer.title}</p>
                  <p className="relative mt-4 text-sm leading-relaxed text-white/70">{layer.description}</p>
                  <ul className="relative mt-5 space-y-2 text-sm">
                    {layer.provides.map((item) => (
                      <li key={item} className="flex gap-2 text-white/75">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan" strokeWidth={2.5} aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="relative mt-6 font-display text-sm font-semibold italic text-white/60">{layer.tagline}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-white/[0.02] py-24 sm:py-32">
        <div className="container">
          <SectionHeading label="THE PIPELINE" heading={ECOSYSTEM.flowHeading} className="max-w-none" headingClassName="text-2xl sm:text-3xl" />
          <ol className="relative mx-auto mt-14 max-w-2xl">
            <span
              className="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-violet via-cyan to-gold opacity-60"
              aria-hidden="true"
            />
            {ECOSYSTEM.flow.map((step, i) => (
              <Reveal as="li" key={step} delay={i * 60} className="relative block">
                <div className="flex items-center gap-5 py-2">
                  <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-[#0B0D14] font-display text-sm font-semibold text-white/70">
                    {i + 1}
                  </span>
                  <div className="glass flex-1 px-5 py-3.5">
                    <p className="text-sm font-medium text-white/85 sm:text-base">{step}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative py-24 sm:py-32">
        <div className="container">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">{ECOSYSTEM.outcomeHeading}</h2>
          </Reveal>
          <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2.5 sm:gap-3">
            {ECOSYSTEM.outcomes.map((item, i) => (
              <Reveal as="li" key={item} delay={i * 60}>
                <span className="glass-soft glass-lift inline-flex items-center rounded-full px-4 py-2.5 text-sm font-medium text-white/85">
                  {item}
                </span>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={120} className="mt-14 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/build"
              className="cta-primary group inline-flex items-center gap-2 rounded-full px-8 py-4 font-display text-base font-semibold text-white"
            >
              Start Building
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              to="/businesses"
              className="glass-soft inline-flex items-center gap-2 rounded-full px-8 py-4 font-display text-base font-semibold text-white/85 transition-colors hover:text-white"
            >
              See Sponsored Businesses
            </Link>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
};

export default Ecosystem;
