import { HardhatUserConfig, subtask } from 'hardhat/config';
import { TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD } from 'hardhat/builtin-tasks/task-names';
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';

dotenv.config();

// Hardhat normally downloads the solc compiler binary from
// binaries.soliditylang.org at compile time. Some sandboxed/CI environments
// block that host, so this points compilation at the solc-js build that
// ships inside the `solc` npm package instead (installed from the regular
// npm registry — no extra network access needed). Functionally identical,
// just slower than the native binary.
subtask(TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD).setAction(async (args: { solcVersion: string }, _hre, runSuper) => {
  if (args.solcVersion === '0.8.24') {
    return {
      compilerPath: require.resolve('solc/soljson.js'),
      isSolcJs: true,
      version: args.solcVersion,
      longVersion: `${args.solcVersion}-local`,
    };
  }
  return runSuper(args);
});

// Never commit a real private key. This reads from a local, gitignored .env
// file (see .env.example) — deployment must be run from your own machine
// with your own funded wallet.
const DEPLOYER_KEY = process.env.DEPLOYER_PRIVATE_KEY;
const accounts = DEPLOYER_KEY ? [DEPLOYER_KEY] : [];

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: 'cancun',
    },
  },
  networks: {
    hardhat: {},
    polygon: {
      url: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
      chainId: 137,
      accounts,
    },
    polygonAmoy: {
      // Free Polygon testnet — get test POL from a faucet before using this.
      url: process.env.POLYGON_AMOY_RPC_URL || 'https://rpc-amoy.polygon.technology',
      chainId: 80002,
      accounts,
    },
  },
  etherscan: {
    // Polygonscan is unified under the Etherscan v2 API as of 2025.
    apiKey: {
      polygon: process.env.POLYGONSCAN_API_KEY || '',
      polygonAmoy: process.env.POLYGONSCAN_API_KEY || '',
    },
  },
};

export default config;
