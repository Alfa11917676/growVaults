require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-etherscan");
require("@openzeppelin/hardhat-upgrades");
require("hardhat-deploy");
require("dotenv").config();
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 800,
        details:{
          yul:false
        }
      },
    },
  },

  networks: {
    hardhat: {
      forking: {
        url: "https://eth-goerli.g.alchemy.com/v2/My_CRCTk9LWEvEyXfPzKLFwLgInbpvwz",
      },
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/07447ee41c2f4f4faf367d4ee05f5bb8",
      accounts:
          process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/My_CRCTk9LWEvEyXfPzKLFwLgInbpvwz",
      accounts: [process.env.PRIVATE_KEY || ""],
    },
    mumbai: {
      url:"https://polygon-mumbai.infura.io/v3/f6dc8a7dd1774615b601060937396ee6",
      accounts:
          process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    polygonMainnet: {
      url:"https://polygon-mainnet.g.alchemy.com/v2/86pZbMsdkHqNDBlLcFZKVGvzIY80MAdD",
      accounts:
          process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    fuji: {
      url:"https://api.avax-test.network/ext/bc/C/rpc",
      accounts:
          process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    binance: {
      url:"https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts:
          process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    scroll: {
      url:"https://sepolia-rpc.scroll.io/",
      accounts:
          process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
          gasPrice: 7000000000,
    }
  },
  etherscan: {
    apiKey:{
      goerli: "31WXEYFAGW4JBBSRRJZRJQB2GB5D6MB48W",
      polygonMumbai: "VIT7XVFNT1RIGIMPDPY6QKEVJJ94DSNVVW",
      polygon:  "9UHP9XAJW9C5CGVRG5IQ29ZEKTB7N12TRE",
      bscTestnet: "HKVFDYA4AR7HN7FG59Z7N73MYN1C1M98X4",
      scrollSepolia: '2K2VF77YM7QRYBVST2EJYFJEUTHX22NKC4',
    },
    customChains: [
      {
        network: 'scrollSepolia',
        chainId: 534351,
        urls: {
          apiURL: 'https://sepolia-blockscout.scroll.io/api',
          browserURL: 'https://sepolia-blockscout.scroll.io/',
        },
      },
    ],
  },

//2K2VF77YM7QRYBVST2EJYFJEUTHX22NKC4

  gasReporter: {
    enabled: true,
    outputFile:"gas-report.txt",
    currency: "USD",
    noColors:true,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    token:"MATIC"
  },

};
