import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { polygon } from 'wagmi/chains';
import { CheckCircle2, Loader2, ShieldCheck, ShieldAlert, Wallet, ArrowUpRight } from 'lucide-react';
import PageShell from '@/components/PageShell';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';
import { usePageMeta } from '@/hooks/usePageMeta';
import { hasWalletConnectProjectId } from '@/lib/wagmi';
import { FRANCHISE_BUNDLE_ABI, FRANCHISE_BUNDLE_CONTRACT_ADDRESS, hasFranchiseBundleContract } from '@/lib/contract';

const fieldClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-base text-white placeholder:text-white/35 transition-colors duration-300 hover:border-white/20 focus:border-violet focus:bg-white/[0.06] focus:outline-none';

const labelClass = 'block font-display text-sm font-medium text-white/75';

/**
 * Internal tool: mints a Franchise Bundle NFT to a certified business
 * owner's wallet. Not linked from public navigation — the contract itself
 * enforces that only a wallet holding MINTER_ROLE can actually mint, so
 * this page is safe even if someone finds the URL: everyone else's
 * transaction will simply revert on-chain.
 */
const AdminMint: React.FC = () => {
  usePageMeta('Mint a Franchise Bundle (Admin)', 'Internal tool for minting certified Franchise Bundle NFTs.');

  const { address, isConnected, chain } = useAccount();
  const [recipient, setRecipient] = useState('');
  const [tokenUri, setTokenUri] = useState('');

  const contractAddress = hasFranchiseBundleContract ? (FRANCHISE_BUNDLE_CONTRACT_ADDRESS as `0x${string}`) : undefined;

  const { data: minterRole } = useReadContract({
    address: contractAddress,
    abi: FRANCHISE_BUNDLE_ABI,
    functionName: 'MINTER_ROLE',
    query: { enabled: Boolean(contractAddress) },
  });

  const {
    data: isMinter,
    isLoading: isCheckingRole,
    refetch: refetchIsMinter,
  } = useReadContract({
    address: contractAddress,
    abi: FRANCHISE_BUNDLE_ABI,
    functionName: 'hasRole',
    args: minterRole && address ? [minterRole, address] : undefined,
    query: { enabled: Boolean(contractAddress && minterRole && address) },
  });

  const { data: totalMinted } = useReadContract({
    address: contractAddress,
    abi: FRANCHISE_BUNDLE_ABI,
    functionName: 'totalMinted',
    query: { enabled: Boolean(contractAddress) },
  });

  const { data: maxSupply } = useReadContract({
    address: contractAddress,
    abi: FRANCHISE_BUNDLE_ABI,
    functionName: 'maxSupply',
    query: { enabled: Boolean(contractAddress) },
  });

  const { writeContract, data: txHash, isPending: isSubmitting, error: writeError, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

  const onWrongChain = isConnected && chain?.id !== polygon.id;
  const canAttemptMint = Boolean(contractAddress) && isConnected && isMinter === true && !onWrongChain;

  const handleMint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractAddress || !canAttemptMint) return;
    writeContract({
      address: contractAddress,
      abi: FRANCHISE_BUNDLE_ABI,
      functionName: 'safeMint',
      args: [recipient as `0x${string}`, tokenUri],
      chainId: polygon.id,
    });
  };

  const startOver = () => {
    setRecipient('');
    setTokenUri('');
    reset();
    refetchIsMinter();
  };

  return (
    <PageShell>
      <section className="relative scroll-mt-24 py-28 pt-36 sm:py-32 sm:pt-40">
        <div className="container">
          <SectionHeading
            label="INTERNAL TOOL"
            heading="Mint a Franchise Bundle"
            intro="Mint a Franchise Bundle NFT to a certified business owner's wallet. Only wallets holding MINTER_ROLE on the contract can do this — everyone else's transaction reverts."
          />

          <Reveal className="mx-auto mt-14 max-w-xl">
            <div className="glass relative overflow-hidden p-6 sm:p-9">
              {!hasFranchiseBundleContract ? (
                <p className="rounded-xl border border-gold/25 bg-gold/[0.06] px-4 py-3 text-center text-xs text-gold/90 sm:text-sm">
                  No contract configured yet. Set VITE_FRANCHISE_BUNDLE_CONTRACT_ADDRESS after
                  deploying — see /contracts/README.md.
                </p>
              ) : (
                <>
                  {!hasWalletConnectProjectId ? (
                    <p className="mb-6 rounded-xl border border-gold/25 bg-gold/[0.06] px-4 py-3 text-center text-xs text-gold/90 sm:text-sm">
                      Browser wallets like MetaMask work here already. Mobile WalletConnect support
                      needs a free Project ID — see .env.example.
                    </p>
                  ) : null}

                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/[0.06] ring-1 ring-inset ring-white/10">
                      <Wallet className="h-5 w-5 text-cyan" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-white">Step 1 — Connect your admin wallet</h3>
                      <p className="text-sm text-white/60">Must hold MINTER_ROLE on Polygon mainnet.</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <ConnectButton showBalance={false} />
                  </div>

                  {isConnected ? (
                    <div className="mt-6 space-y-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm">
                      {onWrongChain ? (
                        <p className="flex items-start gap-2 text-gold/90">
                          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                          Switch your wallet to Polygon mainnet to continue.
                        </p>
                      ) : isCheckingRole ? (
                        <p className="flex items-center gap-2 text-white/60">
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          Checking MINTER_ROLE on-chain…
                        </p>
                      ) : isMinter ? (
                        <p className="flex items-start gap-2 text-cyan">
                          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                          This wallet holds MINTER_ROLE. You can mint below.
                        </p>
                      ) : (
                        <p className="flex items-start gap-2 text-red-300">
                          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                          This wallet does not hold MINTER_ROLE — minting will revert.
                        </p>
                      )}
                      {totalMinted !== undefined && maxSupply !== undefined ? (
                        <p className="text-white/50">
                          {totalMinted.toString()} / {maxSupply.toString()} bundles minted
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="mt-10 border-t border-white/10 pt-8">
                    <h3 className="font-display text-lg font-semibold text-white">Step 2 — Mint</h3>
                    <p className="mt-1 text-sm text-white/60">
                      Mint to the certified business owner's wallet, using the metadata URI for their
                      Franchise Bundle (e.g. an IPFS URI).
                    </p>

                    {isConfirmed ? (
                      <div className="mt-5 space-y-4">
                        <div className="flex items-start gap-3 rounded-lg border border-cyan/30 bg-cyan/[0.06] px-4 py-3.5">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan" strokeWidth={1.5} aria-hidden="true" />
                          <p className="text-sm text-white/85">
                            Minted to{' '}
                            <span className="font-mono text-xs text-white/60">
                              {recipient.slice(0, 6)}…{recipient.slice(-4)}
                            </span>
                            .{' '}
                            <a
                              href={`https://polygonscan.com/tx/${txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-cyan underline-offset-4 hover:underline"
                            >
                              View on Polygonscan
                              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                            </a>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={startOver}
                          className="glass-soft rounded-full px-6 py-3 font-display text-sm font-semibold text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white"
                        >
                          Mint another
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleMint} className="mt-5 space-y-4">
                        <div>
                          <label htmlFor="mint-recipient" className={labelClass}>
                            Recipient wallet address
                          </label>
                          <input
                            id="mint-recipient"
                            required
                            pattern="^0x[a-fA-F0-9]{40}$"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            placeholder="0x…"
                            className={`${fieldClass} mt-2 font-mono text-sm`}
                          />
                        </div>
                        <div>
                          <label htmlFor="mint-uri" className={labelClass}>
                            Metadata URI
                          </label>
                          <input
                            id="mint-uri"
                            required
                            value={tokenUri}
                            onChange={(e) => setTokenUri(e.target.value)}
                            placeholder="ipfs://…"
                            className={`${fieldClass} mt-2 font-mono text-sm`}
                          />
                        </div>

                        {writeError ? (
                          <p role="alert" className="text-sm text-red-300">
                            {writeError.message}
                          </p>
                        ) : null}

                        <button
                          type="submit"
                          disabled={!canAttemptMint || isSubmitting || isConfirming}
                          className="cta-primary group inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 font-display text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {isSubmitting || isConfirming ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                              {isSubmitting ? 'Confirm in wallet…' : 'Minting…'}
                            </>
                          ) : (
                            'Mint Franchise Bundle'
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
};

export default AdminMint;
