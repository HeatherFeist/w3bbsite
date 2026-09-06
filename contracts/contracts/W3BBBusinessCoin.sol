// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title W3BB Business Coin
/// @notice A per-business, standard ERC-20 token. One instance of this
/// contract is deployed per certified W3BB business (mirroring the
/// "one Franchise Bundle NFT per business" model used by
/// W3BBFranchiseBundle). Name, symbol, and decimals are set per-deployment
/// via constructor params so each business's coin can be branded and
/// configured independently.
///
/// IMPORTANT — TECHNOLOGY READINESS ONLY: this contract is standard,
/// transferable ERC-20 token functionality with no purchase/payment logic of
/// any kind built in — no `payable` mint, no price oracle, no exchange rate
/// against real money. Minting is role-gated (mirroring W3BBFranchiseBundle's
/// MINTER_ROLE / AccessControl pattern exactly) and is entirely separate from
/// any monetary exchange. Whether/how a business coin is ever offered,
/// priced, or exchanged for value is explicitly out of scope for this
/// contract and is not decided by anything in this codebase — see
/// contracts/BUSINESS_COIN_README.md for the legal-hold context before this
/// is deployed anywhere with real value.
contract W3BBBusinessCoin is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @notice Number of decimals this coin uses. Fixed at deployment.
    uint8 private immutable _decimals;

    /// @notice Maximum number of tokens (in the smallest unit, i.e. already
    /// scaled by `decimals`) that can ever be minted.
    uint256 public immutable maxSupply;

    /// @param name_ Token name, e.g. "Example Business Coin".
    /// @param symbol_ Token symbol, e.g. "EXBIZ".
    /// @param decimals_ Number of decimals for this token.
    /// @param initialAdmin Address that receives DEFAULT_ADMIN_ROLE and
    /// MINTER_ROLE at deployment. Should be a wallet you control directly —
    /// it can mint coins and grant/revoke minting rights to other wallets
    /// later.
    /// @param maxSupply_ Maximum number of tokens (smallest unit) that can
    /// ever be minted. Immutable once deployed.
    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        address initialAdmin,
        uint256 maxSupply_
    ) ERC20(name_, symbol_) {
        require(initialAdmin != address(0), "W3BB: admin required");
        require(maxSupply_ > 0, "W3BB: supply must be positive");

        _decimals = decimals_;
        maxSupply = maxSupply_;

        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _grantRole(MINTER_ROLE, initialAdmin);
    }

    /// @notice Mint coins to a recipient wallet. Callable only by addresses
    /// holding MINTER_ROLE. There is no public/self-serve mint function and
    /// no way to mint by sending ETH or any other asset to this contract —
    /// minting is strictly role-gated and carries no payment logic.
    /// @param to Recipient wallet address.
    /// @param amount Amount to mint, in the smallest unit (respecting
    /// `decimals`).
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        require(totalSupply() + amount <= maxSupply, "W3BB: max supply reached");
        _mint(to, amount);
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    function supportsInterface(bytes4 interfaceId) public view override(AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
