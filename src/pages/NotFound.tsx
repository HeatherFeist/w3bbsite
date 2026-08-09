import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import PageShell from '@/components/PageShell';
import { usePageMeta } from '@/hooks/usePageMeta';

const NotFound: React.FC = () => {
  const location = useLocation();
  usePageMeta('Page Not Found');

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <PageShell>
      <section className="relative flex min-h-[70vh] items-center py-28 pt-36 sm:pt-40">
        <div className="container">
          <div className="mx-auto max-w-xl text-center">
            <span className="glass-soft inline-flex items-center gap-2.5 rounded-full px-4 py-2">
              <Compass className="h-4 w-4 text-cyan" strokeWidth={1.5} aria-hidden="true" />
              <span className="micro-label text-white/75">404</span>
            </span>
            <h1 className="mt-8 font-display text-4xl font-semibold tracking-[-0.03em] text-white sm:text-6xl">
              This page hasn't been <span className="gradient-text">built</span> yet.
            </h1>
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/65 sm:text-lg">
              We couldn't find <span className="font-mono text-white/80">{location.pathname}</span>.
              It may have moved, or the link might be off.
            </p>
            <Link
              to="/"
              className="cta-primary group mt-10 inline-flex items-center gap-2 rounded-full px-8 py-4 font-display text-base font-semibold text-white"
            >
              Back to Home
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default NotFound;
