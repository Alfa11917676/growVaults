//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";

interface IVault is IERC20Upgradeable{
    function init(
        IERC20MetadataUpgradeable asset_,
        string memory LPTokenName,
        string memory LPTokenSymbol,
        address _treasuryAddress,
        uint256 _entryFeeParameter,
        uint256 _exitFeeParameter,
        uint256 _protocolExitFeeParameter
    ) external;
}
