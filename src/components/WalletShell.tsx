import '@rainbow-me/rainbowkit/styles.css';
import React from 'react';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '@/lib/wagmi';

const rainbowKitTheme = darkTheme({
  accentColor: '#6b4e9e',
  accentColorForeground: '#FFFFFF',
  borderRadius: 'large',
  overlayBlur: 'small',
});

/** Wallet libraries load only with the mint and partner-network routes. */
export const WalletShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <WagmiProvider config={wagmiConfig}>
    <RainbowKitProvider theme={rainbowKitTheme}>{children}</RainbowKitProvider>
  </WagmiProvider>
);

export default WalletShell;
