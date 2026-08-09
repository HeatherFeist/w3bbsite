import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, base, sepolia } from 'wagmi/chains';

// Get a free Project ID at https://cloud.walletconnect.com and set it as
// VITE_WALLETCONNECT_PROJECT_ID in your .env (see .env.example). Without it,
// browser wallets like MetaMask still connect fine — only the WalletConnect
// QR-code flow (for mobile wallets) needs a real project ID.
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? '';

export const wagmiConfig = getDefaultConfig({
  appName: 'W3BB Worldwide',
  projectId: projectId || 'MISSING_WALLETCONNECT_PROJECT_ID',
  chains: [polygon, base, mainnet, sepolia],
  ssr: false,
});

export const hasWalletConnectProjectId = Boolean(projectId);
