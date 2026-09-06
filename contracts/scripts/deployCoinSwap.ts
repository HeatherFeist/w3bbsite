import { network } from 'hardhat';
import { ethers, run } from 'hardhat';

/**
 * Deploys the W3BBCoinSwap escrow trading contract. It takes no
 * constructor parameters — the same instance can be used to create orders
 * between any ERC-20 tokens (e.g. any two W3BBBusinessCoin deployments).
 *
 * ============================================================================
 * NOT CLEARED FOR REAL/MAINNET LAUNCH — TESTNET ONLY, PENDING LEGAL REVIEW.
 * See contracts/BUSINESS_COIN_README.md before running this anywhere.
 * ============================================================================
 *
 * Run with: npm run deploy:swap:amoy   (testnet — the only supported target
 * right now)
 *
 * Mainnet/real-network safety: this script refuses to run against any
 * network it does not recognize as a known testnet unless you also set
 * I_CONFIRM_THIS_IS_NOT_A_REAL_LAUNCH=true, which the project owner should
 * only ever do after legal clearance for a specific real deployment.
 */

const KNOWN_TESTNETS = new Set(['polygonAmoy', 'hardhat', 'localhost']);

async function main() {
  assertSafeToDeploy();

  console.log(`Network: ${network.name}`);

  const Factory = await ethers.getContractFactory('W3BBCoinSwap');
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`\nW3BBCoinSwap deployed to: ${address}`);
  console.log('\nThis is a testnet deployment for simulating trading between');
  console.log('business coins. Do not wire it into any real purchase/payment');
  console.log('flow — see contracts/BUSINESS_COIN_README.md.');

  if (process.env.POLYGONSCAN_API_KEY && network.name !== 'hardhat' && network.name !== 'localhost') {
    console.log('\nWaiting for block confirmations before verifying...');
    const deployTx = contract.deploymentTransaction();
    if (deployTx) await deployTx.wait(5);

    try {
      await run('verify:verify', { address, constructorArguments: [] });
      console.log('Verified on Polygonscan.');
    } catch (err) {
      console.warn('Verification failed (you can retry manually later):', err);
    }
  }
}

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

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
