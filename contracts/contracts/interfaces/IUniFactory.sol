// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IUniFactory {
	
	function getPool(address tokenA, address tokenB, uint24 feeTier) external view returns (address pool);
	
}
