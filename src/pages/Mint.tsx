import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Check, CheckCircle2, Loader2, Wallet, ArrowRight } from 'lucide-react';
import PageShell from '@/components/PageShell';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';
import BundleCard from '@/components/w3bb/BundleCard';
import { MARKETPLACE } from '@/data/site';
import { useLeadCapture } from '@/hooks/useLeadCapture';
import { usePageMeta } from '@/hooks/usePageMeta';
import { hasWalletConnectProjectId } from '@/lib/wagmi';
import { hasNftContract } from '@/lib/nft';
import MintFlow from '@/components/w3bb/MintFlow';
import HoneypotField from '@/components/HoneypotField';
import ConsentCheckbox from '@/components/ConsentCheckbox';

const fieldClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-base text-white placeholder:text-white/35 transition-colors duration-300 hover:border-white/20 focus:border-violet focus:bg-white/[0.06] focus:outline-none';

const Mint: React.FC = () => {
  usePageMeta(
    'Mint Your Franchise Bundle',
    'Connect your wallet and join the waitlist to mint your W3BB Franchise Bundle NFT.',
  );
  const { address, isConnected, chain } = useAccount();
  const { status, error, submit } = useLeadCapture();
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [consent, setConsent] = useState(false);

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading' || !address) return;
    await submit({
      name: email.split('@')[0] || 'Wallet holder',
      email,
      interest: 'Buying a Franchise Bundle',
      source: 'w3bb-mint-page',
      message: `Wallet: ${address}${chain ? ` on ${chain.name}` : ''}`,
      metadata: { walletAddress: address, chainId: chain?.id ?? null },
      honeypot,
    });
  };

  return (
    <PageShell>
      <section className="relative scroll-mt-24 py-28 pt-36 sm:py-32 sm:pt-40">
        <div className="container">
          <SectionHeading
            label={MARKETPLACE.label}
            heading="Mint Your Franchise Bundle"
            intro={MARKETPLACE.paragraph}
          />

          {!hasWalletConnectProjectId ? (
            <Reveal className="mx-auto mt-10 max-w-2xl">
              <p className="rounded-xl border border-gold/25 bg-gold/[0.06] px-4 py-3 text-center text-xs text-gold/90 sm:text-sm">
                Browser wallets like MetaMask work here already. Mobile WalletConnect support
                needs a free Project ID from cloud.walletconnect.com — see .env.example.
              </p>
            </Reveal>
          ) : null}

          <div className="mt-16 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <BundleCard statusLabel="Preview" />
              <dl className="glass mt-8 space-y-px overflow-hidden rounded-xl border border-white/10">
                {MARKETPLACE.includes.map((item) => (
                  <div key={item} className="flex items-center gap-3 bg-white/[0.03] px-4 py-2.5">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet to-cyan">
                      <Check className="h-3 w-3 text-white" strokeWidth={3} aria-hidden="true" />
                    </span>
                    <span className="text-sm text-white/80">{item}</span>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={100}>
              <div className="glass relative overflow-hidden p-6 sm:p-9">
                <span
                  className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan/15 blur-3xl"
                  aria-hidden="true"
                />

                <div className="relative flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/[0.06] ring-1 ring-inset ring-white/10">
                    <Wallet className="h-5 w-5 text-cyan" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-white">
                      Step 1 — Connect your wallet
                    </h3>
                    <p className="text-sm text-white/60">Any EVM wallet works: MetaMask, Coinbase, Rainbow.</p>
                  </div>
                </div>

                <div className="relative mt-6">
                  <ConnectButton showBalance={false} />
                </div>

                {hasNftContract ? (
                  <MintFlow />
                ) : (
                  <div className="relative mt-10 border-t border-white/10 pt-8">
                    <h3 className="font-display text-lg font-semibold text-white">
                      Step 2 — Join the mint waitlist
                    </h3>
                    <p className="mt-1 text-sm text-white/60">
                      The Franchise Bundle minting contract is finishing certification. Connect your
                      wallet and leave an email so we can notify you the moment it opens.
                    </p>

                    {!isConnected ? (
                      <p className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/50">
                        Connect a wallet above to continue.
                      </p>
                    ) : status === 'success' ? (
                      <div className="mt-5 flex items-start gap-3 rounded-lg border border-cyan/30 bg-cyan/[0.06] px-4 py-3.5">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan" strokeWidth={1.5} aria-hidden="true" />
                        <p className="text-sm text-white/85">
                          You're on the list. We'll email {email} and reach out to wallet{' '}
                          <span className="font-mono text-xs text-white/60">
                            {address?.slice(0, 6)}…{address?.slice(-4)}
                          </span>{' '}
                          as soon as minting opens.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleNotify} className="mt-5 space-y-3">
                        <HoneypotField value={honeypot} onChange={setHoneypot} />
                        <div className="flex flex-col gap-3 sm:flex-row">
                          <input
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@company.com"
                            className={fieldClass}
                          />
                          <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="cta-primary group inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-3.5 font-display text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {status === 'loading' ? (
                              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            ) : (
                              <>
                                Notify Me
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                              </>
                            )}
                          </button>
                        </div>
                        <ConsentCheckbox id="mint-consent" checked={consent} onChange={setConsent} />
                      </form>
                    )}

                    {status === 'error' ? (
                      <p role="alert" className="mt-3 text-sm text-red-300">
                        {error}
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default Mint;
