// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract mockToken is ERC20, Ownable {
    constructor(string memory name) ERC20(name, name) {}

    function mint(address to, uint256 amount) public  {
        _mint(to, amount);
    }
}
