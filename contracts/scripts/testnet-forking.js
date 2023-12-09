const hre = require("hardhat");
const {ethers, artifacts, upgrades} = require("hardhat");
const { MockTokenAbi } = require("../artifacts/contracts/mocks/MockToken.sol/demoToken.json");

async function main() {

    const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

    const [owner] = await ethers.getSigners();

    const Vault = await ethers.getContractFactory("vaultContract");
    const vault = await Vault.deploy();
    
    const Factory = await ethers.getContractFactory("vaultFactory");
    const factory = await upgrades.deployProxy(
        Factory,
        [
            vault.address,
            owner.address
        ],
        {
            initializer: "startFactory"
        }
    )

    console.log(
        "Factory deployed to:",
        factory.address
    )

    let tx = await factory.setVaultEntryFeePercentage(ethers.utils.parseEther('0.0995'))
    await tx.wait()
    console.log('Vault Entry Fee Set')
    tx = await factory.setVaultExitFeePercentage(ethers.utils.parseEther('0.0495'))
    await tx.wait()
    console.log('Vault Exit Fee Set')
    tx= await factory.setProtocolExitFees(ethers.utils.parseEther('0.05'))
    await tx.wait()
    console.log('Protocol Exit Fee Set')

        

    const MockToken = new ethers.Contract(
        "0x4ccEFaf65225ed9523EcD8802C75BE557882c1E1",
        MockTokenAbi,
        provider
    );
    console.log("Mock Token Address", MockToken.address);

    let mint = await MockToken.connect(owner).mint(
        owner.address,
        ethers.utils.parseEther('10000')
    );
    await mint.wait()
   
    console.log("Balance of owner:", ethers.utils.formatEther(await MockToken.balanceOf(owner.address)));

    let approval = await MockToken.connect(owner).approve(
        factory.address,
        ethers.utils.parseEther('10000')
    )
    await approval.wait()

    tx = await factory.createVaults(
        "0x4ccEFaf65225ed9523EcD8802C75BE557882c1E1",
        "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
        3000 
    );

    console.log(tx.hash);

    const vaultAddress = await ethers.getContractAt("vaultContract",await factory.tokenVaultAddress(MockToken.address))
    console.log("Vault Address", vaultAddress.address);
    
    approval = await MockToken.connect(owner).approve(
        vaultAddress.address,
        ethers.utils.parseEther('10000')
    );
    await approval.wait();

    let previewDeposit = await vaultAddress.previewDeposit(
        ethers.utils.parseEther('1000')
    );

    console.log("previewDeposit", ethers.utils.formatEther(previewDeposit));

    let minOut = Number(ethers.utils.formatEther(previewDeposit)) - (Number(ethers.utils.formatEther(previewDeposit)) * 0.01)

    console.log("minout", minOut)

    let deposit = await vaultAddress.connect(owner).depositSlippage(
        ethers.utils.parseEther('1000'),
        owner.address,
        ethers.utils.parseEther(minOut.toString())
    );
    await deposit.wait()
    console.log('Deposit Done')

    approval = await vaultAddress.connect(owner).approve(
        vaultAddress.address,
        ethers.utils.parseEther('10000')
    );

    console.log(
        "Price of token:", ethers.utils.formatEther(await vaultAddress.currentPrice())
    );
    console.log(
        "Mock coin balance:", ethers.utils.formatEther(await MockToken.balanceOf(owner.address))
    )
    console.log(
        "Vault coin balance:", ethers.utils.formatEther(await vaultAddress.balanceOf(owner.address))
    )

    let withdraw = await vaultAddress.connect(owner).redeem(
        await vaultAddress.balanceOf(owner.address),
        owner.address,
        owner.address
    );
    await withdraw.wait()

    console.log('Withdraw Done', withdraw)
    console.log(
        "Redeem Preview", ethers.utils.formatEther(await vaultAddress.previewRedeem(
            await vaultAddress.balanceOf(owner.address)
            )
        )
    )
    console.log(
        "Price of token:", ethers.utils.formatEther(await vaultAddress.currentPrice())
    );
    console.log(
        "Mock coin balance:", ethers.utils.formatEther(await MockToken.balanceOf(owner.address))
    )
    console.log(
        "Vault coin balance:", ethers.utils.formatEther(await vaultAddress.balanceOf(owner.address))
    )

   

}

main()