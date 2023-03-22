import { ChainRune, WsConnection } from "capi"

const accountInfo = await ChainRune
  .dynamic(WsConnection, "wss://rpc.polkadot.io")
  .pallet("System")
  .storage("Account")
  .entryPage(10, null)
  .run()

console.log(accountInfo)
