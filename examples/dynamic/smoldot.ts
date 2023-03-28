import { ChainRune, SmoldotConnection } from "capi"

const relayChainSpec = await fetch(
  `https://raw.githubusercontent.com/smol-dot/smoldot/main/demo-chain-specs/polkadot.json`,
).then((v) => v.text())

const chain = ChainRune.from(SmoldotConnection, { relayChainSpec })

const accountInfo = await chain
  .pallet("System")
  .storage("Account")
  .entryPage(10, null)
  .run()

console.log(accountInfo)
