import React from 'react';
import { Handshake } from 'lucide-react';
import PageShell from '@/components/PageShell';
import ProgramHero from '@/components/w3bb/ProgramHero';
import ProgramClosing from '@/components/w3bb/ProgramClosing';
import IconCardGrid from '@/components/w3bb/IconCardGrid';
import { AGENCY_PARTNER } from '@/data/partnerships';
import { usePageMeta } from '@/hooks/usePageMeta';

const AgencyPartnerProgram: React.FC = () => {
  usePageMeta('Agency Partner Program', AGENCY_PARTNER.body);

  return (
    <PageShell>
      <ProgramHero
        icon={Handshake}
        eyebrow={AGENCY_PARTNER.eyebrow}
        heading={<>Agency <span className="gradient-text-gold">Partner Program</span></>}
        sub={AGENCY_PARTNER.sub}
        body={AGENCY_PARTNER.body}
        ctaLabel={AGENCY_PARTNER.ctaLabel}
        accent="gold"
      />

      <IconCardGrid heading="What This Means for You" items={AGENCY_PARTNER.whatItMeans} accent="gold" tinted />
      <IconCardGrid heading="Who This Is For" items={AGENCY_PARTNER.whoFor} />

      <ProgramClosing
        heading={AGENCY_PARTNER.closingHeading}
        body={AGENCY_PARTNER.closingBody}
        ctaLabel={AGENCY_PARTNER.ctaLabel}
        accent="gold"
      />
    </PageShell>
  );
};

export default AgencyPartnerProgram;
