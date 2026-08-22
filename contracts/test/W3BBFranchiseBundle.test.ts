import { expect } from 'chai';
import { ethers } from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';

const MAX_SUPPLY = 3;
const ROYALTY_BPS = 500; // 5%

async function deployFixture() {
  const [admin, royaltyReceiver, otherMinter, buyer1, buyer2, stranger] = await ethers.getSigners();

  const Factory = await ethers.getContractFactory('W3BBFranchiseBundle');
  const contract = await Factory.deploy(
    admin.address,
    royaltyReceiver.address,
    ROYALTY_BPS,
    MAX_SUPPLY,
  );
  await contract.waitForDeployment();

  return { contract, admin, royaltyReceiver, otherMinter, buyer1, buyer2, stranger };
}

describe('W3BBFranchiseBundle', () => {
  it('sets name, symbol, and constructor parameters correctly', async () => {
    const { contract, admin, royaltyReceiver } = await loadFixture(deployFixture);

    expect(await contract.name()).to.equal('W3BB Franchise Bundle');
    expect(await contract.symbol()).to.equal('W3BBFB');
    expect(await contract.maxSupply()).to.equal(MAX_SUPPLY);
    expect(await contract.totalMinted()).to.equal(0);

    const MINTER_ROLE = await contract.MINTER_ROLE();
    const DEFAULT_ADMIN_ROLE = await contract.DEFAULT_ADMIN_ROLE();
    expect(await contract.hasRole(MINTER_ROLE, admin.address)).to.equal(true);
    expect(await contract.hasRole(DEFAULT_ADMIN_ROLE, admin.address)).to.equal(true);

    const [receiver, amount] = await contract.royaltyInfo(1, 10_000n);
    expect(receiver).to.equal(royaltyReceiver.address);
    expect(amount).to.equal((10_000n * BigInt(ROYALTY_BPS)) / 10_000n);
  });

  it('rejects a zero-address admin, zero-address royalty receiver, or zero supply', async () => {
    const Factory = await ethers.getContractFactory('W3BBFranchiseBundle');
    const [admin, royaltyReceiver] = await ethers.getSigners();

    await expect(
      Factory.deploy(ethers.ZeroAddress, royaltyReceiver.address, ROYALTY_BPS, MAX_SUPPLY),
    ).to.be.revertedWith('W3BB: admin required');

    await expect(
      Factory.deploy(admin.address, ethers.ZeroAddress, ROYALTY_BPS, MAX_SUPPLY),
    ).to.be.revertedWith('W3BB: royalty receiver required');

    await expect(
      Factory.deploy(admin.address, royaltyReceiver.address, ROYALTY_BPS, 0),
    ).to.be.revertedWith('W3BB: supply must be positive');
  });

  it('lets a MINTER_ROLE holder mint, assigns sequential token IDs starting at 1, and sets tokenURI', async () => {
    const { contract, admin, buyer1, buyer2 } = await loadFixture(deployFixture);

    await expect(contract.connect(admin).safeMint(buyer1.address, 'ipfs://bundle-1'))
      .to.emit(contract, 'FranchiseBundleMinted')
      .withArgs(1, buyer1.address, 'ipfs://bundle-1');

    expect(await contract.ownerOf(1)).to.equal(buyer1.address);
    expect(await contract.tokenURI(1)).to.equal('ipfs://bundle-1');
    expect(await contract.totalMinted()).to.equal(1);

    await contract.connect(admin).safeMint(buyer2.address, 'ipfs://bundle-2');
    expect(await contract.ownerOf(2)).to.equal(buyer2.address);
    expect(await contract.totalMinted()).to.equal(2);
  });

  it('rejects minting from an address without MINTER_ROLE', async () => {
    const { contract, stranger, buyer1 } = await loadFixture(deployFixture);

    await expect(
      contract.connect(stranger).safeMint(buyer1.address, 'ipfs://nope'),
    ).to.be.reverted;
  });

  it('lets the admin grant MINTER_ROLE to another address, which can then mint', async () => {
    const { contract, admin, otherMinter, buyer1 } = await loadFixture(deployFixture);
    const MINTER_ROLE = await contract.MINTER_ROLE();

    await contract.connect(admin).grantRole(MINTER_ROLE, otherMinter.address);
    await expect(contract.connect(otherMinter).safeMint(buyer1.address, 'ipfs://bundle-1')).to.not.be
      .reverted;

    await contract.connect(admin).revokeRole(MINTER_ROLE, otherMinter.address);
    await expect(contract.connect(otherMinter).safeMint(buyer1.address, 'ipfs://bundle-2')).to.be
      .reverted;
  });

  it('enforces the max supply cap', async () => {
    const { contract, admin, buyer1 } = await loadFixture(deployFixture);

    for (let i = 0; i < MAX_SUPPLY; i += 1) {
      await contract.connect(admin).safeMint(buyer1.address, `ipfs://bundle-${i}`);
    }
    expect(await contract.totalMinted()).to.equal(MAX_SUPPLY);

    await expect(
      contract.connect(admin).safeMint(buyer1.address, 'ipfs://one-too-many'),
    ).to.be.revertedWith('W3BB: max supply reached');
  });

  it('lets only the admin update the default royalty', async () => {
    const { contract, admin, stranger, buyer1 } = await loadFixture(deployFixture);

    await contract.connect(admin).setDefaultRoyalty(buyer1.address, 1000);
    const [receiver, amount] = await contract.royaltyInfo(1, 10_000n);
    expect(receiver).to.equal(buyer1.address);
    expect(amount).to.equal(1000n);

    await expect(contract.connect(stranger).setDefaultRoyalty(stranger.address, 1000)).to.be.reverted;
  });

  it('reports ERC721, ERC721Metadata, ERC2981, and AccessControl interface support', async () => {
    const { contract } = await loadFixture(deployFixture);

    const ERC721_INTERFACE_ID = '0x80ac58cd';
    const ERC2981_INTERFACE_ID = '0x2a55205a';
    const ACCESS_CONTROL_INTERFACE_ID = '0x7965db0b';

    expect(await contract.supportsInterface(ERC721_INTERFACE_ID)).to.equal(true);
    expect(await contract.supportsInterface(ERC2981_INTERFACE_ID)).to.equal(true);
    expect(await contract.supportsInterface(ACCESS_CONTROL_INTERFACE_ID)).to.equal(true);
  });
});
