const hre = require('hardhat');

// Deploys FranchiseBundle with sane, safe-by-default launch parameters:
//   - mint price:  0 (free) — matches the site's current waitlist-stage copy
//   - max supply:  0 (uncapped) — set a real cap with setMaxSupply() before launch if desired
//   - royalty:     800 bps = 8%, matching the "8% perpetual" marketplace copy
//
// Override via env vars without editing this file:
//   NFT_TREASURY_ADDRESS   (required) — receives proceeds + royalties
//   NFT_MAX_SUPPLY         (default 0 = uncapped)
//   NFT_MINT_PRICE_WEI     (default 0 = free)
//   NFT_ROYALTY_BPS        (default 800 = 8%)
async function main() {
  const treasury = process.env.NFT_TREASURY_ADDRESS;
  if (!treasury) {
    throw new Error(
      'Set NFT_TREASURY_ADDRESS in your .env before deploying — this wallet receives mint proceeds and resale royalties.',
    );
  }

  const maxSupply = BigInt(process.env.NFT_MAX_SUPPLY || '0');
  const mintPrice = BigInt(process.env.NFT_MINT_PRICE_WEI || '0');
  const royaltyBps = Number(process.env.NFT_ROYALTY_BPS || '800');

  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying FranchiseBundle');
  console.log('  network       :', hre.network.name);
  console.log('  deployer/owner:', deployer.address);
  console.log('  treasury      :', treasury);
  console.log('  maxSupply     :', maxSupply.toString(), maxSupply === 0n ? '(uncapped)' : '');
  console.log('  mintPrice     :', mintPrice.toString(), 'wei');
  console.log('  royalty       :', royaltyBps, 'bps');

  const FranchiseBundle = await hre.ethers.getContractFactory('FranchiseBundle');
  const contract = await FranchiseBundle.deploy(
    deployer.address,
    treasury,
    maxSupply,
    mintPrice,
    royaltyBps,
  );
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log('\nFranchiseBundle deployed to:', address);
  console.log('\nNext steps:');
  console.log('  1. Set VITE_NFT_CONTRACT_ADDRESS=' + address + ' in your .env');
  console.log('  2. Set VITE_NFT_CHAIN_ID to match --network', hre.network.name);
  console.log(
    '  3. Verify (optional): npx hardhat verify --network ' +
      hre.network.name +
      ' ' +
      address +
      ' ' +
      deployer.address +
      ' ' +
      treasury +
      ' ' +
      maxSupply +
      ' ' +
      mintPrice +
      ' ' +
      royaltyBps,
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
