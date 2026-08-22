import React from 'react';
import PageShell from '@/components/PageShell';
import { useHashScroll } from '@/hooks/useHashScroll';
import Hero from '@/components/w3bb/Hero';
import About from '@/components/w3bb/About';
import FeaturedBusinesses from '@/components/w3bb/FeaturedBusinesses';
import WhatYouCanBuild from '@/components/w3bb/WhatYouCanBuild';
import BusinessBuilder from '@/components/w3bb/BusinessBuilder';
import Marketplace from '@/components/w3bb/Marketplace';
import Certification from '@/components/w3bb/Certification';
import Enterprise from '@/components/w3bb/Enterprise';
import SocialMission from '@/components/w3bb/SocialMission';
import Economy from '@/components/w3bb/Economy';
import WhyW3bb from '@/components/w3bb/WhyW3bb';
import FinalCta from '@/components/w3bb/FinalCta';
import Contact from '@/components/w3bb/Contact';

const AppLayout: React.FC = () => {
  useHashScroll();

  return (
    <PageShell>
      <Hero />
      <About />
      <FeaturedBusinesses />
      <WhatYouCanBuild />
      <BusinessBuilder />
      <Marketplace />
      <Certification />
      <Enterprise />
      <SocialMission />
      <Economy />
      <WhyW3bb />
      <FinalCta />
      <Contact />
    </PageShell>
  );
};

export default AppLayout;
