import { ethers, network, run } from 'hardhat';

/**
 * Deploys W3BBFranchiseBundle using parameters from environment variables.
 * Run with: npm run deploy:polygon   (or deploy:amoy for the testnet dry run)
 *
 * Required env vars (see .env.example):
 *   DEPLOYER_PRIVATE_KEY  — the wallet that signs the deploy transaction
 *   INITIAL_ADMIN_ADDRESS — wallet that receives DEFAULT_ADMIN_ROLE + MINTER_ROLE
 *   ROYALTY_RECEIVER_ADDRESS — wallet that receives resale royalty payouts
 *   ROYALTY_FEE_BPS       — royalty fee in basis points, e.g. 500 = 5%
 *   MAX_SUPPLY            — maximum number of bundles that can ever be minted
 */
async function main() {
  const initialAdmin = requireEnv('INITIAL_ADMIN_ADDRESS');
  const royaltyReceiver = requireEnv('ROYALTY_RECEIVER_ADDRESS');
  const royaltyFeeBps = Number(process.env.ROYALTY_FEE_BPS ?? '500');
  const maxSupply = Number(process.env.MAX_SUPPLY ?? '10000');

  if (!ethers.isAddress(initialAdmin)) throw new Error('INITIAL_ADMIN_ADDRESS is not a valid address');
  if (!ethers.isAddress(royaltyReceiver)) throw new Error('ROYALTY_RECEIVER_ADDRESS is not a valid address');
  if (royaltyFeeBps < 0 || royaltyFeeBps > 10_000) throw new Error('ROYALTY_FEE_BPS must be between 0 and 10000');
  if (maxSupply <= 0) throw new Error('MAX_SUPPLY must be greater than 0');

  console.log(`Network: ${network.name}`);
  console.log('Deploy parameters:');
  console.log(`  initialAdmin:     ${initialAdmin}`);
  console.log(`  royaltyReceiver:  ${royaltyReceiver}`);
  console.log(`  royaltyFeeBps:    ${royaltyFeeBps} (${(royaltyFeeBps / 100).toFixed(2)}%)`);
  console.log(`  maxSupply:        ${maxSupply}`);

  const Factory = await ethers.getContractFactory('W3BBFranchiseBundle');
  const contract = await Factory.deploy(initialAdmin, royaltyReceiver, royaltyFeeBps, maxSupply);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`\nW3BBFranchiseBundle deployed to: ${address}`);
  console.log('\nNext steps:');
  console.log(`  1. Set VITE_FRANCHISE_BUNDLE_CONTRACT_ADDRESS=${address} in the site's .env`);
  console.log('  2. Verify the contract on Polygonscan (see README.md).');

  if (process.env.POLYGONSCAN_API_KEY && network.name !== 'hardhat') {
    console.log('\nWaiting for block confirmations before verifying...');
    const deployTx = contract.deploymentTransaction();
    if (deployTx) await deployTx.wait(5);

    try {
      await run('verify:verify', {
        address,
        constructorArguments: [initialAdmin, royaltyReceiver, royaltyFeeBps, maxSupply],
      });
      console.log('Verified on Polygonscan.');
    } catch (err) {
      console.warn('Verification failed (you can retry manually later):', err);
    }
  }
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
