import React from 'react';
import { Share2 } from 'lucide-react';
import PageShell from '@/components/PageShell';
import ProgramHero from '@/components/w3bb/ProgramHero';
import ProgramClosing from '@/components/w3bb/ProgramClosing';
import ProgramApplicationForm from '@/components/w3bb/ProgramApplicationForm';
import IconCardGrid from '@/components/w3bb/IconCardGrid';
import { AFFILIATE } from '@/data/partnerships';
import { usePageMeta } from '@/hooks/usePageMeta';

const CHANNEL_OPTIONS = [
  'Content creator',
  'Coach or consultant',
  'Influencer',
  'Community leader',
  'Newsletter or blog',
  'Other',
];

const AffiliateProgram: React.FC = () => {
  usePageMeta(
    'Affiliate Partnership Program',
    'Apply to become a W3BB Worldwide affiliate and earn recurring commissions for every entrepreneur you refer.',
  );
  return (
    <PageShell>
      <ProgramHero
        icon={Share2}
        eyebrow={AFFILIATE.eyebrow}
        heading={<>Affiliate <span className="gradient-text">Partnership Program</span></>}
        sub={AFFILIATE.sub}
        body={AFFILIATE.body}
        ctaLabel={AFFILIATE.ctaLabel}
        ctaHref="#affiliate-form"
      />

      <IconCardGrid heading="What You Get" items={AFFILIATE.whatYouGet} tinted />
      <IconCardGrid heading="Who This Is For" items={AFFILIATE.whoFor} />

      <ProgramApplicationForm
        id="affiliate-form"
        heading="Become an Affiliate"
        intro="Tell us about your audience and how you'd like to share W3BB Worldwide. Our team reviews every application and follows up with your affiliate dashboard access."
        interest="Affiliate Partnership Program"
        source="w3bb-affiliate-page"
        submitLabel="Submit Application"
        successHeading="Application received."
        successBody="Our team will review your application and follow up at {email} with your affiliate dashboard access."
        messageLabel="Tell us about your audience"
        messagePlaceholder="Who follows you, and how do you plan to share W3BB Worldwide?"
        fields={[
          { id: 'channel', label: 'How do you primarily reach your audience?', type: 'select', options: CHANNEL_OPTIONS },
          { id: 'link', label: 'Website or social profile', placeholder: 'https://…' },
        ]}
      />

      <ProgramClosing
        heading={AFFILIATE.closingHeading}
        body={AFFILIATE.closingBody}
        ctaLabel={AFFILIATE.ctaLabel}
        ctaHref="#affiliate-form"
      />
    </PageShell>
  );
};

export default AffiliateProgram;
