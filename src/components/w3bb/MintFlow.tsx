import React, { useEffect, useState } from 'react';
import { useAccount, useReadContract, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { formatEther } from 'viem';
import { CheckCircle2, ExternalLink, Loader2, Sparkles } from 'lucide-react';
import {
  DEFAULT_BUNDLE_METADATA_URI,
  franchiseBundleAbi,
  NFT_CONTRACT_ADDRESS,
  nftChain,
  openSeaUrl,
  txExplorerUrl,
} from '@/lib/nft';

/**
 * Live on-chain mint flow for the Franchise Bundle NFT. Only rendered from
 * Mint.tsx when `hasNftContract` is true (i.e. VITE_NFT_CONTRACT_ADDRESS is
 * set) — until then the page shows the waitlist form instead.
 */
export const MintFlow: React.FC = () => {
  const { address, isConnected, chain } = useAccount();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const onWrongNetwork = isConnected && chain?.id !== nftChain.id;

  // MintFlow only ever mounts when hasNftContract is true (see Mint.tsx),
  // so the address is guaranteed non-empty here.
  const contractAddress = NFT_CONTRACT_ADDRESS as `0x${string}`;
  const contract = { address: contractAddress, abi: franchiseBundleAbi } as const;

  const { data: mintPrice } = useReadContract({
    ...contract,
    functionName: 'mintPrice',
    query: { enabled: !onWrongNetwork },
  });
  const { data: totalSupply, refetch: refetchSupply } = useReadContract({
    ...contract,
    functionName: 'totalSupply',
    query: { enabled: !onWrongNetwork },
  });
  const { data: maxSupply } = useReadContract({
    ...contract,
    functionName: 'maxSupply',
    query: { enabled: !onWrongNetwork },
  });

  const soldOut = Boolean(maxSupply && maxSupply > 0n && totalSupply !== undefined && totalSupply >= maxSupply);

  const { writeContract, data: hash, isPending, error: writeError, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } = useWaitForTransactionReceipt({ hash });

  const [mintedTokenId, setMintedTokenId] = useState<bigint | null>(null);

  useEffect(() => {
    if (!isConfirmed || !receipt) return;
    refetchSupply();
    const mintedLog = receipt.logs.find((log) => log.topics.length === 3);
    if (mintedLog?.topics[2]) {
      try {
        setMintedTokenId(BigInt(mintedLog.topics[2]));
      } catch {
        /* ignore — token id is cosmetic here */
      }
    }
  }, [isConfirmed, receipt, refetchSupply]);

  const handleMint = () => {
    if (!address) return;
    reset();
    setMintedTokenId(null);
    writeContract({
      ...contract,
      functionName: 'mint',
      args: [DEFAULT_BUNDLE_METADATA_URI],
      value: mintPrice ?? 0n,
      chain: nftChain,
      account: address,
    });
  };

  const priceLabel =
    mintPrice === undefined ? '…' : mintPrice === 0n ? 'Free' : `${formatEther(mintPrice)} ${nftChain.nativeCurrency.symbol}`;

  return (
    <div className="relative mt-10 border-t border-white/10 pt-8">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/[0.06] ring-1 ring-inset ring-white/10">
          <Sparkles className="h-5 w-5 text-gold" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-display text-lg font-semibold text-white">Step 2 — Mint your bundle</h3>
          <p className="text-sm text-white/60">
            {priceLabel} on {nftChain.name}
            {maxSupply !== undefined && maxSupply > 0n ? ` · ${totalSupply ?? '…'}/${maxSupply} minted` : null}
          </p>
        </div>
      </div>

      <div className="mt-5">
        {!isConnected ? (
          <p className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/50">
            Connect a wallet above to continue.
          </p>
        ) : onWrongNetwork ? (
          <div className="rounded-lg border border-gold/25 bg-gold/[0.06] px-4 py-3.5">
            <p className="text-sm text-white/85">
              Switch your wallet to <span className="font-semibold text-white">{nftChain.name}</span> to mint.
            </p>
            <button
              type="button"
              onClick={() => switchChain({ chainId: nftChain.id })}
              disabled={isSwitching}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/15 disabled:opacity-60"
            >
              {isSwitching ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              Switch to {nftChain.name}
            </button>
          </div>
        ) : soldOut ? (
          <p className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
            All Franchise Bundles have been minted.
          </p>
        ) : isConfirmed ? (
          <div className="flex flex-col gap-3 rounded-lg border border-cyan/30 bg-cyan/[0.06] px-4 py-3.5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan" strokeWidth={1.5} aria-hidden="true" />
              <p className="text-sm text-white/85">
                Minted{mintedTokenId !== null ? ` — Bundle #${mintedTokenId.toString()}` : ''} to{' '}
                <span className="font-mono text-xs text-white/60">
                  {address?.slice(0, 6)}…{address?.slice(-4)}
                </span>
                .
              </p>
            </div>
            <div className="flex flex-wrap gap-4 pl-8 text-xs">
              {hash ? (
                <a
                  href={txExplorerUrl(nftChain.id, hash)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-cyan hover:underline"
                >
                  View transaction <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              ) : null}
              {mintedTokenId !== null && openSeaUrl(nftChain.id, NFT_CONTRACT_ADDRESS, mintedTokenId) ? (
                <a
                  href={openSeaUrl(nftChain.id, NFT_CONTRACT_ADDRESS, mintedTokenId) ?? undefined}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-cyan hover:underline"
                >
                  View on OpenSea <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={handleMint}
              disabled={isPending || isConfirming}
              className="cta-primary group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-display text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending || isConfirming ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : null}
              {isPending ? 'Confirm in wallet…' : isConfirming ? 'Minting…' : `Mint for ${priceLabel}`}
            </button>
            {writeError ? (
              <p role="alert" className="mt-3 text-sm text-red-300">
                {writeError.message.split('\n')[0]}
              </p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default MintFlow;
