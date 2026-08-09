# Franchise Bundle NFT contract

`FranchiseBundle.sol` is an ERC-721 (+ ERC-2981 perpetual resale royalty)
backing the "Mint a Franchise Bundle" flow on `/mint`. It's a separate
toolchain from the website (Hardhat, not Vite) — nothing under `contracts/`,
`scripts/`, or `test/` is bundled into the site; the site only reads the
**deployed contract address** once you give it one.

## What it does

- `mint(string tokenURI)` — anyone can mint a bundle for `mintPrice` (owner-settable, defaults to free/0)
- Enforces an optional `maxSupply` (0 = uncapped)
- Pays an 8% perpetual resale royalty (ERC-2981) to a `treasury` address — matches the "8% perpetual" copy already on the site
- Owner (you) can update price, supply cap, treasury, and royalty after deploy, and `withdraw()` collected proceeds

## 1. Configure

Copy the deploy-related variables from `.env.example` into `.env` and fill in:

- `DEPLOYER_PRIVATE_KEY` — the wallet that pays gas and becomes the contract owner. **Use a wallet dedicated to this, not your main one, and never commit this value.**
- `NFT_TREASURY_ADDRESS` — receives mint proceeds and resale royalties
- An RPC URL for whichever network you're deploying to (public defaults are filled in, but get your own from Alchemy/Infura for anything beyond testing)

## 2. Compile & test

```bash
npx hardhat compile
npx hardhat test
```

(Both were validated to compile/pass while building this, but re-run them yourself before deploying — this sandbox's network policy blocks the Solidity compiler download, so `npx hardhat compile` couldn't be run here directly. The contract syntax was independently verified with `solc` instead.)

## 3. Deploy

Start on testnet — it's free and lets you click through the whole /mint flow safely:

```bash
npx hardhat run scripts/deploy.cjs --network sepolia
```

Get free Sepolia ETH from a faucet (e.g. `https://sepoliafaucet.com`) for the deployer wallet first.

When ready for a real launch, redeploy to a live network the same way:

```bash
npx hardhat run scripts/deploy.cjs --network polygon   # or: base, mainnet
```

## 4. Wire it into the site

The deploy script prints the deployed address. Set in your site's `.env` (and in your hosting provider's env vars for production):

```
VITE_NFT_CONTRACT_ADDRESS=0x...
VITE_NFT_CHAIN_ID=11155111   # 137 = Polygon, 8453 = Base, 1 = mainnet
```

`/mint` picks this up automatically — the waitlist form is replaced by the live mint flow (connect wallet → mint → view transaction / OpenSea link) the moment both are set. Leaving them blank keeps today's waitlist behavior, so this is safe to ship before you've deployed anything.

## 5. Metadata

Every mint currently points at the same placeholder metadata: `public/nft/franchise-bundle-metadata.json`, served from the site itself. Replace its contents with real bundle artwork/description, or move to per-bundle metadata (e.g. one JSON file per token, pinned to IPFS) before a real launch — see `DEFAULT_BUNDLE_METADATA_URI` in `src/lib/nft.ts`.

## 6. Verify (optional)

```bash
npx hardhat verify --network sepolia <address> <owner> <treasury> <maxSupply> <mintPrice> <royaltyBps>
```

(The deploy script prints the exact command with your values filled in.)
