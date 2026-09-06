import { expect } from 'chai';
import { ethers } from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';

const DECIMALS = 18;
const MAX_SUPPLY = ethers.parseUnits('1000000', DECIMALS);

async function deployFixture() {
  const [admin, maker, taker, stranger] = await ethers.getSigners();

  const CoinFactory = await ethers.getContractFactory('W3BBBusinessCoin');
  const coinA = await CoinFactory.deploy('Business A Coin', 'BIZA', DECIMALS, admin.address, MAX_SUPPLY);
  await coinA.waitForDeployment();
  const coinB = await CoinFactory.deploy('Business B Coin', 'BIZB', DECIMALS, admin.address, MAX_SUPPLY);
  await coinB.waitForDeployment();

  const SwapFactory = await ethers.getContractFactory('W3BBCoinSwap');
  const swap = await SwapFactory.deploy();
  await swap.waitForDeployment();

  const mintAmount = ethers.parseUnits('1000', DECIMALS);
  await coinA.connect(admin).mint(maker.address, mintAmount);
  await coinB.connect(admin).mint(taker.address, mintAmount);

  return { swap, coinA, coinB, admin, maker, taker, stranger, mintAmount };
}

describe('W3BBCoinSwap', () => {
  it('starts with zero orders', async () => {
    const { swap } = await loadFixture(deployFixture);
    expect(await swap.orderCount()).to.equal(0);
  });

  it('creates an order, escrowing the offered token from the maker', async () => {
    const { swap, coinA, coinB, maker } = await loadFixture(deployFixture);
    const offered = ethers.parseUnits('100', DECIMALS);
    const wanted = ethers.parseUnits('50', DECIMALS);

    await coinA.connect(maker).approve(await swap.getAddress(), offered);

    await expect(
      swap.connect(maker).createOrder(await coinA.getAddress(), offered, await coinB.getAddress(), wanted),
    )
      .to.emit(swap, 'OrderCreated')
      .withArgs(1, maker.address, await coinA.getAddress(), offered, await coinB.getAddress(), wanted);

    expect(await swap.orderCount()).to.equal(1);
    expect(await coinA.balanceOf(await swap.getAddress())).to.equal(offered);

    const order = await swap.orders(1);
    expect(order.maker).to.equal(maker.address);
    expect(order.tokenOffered).to.equal(await coinA.getAddress());
    expect(order.amountOffered).to.equal(offered);
    expect(order.tokenWanted).to.equal(await coinB.getAddress());
    expect(order.amountWanted).to.equal(wanted);
    expect(order.active).to.equal(true);
  });

  it('rejects creating an order without a prior approval (insufficient allowance)', async () => {
    const { swap, coinA, coinB, maker } = await loadFixture(deployFixture);
    const offered = ethers.parseUnits('100', DECIMALS);
    const wanted = ethers.parseUnits('50', DECIMALS);

    await expect(
      swap.connect(maker).createOrder(await coinA.getAddress(), offered, await coinB.getAddress(), wanted),
    ).to.be.reverted;
  });

  it('rejects creating an order the maker cannot afford (insufficient balance)', async () => {
    const { swap, coinA, coinB, maker, mintAmount } = await loadFixture(deployFixture);
    const tooMuch = mintAmount + 1n;
    const wanted = ethers.parseUnits('50', DECIMALS);

    await coinA.connect(maker).approve(await swap.getAddress(), tooMuch);

    await expect(
      swap.connect(maker).createOrder(await coinA.getAddress(), tooMuch, await coinB.getAddress(), wanted),
    ).to.be.reverted;
  });

  it('rejects invalid order parameters', async () => {
    const { swap, coinA, coinB, maker } = await loadFixture(deployFixture);
    const offered = ethers.parseUnits('100', DECIMALS);
    const wanted = ethers.parseUnits('50', DECIMALS);
    await coinA.connect(maker).approve(await swap.getAddress(), offered * 4n);

    await expect(
      swap.connect(maker).createOrder(ethers.ZeroAddress, offered, await coinB.getAddress(), wanted),
    ).to.be.revertedWith('W3BB: token required');

    await expect(
      swap.connect(maker).createOrder(await coinA.getAddress(), offered, ethers.ZeroAddress, wanted),
    ).to.be.revertedWith('W3BB: token required');

    await expect(
      swap.connect(maker).createOrder(await coinA.getAddress(), offered, await coinA.getAddress(), wanted),
    ).to.be.revertedWith('W3BB: tokens must differ');

    await expect(
      swap.connect(maker).createOrder(await coinA.getAddress(), 0, await coinB.getAddress(), wanted),
    ).to.be.revertedWith('W3BB: amountOffered must be positive');

    await expect(
      swap.connect(maker).createOrder(await coinA.getAddress(), offered, await coinB.getAddress(), 0),
    ).to.be.revertedWith('W3BB: amountWanted must be positive');
  });

  it('lets a taker fill an order, exchanging tokens directly between maker and taker', async () => {
    const { swap, coinA, coinB, maker, taker } = await loadFixture(deployFixture);
    const offered = ethers.parseUnits('100', DECIMALS);
    const wanted = ethers.parseUnits('50', DECIMALS);

    await coinA.connect(maker).approve(await swap.getAddress(), offered);
    await swap.connect(maker).createOrder(await coinA.getAddress(), offered, await coinB.getAddress(), wanted);

    await coinB.connect(taker).approve(await swap.getAddress(), wanted);

    await expect(swap.connect(taker).fillOrder(1)).to.emit(swap, 'OrderFilled').withArgs(1, taker.address);

    expect(await coinA.balanceOf(taker.address)).to.equal(offered);
    expect(await coinB.balanceOf(maker.address)).to.equal(wanted);
    expect(await coinA.balanceOf(await swap.getAddress())).to.equal(0);

    const order = await swap.orders(1);
    expect(order.active).to.equal(false);
  });

  it('rejects filling an order the taker cannot afford (insufficient balance)', async () => {
    const { swap, coinA, coinB, maker, taker } = await loadFixture(deployFixture);
    const offered = ethers.parseUnits('100', DECIMALS);
    const wanted = ethers.parseUnits('50', DECIMALS);

    await coinA.connect(maker).approve(await swap.getAddress(), offered);
    await swap.connect(maker).createOrder(await coinA.getAddress(), offered, await coinB.getAddress(), wanted);

    // Taker approves but drains their own balance first so the transferFrom fails.
    await coinB.connect(taker).approve(await swap.getAddress(), wanted);
    await coinB.connect(taker).transfer(maker.address, await coinB.balanceOf(taker.address));

    await expect(swap.connect(taker).fillOrder(1)).to.be.reverted;
  });

  it('rejects filling an order without sufficient allowance', async () => {
    const { swap, coinA, coinB, maker, taker } = await loadFixture(deployFixture);
    const offered = ethers.parseUnits('100', DECIMALS);
    const wanted = ethers.parseUnits('50', DECIMALS);

    await coinA.connect(maker).approve(await swap.getAddress(), offered);
    await swap.connect(maker).createOrder(await coinA.getAddress(), offered, await coinB.getAddress(), wanted);

    await expect(swap.connect(taker).fillOrder(1)).to.be.reverted;
  });

  it('rejects filling a non-existent or already-filled order', async () => {
    const { swap, coinA, coinB, maker, taker } = await loadFixture(deployFixture);
    const offered = ethers.parseUnits('100', DECIMALS);
    const wanted = ethers.parseUnits('50', DECIMALS);

    await expect(swap.connect(taker).fillOrder(1)).to.be.revertedWith('W3BB: order not active');

    await coinA.connect(maker).approve(await swap.getAddress(), offered);
    await swap.connect(maker).createOrder(await coinA.getAddress(), offered, await coinB.getAddress(), wanted);
    await coinB.connect(taker).approve(await swap.getAddress(), wanted);
    await swap.connect(taker).fillOrder(1);

    await expect(swap.connect(taker).fillOrder(1)).to.be.revertedWith('W3BB: order not active');
  });

  it('lets the maker cancel an active order and reclaim escrowed tokens', async () => {
    const { swap, coinA, coinB, maker } = await loadFixture(deployFixture);
    const offered = ethers.parseUnits('100', DECIMALS);
    const wanted = ethers.parseUnits('50', DECIMALS);

    await coinA.connect(maker).approve(await swap.getAddress(), offered);
    await swap.connect(maker).createOrder(await coinA.getAddress(), offered, await coinB.getAddress(), wanted);

    const balanceBefore = await coinA.balanceOf(maker.address);
    await expect(swap.connect(maker).cancelOrder(1)).to.emit(swap, 'OrderCancelled').withArgs(1);

    expect(await coinA.balanceOf(maker.address)).to.equal(balanceBefore + offered);
    expect(await coinA.balanceOf(await swap.getAddress())).to.equal(0);

    const order = await swap.orders(1);
    expect(order.active).to.equal(false);
  });

  it('rejects cancelling by a non-maker', async () => {
    const { swap, coinA, coinB, maker, stranger } = await loadFixture(deployFixture);
    const offered = ethers.parseUnits('100', DECIMALS);
    const wanted = ethers.parseUnits('50', DECIMALS);

    await coinA.connect(maker).approve(await swap.getAddress(), offered);
    await swap.connect(maker).createOrder(await coinA.getAddress(), offered, await coinB.getAddress(), wanted);

    await expect(swap.connect(stranger).cancelOrder(1)).to.be.revertedWith('W3BB: not order maker');
  });

  it('rejects cancelling an already-cancelled or already-filled order', async () => {
    const { swap, coinA, coinB, maker, taker } = await loadFixture(deployFixture);
    const offered = ethers.parseUnits('100', DECIMALS);
    const wanted = ethers.parseUnits('50', DECIMALS);

    await coinA.connect(maker).approve(await swap.getAddress(), offered);
    await swap.connect(maker).createOrder(await coinA.getAddress(), offered, await coinB.getAddress(), wanted);
    await swap.connect(maker).cancelOrder(1);

    await expect(swap.connect(maker).cancelOrder(1)).to.be.revertedWith('W3BB: order not active');

    await coinA.connect(maker).approve(await swap.getAddress(), offered);
    await swap.connect(maker).createOrder(await coinA.getAddress(), offered, await coinB.getAddress(), wanted);
    await coinB.connect(taker).approve(await swap.getAddress(), wanted);
    await swap.connect(taker).fillOrder(2);

    await expect(swap.connect(maker).cancelOrder(2)).to.be.revertedWith('W3BB: order not active');
  });

  it('supports independent, concurrent orders across multiple coin pairs', async () => {
    const { swap, coinA, coinB, maker, taker, admin } = await loadFixture(deployFixture);
    const offered1 = ethers.parseUnits('10', DECIMALS);
    const wanted1 = ethers.parseUnits('5', DECIMALS);
    const offered2 = ethers.parseUnits('20', DECIMALS);
    const wanted2 = ethers.parseUnits('40', DECIMALS);

    // Order 1: maker offers coinA for coinB.
    await coinA.connect(maker).approve(await swap.getAddress(), offered1);
    await swap.connect(maker).createOrder(await coinA.getAddress(), offered1, await coinB.getAddress(), wanted1);

    // Order 2: taker offers coinB for coinA.
    await coinB.connect(taker).approve(await swap.getAddress(), offered2);
    await swap.connect(taker).createOrder(await coinB.getAddress(), offered2, await coinA.getAddress(), wanted2);

    expect(await swap.orderCount()).to.equal(2);

    await coinB.connect(taker).approve(await swap.getAddress(), wanted1);
    await swap.connect(taker).fillOrder(1);

    expect((await swap.orders(1)).active).to.equal(false);
    expect((await swap.orders(2)).active).to.equal(true);
  });
});
