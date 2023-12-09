//SPDX-License-Identifier: UNLICENCED
pragma solidity ^0.8.0;

interface ICalculateValues {
    function getRedeemAmount(
        uint256 lpRedeemed,
        uint256 currentPrice,
        uint256 vaultBalance,
        uint256 effectiveExitFees,
        uint256 protocolExitFees
    ) external pure returns (uint256);
    function getProtocolExitFeeAmount (
        uint256 LPTredeemtionAmount,
        uint256 currentPrice,
        uint256 exitFeeParameter
    ) external returns (uint256);
    function getDepositAmount (
        uint256 depositAmount,
        uint256 currentPrice,
        uint256 vaultBalance,
        uint256 entryFeesParameter,
        uint256 protocolEntryFees
    ) external pure returns(uint256);
}