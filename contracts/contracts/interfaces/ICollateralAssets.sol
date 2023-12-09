// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
interface iCollateralAssets is IERC20Upgradeable{

    function name() external returns (string memory);
    function symbol() external returns (string memory);

}
