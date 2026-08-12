// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title W3BB Franchise Bundle
/// @notice Represents a certified W3BB Worldwide business, packaged as a
/// Franchise Bundle NFT. Minting is restricted to addresses holding
/// MINTER_ROLE — businesses are minted to their owner's wallet only after
/// completing the W3BB Business Builder and Trust-Approved Certification
/// flow. There is no public/self-serve mint function by design: an
/// uncontrolled free mint would let anyone create an uncertified
/// "Franchise Bundle," undermining the certification the token is meant to
/// represent.
contract W3BBFranchiseBundle is ERC721, ERC721URIStorage, ERC2981, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @notice Maximum number of bundles that can ever be minted.
    uint256 public immutable maxSupply;

    /// @notice Number of bundles minted so far. Token IDs are assigned
    /// sequentially starting at 1.
    uint256 public totalMinted;

    event FranchiseBundleMinted(uint256 indexed tokenId, address indexed to, string tokenURI);

    /// @param initialAdmin Address that receives DEFAULT_ADMIN_ROLE and
    /// MINTER_ROLE at deployment. Should be a wallet you control directly —
    /// it can mint bundles and grant/revoke minting rights to other wallets
    /// (e.g. a separate operational hot wallet) later.
    /// @param royaltyReceiver Address that receives resale royalty payouts.
    /// @param royaltyFeeBps Royalty fee in basis points (100 = 1%). Max 10000.
    /// @param maxSupply_ Maximum number of bundles that can ever be minted.
    constructor(
        address initialAdmin,
        address royaltyReceiver,
        uint96 royaltyFeeBps,
        uint256 maxSupply_
    ) ERC721("W3BB Franchise Bundle", "W3BBFB") {
        require(initialAdmin != address(0), "W3BB: admin required");
        require(royaltyReceiver != address(0), "W3BB: royalty receiver required");
        require(maxSupply_ > 0, "W3BB: supply must be positive");

        maxSupply = maxSupply_;

        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _grantRole(MINTER_ROLE, initialAdmin);
        _setDefaultRoyalty(royaltyReceiver, royaltyFeeBps);
    }

    /// @notice Mint a Franchise Bundle NFT to a certified business owner's
    /// wallet. Callable only by addresses holding MINTER_ROLE.
    /// @param to Recipient wallet address.
    /// @param uri Metadata URI for this bundle (typically an IPFS URI
    /// pointing at the business's Franchise Bundle JSON).
    function safeMint(address to, string calldata uri) external onlyRole(MINTER_ROLE) returns (uint256 tokenId) {
        require(totalMinted < maxSupply, "W3BB: max supply reached");
        unchecked {
            tokenId = totalMinted + 1;
        }
        totalMinted = tokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        emit FranchiseBundleMinted(tokenId, to, uri);
    }

    /// @notice Update the default resale royalty. Callable only by an
    /// address holding DEFAULT_ADMIN_ROLE.
    function setDefaultRoyalty(address receiver, uint96 feeBps) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _setDefaultRoyalty(receiver, feeBps);
    }

    // --- Required overrides for multiple inheritance ---

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, ERC2981, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
