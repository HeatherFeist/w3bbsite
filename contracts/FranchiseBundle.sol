// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title W3BB Franchise Bundle
/// @notice ERC-721 representing a fully packaged, resellable W3BB franchise
/// business bundle (brand identity, product catalog, operational system,
/// marketing materials, AI workflows, revenue model, launch instructions —
/// the 7 asset modules described on w3bbworldwide.com). Every bundle carries
/// a perpetual resale royalty (ERC-2981), matching the site's "8% perpetual"
/// marketplace copy.
contract FranchiseBundle is ERC721URIStorage, ERC721Royalty, Ownable {
    uint256 public nextTokenId = 1;

    /// @notice 0 means uncapped.
    uint256 public maxSupply;

    /// @notice Price in wei. 0 means free mint (current waitlist/launch stage).
    uint256 public mintPrice;

    /// @notice Receives mint proceeds on withdraw() and the default resale royalty.
    address public treasury;

    event BundleMinted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event MintPriceUpdated(uint256 newPrice);
    event MaxSupplyUpdated(uint256 newMaxSupply);
    event TreasuryUpdated(address newTreasury);
    event Withdrawn(address indexed to, uint256 amount);

    constructor(
        address initialOwner,
        address initialTreasury,
        uint256 initialMaxSupply,
        uint256 initialMintPrice,
        uint96 royaltyBps
    ) ERC721("W3BB Franchise Bundle", "W3BB") Ownable(initialOwner) {
        require(initialTreasury != address(0), "treasury required");
        treasury = initialTreasury;
        maxSupply = initialMaxSupply;
        mintPrice = initialMintPrice;
        _setDefaultRoyalty(initialTreasury, royaltyBps);
    }

    /// @notice Number of bundles minted so far.
    function totalSupply() external view returns (uint256) {
        return nextTokenId - 1;
    }

    /// @notice Mint a Franchise Bundle NFT to the caller.
    /// @param tokenURI_ Metadata URI for this bundle (brand kit, product
    /// catalog, etc. — typically an ipfs:// or https:// JSON document
    /// following the standard ERC-721 metadata schema).
    function mint(string calldata tokenURI_) external payable returns (uint256 tokenId) {
        require(maxSupply == 0 || nextTokenId <= maxSupply, "sold out");
        require(msg.value >= mintPrice, "insufficient payment");

        tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI_);

        emit BundleMinted(msg.sender, tokenId, tokenURI_);
    }

    function setMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
        emit MintPriceUpdated(newPrice);
    }

    function setMaxSupply(uint256 newMaxSupply) external onlyOwner {
        require(newMaxSupply == 0 || newMaxSupply >= nextTokenId - 1, "below minted count");
        maxSupply = newMaxSupply;
        emit MaxSupplyUpdated(newMaxSupply);
    }

    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "treasury required");
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }

    /// @notice Update the perpetual resale royalty (basis points, e.g. 800 = 8%).
    function setDefaultRoyalty(address receiver, uint96 feeBps) external onlyOwner {
        _setDefaultRoyalty(receiver, feeBps);
    }

    /// @notice Sweep mint proceeds collected by this contract to the treasury.
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "nothing to withdraw");
        (bool ok, ) = treasury.call{value: balance}("");
        require(ok, "withdraw failed");
        emit Withdrawn(treasury, balance);
    }

    // --- Required overrides (multiple inheritance) ---

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

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
        override(ERC721URIStorage, ERC721Royalty)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
