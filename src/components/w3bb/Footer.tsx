import React from 'react';
import { Linkedin, Twitter, Github, Youtube, Mail } from 'lucide-react';
import { SITE, FOOTER_COLUMNS } from '@/data/site';
import { scrollToId } from '@/hooks/useScrollSpy';
import { Wordmark } from '@/components/w3bb/Navbar';

const SOCIALS = [
  { label: 'W3BB Worldwide on X', Icon: Twitter, href: 'https://x.com/w3bbworldwide' },
  { label: 'W3BB Worldwide on LinkedIn', Icon: Linkedin, href: 'https://www.linkedin.com/company/w3bbworldwide' },
  { label: 'W3BB Worldwide on YouTube', Icon: Youtube, href: 'https://www.youtube.com/@w3bbworldwide' },
  { label: 'W3BB Worldwide on GitHub', Icon: Github, href: 'https://github.com/w3bbworldwide' },
];

export const Footer: React.FC = () => (
  <footer className="relative border-t border-white/10 bg-[#07080C]/80 pt-16 pb-10">
    <div className="container">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
        <div>
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToId('hero');
            }}
            className="inline-flex items-center gap-2.5 rounded-lg"
            aria-label="W3BB Worldwide — back to top"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet via-cyan to-gold p-[1px]">
              <span className="grid h-full w-full place-items-center rounded-[11px] bg-[#07080C] font-display text-[0.7rem] font-bold text-white">
                W3
              </span>
            </span>
            <Wordmark />
          </a>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">{SITE.descriptor}</p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/[0.07] px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
            <span className="font-display text-xs font-medium tracking-wide text-gold">
              {SITE.trustLine}
            </span>
          </p>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-5 flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-cyan"
          >
            <Mail className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            {SITE.email}
          </a>
        </div>

        <nav className="grid gap-8 sm:grid-cols-3" aria-label="Footer">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h2 className="micro-label text-white/40">{column.title}</h2>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToId(link.id);
                      }}
                      className="text-sm text-white/60 transition-colors duration-300 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-14 h-px w-full gradient-rule opacity-50" aria-hidden="true" />

      <div className="mt-8 flex flex-col-reverse items-center justify-between gap-6 sm:flex-row">
        <p className="text-center text-xs text-white/45 sm:text-left">
          {SITE.copyright} · {SITE.domain}
        </p>
        <ul className="flex items-center gap-3">
          {SOCIALS.map(({ label, Icon: SocialIcon, href }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet/50 hover:bg-white/[0.08] hover:text-white"
              >
                <SocialIcon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </footer>
);

export default Footer;
