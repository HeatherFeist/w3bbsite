const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('FranchiseBundle', function () {
  async function deploy({ maxSupply = 0, mintPrice = 0, royaltyBps = 800 } = {}) {
    const [owner, treasury, buyer, other] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory('FranchiseBundle');
    const contract = await Factory.deploy(
      owner.address,
      treasury.address,
      maxSupply,
      mintPrice,
      royaltyBps,
    );
    await contract.waitForDeployment();
    return { contract, owner, treasury, buyer, other };
  }

  it('mints a bundle and emits BundleMinted', async function () {
    const { contract, buyer } = await deploy();
    await expect(contract.connect(buyer).mint('ipfs://bundle-1'))
      .to.emit(contract, 'BundleMinted')
      .withArgs(buyer.address, 1n, 'ipfs://bundle-1');

    expect(await contract.ownerOf(1)).to.equal(buyer.address);
    expect(await contract.tokenURI(1)).to.equal('ipfs://bundle-1');
    expect(await contract.totalSupply()).to.equal(1n);
  });

  it('rejects mint below mintPrice', async function () {
    const { contract, buyer } = await deploy({ mintPrice: ethers.parseEther('0.05') });
    await expect(
      contract.connect(buyer).mint('ipfs://bundle-1', { value: ethers.parseEther('0.01') }),
    ).to.be.revertedWith('insufficient payment');
  });

  it('accepts mint at or above mintPrice', async function () {
    const { contract, buyer } = await deploy({ mintPrice: ethers.parseEther('0.05') });
    await expect(
      contract.connect(buyer).mint('ipfs://bundle-1', { value: ethers.parseEther('0.05') }),
    ).to.not.be.reverted;
  });

  it('enforces maxSupply', async function () {
    const { contract, buyer } = await deploy({ maxSupply: 1 });
    await contract.connect(buyer).mint('ipfs://bundle-1');
    await expect(contract.connect(buyer).mint('ipfs://bundle-2')).to.be.revertedWith('sold out');
  });

  it('reports the default 8% royalty to the treasury', async function () {
    const { contract, treasury, buyer } = await deploy();
    await contract.connect(buyer).mint('ipfs://bundle-1');
    const [receiver, amount] = await contract.royaltyInfo(1, ethers.parseEther('1'));
    expect(receiver).to.equal(treasury.address);
    expect(amount).to.equal(ethers.parseEther('0.08'));
  });

  it('lets only the owner change mint price, max supply, and treasury', async function () {
    const { contract, other } = await deploy();
    await expect(contract.connect(other).setMintPrice(1)).to.be.revertedWithCustomError(
      contract,
      'OwnableUnauthorizedAccount',
    );
    await expect(contract.connect(other).setMaxSupply(5)).to.be.revertedWithCustomError(
      contract,
      'OwnableUnauthorizedAccount',
    );
    await expect(contract.connect(other).setTreasury(other.address)).to.be.revertedWithCustomError(
      contract,
      'OwnableUnauthorizedAccount',
    );
  });

  it('withdraws collected mint proceeds to the treasury', async function () {
    const { contract, owner, treasury, buyer } = await deploy({
      mintPrice: ethers.parseEther('0.05'),
    });
    await contract.connect(buyer).mint('ipfs://bundle-1', { value: ethers.parseEther('0.05') });

    const before = await ethers.provider.getBalance(treasury.address);
    await expect(contract.connect(owner).withdraw())
      .to.emit(contract, 'Withdrawn')
      .withArgs(treasury.address, ethers.parseEther('0.05'));
    const after = await ethers.provider.getBalance(treasury.address);
    expect(after - before).to.equal(ethers.parseEther('0.05'));
  });
});
