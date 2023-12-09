const hre = require("hardhat");
const {ethers, artifacts, upgrades} = require("hardhat");

async function main() {
    [alfa] = await ethers.getSigners()

    Factory = await ethers.getContractFactory('vaultFactory')
    factory = Factory.attach("0x058b4517E6db66e96f552Cb3cA1B7E4655053227")
    Token = await ethers.getContractFactory('mockToken')
    token = Token.attach("0x491866Bacda37014B0591DF649dCb2E12D2A37C4")



    console.log("Alfa's address", alfa.address)

    // let vaultAddress= await factory.tokenVaultAddress('0xB15Cef218a2232f35BeF1df03D8967eACc16e9DA')
    let mint = await token.mint("0x5d0c83A6bd7bf1986E5519C766f6568D2B390dE0", ethers.utils.parseEther('10000000'))
    await mint.wait();
    console.log(
        "balance of Ashwin", ethers.utils.formatEther(await token.balanceOf(
            "0x5d0c83A6bd7bf1986E5519C766f6568D2B390dE0"
        ))
    );

    // let tx = await token.approve(factory.address, ethers.utils.parseEther('10000000'))
    // await tx.wait();
    // console.log("Demo token approved");
    
    // tx =  await factory.createVaults(
    //         '0x491866Bacda37014B0591DF649dCb2E12D2A37C4',
    //     );
    // await tx.wait();
    // console.log('Vault Created')
    // //
    // console.log("Vault Address", await factory.tokenVaultAddress(token.address));

    // const Vault = await ethers.getContractFactory('vaultContract')
    // vault = Vault.attach(await factory.tokenVaultAddress(token.address))
    // // //
   
    // let approve = await token.approve(vault.address, ethers.utils.parseEther('10000'))
    // await approve.wait()

    // tx = await vault.approve(vault.address, await vault.balanceOf(alfa.address))
    // await tx.wait()
    // tx = await vault.deposit(ethers.utils.parseEther('1000'), alfa.address)
    // await tx.wait()
    // console.log('Deposit Done')
        
    // let previewDeposit = await vault.previewDeposit(
    //     ethers.utils.parseEther('1000')
    // );

    // console.log("previewDeposit", ethers.utils.formatEther(previewDeposit));

    // let minOut = Number(ethers.utils.formatEther(previewDeposit)) - (Number(ethers.utils.formatEther(previewDeposit)) * 0.01)

    // console.log("minout", minOut)

    // let deposit = await vault.connect(alfa).callStatic.depositSlippage(
    //     ethers.utils.parseEther('1000'),
    //     alfa.address,
    //     ethers.utils.parseEther(minOut.toString())
    // );
    // console.log(deposit)
    // await deposit.wait()
    // console.log('Deposit Done')



    // tx = await vault.redeem(
    //         ethers.utils.parseEther('100'),
    //         alfa.address,
    //         alfa.address
    // )
    // await tx.wait()
    // console.log('Redeem Done')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
