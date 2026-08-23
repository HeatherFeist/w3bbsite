import React from 'react';
import { useParams } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import PageShell from '@/components/PageShell';
import ProgramHero from '@/components/w3bb/ProgramHero';
import ProgramClosing from '@/components/w3bb/ProgramClosing';
import ProgramApplicationForm from '@/components/w3bb/ProgramApplicationForm';
import IconCardGrid from '@/components/w3bb/IconCardGrid';
import Reveal from '@/components/w3bb/Reveal';
import { BUSINESS_SERVICES, Check } from '@/data/partnerships';
import { usePageMeta } from '@/hooks/usePageMeta';

const BusinessServices: React.FC = () => {
  const { service } = useParams<{ service?: string }>();
  const activeService = BUSINESS_SERVICES.services.find((s) => s.slug === service);

  usePageMeta(
    activeService ? activeService.title : 'Business Services',
    activeService ? activeService.description : BUSINESS_SERVICES.body,
  );
  const heroHeading = activeService ? (
    activeService.title
  ) : (
    <>Business <span className="gradient-text">Services</span></>
  );
  const heroSub = activeService ? activeService.description : BUSINESS_SERVICES.sub;

  return (
    <PageShell>
      <ProgramHero
        icon={activeService ? activeService.icon : Briefcase}
        eyebrow={BUSINESS_SERVICES.eyebrow}
        heading={heroHeading}
        sub={heroSub}
        body={BUSINESS_SERVICES.body}
        ctaLabel={BUSINESS_SERVICES.ctaLabel}
        ctaHref="#business-services-form"
      />

      <section className="border-y border-white/5 bg-white/[0.02] py-4">
        <p className="mx-auto max-w-4xl px-4 text-center text-xs text-white/50">
          {BUSINESS_SERVICES.disclosure}
        </p>
      </section>

      {activeService ? (
        <section className="relative py-4 sm:py-6">
          <div className="container">
            <Reveal className="mx-auto max-w-3xl">
              <div className="glass p-6 sm:p-8">
                <p className="font-display text-sm font-semibold uppercase tracking-wide text-cyan">
                  What's included
                </p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {activeService.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-white/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan" strokeWidth={2.5} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      <IconCardGrid
        heading="Our Services"
        items={BUSINESS_SERVICES.services}
        tinted
        getHref={(item) => `/business-services/${item.slug}`}
      />
      <IconCardGrid heading="Who We Serve" items={BUSINESS_SERVICES.whoWeServe} />

      <ProgramApplicationForm
        key={service ?? 'general'}
        id="business-services-form"
        heading="Start a Project"
        intro="Tell us what you're building and our team will follow up to scope your project."
        interest="Business Services"
        source="w3bb-business-services-page"
        submitLabel={BUSINESS_SERVICES.ctaLabel}
        successHeading="Thanks — we'll follow up shortly."
        successBody="Our team will review your project and follow up at {email} with next steps."
        messageLabel="Tell us about your project"
        messagePlaceholder="What are you looking to build, and what's your timeline?"
        fields={[
          {
            id: 'service',
            label: 'What do you need help with?',
            type: 'select',
            options: BUSINESS_SERVICES.services.map((s) => s.title),
          },
        ]}
        initialValues={activeService ? { service: activeService.title } : undefined}
      />

      <ProgramClosing
        heading={BUSINESS_SERVICES.closingHeading}
        body={BUSINESS_SERVICES.closingBody}
        ctaLabel={BUSINESS_SERVICES.ctaLabel}
        ctaHref="#business-services-form"
      />
    </PageShell>
  );
};

export default BusinessServices;
