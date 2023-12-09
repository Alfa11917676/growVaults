import {
  Deposit as DepositEvent,
  Vault,
  Withdraw as WithdrawEvent
} from "../generated/Vault/Vault"
import {
  LPPrice
} from "../generated/schema"


export function handleDeposit(event: DepositEvent): void {
  let price = new LPPrice(event.transaction.hash.concatI32(event.logIndex.toI32()))
  let vault = Vault.bind(event.address);
  let cP = vault.currentPrice();
  let asset = Vault.bind(vault.asset());
  let assetBalance = asset.balanceOf(event.address);
  let lpBalance = vault.totalSupply();
  price.price = cP;
  price.blockNumber = event.block.number
  price.assetsLocked = assetBalance;
  price.assetsMinted = lpBalance;
  price.save();

}

export function handleWithdraw(event: WithdrawEvent): void {
  let price = new LPPrice(event.transaction.hash.concatI32(event.logIndex.toI32()))
  let vault = Vault.bind(event.address);
  let cP = vault.currentPrice();
  let asset = Vault.bind(vault.asset());
  let assetBalance = asset.balanceOf(event.address);
  let lpBalance = vault.totalSupply();
  price.price = cP;
  price.blockNumber = event.block.number
  price.assetsLocked = assetBalance;
  price.assetsMinted = lpBalance;
  price.save();
}
