# W3BB Franchise Bundle — NFT smart contract

An ERC-721 contract representing certified W3BB Worldwide businesses as
"Franchise Bundle" NFTs, deployed on Polygon.

## How this contract works

- **Minting is gated, not public.** Only wallets holding `MINTER_ROLE` can
  mint. This matches the site's own flow — a business goes through the
  Business Builder and Trust-Approved Certification, and only then does W3BB
  mint the Franchise Bundle NFT to that business owner's wallet. There is no
  public "connect wallet and mint" button on the contract itself, by design:
  an open free mint would let anyone create an uncertified bundle, which
  undermines the certification the token is supposed to represent.
- **Free to mint** (the certified business doesn't pay to receive their
  bundle) — the minter wallet pays gas.
- **Capped supply** — set at deploy time, cannot be changed afterward.
- **On-chain resale royalties (EIP-2981)** — a percentage of every resale on
  marketplaces that support EIP-2981 (OpenSea, Blur, most modern
  marketplaces) is paid to a royalty receiver address you set at deploy time,
  and can be updated later by the contract admin.

## Project layout

```
contracts/
  contracts/W3BBFranchiseBundle.sol   the contract
  test/                               Hardhat test suite (run before ever deploying)
  scripts/deploy.ts                   deployment script, reads params from .env
  hardhat.config.ts                   network + compiler config
```

This is a separate, self-contained npm project from the main site (its own
`package.json`), so it doesn't affect the frontend's dependencies.

## Before you deploy anything

1. **Install dependencies:**
   ```bash
   cd contracts
   npm install
   ```
2. **Run the tests.** These run entirely on a local, in-memory blockchain —
   no real network, no real funds, completely safe to run as many times as
   you want:
   ```bash
   npm test
   ```
   All 8 should pass. Don't deploy anywhere if they don't.

## Deploying

**I cannot run this step for you.** Deployment requires signing a real
transaction with a real wallet's private key, and I never have access to
your keys — this has to run from your own machine with your own funded
wallet. Here's exactly what to do:

### 1. Get a wallet ready

Use MetaMask (or any EVM wallet). You'll need it funded with a small amount
of **POL** (Polygon's gas token) to pay for the deploy transaction — a few
dollars' worth is plenty. Consider using a **separate wallet from your main
one** for this: it holds `DEFAULT_ADMIN_ROLE` and `MINTER_ROLE`, so keeping
it separate from personal funds limits what's exposed if that key is ever
compromised.

### 2. Fill in your `.env`

```bash
cp .env.example .env
```

Open `.env` and fill in:
- `DEPLOYER_PRIVATE_KEY` — export from your wallet (MetaMask: Account
  details → Show private key). This file is already gitignored — it will
  never be committed.
- `INITIAL_ADMIN_ADDRESS` — the wallet that will hold minting rights (can be
  the same wallet as above, or a different one you also control).
- `ROYALTY_RECEIVER_ADDRESS` — where resale royalty payouts go.
- `ROYALTY_FEE_BPS` — royalty percentage in basis points (default `500` = 5%).
- `MAX_SUPPLY` — the supply cap (default `10000`).

### 3. (Strongly recommended) Dry-run on the free testnet first

Even though the plan is to launch on Polygon mainnet, testing the actual
deploy script against Polygon's free Amoy testnet first costs nothing and
catches script/config mistakes before they cost real gas:

1. Get free test POL from a faucet, e.g. https://faucet.polygon.technology
   (select Amoy).
2. Run:
   ```bash
   npm run deploy:amoy
   ```
3. Confirm it deploys successfully and the printed contract address shows up
   on https://amoy.polygonscan.com.

### 4. Deploy to Polygon mainnet

```bash
npm run deploy:polygon
```

This prints the deployed contract address and — if `POLYGONSCAN_API_KEY` is
set in `.env` — automatically verifies the source code on Polygonscan.

### 5. Wire it up to the site

Take the printed contract address and set it as
`VITE_FRANCHISE_BUNDLE_CONTRACT_ADDRESS` in the main site's `.env` (see
`src/lib/contract.ts` and `.env.example` at the repo root), then redeploy the
site.

## After deployment: minting bundles

Once deployed, minting a Franchise Bundle for a certified business happens
from the site's admin mint page (`/admin/mint`), using the wallet you set as
`INITIAL_ADMIN_ADDRESS`. That page only allows minting if the connected
wallet actually holds `MINTER_ROLE` on-chain — it checks the contract
directly, not just trusting the frontend.

To grant minting rights to another wallet later (e.g. a day-to-day
operations wallet, separate from your admin wallet), call
`grantRole(MINTER_ROLE, <address>)` on the contract from a wallet that
already holds `DEFAULT_ADMIN_ROLE` — either via Polygonscan's "Write
Contract" tab (connect your admin wallet there) or a short script.

## Updating royalties later

Call `setDefaultRoyalty(receiver, feeBps)` from the admin wallet (also
available via Polygonscan's "Write Contract" tab).
