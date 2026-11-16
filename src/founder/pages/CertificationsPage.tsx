import React from 'react';
import { Link } from 'react-router-dom';
import { PATHWAYS } from '../catalog';
import { FounderFrame, Meter } from '../components';
import { useFounder } from '../useFounder';
import { pathwayComplete } from '../gamification';

const CertificationsPage: React.FC = () => {
  const { state, credibility, setCertModule } = useFounder();

  return (
    <FounderFrame
      title="Certification pathways"
      description="New W3BB learning pathways that prepare you for Trust-Approved Certification."
    >
      <p className="micro-label text-cyan">New learning tracks</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">Pathways toward Trust-Approved Certification</h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/75">
        W3BB does not have individual course certifications today. These seven tracks are new. They are self-checked study steps inside Launch. Completing them raises the credibility score on this dashboard. The capstone is still the existing Trust-Approved Certification: a business-level review backed by the Webb Family Dynasty Trust.
      </p>
      <div className="mt-6 max-w-xl">
        <Meter value={credibility} label="Credibility score" />
      </div>
      <p className="mt-2 text-sm text-white/70">Credibility is the share of pathways you have fully checked. It is not the Trust-Approved badge.</p>

      <ol className="mt-10 space-y-4">
        {PATHWAYS.map((pathway, index) => {
          const done = pathwayComplete(state.certProgress, pathway.id);
          return (
            <li id={pathway.id} key={pathway.id} className="glass scroll-mt-28 p-5 sm:p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-2xl font-semibold text-white">{index + 1}. {pathway.name}</h2>
                <span className="text-xs uppercase tracking-[0.14em] text-white/60">{done ? 'Pathway complete' : 'In progress'}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/75">{pathway.summary}</p>
              <fieldset className="mt-4 space-y-2">
                <legend className="sr-only">{pathway.name} modules</legend>
                {pathway.modules.map((module) => {
                  const checked = Boolean(state.certProgress[pathway.id]?.modules?.[module.id]);
                  return (
                    <label key={module.id} className="flex items-start gap-3 text-sm text-white/85">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 accent-cyan"
                        checked={checked}
                        onChange={(event) => setCertModule(pathway.id, module.id, event.target.checked)}
                      />
                      {module.label}
                    </label>
                  );
                })}
              </fieldset>
            </li>
          );
        })}
      </ol>

      <section className="mt-8 glass p-6 ring-1 ring-gold/30">
        <p className="micro-label text-gold">Capstone</p>
        <h2 className="mt-3 font-display text-2xl font-semibold text-white">Trust-Approved Certification</h2>
        <p className="mt-3 text-sm leading-relaxed text-white/75">
          This is the existing certification for a business, not a course completion badge. The Webb Family Dynasty Trust backs the review. Apply from the certification page when the business has been built in the Business Builder and you can show the work.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link to="/certification" className="cta-primary inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white">
            Apply for Trust Certification
          </Link>
          <Link to="/build" className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/85">
            Open the Business Builder
          </Link>
        </div>
      </section>
    </FounderFrame>
  );
};

export default CertificationsPage;
