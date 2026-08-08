import React from 'react';
import Backdrop from '@/components/w3bb/Backdrop';
import Navbar from '@/components/w3bb/Navbar';
import Hero from '@/components/w3bb/Hero';
import About from '@/components/w3bb/About';
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
import Footer from '@/components/w3bb/Footer';

const AppLayout: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-white">

      <Backdrop />
      <a
        href="#about"
        className="sr-only rounded-full bg-white px-4 py-2 font-display text-sm font-semibold text-[#07080C] focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60]"
      >
        Skip to content
      </a>

      <Navbar />

      <main>
        <Hero />
        <About />
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
      </main>

      <Footer />
    </div>
  );
};

export default AppLayout;
