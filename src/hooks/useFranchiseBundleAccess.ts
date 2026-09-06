import { useAccount, useReadContract } from 'wagmi';
import { FRANCHISE_BUNDLE_ABI, FRANCHISE_BUNDLE_CONTRACT_ADDRESS, hasFranchiseBundleContract } from '@/lib/contract';

export type FranchiseBundleAccessStatus =
  /** No contract address configured yet — access gating isn't live. Not an error. */
  | 'not-configured'
  /** No wallet connected. */
  | 'disconnected'
  /** Wallet connected, on-chain ownership check in flight. */
  | 'checking'
  /** Wallet connected, ownership check failed (RPC/network issue, etc). */
  | 'error'
  /** Wallet connected and confirmed to hold the required token(s). */
  | 'granted'
  /** Wallet connected and confirmed NOT to hold the required token(s). */
  | 'denied';

export interface UseFranchiseBundleAccessOptions {
  /**
   * A specific token ID the wallet must own. Omit (default) to accept any
   * token from the Franchise Bundle collection — i.e. `balanceOf(wallet) > 0`.
   */
  tokenId?: bigint | number;
}

export interface UseFranchiseBundleAccessResult {
  status: FranchiseBundleAccessStatus;
  /** True only once ownership has been confirmed on-chain. */
  hasAccess: boolean;
  /** True while a connected wallet's on-chain ownership is being read. */
  isLoading: boolean;
  /** True when the contract address env var isn't set yet — matches AdminMint's pattern. */
  isConfigured: boolean;
  isConnected: boolean;
  address: `0x${string}` | undefined;
  error: Error | null;
  refetch: () => void;
}

/**
 * Gates access to a page/section by whether the connected wallet holds a
 * Franchise Bundle NFT. Pure utility/access-control check — a keycard, not
 * an investment mechanic.
 *
 * - By default (no `tokenId`), any token from the collection grants access
 *   via `balanceOf(address) > 0`.
 * - Pass `tokenId` to require ownership of one specific token via
 *   `ownerOf(tokenId) === address`.
 *
 * When no contract address is configured (VITE_FRANCHISE_BUNDLE_CONTRACT_ADDRESS
 * unset), this reports `status: 'not-configured'` rather than erroring —
 * the same "not yet active" handling AdminMint.tsx uses for the same case.
 */
export function useFranchiseBundleAccess(
  options: UseFranchiseBundleAccessOptions = {},
): UseFranchiseBundleAccessResult {
  const { tokenId } = options;
  const { address, isConnected } = useAccount();

  const contractAddress = hasFranchiseBundleContract
    ? (FRANCHISE_BUNDLE_CONTRACT_ADDRESS as `0x${string}`)
    : undefined;

  const enabled = Boolean(contractAddress && isConnected && address);

  const {
    data: balance,
    isLoading: isLoadingBalance,
    isError: isBalanceError,
    error: balanceError,
    refetch: refetchBalance,
  } = useReadContract({
    address: contractAddress,
    abi: FRANCHISE_BUNDLE_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: enabled && tokenId === undefined },
  });

  const {
    data: tokenOwner,
    isLoading: isLoadingOwner,
    isError: isOwnerError,
    error: ownerError,
    refetch: refetchOwner,
  } = useReadContract({
    address: contractAddress,
    abi: FRANCHISE_BUNDLE_ABI,
    functionName: 'ownerOf',
    args: tokenId !== undefined ? [BigInt(tokenId)] : undefined,
    query: { enabled: enabled && tokenId !== undefined },
  });

  const refetch = () => {
    if (tokenId !== undefined) {
      refetchOwner();
    } else {
      refetchBalance();
    }
  };

  if (!hasFranchiseBundleContract) {
    return {
      status: 'not-configured',
      hasAccess: false,
      isLoading: false,
      isConfigured: false,
      isConnected,
      address,
      error: null,
      refetch,
    };
  }

  if (!isConnected || !address) {
    return {
      status: 'disconnected',
      hasAccess: false,
      isLoading: false,
      isConfigured: true,
      isConnected,
      address,
      error: null,
      refetch,
    };
  }

  const isLoading = tokenId !== undefined ? isLoadingOwner : isLoadingBalance;
  const isError = tokenId !== undefined ? isOwnerError : isBalanceError;
  const readError = (tokenId !== undefined ? ownerError : balanceError) as Error | null;

  if (isLoading) {
    return {
      status: 'checking',
      hasAccess: false,
      isLoading: true,
      isConfigured: true,
      isConnected,
      address,
      error: null,
      refetch,
    };
  }

  if (isError) {
    // `ownerOf` reverts (ERC721NonexistentToken) for a token that hasn't
    // been minted — that's a legitimate "does not own it" answer, not a
    // real error, so treat it as denied rather than surfacing an error.
    if (tokenId !== undefined) {
      return {
        status: 'denied',
        hasAccess: false,
        isLoading: false,
        isConfigured: true,
        isConnected,
        address,
        error: null,
        refetch,
      };
    }
    return {
      status: 'error',
      hasAccess: false,
      isLoading: false,
      isConfigured: true,
      isConnected,
      address,
      error: readError,
      refetch,
    };
  }

  const hasAccess =
    tokenId !== undefined
      ? typeof tokenOwner === 'string' && tokenOwner.toLowerCase() === address.toLowerCase()
      : typeof balance === 'bigint' && balance > 0n;

  return {
    status: hasAccess ? 'granted' : 'denied',
    hasAccess,
    isLoading: false,
    isConfigured: true,
    isConnected,
    address,
    error: null,
    refetch,
  };
}

export default useFranchiseBundleAccess;
