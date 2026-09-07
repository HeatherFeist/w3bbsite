import React from 'react';
import { Compass, FileText, MessagesSquare, Sparkles } from 'lucide-react';
import PageShell from '@/components/PageShell';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';
import RequireFranchiseBundle from '@/components/w3bb/RequireFranchiseBundle';
import { usePageMeta } from '@/hooks/usePageMeta';

const RESOURCES = [
  {
    icon: FileText,
    title: 'Playbooks & templates',
    body: 'Certification checklists, franchise operating docs, and launch templates shared across the network.',
  },
  {
    icon: MessagesSquare,
    title: 'Private updates',
    body: 'Roadmap notes, program changes, and early announcements before they go public.',
  },
  {
    icon: Compass,
    title: 'Partner directory',
    body: 'Connect with other certified Franchise Bundle holders building in the W3BB ecosystem.',
  },
  {
    icon: Sparkles,
    title: 'Priority access',
    body: 'First access to new tools, partner programs, and enterprise pilots as they roll out.',
  },
] as const;

/**
 * Example private page gated to wallets holding a W3BB Franchise Bundle
 * NFT. Demonstrates useFranchiseBundleAccess + RequireFranchiseBundle
 * end-to-end. Pure access control — the NFT works like a keycard here, not
 * an investment.
 */
const PartnerNetwork: React.FC = () => {
  usePageMeta(
    'Partner Network',
    'Private updates and resources for W3BB Franchise Bundle holders.',
  );

  return (
    <PageShell>
      <section className="relative scroll-mt-24 py-28 pt-36 sm:py-32 sm:pt-40">
        <div className="container">
          <SectionHeading
            label="FRANCHISE BUNDLE HOLDERS"
            heading="Partner Network"
            intro="Private updates and resources for wallets holding a W3BB Franchise Bundle NFT — your keycard into the network."
          />

          <div className="mt-14">
            <RequireFranchiseBundle>
              <div className="mx-auto max-w-4xl">
                <Reveal className="glass relative overflow-hidden p-6 sm:p-9">
                  <span
                    className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet/15 blur-3xl"
                    aria-hidden="true"
                  />
                  <h3 className="relative font-display text-lg font-semibold text-white">
                    Welcome to the Partner Network
                  </h3>
                  <p className="relative mt-2 text-sm text-white/60">
                    Your wallet holds a Franchise Bundle NFT, so you're in. This is where certified
                    partners get updates and resources that aren't published anywhere else.
                  </p>
                </Reveal>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  {RESOURCES.map((item, i) => (
                    <Reveal key={item.title} delay={i * 60}>
                      <div className="glass h-full p-6">
                        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/[0.06] ring-1 ring-inset ring-white/10">
                          <item.icon className="h-5 w-5 text-cyan" strokeWidth={1.5} aria-hidden="true" />
                        </span>
                        <h4 className="mt-4 font-display text-base font-semibold text-white">
                          {item.title}
                        </h4>
                        <p className="mt-1.5 text-sm text-white/60">{item.body}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </RequireFranchiseBundle>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default PartnerNetwork;
