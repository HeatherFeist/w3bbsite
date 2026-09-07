import { expect } from 'chai';
import { ethers } from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';

const NAME = 'Example Business Coin';
const SYMBOL = 'EXBIZ';
const DECIMALS = 18;
const MAX_SUPPLY = ethers.parseUnits('1000', DECIMALS);

async function deployFixture() {
  const [admin, otherMinter, holder1, holder2, stranger] = await ethers.getSigners();

  const Factory = await ethers.getContractFactory('W3BBBusinessCoin');
  const contract = await Factory.deploy(NAME, SYMBOL, DECIMALS, admin.address, MAX_SUPPLY);
  await contract.waitForDeployment();

  return { contract, admin, otherMinter, holder1, holder2, stranger };
}

describe('W3BBBusinessCoin', () => {
  it('sets name, symbol, decimals, and constructor parameters correctly', async () => {
    const { contract, admin } = await loadFixture(deployFixture);

    expect(await contract.name()).to.equal(NAME);
    expect(await contract.symbol()).to.equal(SYMBOL);
    expect(await contract.decimals()).to.equal(DECIMALS);
    expect(await contract.maxSupply()).to.equal(MAX_SUPPLY);
    expect(await contract.totalSupply()).to.equal(0);

    const MINTER_ROLE = await contract.MINTER_ROLE();
    const DEFAULT_ADMIN_ROLE = await contract.DEFAULT_ADMIN_ROLE();
    expect(await contract.hasRole(MINTER_ROLE, admin.address)).to.equal(true);
    expect(await contract.hasRole(DEFAULT_ADMIN_ROLE, admin.address)).to.equal(true);
  });

  it('supports a different decimals value per deployment', async () => {
    const [admin] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory('W3BBBusinessCoin');
    const contract = await Factory.deploy('Six Decimal Coin', 'SIX', 6, admin.address, 1_000_000);
    await contract.waitForDeployment();

    expect(await contract.decimals()).to.equal(6);
  });

  it('rejects a zero-address admin or zero max supply', async () => {
    const Factory = await ethers.getContractFactory('W3BBBusinessCoin');
    const [admin] = await ethers.getSigners();

    await expect(
      Factory.deploy(NAME, SYMBOL, DECIMALS, ethers.ZeroAddress, MAX_SUPPLY),
    ).to.be.revertedWith('W3BB: admin required');

    await expect(Factory.deploy(NAME, SYMBOL, DECIMALS, admin.address, 0)).to.be.revertedWith(
      'W3BB: supply must be positive',
    );
  });

  it('lets a MINTER_ROLE holder mint to any address', async () => {
    const { contract, admin, holder1, holder2 } = await loadFixture(deployFixture);
    const amount = ethers.parseUnits('100', DECIMALS);

    await expect(contract.connect(admin).mint(holder1.address, amount))
      .to.emit(contract, 'Transfer')
      .withArgs(ethers.ZeroAddress, holder1.address, amount);

    expect(await contract.balanceOf(holder1.address)).to.equal(amount);
    expect(await contract.totalSupply()).to.equal(amount);

    await contract.connect(admin).mint(holder2.address, amount);
    expect(await contract.totalSupply()).to.equal(amount * 2n);
  });

  it('rejects minting from an address without MINTER_ROLE', async () => {
    const { contract, stranger, holder1 } = await loadFixture(deployFixture);

    await expect(contract.connect(stranger).mint(holder1.address, 1)).to.be.reverted;
  });

  it('lets the admin grant MINTER_ROLE to another address, which can then mint', async () => {
    const { contract, admin, otherMinter, holder1 } = await loadFixture(deployFixture);
    const MINTER_ROLE = await contract.MINTER_ROLE();
    const amount = ethers.parseUnits('10', DECIMALS);

    await contract.connect(admin).grantRole(MINTER_ROLE, otherMinter.address);
    await expect(contract.connect(otherMinter).mint(holder1.address, amount)).to.not.be.reverted;

    await contract.connect(admin).revokeRole(MINTER_ROLE, otherMinter.address);
    await expect(contract.connect(otherMinter).mint(holder1.address, amount)).to.be.reverted;
  });

  it('enforces the max supply cap, including across multiple mints', async () => {
    const { contract, admin, holder1 } = await loadFixture(deployFixture);

    await contract.connect(admin).mint(holder1.address, MAX_SUPPLY - 1n);
    await expect(contract.connect(admin).mint(holder1.address, 2)).to.be.revertedWith(
      'W3BB: max supply reached',
    );

    await expect(contract.connect(admin).mint(holder1.address, 1)).to.not.be.reverted;
    expect(await contract.totalSupply()).to.equal(MAX_SUPPLY);

    await expect(contract.connect(admin).mint(holder1.address, 1)).to.be.revertedWith(
      'W3BB: max supply reached',
    );
  });

  it('supports standard ERC-20 transfers and approvals between holders', async () => {
    const { contract, admin, holder1, holder2 } = await loadFixture(deployFixture);
    const amount = ethers.parseUnits('50', DECIMALS);

    await contract.connect(admin).mint(holder1.address, amount);

    await contract.connect(holder1).transfer(holder2.address, amount / 2n);
    expect(await contract.balanceOf(holder1.address)).to.equal(amount / 2n);
    expect(await contract.balanceOf(holder2.address)).to.equal(amount / 2n);

    await contract.connect(holder1).approve(holder2.address, amount / 4n);
    await contract.connect(holder2).transferFrom(holder1.address, holder2.address, amount / 4n);
    expect(await contract.balanceOf(holder1.address)).to.equal(amount / 4n);
    expect(await contract.balanceOf(holder2.address)).to.equal((amount / 2n) + (amount / 4n));
  });

  it('reports AccessControl interface support', async () => {
    const { contract } = await loadFixture(deployFixture);
    const ACCESS_CONTROL_INTERFACE_ID = '0x7965db0b';
    expect(await contract.supportsInterface(ACCESS_CONTROL_INTERFACE_ID)).to.equal(true);
  });
});
