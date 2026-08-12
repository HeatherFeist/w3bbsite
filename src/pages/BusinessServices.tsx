import React from 'react';
import { Briefcase } from 'lucide-react';
import PageShell from '@/components/PageShell';
import ProgramHero from '@/components/w3bb/ProgramHero';
import ProgramClosing from '@/components/w3bb/ProgramClosing';
import ProgramApplicationForm from '@/components/w3bb/ProgramApplicationForm';
import IconCardGrid from '@/components/w3bb/IconCardGrid';
import { BUSINESS_SERVICES } from '@/data/partnerships';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useHashScroll } from '@/hooks/useHashScroll';

const BusinessServices: React.FC = () => {
  usePageMeta('Business Services', BUSINESS_SERVICES.body);
  useHashScroll();

  return (
    <PageShell>
      <ProgramHero
        icon={Briefcase}
        eyebrow={BUSINESS_SERVICES.eyebrow}
        heading={<>Business <span className="gradient-text">Services</span></>}
        sub={BUSINESS_SERVICES.sub}
        body={BUSINESS_SERVICES.body}
        ctaLabel={BUSINESS_SERVICES.ctaLabel}
        ctaHref="#business-services-form"
      />

      <IconCardGrid heading="Our Services" items={BUSINESS_SERVICES.services} tinted />
      <IconCardGrid heading="Who We Serve" items={BUSINESS_SERVICES.whoWeServe} />

      <ProgramApplicationForm
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
