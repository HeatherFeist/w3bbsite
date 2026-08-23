import React from 'react';
import Backdrop from '@/components/w3bb/Backdrop';
import Navbar from '@/components/w3bb/Navbar';
import Footer from '@/components/w3bb/Footer';
import { useHashScroll } from '@/hooks/useHashScroll';

interface PageShellProps {
  children: React.ReactNode;
}

/** Shared chrome (backdrop, navbar, footer) for every route in the app. */
export const PageShell: React.FC<PageShellProps> = ({ children }) => {
  useHashScroll();

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-white">
      <Backdrop />
      <a
        href="#main"
        className="sr-only rounded-full bg-white px-4 py-2 font-display text-sm font-semibold text-[#07080C] focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60]"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main">{children}</main>

      <Footer />
    </div>
  );
};

export default PageShell;
