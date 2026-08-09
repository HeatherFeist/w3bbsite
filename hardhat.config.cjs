require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

// Deploy configuration for the W3BB Franchise Bundle NFT contract.
// This is a separate toolchain from the Vite site (npm run dev/build) and
// does not affect it — `contracts/`, `scripts/`, `test/`, and this file are
// never imported into src/, so they're not bundled into the website.
//
// Usage:
//   npx hardhat compile
//   npx hardhat test
//   npx hardhat run scripts/deploy.js --network sepolia
//
// Required env vars for a real deploy (see .env.example):
//   DEPLOYER_PRIVATE_KEY   — the wallet that pays gas and becomes the
//                            contract owner. NEVER commit a real key.
//   SEPOLIA_RPC_URL / POLYGON_RPC_URL / BASE_RPC_URL / MAINNET_RPC_URL
//   NFT_TREASURY_ADDRESS   — receives mint proceeds + resale royalties
//   ETHERSCAN_API_KEY / POLYGONSCAN_API_KEY (optional, for `--verify`)

const accounts = process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [];

module.exports = {
  solidity: {
    version: '0.8.24',
    settings: {
      evmVersion: 'cancun',
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com',
      accounts,
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
      accounts,
    },
    base: {
      url: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
      accounts,
    },
    mainnet: {
      url: process.env.MAINNET_RPC_URL || '',
      accounts,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || '',
      polygon: process.env.POLYGONSCAN_API_KEY || '',
      base: process.env.BASESCAN_API_KEY || '',
      mainnet: process.env.ETHERSCAN_API_KEY || '',
    },
  },
};
