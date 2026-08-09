import React from 'react';
import { Share2 } from 'lucide-react';
import PageShell from '@/components/PageShell';
import ProgramHero from '@/components/w3bb/ProgramHero';
import ProgramClosing from '@/components/w3bb/ProgramClosing';
import IconCardGrid from '@/components/w3bb/IconCardGrid';
import { AFFILIATE } from '@/data/partnerships';
import { usePageMeta } from '@/hooks/usePageMeta';

const AffiliateProgram: React.FC = () => {
  usePageMeta('Affiliate Partnership Program', AFFILIATE.body);

  return (
    <PageShell>
      <ProgramHero
        icon={Share2}
        eyebrow={AFFILIATE.eyebrow}
        heading={<>Affiliate <span className="gradient-text">Partnership Program</span></>}
        sub={AFFILIATE.sub}
        body={AFFILIATE.body}
        ctaLabel={AFFILIATE.ctaLabel}
      />

      <IconCardGrid heading="What You Get" items={AFFILIATE.whatYouGet} tinted />
      <IconCardGrid heading="Who This Is For" items={AFFILIATE.whoFor} />

      <ProgramClosing heading={AFFILIATE.closingHeading} body={AFFILIATE.closingBody} ctaLabel={AFFILIATE.ctaLabel} />
    </PageShell>
  );
};

export default AffiliateProgram;
