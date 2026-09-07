import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link } from 'react-router-dom';
import { KeyRound, Loader2, ShieldAlert, Wallet } from 'lucide-react';
import Reveal from '@/components/w3bb/Reveal';
import { useFranchiseBundleAccess, type UseFranchiseBundleAccessOptions } from '@/hooks/useFranchiseBundleAccess';

interface RequireFranchiseBundleProps extends UseFranchiseBundleAccessOptions {
  children: React.ReactNode;
  /** Where the "learn more" link in the access-denied state points. Defaults to /mint. */
  learnMoreHref?: string;
}

const stateCardClass = 'glass relative mx-auto max-w-xl overflow-hidden p-8 text-center sm:p-10';

/**
 * Gates its children behind Franchise Bundle NFT ownership — a keycard, not
 * an investment mechanic. Shows a connect-wallet prompt, an "access not yet
 * active" notice (no contract deployed), or an access-denied message with a
 * link to mint, before finally rendering the protected content.
 */
export const RequireFranchiseBundle: React.FC<RequireFranchiseBundleProps> = ({
  children,
  tokenId,
  learnMoreHref = '/mint',
}) => {
  const { status, error } = useFranchiseBundleAccess({ tokenId });

  if (status === 'not-configured') {
    return (
      <Reveal className={stateCardClass}>
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gold/[0.1] ring-1 ring-inset ring-gold/25">
          <KeyRound className="h-6 w-6 text-gold" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <h3 className="mt-5 font-display text-xl font-semibold text-white">
          Access gating isn't active yet
        </h3>
        <p className="mt-2 text-sm text-white/60">
          This page will be gated to Franchise Bundle NFT holders once the minting contract is
          deployed. There's nothing to configure on your end — check back soon.
        </p>
      </Reveal>
    );
  }

  if (status === 'disconnected') {
    return (
      <Reveal className={stateCardClass}>
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.06] ring-1 ring-inset ring-white/10">
          <Wallet className="h-6 w-6 text-cyan" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <h3 className="mt-5 font-display text-xl font-semibold text-white">
          Connect your wallet to continue
        </h3>
        <p className="mt-2 text-sm text-white/60">
          This page is reserved for wallets holding a W3BB Franchise Bundle NFT. Connect your
          wallet to check access.
        </p>
        <div className="mt-6 flex justify-center">
          <ConnectButton showBalance={false} />
        </div>
      </Reveal>
    );
  }

  if (status === 'checking') {
    return (
      <Reveal className={stateCardClass}>
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.06] ring-1 ring-inset ring-white/10">
          <Loader2 className="h-6 w-6 animate-spin text-cyan" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <h3 className="mt-5 font-display text-xl font-semibold text-white">
          Checking wallet access…
        </h3>
        <p className="mt-2 text-sm text-white/60">Confirming Franchise Bundle ownership on-chain.</p>
      </Reveal>
    );
  }

  if (status === 'error') {
    return (
      <Reveal className={stateCardClass}>
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-500/[0.1] ring-1 ring-inset ring-red-400/25">
          <ShieldAlert className="h-6 w-6 text-red-300" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <h3 className="mt-5 font-display text-xl font-semibold text-white">
          Couldn't verify wallet access
        </h3>
        <p className="mt-2 text-sm text-white/60">
          {error?.message ?? 'Something went wrong reading the Franchise Bundle contract. Please try again.'}
        </p>
      </Reveal>
    );
  }

  if (status === 'denied') {
    return (
      <Reveal className={stateCardClass}>
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.06] ring-1 ring-inset ring-white/10">
          <KeyRound className="h-6 w-6 text-violet" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <h3 className="mt-5 font-display text-xl font-semibold text-white">
          This page requires a Franchise Bundle
        </h3>
        <p className="mt-2 text-sm text-white/60">
          Your connected wallet doesn't hold a W3BB Franchise Bundle NFT yet. Holding one unlocks
          this page — think of it as a keycard, not an investment.
        </p>
        <Link
          to={learnMoreHref}
          className="cta-primary mt-6 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display text-sm font-semibold text-white"
        >
          Learn about Franchise Bundles
        </Link>
      </Reveal>
    );
  }

  // status === 'granted'
  return <>{children}</>;
};

export default RequireFranchiseBundle;
