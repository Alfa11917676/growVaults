const { expect } = require("chai");
const { ethers } = require("hardhat");
const { upgrades } = require("hardhat");
const Web3 = require("web3");
const {fromWei} = Web3.utils;
const {artifacts} = require ("hardhat");

describe ('Test-Suite: Testing Factory To Deploy Vaults', async() => {
    let alice, bob, charlie, dorothy,elsa, fred, gar, henry, treasury, demo1, demo2, demo3, calculationHelper, factory,vault1, vault2;
    before ('Test-Suite: Setting Up The Test Suite', async() => {
        [alice, bob, charlie, treasury, dorothy,elsa, fred, gar, henry] = await ethers.getSigners()
        Demo = await ethers.getContractFactory('demoToken')
        demo1 = await Demo.deploy('demoToken')
        demo2 = await Demo.deploy('demoToken')
        demo3 = await Demo.deploy('demoToken')
        CalculationHelper = await ethers.getContractFactory('calculateRedeemValues')
        Factory = await ethers.getContractFactory('vaultFactory')
        Vault = await ethers.getContractFactory('vaultContract')
        calculationHelper = await CalculationHelper.deploy()
        vault = await Vault.deploy()
        factory = await upgrades.deployProxy(Factory,[vault.address, treasury.address],{"initializer":"startFactory"});
        await demo1.mint(alice.address, ethers.utils.parseEther('10000000001'))
        await demo1.mint(bob.address, ethers.utils.parseEther('20'))
        await demo1.mint(charlie.address, ethers.utils.parseEther('50'))
        await demo1.mint(dorothy.address, ethers.utils.parseEther('100'))
        await demo1.mint(elsa.address, ethers.utils.parseEther('100'))
        await demo1.mint(fred.address, ethers.utils.parseEther('11000'))
        await demo1.connect(alice).approve(factory.address,ethers.utils.parseEther('10000000'))

    })
    it ('Depositing ', async() => {
            await factory.createVaults(
                demo1.address,
                ethers.utils.parseEther('0.0995'),
                ethers.utils.parseEther('0.0495'),
                ethers.utils.parseEther('0.0000'),
                ethers.utils.parseEther('0.05')
            );
            let vaultAddress= await factory.tokenVaultAddress(demo1.address)
            let {abi:vault} = await artifacts.readArtifact("vaultContract")
            vault1 = new ethers.Contract(vaultAddress,vault,ethers.getDefaultProvider())
            console.log('Name of the token-',await vault1.connect(alice).name())
            console.log('Symbol of the token-',await vault1.connect(alice).symbol())
            await demo1.connect(alice).approve(vault1.address,ethers.utils.parseEther('1000000000') )
            await demo1.connect(bob).approve(vault1.address,ethers.utils.parseEther('100000') )
            await demo1.connect(charlie).approve(vault1.address,ethers.utils.parseEther('100000') )
            await demo1.connect(dorothy).approve(vault1.address,ethers.utils.parseEther('100000') )
            await demo1.connect(elsa).approve(vault1.address,ethers.utils.parseEther('100000') )
            await demo1.connect(fred).approve(vault1.address,ethers.utils.parseEther('100000') )
            let data  = await vault1.connect(alice).currentPrice()
            console.log('Current Price Of LP Before Deposit ',fromWei(data.toString(),'ether'))

            console.log('--------------DEPOSIT OF 100------------------')
        let currentPriceIn = await vault1.connect(dorothy).currentPrice()
        console.log('Price of Vault token: ', fromWei(currentPriceIn.toString(), 'ether'))
        let minOut = await vault1.connect(dorothy).previewDeposit(ethers.utils.parseEther('100'))
        console.log('MinOut: ', fromWei(minOut.toString(), 'ether'))
        minOut = Number(ethers.utils.formatEther(minOut)) - (Number(ethers.utils.formatEther(minOut)) * 0.01)
        await vault1.connect(dorothy).depositSlippage(ethers.utils.parseEther('100'),dorothy.address, )
        let DorothyData = await vault1.connect(dorothy).balanceOf(dorothy.address)
        console.log('Vault Token received by dorothy: ', fromWei(DorothyData.toString(), 'ether'))
        let amountIn = await vault1.connect(dorothy).totalAssets()
        console.log('Total tokens deposited by dorothy(excluding fees): ', fromWei(amountIn.toString(), "ether"))
        let totalSupplyOfLPTokenIn = await vault1.connect(dorothy).totalSupply()
        console.log('Total supply of Vault token: ', fromWei(totalSupplyOfLPTokenIn.toString(), 'ether'))
        currentPriceIn = await vault1.connect(dorothy).currentPrice()
        console.log('Price of Vault token: ', fromWei(currentPriceIn.toString(), 'ether'))
        console.log('Total fees accumulated: ', fromWei((await demo1.connect(dorothy).balanceOf(treasury.address)).toString(), 'ether'));
        console.log('=====================================');
            for (let i=0;i < 100; i++)    {
            await vault1.connect(alice).deposit(ethers.utils.parseEther('100'),alice.address)
            // let AliceLPBalance = await vault1.connect(alice).balanceOf(alice.address)
            // console.log('Vault Token received by Alice: ', fromWei(AliceLPBalance.toString(), 'ether'))
            // let amount = await vault1.connect(alice).totalAssets()
            // console.log('Total tokens deposited by Alice(excluding fees): ', fromWei(amount.toString(), "ether"))
            // let totalSupplyOfLPToken = await vault1.connect(alice).totalSupply()
            // console.log('Total supply of Vault token: ', fromWei(totalSupplyOfLPToken.toString(), 'ether'))
            // let currentPrice = await vault1.connect(alice).currentPrice()
            // console.log('Price of Vault token: ', fromWei(currentPrice.toString(), 'ether'))
            // console.log('Total fees accumulated: ', fromWei((await demo1.connect(alice).balanceOf(treasury.address)).toString(), 'ether'));
                console.log('----------------------------------------------------');
            if (i%5 === 0) {
                console.log('----------------Reward Deposited----------------------');
                let reward = await vault1.connect(fred).depositReward(ethers.utils.parseEther('25'))
                console.log("Price of token after Reward Deposit: ", fromWei((await vault1.connect(fred).currentPrice()).toString(), 'ether'));
                console.log('----------------------------------------------------');
            }
        }

            console.log("Total rewards from uniswap swapping fees: ", fromWei((await vault1.connect(alice).totalRewardAccumulated()).toString(), 'ether'));
        console.log('==============================================');
            console.log("Dorothy exiting");

        await vault1.connect(dorothy).approve(dorothy.address, await vault1.connect(dorothy).balanceOf(dorothy.address))
        console.log('Balance before redemption', ethers.utils.formatEther(await demo1.connect(dorothy).balanceOf(dorothy.address)))
        console.log('Balance of vault', ethers.utils.formatEther(await demo1.connect(dorothy).balanceOf(vault1.address)))
        await vault1.connect(dorothy).redeem(await vault1.connect(dorothy).balanceOf(dorothy.address), dorothy.address, dorothy.address)
        console.log('redemptionAmount', ethers.utils.formatEther(await demo1.connect(dorothy).balanceOf(dorothy.address)))
        console.log('newVaultBalance ',ethers.utils.formatEther(await vault1.connect(dorothy).totalAssets()))
        console.log('newSupply',ethers.utils.formatEther(await vault1.connect(dorothy).totalSupply()))
        console.log('Price of Vault token: ', fromWei((await vault1.connect(dorothy).currentPrice()).toString(),'ether'))
        console.log('protocolFeeAmount accumulated ', fromWei((await demo1.connect(dorothy).balanceOf(treasury.address)).toString(),'ether'));


        console.log('================Elsa Entering the Vault==============================');
        await vault1.connect(elsa).deposit(ethers.utils.parseEther('100'),elsa.address)
        let AliceLPBalance = await vault1.connect(alice).balanceOf(elsa.address)
        console.log('Vault Token received by Alice: ', fromWei(AliceLPBalance.toString(), 'ether'))
        let amount = await vault1.connect(alice).totalAssets()
        console.log('Total tokens deposited by Alice(excluding fees): ', fromWei(amount.toString(), "ether"))
        let totalSupplyOfLPToken = await vault1.connect(alice).totalSupply()
        console.log('Total supply of Vault token: ', fromWei(totalSupplyOfLPToken.toString(), 'ether'))
        let currentPrice = await vault1.connect(alice).currentPrice()
        console.log('Price of Vault token: ', fromWei(currentPrice.toString(), 'ether'))
        console.log('Total fees accumulated: ', fromWei((await demo1.connect(alice).balanceOf(treasury.address)).toString(), 'ether'));


        await vault1.connect(fred).deposit(ethers.utils.parseEther('100'),fred.address)

        console.log('=================Intermediate Trade Happening=============================');
        // for (let i=0;i < 100; i++)    {
        //     await vault1.connect(alice).deposit(ethers.utils.parseEther('100'),alice.address)
        //      AliceLPBalance = await vault1.connect(alice).balanceOf(alice.address)
        //     console.log('Vault Token received by Alice: ', fromWei(AliceLPBalance.toString(), 'ether'))
        //      amount = await vault1.connect(alice).totalAssets()
        //     console.log('Total tokens deposited by Alice(excluding fees): ', fromWei(amount.toString(), "ether"))
        //      totalSupplyOfLPToken = await vault1.connect(alice).totalSupply()
        //     console.log('Total supply of Vault token: ', fromWei(totalSupplyOfLPToken.toString(), 'ether'))
        //      currentPrice = await vault1.connect(alice).currentPrice()
        //     console.log('Price of Vault token: ', fromWei(currentPrice.toString(), 'ether'))
        //     console.log('Total fees accumulated: ', fromWei((await demo1.connect(alice).balanceOf(treasury.address)).toString(), 'ether'));
        //     console.log('----------------------------------------------------');
        //     if (i%10 === 0) {
        //         await vault1.connect(fred).approve(vault1.address, ethers.utils.parseEther('10000000001'))
        //         let balance = await vault1.connect(alice).balanceOf(fred.address)
        //         balance = ethers.utils.formatEther(balance)
        //         balance = parseInt(balance) * 0.1
        //         await vault1.connect(fred).redeem(ethers.utils.parseEther(balance.toString()), fred.address, fred.address)
        //     }
        // }


        console.log('=================Elsa Exiting the Vault=============================');

        await vault1.connect(elsa).approve(elsa.address, await vault1.connect(dorothy).balanceOf(elsa.address))
        console.log('Balance before redemption', ethers.utils.formatEther(await demo1.connect(dorothy).balanceOf(dorothy.address)))
        console.log('Balance of vault', ethers.utils.formatEther(await demo1.connect(dorothy).balanceOf(vault1.address)))
        await vault1.connect(elsa).redeem(await vault1.connect(dorothy).balanceOf(elsa.address), elsa.address, elsa.address)
        console.log('redemptionAmount', ethers.utils.formatEther(await demo1.connect(dorothy).balanceOf(elsa.address)))
        console.log('newVaultBalance ',ethers.utils.formatEther(await vault1.connect(dorothy).totalAssets()))
        console.log('newSupply',ethers.utils.formatEther(await vault1.connect(dorothy).totalSupply()))
        console.log('Price of Vault token: ', fromWei((await vault1.connect(dorothy).currentPrice()).toString(),'ether'))
        console.log('protocolFeeAmount accumulated ', fromWei((await demo1.connect(dorothy).balanceOf(treasury.address)).toString(),'ether'));

    })

    it ('Withdrawing', async()=> {
        console.log('-------------------WITHDRAW OF All SHARES---------------------')
        await vault1.connect(alice).approve(bob.address, await vault1.connect(alice).balanceOf(alice.address))
        console.log('Balance before redemption', ethers.utils.formatEther(await demo1.connect(alice).balanceOf(charlie.address)))
        console.log('Balance of vault', ethers.utils.formatEther(await demo1.connect(alice).balanceOf(vault1.address)))
        await vault1.connect(bob).redeem(await vault1.connect(alice).balanceOf(alice.address), charlie.address, alice.address)
        console.log('redemptionAmount', ethers.utils.formatEther(await demo1.connect(alice).balanceOf(elsa.address)))
        console.log('newVaultBalance ',ethers.utils.formatEther(await vault1.connect(charlie).totalAssets()))
        console.log('newSupply',ethers.utils.formatEther(await vault1.connect(alice).totalSupply()))
        console.log('Price of Vault token: ', fromWei((await vault1.connect(alice).currentPrice()).toString(),'ether'))
        console.log('protocolFeeAmount accumulated ', fromWei((await demo1.connect(alice).balanceOf(treasury.address)).toString(),'ether'));
        console.log('------------DEPOSIT OF 1000 TOKENS----------------')
        await vault1.connect(fred).deposit(ethers.utils.parseEther('1000'),alice.address)
        console.log('LPTrecevied ', ethers.utils.formatEther(await vault1.connect(alice).balanceOf(alice.address)))
        console.log('newVaultBalance ',ethers.utils.formatEther(await vault1.connect(charlie).totalAssets()))
        console.log('newSupply',ethers.utils.formatEther(await vault1.connect(alice).totalSupply()))
        console.log('Price of Vault token:  ', fromWei((await vault1.connect(alice).currentPrice()).toString(),'ether'))
        console.log('protocolFeeAmount accumulated ', fromWei((await demo1.connect(alice).balanceOf(treasury.address)).toString(),'ether'));
        console.log('-------------------WITHDRAW OF REST Of THE ASSETS---------------------')
        balanceBeforeFinalRedeem = ethers.utils.formatEther(await demo1.connect(alice).balanceOf(alice.address))
        await vault1.connect(alice).redeem(await vault1.connect(alice).balanceOf(alice.address),alice.address,alice.address)
        balanceAfterFinalRedeem = ethers.utils.formatEther(await demo1.connect(alice).balanceOf(alice.address))
        // console.log('redemptionAmount', parseInt(balanceAfterFinalRedeem) - parseInt(balanceBeforeFinalRedeem))
        console.log('newVaultBalance ',ethers.utils.formatEther(await vault1.connect(charlie).totalAssets()))
        console.log('newSupply',ethers.utils.formatEther(await vault1.connect(alice).totalSupply()))
        console.log('Price of Vault token:  ', fromWei((await vault1.connect(alice).currentPrice()).toString(),'ether'))
        console.log('protocolFeeAmount accumulated ', fromWei((await demo1.connect(alice).balanceOf(treasury.address)).toString(),'ether'));

    })
        // Expected Value : 9.0905,
        // Current Value: 0.867579908675799086
})
