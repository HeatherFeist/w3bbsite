// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title W3BB Coin Swap
/// @notice A minimal, escrow-based limit-order contract for trading
/// between different businesses' W3BBBusinessCoin tokens (or any other
/// ERC-20) on a testnet, for simulating a stock-exchange-style trading
/// experience. This is deliberately simple: a maker locks up the token
/// they're offering, and any taker can fill the order in full at the
/// maker's stated rate, or the maker can cancel and reclaim their tokens
/// before it's filled. No partial fills, no order matching/pricing engine,
/// no custody of funds beyond the single escrowed order amount, and no
/// path for real-money payment of any kind — it only ever moves the ERC-20
/// tokens the maker and taker already hold.
///
/// TECHNOLOGY READINESS ONLY — see contracts/BUSINESS_COIN_README.md. This
/// contract is intended for testnet use with test tokens while the
/// business-coin concept is under legal review, not for real-value trading.
contract W3BBCoinSwap is ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Order {
        address maker;
        address tokenOffered;
        uint256 amountOffered;
        address tokenWanted;
        uint256 amountWanted;
        bool active;
    }

    /// @notice All orders ever created, indexed by order ID starting at 1.
    mapping(uint256 => Order) public orders;

    /// @notice Number of orders created so far. The most recently created
    /// order's ID.
    uint256 public orderCount;

    event OrderCreated(
        uint256 indexed orderId,
        address indexed maker,
        address indexed tokenOffered,
        uint256 amountOffered,
        address tokenWanted,
        uint256 amountWanted
    );
    event OrderFilled(uint256 indexed orderId, address indexed taker);
    event OrderCancelled(uint256 indexed orderId);

    /// @notice Create a new limit order: escrow `amountOffered` of
    /// `tokenOffered` in this contract, offering to trade it for
    /// `amountWanted` of `tokenWanted`. The caller must have approved this
    /// contract to spend at least `amountOffered` of `tokenOffered`
    /// beforehand.
    /// @return orderId The ID of the newly created order.
    function createOrder(
        address tokenOffered,
        uint256 amountOffered,
        address tokenWanted,
        uint256 amountWanted
    ) external nonReentrant returns (uint256 orderId) {
        require(tokenOffered != address(0) && tokenWanted != address(0), "W3BB: token required");
        require(tokenOffered != tokenWanted, "W3BB: tokens must differ");
        require(amountOffered > 0, "W3BB: amountOffered must be positive");
        require(amountWanted > 0, "W3BB: amountWanted must be positive");

        orderCount += 1;
        orderId = orderCount;

        orders[orderId] = Order({
            maker: msg.sender,
            tokenOffered: tokenOffered,
            amountOffered: amountOffered,
            tokenWanted: tokenWanted,
            amountWanted: amountWanted,
            active: true
        });

        IERC20(tokenOffered).safeTransferFrom(msg.sender, address(this), amountOffered);

        emit OrderCreated(orderId, msg.sender, tokenOffered, amountOffered, tokenWanted, amountWanted);
    }

    /// @notice Fill an active order in full. The caller must have approved
    /// this contract to spend at least the order's `amountWanted` of
    /// `tokenWanted` beforehand. On success, the taker receives the
    /// escrowed `amountOffered` of `tokenOffered`, and the maker receives
    /// `amountWanted` of `tokenWanted` directly from the taker.
    function fillOrder(uint256 orderId) external nonReentrant {
        Order storage order = orders[orderId];
        require(order.active, "W3BB: order not active");

        order.active = false;

        IERC20(order.tokenWanted).safeTransferFrom(msg.sender, order.maker, order.amountWanted);
        IERC20(order.tokenOffered).safeTransfer(msg.sender, order.amountOffered);

        emit OrderFilled(orderId, msg.sender);
    }

    /// @notice Cancel an order the caller created, returning the escrowed
    /// tokens to them. Only the maker can cancel, and only while the order
    /// is still active.
    function cancelOrder(uint256 orderId) external nonReentrant {
        Order storage order = orders[orderId];
        require(order.active, "W3BB: order not active");
        require(order.maker == msg.sender, "W3BB: not order maker");

        order.active = false;

        IERC20(order.tokenOffered).safeTransfer(order.maker, order.amountOffered);

        emit OrderCancelled(orderId);
    }
}
