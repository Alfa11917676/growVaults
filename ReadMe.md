# 🤖 Wallet Whisperer
## 🌟 Project Tagline
🔗 Arch's Vault offers a liquid staking model tailored for new coins, amplifying community engagement and asset value.

## 📄 Description
🚀 This vault is designed to grow the LP's price overtime with increase in interaction of the vault. This vault is designed to incentivise people who are interested in staying staked and penalise who wants to pump and dump the token.

## 🚀 How It Works
- Deposit: 🆕 Users deposit the tokens on the vault at a given price, for which they will receive vault shares worth same minus the protocol tax.
- Stay Calm and watch: After depositing, stay relaxed and watch more people interacting with the vault thus increasing your share's value.
- Withdraw: Once the you feel, you have got enough profit go to withdraw and burn the vault shares for tokens worth the amount of shares you burnt.
## 🤔 Problem Statement
💡 Most coins in ICOs and meme coins need help with value retention due to their reliance on social momentum and lack of financial incentives. This volatility necessitates strategies for long-term holding and stability.
These coins often need help maintaining value, mainly stemming from a lack of inherent utility or financial incentives to hold them. Unlike more established cryptocurrencies, which may offer staking, governance, or other value-generating activities, meme coins typically operate on the principle of social momentum. 
While this can result in rapid appreciation, it sets the stage for dramatic downturns, as investors are prone to "dump" their holdings without long-term value drivers. 
This lack of structural incentives creates a volatile environment where the asset's value is highly susceptible to market sentiment, making it challenging for meme coins to sustain value over time. 
Consequently, crafting strategies to incentivise long-term holding and discourage dumping becomes imperative for these assets to achieve lasting stability and growth.
For more info, refer this GitBook:
https://alfatitas747ray.gitbook.io/arch_vault/

## ✅ Solution
🌉 Arch's Vaults stand apart from traditional bespoke per-project specific staking pools primarily through its dynamic fee structure and self-funding nature. 
<br>
While traditional staking pools often offer a flat rate of return and may require external funding sources to maintain those returns, Arch's Vault Vaults use entry and exit fees to create a collective pool of assets that benefits all stakers. 
<br>
This model is particularly suited for meme coins, as it synergizes well with social momentum to sustainably increase the vault token's asset-backed value. The vault also employs a linearly decreasing exit fee and other yield-boosting strategies like an immutable vesting schedule, which can incentivize long-term holding and discourage early exits.

## 🛠 Tech Stack
- Frontend: 🖥 React, Ethers.js
- Blockchain: 📦 Solidity, Hardhat, Ethers.js, Subgraph
## 📜 Smart Contracts
🔗 The contracts used in this project are a set of contracts deployed on the Scroll Sepolia Blockchain, where there is a main factory contract which will deploy vault's for each asset.
## Testing
- You can use the MockToken contract and mint yourself as much token as you wish in order to test the vault.

- Contract Address (Factory): https://sepolia.scrollscan.dev/address/0x058b4517e6db66e96f552cb3ca1b7e4655053227#contracts
- Verified Contract Address MockToken: https://sepolia-blockscout.scroll.io/address/0x491866bacda37014b0591df649dcb2e12d2a37c4/contracts
## 🤖 Website Link
🔗 https://vault-frontend2.vercel.app/

## 🔍 Subgraph URL
🔗 https://api.studio.thegraph.com/query/60979/arch-vault/v0.0.1