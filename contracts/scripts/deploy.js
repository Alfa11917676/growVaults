const hre = require("hardhat");
const {ethers, upgrades} = require("hardhat");


async function main() {
    [alfa] = await ethers.getSigners()
    const demoToken = await ethers.getContractFactory('mockToken')
    demo1 = await demoToken.deploy('ETH_INDIA')
    await demo1.deployed()
    console.log('ETH_INDIA address', demo1.address)

    // Factory = await ethers.getContractFactory('vaultFactory')
    // let Vault = await ethers.getContractFactory('vaultContract')
    // let vault = await Vault.deploy()
    // await vault.deployed();
    // console.log('Vault deployed')
    // factory = await upgrades.deployProxy(Factory,[vault.address, alfa.address],{"initializer":"startFactory"});
    // await factory.deployed()
    // console.log('Factory contract address', factory.address)
    // //
    // //
    // let tx = await factory.setVaultEntryFeePercentage(ethers.utils.parseEther('0.0995'))
    // await tx.wait()
    // console.log('Vault Entry Fee Set')
    // tx = await factory.setVaultExitFeePercentage(ethers.utils.parseEther('0.0495'))
    // await tx.wait()
    // console.log('Vault Exit Fee Set')
    // tx= await factory.setProtocolExitFees(ethers.utils.parseEther('0.05'))
    // await tx.wait()
    // console.log('Protocol Exit Fee Set')
    // tx = await demo1.mint(alfa.address, ethers.utils.parseEther('100000'))
    // await tx.wait()

    await verify(demo1.address,['ETH_INDIA'])
    // await verify(factory.address,[])
    // await verify(vault.address,[])
}
async function verify (contractAddress, args) {
    console.log('----------------Verification Started------------------')
    try {
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    }catch (e) {
        console.log('The error is ', e)
    }
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
