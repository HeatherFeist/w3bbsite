# W3BB Business Coin + Coin Swap — technology readiness (NOT cleared for real launch)

> **This is not launching.** These contracts are technology-readiness work
> only. The per-business "coin" concept — a fungible token per business,
> tradeable among platform members, intended to reflect business
> growth/performance — is very likely a **security under U.S. law** as
> currently conceived. The project owner is engaging a securities attorney,
> and **no real, value-bearing version of this may be deployed publicly, sold,
> priced, or wired into any payment flow until that legal review is complete
> and the project owner explicitly confirms clearance.**
>
> Everything in this document and these contracts is scoped to: building the
> smart-contract technology, testing it thoroughly on a free public testnet
> with test tokens that have no monetary value, and leaving it ready to go
> the moment legal clearance is given. Nothing here configures real value,
> connects to real payment, or launches anything.

## What's here

Two contracts, alongside the existing `W3BBFranchiseBundle` NFT contract in
this same project:

- **`contracts/W3BBBusinessCoin.sol`** — a standard ERC-20 token, one
  instance deployed per business (mirroring the "one Franchise Bundle NFT
  per business" model). Name, symbol, and decimals are set per-deployment in
  the constructor. Minting is gated behind `MINTER_ROLE` (identical
  `AccessControl` pattern to `W3BBFranchiseBundle`'s `MINTER_ROLE`), and a
  `maxSupply` cap is set immutably at deploy time. The contract has **no
  purchase or payment logic whatsoever** — no `payable` mint function, no
  price oracle, no exchange rate against ETH/POL/USD/anything. Minting only
  ever happens when a `MINTER_ROLE` holder calls `mint(to, amount)` directly;
  there is no way to acquire tokens by sending value to the contract. Beyond
  minting, it is a fully standard, freely transferable ERC-20 token — that
  transferability is intentional and matches the project owner's stated
  direction that these coins should eventually be tradeable, once cleared.
- **`contracts/W3BBCoinSwap.sol`** — a minimal escrow-based limit-order
  contract for simulating trading between different businesses' coins on a
  testnet. A maker locks up the token they're offering and states what
  they want in return; any taker can fill the order in full at that stated
  rate, or the maker can cancel and reclaim their tokens before it's filled.
  See "Why a simple escrow contract, not an AMM" below for why this design
  was chosen over a more complex liquidity-pool system.

Neither contract talks to Stripe, any payment processor, or any oracle. They
only move ERC-20 tokens that a `MINTER_ROLE` holder has already minted for
testing purposes.

## Why a simple escrow contract, not an AMM

The task called for "simulating a stock exchange" experience beyond bare
ERC-20 transfers (which already support peer-to-peer trading with zero extra
code). Two reasonable designs exist:

1. **A basic escrow-based limit-order book** (what's implemented here): a
   maker deposits token A and states an asking amount of token B; any taker
   can fill it in full, or the maker can cancel. No pricing curve, no
   liquidity pools, no slippage math.
2. **An AMM / constant-product liquidity pool** (Uniswap-v2-style): would
   require liquidity provisioning, LP token accounting, pricing-curve math,
   and materially more edge cases (rounding, front-running/sandwich
   considerations, minimum liquidity locks) to get right.

The escrow-based order book was chosen because it is meaningfully simpler to
implement and test correctly, matches the "simulate placing and filling
trade offers" framing in the request, and keeps the contract surface small
enough that its ~100 lines can be fully covered by tests with confidence. An
AMM was not pursued — it would add real complexity (and real risk of subtle
bugs) without a corresponding requirement in the current testnet-simulation
scope.

## Contract details

### `W3BBBusinessCoin`

```solidity
constructor(
    string memory name_,
    string memory symbol_,
    uint8 decimals_,
    address initialAdmin,
    uint256 maxSupply_
)
```

- `initialAdmin` receives `DEFAULT_ADMIN_ROLE` and `MINTER_ROLE` at
  deployment, exactly like `W3BBFranchiseBundle`'s `initialAdmin`.
- `mint(address to, uint256 amount)` — callable only by a `MINTER_ROLE`
  holder. Reverts if it would push `totalSupply()` above `maxSupply`.
- `decimals()` returns the value fixed at construction (not necessarily 18).
- Standard `transfer`/`approve`/`transferFrom` work exactly like any ERC-20.

### `W3BBCoinSwap`

Takes no constructor parameters — one instance can broker trades between any
number of ERC-20 tokens (e.g. any two `W3BBBusinessCoin` deployments, or test
tokens).

- `createOrder(tokenOffered, amountOffered, tokenWanted, amountWanted)` —
  the caller must have approved this contract for at least `amountOffered`
  of `tokenOffered` first. Escrows the tokens in the contract and returns an
  `orderId`.
- `fillOrder(orderId)` — the caller (taker) must have approved this contract
  for at least the order's `amountWanted` of `tokenWanted` first. Full-fill
  only, no partial fills. Sends the taker's `tokenWanted` straight to the
  maker, and releases the escrowed `tokenOffered` to the taker.
- `cancelOrder(orderId)` — only the original maker, only while the order is
  still active. Returns the escrowed tokens.
- Uses OpenZeppelin's `SafeERC20` for all token moves and `ReentrancyGuard`
  on every state-changing function.

## Testing on testnet (the only supported path right now)

All contract logic is fully covered by the Hardhat test suite, which runs on
an in-memory local blockchain — no testnet, no real funds, no setup beyond
`npm install`:

```bash
cd contracts
npm install
npm test
```

All 30 tests should pass (see the full list below). Don't deploy anywhere,
testnet included, if they don't.

To actually try it against a public testnet (Polygon Amoy — free test POL
from a faucet, e.g. https://faucet.polygon.technology):

1. Fill in `.env` (copy from `.env.example`) — coin name/symbol/decimals,
   `COIN_INITIAL_ADMIN_ADDRESS`, `COIN_MAX_SUPPLY`, and your
   `DEPLOYER_PRIVATE_KEY` for a funded Amoy testnet wallet.
2. Deploy a coin:
   ```bash
   npm run deploy:coin:amoy
   ```
3. Deploy the swap contract (only needs to be deployed once, shared across
   all coins):
   ```bash
   npm run deploy:swap:amoy
   ```
4. From two different testnet wallets: mint some of each coin to each wallet
   (via `mint(to, amount)`, using a wallet holding `MINTER_ROLE` — e.g.
   Polygonscan's "Write Contract" tab on Amoy's block explorer), have one
   wallet `approve` the swap contract and call `createOrder`, then have the
   other wallet `approve` the swap contract and call `fillOrder`.

There is deliberately **no `npm run deploy:coin:polygon` or
`deploy:swap:polygon` script** — only the Amoy testnet target is wired up as
an npm script. See "Mainnet safety" below for what it would take to target a
real network at all.

## Mainnet safety — deliberately hard to do by accident

Both `scripts/deployBusinessCoin.ts` and `scripts/deployCoinSwap.ts`:

- Print a loud warning if the target network isn't one of the recognized
  testnets (`polygonAmoy`, plus the local `hardhat`/`localhost` networks).
- **Refuse to proceed** against any other network (including `polygon`
  mainnet) unless the environment variable
  `I_CONFIRM_THIS_IS_NOT_A_REAL_LAUNCH=true` is also set.
- That variable is not set by default anywhere in this repo, has no default
  value in `.env.example` (it's documented but left blank), and is not
  referenced by any `npm run` script — someone would have to deliberately
  export it by hand, understanding exactly what it means, to get past the
  check.

This means there is no path — no default npm script, no unset env var, no
missing config — that deploys either contract to a real/production network.
Reaching a real network requires (a) manually adding a mainnet network
target/command, and (b) deliberately setting that confirmation variable,
which should only ever happen after the project owner confirms legal
clearance for a specific deployment.

## What would need to happen before any real deployment

Referenced here only at a high level, since the actual process is between
the project owner and their attorney, not something this codebase decides:

- Legal clearance from a securities attorney on how (or whether) a
  per-business coin can be offered/sold/traded without running afoul of
  U.S. securities law.
- A resolved, compliant answer to "how does anyone acquire a coin in the
  first place" — this is explicitly out of scope for `W3BBBusinessCoin`
  itself (no payment logic exists in the contract), and would need its own
  design once legal clearance defines what's permissible.
- Only after that: a real deployment, using the existing testnet-first
  workflow as a dry run, plus the extra `I_CONFIRM_THIS_IS_NOT_A_REAL_LAUNCH`
  step (or an equivalent explicit mainnet-deploy decision) made knowingly by
  the project owner.

Until then, these contracts exist only to be tested against, on free
testnets, with tokens that carry no monetary value.

## Test suite

Run with `npm test` from `contracts/`. All 30 tests currently pass:

**`W3BBBusinessCoin` (9 tests)**
- sets name, symbol, decimals, and constructor parameters correctly
- supports a different decimals value per deployment
- rejects a zero-address admin or zero max supply
- lets a MINTER_ROLE holder mint to any address
- rejects minting from an address without MINTER_ROLE
- lets the admin grant MINTER_ROLE to another address, which can then mint
- enforces the max supply cap, including across multiple mints
- supports standard ERC-20 transfers and approvals between holders
- reports AccessControl interface support

**`W3BBCoinSwap` (13 tests)**
- starts with zero orders
- creates an order, escrowing the offered token from the maker
- rejects creating an order without a prior approval (insufficient allowance)
- rejects creating an order the maker cannot afford (insufficient balance)
- rejects invalid order parameters
- lets a taker fill an order, exchanging tokens directly between maker and taker
- rejects filling an order the taker cannot afford (insufficient balance)
- rejects filling an order without sufficient allowance
- rejects filling a non-existent or already-filled order
- lets the maker cancel an active order and reclaim escrowed tokens
- rejects cancelling by a non-maker
- rejects cancelling an already-cancelled or already-filled order
- supports independent, concurrent orders across multiple coin pairs

**`W3BBFranchiseBundle` (8 tests, pre-existing, unchanged)** — see
`contracts/README.md`.

## Frontend

No frontend changes were made as part of this work. `src/` was left
untouched — there is no wallet-connect page, balance display, or trading UI
wired up anywhere in the site. If a read-only testnet demo page is added
later, it must be clearly labeled as a testnet-only preview and must not be
reachable from any real purchase/checkout flow.
