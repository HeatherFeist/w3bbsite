import React, { useEffect, useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_LINKS, SECTION_IDS } from '@/data/site';
import { useScrollSpy, scrollToId } from '@/hooks/useScrollSpy';

export const Wordmark: React.FC<{ className?: string }> = ({ className }) => (
  <span
    className={cn(
      'font-display text-2xl font-bold tracking-[-0.04em] leading-none',
      className,
    )}
  >
    <span className="text-white">W3</span>
    <span className="gradient-text">BB</span>
  </span>
);

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    // Let the mobile sheet close before scrolling.
    window.setTimeout(() => scrollToId(id), open ? 120 : 0);
  };

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'border-b border-white/10 bg-[#07080C]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#07080C]/65'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav
        className="container flex h-[72px] items-center justify-between gap-6"
        aria-label="Primary"
      >
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            go('hero');
          }}
          className="flex items-center gap-2.5 rounded-lg"
          aria-label="W3BB Worldwide — home"
        >
          <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet via-cyan to-gold p-[1px]">
            <span className="grid h-full w-full place-items-center rounded-[11px] bg-[#07080C] font-display text-[0.7rem] font-bold tracking-tight text-white">
              W3
            </span>
          </span>
          <Wordmark />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(link.id);
                  }}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300',
                    isActive ? 'text-white' : 'text-white/60 hover:text-white',
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      'absolute inset-x-3 -bottom-0.5 h-px origin-center gradient-rule transition-transform duration-300',
                      isActive ? 'scale-x-100' : 'scale-x-0',
                    )}
                    aria-hidden="true"
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go('contact')}
            className="cta-primary hidden rounded-full px-5 py-2.5 text-sm font-semibold text-white sm:inline-flex items-center gap-2"
          >
            Start Creating
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-nav"
        className={cn(
          'overflow-hidden border-t border-white/10 bg-[#07080C]/95 backdrop-blur-xl transition-[max-height,opacity] duration-500 lg:hidden',
          open ? 'max-h-[70vh] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <ul className="container flex flex-col gap-1 py-5">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(link.id);
                }}
                className={cn(
                  'flex items-center justify-between rounded-xl px-4 py-3.5 font-display text-lg font-medium transition-colors',
                  active === link.id
                    ? 'bg-white/[0.06] text-white'
                    : 'text-white/70 hover:bg-white/[0.04] hover:text-white',
                )}
              >
                {link.label}
                <ArrowRight className="h-4 w-4 opacity-50" aria-hidden="true" />
              </a>
            </li>
          ))}
          <li className="mt-2">
            <button
              type="button"
              onClick={() => go('contact')}
              className="cta-primary w-full rounded-xl px-5 py-3.5 text-base font-semibold text-white"
            >
              Start Creating
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
