import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Map, Rocket } from 'lucide-react';
import PageShell from '@/components/PageShell';
import Reveal from '@/components/w3bb/Reveal';
import { CHOOSE_YOUR_PATH } from '@/data/partnerships';
import { usePageMeta } from '@/hooks/usePageMeta';

const ChooseYourPath: React.FC = () => {
  usePageMeta('Choose Your Path', CHOOSE_YOUR_PATH.body);

  return (
    <PageShell>
      <section className="relative scroll-mt-24 py-28 pt-36 sm:py-32 sm:pt-40">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <span className="glass-soft inline-flex items-center gap-2.5 rounded-full px-4 py-2">
                <Map className="h-4 w-4 text-cyan" strokeWidth={1.5} aria-hidden="true" />
                <span className="micro-label text-white/75">{CHOOSE_YOUR_PATH.eyebrow}</span>
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-7 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl">
                Choose <span className="gradient-text">Your Path</span>
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="mx-auto mt-6 max-w-2xl font-display text-lg font-medium text-white/85 sm:text-xl">
                {CHOOSE_YOUR_PATH.sub}
              </p>
            </Reveal>
            <Reveal delay={180}>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/65">{CHOOSE_YOUR_PATH.body}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative pb-12">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-2">
            {CHOOSE_YOUR_PATH.paths.map((path, i) => (
              <Reveal key={path.title} delay={i * 90}>
                <div className={`glass relative h-full overflow-hidden p-8 ${path.tone === 'gold' ? 'ring-2 ring-gold/40' : ''}`}>
                  <span className="pointer-events-none absolute -right-1 -top-2 font-display text-7xl font-black text-white/[0.05]">
                    {path.n}
                  </span>
                  <h3 className="relative font-display text-2xl font-extrabold text-white">{path.title}</h3>
                  <p className="relative mt-2 text-sm text-white/60">{path.description}</p>
                  <ul className="relative mt-5 space-y-2 text-sm">
                    {path.items.map((item) => (
                      <li key={item} className="flex gap-2 text-white/75">
                        <ArrowRight
                          className={`mt-0.5 h-4 w-4 shrink-0 ${path.tone === 'gold' ? 'text-gold' : 'text-cyan'}`}
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={path.to}
                    className={`relative mt-7 inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-display text-sm font-semibold transition-colors ${
                      path.tone === 'gold' ? 'bg-gold text-[#07080C] hover:bg-gold/90' : 'cta-primary text-white'
                    }`}
                  >
                    {path.cta}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120} className="mt-6">
            <Link to="/launchpad" className="glass glass-lift group flex items-center gap-4 p-7">
              <Rocket className="h-7 w-7 shrink-0 text-cyan" strokeWidth={1.5} aria-hidden="true" />
              <div>
                <h3 className="font-display text-lg font-bold text-white">New here? Start with the Entrepreneur Launchpad</h3>
                <p className="text-sm text-white/60">Our nonprofit-powered program for first-time entrepreneurs with no capital and no LLC yet.</p>
              </div>
              <ArrowRight className="ml-auto h-5 w-5 shrink-0 text-cyan transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="relative bg-white/[0.02] py-24 sm:py-32">
        <div className="container">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">{CHOOSE_YOUR_PATH.closingHeading}</h2>
            <p className="mt-5 text-base leading-relaxed text-white/65 sm:text-lg">{CHOOSE_YOUR_PATH.closingBody}</p>
            <Link
              to="/partner-services#contact"
              className="cta-primary group mt-9 inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-display text-sm font-semibold text-white"
            >
              Talk to Us
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
};

export default ChooseYourPath;
