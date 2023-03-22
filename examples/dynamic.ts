import { ChainRune, WsConnection } from "capi"

const chain = ChainRune.dynamic(WsConnection, "wss://rpc.polkadot.io")

const accountInfo = await chain
  .pallet("System")
  .storage("Account")
  .entryPage(10, null)
  .run()

console.log(accountInfo)
