//SPDX-License-Identifier: LICENCED
// EIP 4626.  Non-upgradable once deployed. One vault per asset.
// We will change to not upgradeable. Fees for new vaults can be modified, but not those already deployed. Protocol Fees for existing vaults are immutable.
pragma solidity >=0.8.7;
pragma abicoder v2;

//import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {IERC4626} from "@openzeppelin/contracts/interfaces/IERC4626.sol";
import {calculateRedeemValues} from "../utils/calculateRedeemValues.sol";
import {ERC4626Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol";
import {IERC20MetadataUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IUniFactory.sol";
import "hardhat/console.sol";

contract vaultContract is ERC4626Upgradeable, calculateRedeemValues {
    address public treasuryAddress;
    uint256 public entryFeeParameter;
    uint256 public exitFeeParameter;
    uint256 public protocolExitFee;
    uint256 public totalRewardAccumulated;

    function init(
        IERC20MetadataUpgradeable asset_,
        string memory LPTokenName,
        string memory LPTokenSymbol,
        address _treasuryAddress,
        uint256 _entryFeeParameter,
        uint256 _exitFeeParameter,
        uint256 _protocolExitFeeParameter
    ) external initializer {
        __ERC4626_init(asset_);
        __ERC20_init(LPTokenName, LPTokenSymbol);
        _mint(address(1), 0.0001 ether);
        entryFeeParameter = _entryFeeParameter;
        exitFeeParameter = _exitFeeParameter;
        protocolExitFee = _protocolExitFeeParameter;
        treasuryAddress = _treasuryAddress;
    }

    function deposit(uint256 assets, address receiver) public virtual override returns (uint256) {
        uint256 shares = getDepositAmount(
            assets,
            currentPrice(),
            entryFeeParameter,
            0
        );
        IERC20MetadataUpgradeable(asset()).transferFrom(msg.sender, address(this), assets);
        _mint( receiver, shares);
        emit Deposit(msg.sender, receiver, assets, shares);
        return assets;
    }

    /// @notice added slippage tolerance
    function depositSlippage(uint256 assets, address receiver, uint256 minAmount) public returns (uint256) {
        uint256 shares = getDepositAmount(
            assets,
            currentPrice(),
            entryFeeParameter,
            0
        );
        require (shares >= minAmount, "Error: minAmount is less than expected shares amount");
        IERC20MetadataUpgradeable(asset()).transferFrom(receiver, address(this), assets);
        _mint( receiver, shares);
        emit Deposit(msg.sender, receiver, assets, shares);
        return assets;
    }

    function currentPrice () public view returns (uint256) {
        uint256 vaultBalance = totalAssets();
        uint256 _currentPrice = vaultBalance * 1 ether / totalSupply();
        return _currentPrice;
    }

    ///  @notice these values are not including taxes and fees
    function convertToShares(uint256 assets) public view virtual override returns (uint256 shares) {
        shares = (assets * 1 ether) / currentPrice();
        return shares;
    }

    ///  @notice these values are not including taxes and fees
    function convertToAssets(uint256 shares) public view virtual override returns (uint256 assets) {
         assets = (shares * 1 ether) / currentPrice();
        return assets;
    }

    function redeem(
        uint256 shares,
        address receiver,
        address owner
    ) public virtual override returns (uint256)  {
        if (owner != msg.sender) {
            if (shares > allowance(owner,msg.sender))
                revert("Caller doesn't have permission from owner to take share");
        }
        uint256 assets = getRedeemAmount(
            shares,
            currentPrice(),
            totalAssets(),
            exitFeeParameter,
            protocolExitFee
        );
        uint256 _ProtocolExitFees = getProtocolExitFeeAmount(
            shares,
            currentPrice(),
            protocolExitFee
        );
        _burn(owner, shares);
        sendProtocolFees(treasuryAddress, _ProtocolExitFees);
        IERC20MetadataUpgradeable(asset()).transfer(receiver, assets);
        emit Withdraw(msg.sender, receiver, owner, assets, shares);
        return shares;
    }
    
    function redeemSlippage(
        uint256 shares,
        uint256 minimumReceivableAmount,
        address receiver,
        address owner
    ) public virtual returns (uint256) {
        if (owner != msg.sender) {
            if (shares > allowance(owner,msg.sender))
                revert("Caller doesn't have permission from owner to take share");
        }
        uint256 assets = getRedeemAmount(
            shares,
            currentPrice(),
            totalAssets(),
            exitFeeParameter,
            protocolExitFee
        );
        require ( assets >= minimumReceivableAmount, "Error: minimumReceivableAmount is less than expected assets amount");
        uint256 _ProtocolExitFees = getProtocolExitFeeAmount(
            shares,
            currentPrice(),
            protocolExitFee
        );
        _burn(owner, shares);
        sendProtocolFees(treasuryAddress, _ProtocolExitFees);
        IERC20MetadataUpgradeable(asset()).transfer(receiver, assets);
        emit Withdraw(msg.sender, receiver, owner, assets, shares);
        return shares;
    }

    function totalAssets() public view virtual override returns (uint256) {
        return IERC20MetadataUpgradeable(asset()).balanceOf(address(this));
    }

    function depositReward(uint256 collateralAmount) external {
        totalRewardAccumulated += collateralAmount;
        IERC20MetadataUpgradeable(asset()).transferFrom(msg.sender, address(this), collateralAmount);
    }

    function sendProtocolFees(address _to, uint256 _amount) internal {
        IERC20MetadataUpgradeable(asset()).transfer(_to, _amount);
    }

    /** @dev See {IERC4262-maxDeposit}. */
    function maxDeposit(address) public view virtual override returns (uint256) {
        return 2 ** 256 - 1;
    }

    /** @dev See {IERC4262-maxMint}. */
    function maxMint(address) public view virtual override returns (uint256) {
        revert("Error: This function is not allowed");
    }

    /** @dev See {IERC4262-maxWithdraw}. */
    function maxWithdraw(address ) public view virtual override returns (uint256) {
        revert("Error: This function is not allowed");
    }

    /** @dev See {IERC4262-maxRedeem}. */
    function maxRedeem(address owner) public view virtual override returns (uint256) {
        return balanceOf(owner);
    }

    /** @dev See {IERC4262-previewDeposit}. */
    function previewDeposit(uint256 assets) public view virtual override returns (uint256) {
        uint256 shares = getDepositAmount(
            assets,
            currentPrice(),
            entryFeeParameter,
            0
        );
        return (shares);
    }

    /** @dev See {IERC4262-previewMint}. */
    function previewMint(uint256 ) public view virtual override returns (uint256) {
        revert("Error: This function is not allowed");
    }

    /** @dev See {IERC4262-previewWithdraw}. */
    function previewWithdraw(uint256 ) public view virtual override returns (uint256) {
        revert("Error: This function is not allowed");
    }

    /** @dev See {IERC4262-previewRedeem}. */
    function previewRedeem(uint256 shares) public view virtual override returns (uint256) {
        uint256 assets = getRedeemAmount(
            shares,
            currentPrice(),
            totalAssets(),
            exitFeeParameter,
            protocolExitFee
        );
        return assets;
    }

    /** @dev See {IERC4262-mint}. */
    function mint(uint256 , address ) public virtual override returns (uint256) {
        revert("Error: This function is not allowed");
    }

    /** @dev See {IERC4262-withdraw}. */
    function withdraw(
        uint256 ,
        address ,
        address
    ) public virtual override returns (uint256) {
        revert("Error: This function is not allowed");
    }
}
