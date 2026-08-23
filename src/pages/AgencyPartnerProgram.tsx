import React from 'react';
import { Handshake } from 'lucide-react';
import PageShell from '@/components/PageShell';
import ProgramHero from '@/components/w3bb/ProgramHero';
import ProgramClosing from '@/components/w3bb/ProgramClosing';
import ProgramApplicationForm from '@/components/w3bb/ProgramApplicationForm';
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
        ctaHref="#agency-partner-form"
        accent="gold"
      />

      <IconCardGrid heading="What This Means for You" items={AGENCY_PARTNER.whatItMeans} accent="gold" tinted />
      <IconCardGrid heading="Who This Is For" items={AGENCY_PARTNER.whoFor} />

      <ProgramApplicationForm
        id="agency-partner-form"
        heading="Become a Partner"
        intro="Tell us about your agency and how you'd like to work with W3BB Worldwide and GoDaddy's Agency Partner Program."
        interest="Agency Partner Program"
        source="w3bb-agency-partner-page"
        submitLabel={AGENCY_PARTNER.ctaLabel}
        successHeading="Application received."
        successBody="Our team will review your application and follow up at {email} with next steps to onboard as an agency partner."
        messageLabel="Tell us about your agency"
        messagePlaceholder="What services do you offer, and how many clients do you currently serve?"
        fields={[{ id: 'agency', label: 'Agency or company name', placeholder: 'Your agency or company name' }]}
        accent="gold"
      />

      <ProgramClosing
        heading={AGENCY_PARTNER.closingHeading}
        body={AGENCY_PARTNER.closingBody}
        ctaLabel={AGENCY_PARTNER.ctaLabel}
        ctaHref="#agency-partner-form"
        accent="gold"
      />
    </PageShell>
  );
};

export default AgencyPartnerProgram;
