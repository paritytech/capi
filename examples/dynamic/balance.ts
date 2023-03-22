import { ChainRune, connection, Rune, WsConnection } from "capi"

const chain = Rune
  .rec({
    connection: connection(async (signal) => WsConnection.connect("wss://rpc.polkadot.io", signal)),
    metadata: null! as any,
  })
  .into(ChainRune)

const accountInfo = await chain
  .pallet("System")
  .storage("Account")
  .entryPage(10, null)
  .run()

console.log(accountInfo)
