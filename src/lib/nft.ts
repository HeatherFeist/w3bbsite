import { mainnet, polygon, base, sepolia } from 'wagmi/chains';

/**
 * Franchise Bundle NFT (contracts/FranchiseBundle.sol) wiring.
 *
 * Nothing here goes live until VITE_NFT_CONTRACT_ADDRESS is set — until
 * then `hasNftContract` is false and /mint keeps showing the waitlist form.
 * See contracts/README.md for how to deploy and fill these in.
 */

const rawAddress = (import.meta.env.VITE_NFT_CONTRACT_ADDRESS ?? '').trim();

export const NFT_CONTRACT_ADDRESS = (
  /^0x[a-fA-F0-9]{40}$/.test(rawAddress) ? rawAddress : ''
) as `0x${string}` | '';

export const hasNftContract = Boolean(NFT_CONTRACT_ADDRESS);

// Matches wagmiConfig's chain list exactly (src/lib/wagmi.ts) so nftChain.id
// stays in the literal union wagmi's hooks (useSwitchChain, etc.) expect.
const SUPPORTED_CHAINS = {
  [mainnet.id]: mainnet,
  [polygon.id]: polygon,
  [base.id]: base,
  [sepolia.id]: sepolia,
} as const;

const parsedChainId = Number(import.meta.env.VITE_NFT_CHAIN_ID ?? '');

/** Chain the contract is deployed on. Defaults to Sepolia (testnet) until configured. */
export const nftChain =
  SUPPORTED_CHAINS[parsedChainId as keyof typeof SUPPORTED_CHAINS] ?? sepolia;

/** Placeholder ERC-721 metadata used for every mint until real per-bundle
 *  metadata (brand kit, product catalog, etc.) is generated at mint time.
 *  Host real JSON at this path (or swap in an ipfs:// URI) — see
 *  public/nft/franchise-bundle-metadata.json. */
export const DEFAULT_BUNDLE_METADATA_URI =
  typeof window !== 'undefined'
    ? `${window.location.origin}/nft/franchise-bundle-metadata.json`
    : 'https://w3bbworldwide.com/nft/franchise-bundle-metadata.json';

function explorerBase(chainId: number): string {
  switch (chainId) {
    case polygon.id:
      return 'https://polygonscan.com';
    case base.id:
      return 'https://basescan.org';
    case sepolia.id:
      return 'https://sepolia.etherscan.io';
    case mainnet.id:
    default:
      return 'https://etherscan.io';
  }
}

export function txExplorerUrl(chainId: number, hash: string): string {
  return `${explorerBase(chainId)}/tx/${hash}`;
}

function openSeaSlug(chainId: number): string | null {
  switch (chainId) {
    case mainnet.id:
      return 'ethereum';
    case polygon.id:
      return 'matic';
    case base.id:
      return 'base';
    case sepolia.id:
      return 'sepolia';
    default:
      return null;
  }
}

export function openSeaUrl(chainId: number, contractAddress: string, tokenId: bigint): string | null {
  const slug = openSeaSlug(chainId);
  if (!slug) return null;
  const host = chainId === sepolia.id ? 'testnets.opensea.io' : 'opensea.io';
  return `https://${host}/assets/${slug}/${contractAddress}/${tokenId.toString()}`;
}

/** Minimal ABI — only the reads/writes the /mint page uses. Matches the
 *  deployed FranchiseBundle contract exactly (see contracts/FranchiseBundle.sol). */
export const franchiseBundleAbi = [
  {
    type: 'function',
    name: 'mint',
    stateMutability: 'payable',
    inputs: [{ name: 'tokenURI_', type: 'string' }],
    outputs: [{ name: 'tokenId', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'mintPrice',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'totalSupply',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'maxSupply',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'BundleMinted',
    inputs: [
      { name: 'to', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true },
      { name: 'tokenURI', type: 'string', indexed: false },
    ],
  },
] as const;
