//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "hardhat/console.sol";
contract calculateRedeemValues {
    
    function
    getRedeemAmount (uint256 LPTredeemed, uint256 currentPrice, uint256 vaultBalance, uint256 effectiveExitFees, uint256 protocolExitFees) public pure returns (uint256) {
        uint256 x = getX(LPTredeemed, currentPrice);
        uint256 y = getY(x, vaultBalance);
        uint256 z=  getZ(y, effectiveExitFees);
        uint256 alpha = getAlpha(z, protocolExitFees);
        uint256 finalResult = (x * alpha) / (1 ether * 1 ether);
        return finalResult;
    }
    
    function getProtocolExitFeeAmount (uint256 LPTredeemed, uint256 currentPrice, uint256 protocolExitFee ) public pure returns (uint256) {
        return (LPTredeemed * currentPrice * protocolExitFee) / (1 ether * 1 ether) ;
    }
    
    function getX (uint256 LPTredeemed, uint256 currentPrice) internal pure returns (uint256) {
        return (LPTredeemed * currentPrice);
    }
    
    function getY (uint256 x, uint256 vaultBalance) internal pure returns (uint256) {
        return (x/vaultBalance);
    }
    
    function getZ (uint256 y, uint256 effectiveExitFees) internal pure returns (uint256) {
        return effectiveExitFees * (1 ether - y);
    }
    
    function getAlpha (uint256 z, uint256 protocolExitFees) internal pure returns (uint256) {
        return ( 1 ether - (z/1 ether) - protocolExitFees);
    }
    
    
    // depositAmount - 9.95% / currentTokenPrice;
    function getDepositAmount (
        uint256 depositAmount,
        uint256 currentPrice,
        uint256 entryFeesParameter,
        uint256 protocolEntryFees
    ) public pure returns(uint256) {
        uint256 amountAfterTax = depositAmount - ((depositAmount * entryFeesParameter / 1 ether) + (depositAmount * protocolEntryFees / 1 ether));
        uint256 totalReceivableShares = (amountAfterTax * 1 ether) / currentPrice;
        return totalReceivableShares;
    }
}
