import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import PageShell from '@/components/PageShell';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';
import { RESOURCES } from '@/data/resources';
import { usePageMeta } from '@/hooks/usePageMeta';

const Resources: React.FC = () => {
  usePageMeta('Resources', RESOURCES.sub);

  return (
    <PageShell>
      <section className="relative scroll-mt-24 py-28 pt-36 sm:py-32 sm:pt-40">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <span className="glass-soft inline-flex items-center gap-2.5 rounded-full px-4 py-2">
                <BookOpen className="h-4 w-4 text-cyan" strokeWidth={1.5} aria-hidden="true" />
                <span className="micro-label text-white/75">{RESOURCES.eyebrow}</span>
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-7 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl">
                {RESOURCES.heading}
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
                {RESOURCES.sub}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative pb-8">
        <div className="container">
          <SectionHeading label="LIBRARY" heading={RESOURCES.libraryHeading} intro={RESOURCES.libraryIntro} />
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {RESOURCES.library.map((item, i) => (
              <Reveal as="li" key={item.title} delay={(i % 4) * 80}>
                <div className="glass relative h-full p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/[0.06] ring-1 ring-inset ring-white/10">
                    <item.icon className="h-5 w-5 text-cyan" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-base font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative bg-white/[0.02] py-24 sm:py-32">
        <div className="container">
          <SectionHeading label="LIVE TODAY" heading={RESOURCES.growHeading} intro={RESOURCES.growIntro} />
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {RESOURCES.growPrograms.map((program, i) => (
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
        </div>
      </section>
    </PageShell>
  );
};

export default Resources;
