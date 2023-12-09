//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {vaultSpawner} from "../proxies/vaultSpawwner.sol";
import {iCollateralAssets} from "../interfaces/ICollateralAssets.sol";
import {IVault} from "../interfaces/IVault.sol";
import "./vaultContract.sol";

contract vaultFactory is OwnableUpgradeable, vaultSpawner{

    mapping (address => bool) public tokenRegistry;
    mapping (address => address) public tokenVaultAddress;
    address public globalVaultImplementationAddress;
    address public treasuryAddress;
    uint256 public protocolExitFees;
    uint256 public vaultEntryFeePercentage;
    uint256 public vaultExitFeePercentage;
    
    event VaultCreated (address indexed _collateralToken, address indexed vaultAddress);

    function startFactory (address _globalVaultImplementationAddress, address _treasuryAddress) external initializer {
        __Ownable_init();
        globalVaultImplementationAddress = _globalVaultImplementationAddress;
        treasuryAddress = _treasuryAddress;
    }

    function setTreasuryAddress (address _treasuryAddress) external onlyOwner {
        treasuryAddress = _treasuryAddress;
        protocolExitFees = 0.05 ether;
    }
    
    function setProtocolExitFees (uint256 _protocolExitFees) external onlyOwner {
        protocolExitFees = _protocolExitFees;
    }
    
    function setGlobalVaultImplementationAddress (address _globalVaultImplementationAddress) external onlyOwner {
        globalVaultImplementationAddress = _globalVaultImplementationAddress;
    }
    
    function setVaultEntryFeePercentage (uint256 _vaultEntryFeePercentage) external onlyOwner {
        vaultEntryFeePercentage = _vaultEntryFeePercentage;
    }
    
    function setVaultExitFeePercentage (uint256 _vaultExitFeePercentage) external onlyOwner {
        vaultExitFeePercentage = _vaultExitFeePercentage;
    }
    
    function createVaults(address _collateralAsset) external {
        require(_collateralAsset != address(0), "Error: Invalid Collateral Asset Address");
        require(vaultExitFeePercentage != 0, "Error: Vault Exit Fee Percentage not set");
        require(vaultEntryFeePercentage != 0, "Error: Vault Entry Fee Percentage not set");
        
        if (tokenRegistry[_collateralAsset]) {
            revert('Error: Sorry, this asset already has a vault deployed.');
        }
        bytes32 salt = keccak256(abi.encodePacked(_collateralAsset,msg.sender,block.timestamp));
        address newDeployedProxy;
        string memory LPTokenName = iCollateralAssets(_collateralAsset).name();
        string memory LPTokenSymbol = iCollateralAssets(_collateralAsset).symbol();
        LPTokenName = string (abi.encodePacked("Grow_Vaults ",LPTokenName));
        LPTokenSymbol = string (abi.encodePacked("gv",LPTokenSymbol));
        bytes memory vaultByteCode = type(vaultContract).creationCode;
        assembly {
            newDeployedProxy := create2(0, add(vaultByteCode, 32), mload(vaultByteCode), salt)
            if iszero(extcodesize(newDeployedProxy)) {
                revert ("Vault Proxy Code", 0)
            }
        }
        IVault(newDeployedProxy).init(
                IERC20MetadataUpgradeable(_collateralAsset),
                LPTokenName,
                LPTokenSymbol,
                treasuryAddress,
                vaultEntryFeePercentage,
                vaultExitFeePercentage,
                protocolExitFees
        );
        IERC20Upgradeable(_collateralAsset).transferFrom(msg.sender, newDeployedProxy, 0.0001 ether);
        tokenRegistry[_collateralAsset] = true;
        tokenVaultAddress[_collateralAsset] = newDeployedProxy;
        emit VaultCreated(_collateralAsset, newDeployedProxy);
    }

}
