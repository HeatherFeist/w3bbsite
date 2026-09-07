import { ethers, network, run } from 'hardhat';

/**
 * Deploys a single W3BBBusinessCoin instance for one business, using
 * parameters from environment variables.
 *
 * ============================================================================
 * NOT CLEARED FOR REAL/MAINNET LAUNCH — TESTNET ONLY, PENDING LEGAL REVIEW.
 * See contracts/BUSINESS_COIN_README.md before running this anywhere.
 * ============================================================================
 *
 * Run with: npm run deploy:coin:amoy   (testnet — the only supported target
 * right now)
 *
 * Required env vars (see .env.example):
 *   DEPLOYER_PRIVATE_KEY  — the wallet that signs the deploy transaction
 *   COIN_NAME             — token name, e.g. "Example Business Coin"
 *   COIN_SYMBOL           — token symbol, e.g. "EXBIZ"
 *   COIN_DECIMALS         — number of decimals (default 18)
 *   COIN_INITIAL_ADMIN_ADDRESS — wallet that receives DEFAULT_ADMIN_ROLE + MINTER_ROLE
 *   COIN_MAX_SUPPLY       — max supply, in whole tokens (scaled by decimals for you)
 *
 * Mainnet/real-network safety: this script refuses to run against any
 * network it does not recognize as a known testnet unless you also set
 * I_CONFIRM_THIS_IS_NOT_A_REAL_LAUNCH=true, which the project owner should
 * only ever do after legal clearance for a specific real deployment.
 */

const KNOWN_TESTNETS = new Set(['polygonAmoy', 'hardhat', 'localhost']);

async function main() {
  assertSafeToDeploy();

  const coinName = requireEnv('COIN_NAME');
  const coinSymbol = requireEnv('COIN_SYMBOL');
  const decimals = Number(process.env.COIN_DECIMALS ?? '18');
  const initialAdmin = requireEnv('COIN_INITIAL_ADMIN_ADDRESS');
  const maxSupplyWhole = requireEnv('COIN_MAX_SUPPLY');

  if (!ethers.isAddress(initialAdmin)) throw new Error('COIN_INITIAL_ADMIN_ADDRESS is not a valid address');
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 255) {
    throw new Error('COIN_DECIMALS must be an integer between 0 and 255');
  }
  const maxSupply = ethers.parseUnits(maxSupplyWhole, decimals);
  if (maxSupply <= 0n) throw new Error('COIN_MAX_SUPPLY must be greater than 0');

  console.log(`Network: ${network.name}`);
  console.log('Deploy parameters:');
  console.log(`  name:          ${coinName}`);
  console.log(`  symbol:        ${coinSymbol}`);
  console.log(`  decimals:      ${decimals}`);
  console.log(`  initialAdmin:  ${initialAdmin}`);
  console.log(`  maxSupply:     ${maxSupplyWhole} (${maxSupply} smallest units)`);

  const Factory = await ethers.getContractFactory('W3BBBusinessCoin');
  const contract = await Factory.deploy(coinName, coinSymbol, decimals, initialAdmin, maxSupply);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`\nW3BBBusinessCoin deployed to: ${address}`);
  console.log('\nThis is a testnet deployment. Do not treat this token as having real');
  console.log('value, and do not wire it into any real purchase or payment flow — see');
  console.log('contracts/BUSINESS_COIN_README.md.');

  if (process.env.POLYGONSCAN_API_KEY && network.name !== 'hardhat' && network.name !== 'localhost') {
    console.log('\nWaiting for block confirmations before verifying...');
    const deployTx = contract.deploymentTransaction();
    if (deployTx) await deployTx.wait(5);

    try {
      await run('verify:verify', {
        address,
        constructorArguments: [coinName, coinSymbol, decimals, initialAdmin, maxSupply],
      });
      console.log('Verified on Polygonscan.');
    } catch (err) {
      console.warn('Verification failed (you can retry manually later):', err);
    }
  }
}

/**
 * Refuses to proceed if the target network is not a recognized testnet
 * (or the local Hardhat network), unless the operator has explicitly
 * acknowledged this is not a real launch via an env var. This is the
 * "deploying to mainnet by accident should be genuinely hard" safeguard
 * called for while this feature is on legal hold.
 */
function assertSafeToDeploy() {
  if (KNOWN_TESTNETS.has(network.name)) return;

  const confirmed = process.env.I_CONFIRM_THIS_IS_NOT_A_REAL_LAUNCH === 'true';
  console.warn('=============================================================');
  console.warn(`WARNING: target network "${network.name}" is not a recognized testnet.`);
  console.warn('The W3BB Business Coin and Coin Swap contracts are NOT yet');
  console.warn('cleared for real/mainnet launch — this feature is on legal hold');
  console.warn('pending securities-law review. See contracts/BUSINESS_COIN_README.md.');
  console.warn('=============================================================');

  if (!confirmed) {
    throw new Error(
      `Refusing to deploy to "${network.name}": this is not a recognized testnet, and ` +
        'I_CONFIRM_THIS_IS_NOT_A_REAL_LAUNCH=true was not set. If you have received explicit ' +
        'legal clearance for a real deployment and mean to do this deliberately, set that env ' +
        'var and re-run. Otherwise, use the polygonAmoy testnet.',
    );
  }

  console.warn(
    'I_CONFIRM_THIS_IS_NOT_A_REAL_LAUNCH=true is set — proceeding anyway. Make sure this is ' +
      'genuinely deliberate and that legal clearance has actually been obtained.',
  );
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name} (see .env.example)`);
  return value;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
