import { SmoldotConnection } from "capi"

// Bring the chainspec(s) into scope. Here, we'll fetch from the smol-dot/smoldot GitHub repo.
const relayChainSpec = await fetch(
  `https://raw.githubusercontent.com/smol-dot/smoldot/main/demo-chain-specs/polkadot.json`,
).then((r) => r.text())

// Bind the connection to the chainspec and export with the name `connect`.
export const connect = SmoldotConnection.bind({ relayChainSpec })
