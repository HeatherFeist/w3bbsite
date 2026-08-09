import React from 'react';
import { Briefcase } from 'lucide-react';
import PageShell from '@/components/PageShell';
import ProgramHero from '@/components/w3bb/ProgramHero';
import ProgramClosing from '@/components/w3bb/ProgramClosing';
import IconCardGrid from '@/components/w3bb/IconCardGrid';
import { BUSINESS_SERVICES } from '@/data/partnerships';
import { usePageMeta } from '@/hooks/usePageMeta';

const BusinessServices: React.FC = () => {
  usePageMeta('Business Services', BUSINESS_SERVICES.body);

  return (
    <PageShell>
      <ProgramHero
        icon={Briefcase}
        eyebrow={BUSINESS_SERVICES.eyebrow}
        heading={<>Business <span className="gradient-text">Services</span></>}
        sub={BUSINESS_SERVICES.sub}
        body={BUSINESS_SERVICES.body}
        ctaLabel={BUSINESS_SERVICES.ctaLabel}
      />

      <IconCardGrid heading="Our Services" items={BUSINESS_SERVICES.services} tinted />
      <IconCardGrid heading="Who We Serve" items={BUSINESS_SERVICES.whoWeServe} />

      <ProgramClosing heading={BUSINESS_SERVICES.closingHeading} body={BUSINESS_SERVICES.closingBody} ctaLabel={BUSINESS_SERVICES.ctaLabel} />
    </PageShell>
  );
};

export default BusinessServices;
