import * as Z from "../deps/zones.ts"
import * as rpc from "../rpc/mod.ts"
import { rpcClient } from "./rpc.ts"

function smoldotClient(relayChainSpecUrl: string, parachainSpecUrl?: string) {
  return rpcClient(
    rpc.smoldotProvider,
    Z.lift([]).next(async () => {
      const relayChainSpec = await (await fetch(relayChainSpecUrl)).text()
      const parachainSpec = parachainSpecUrl
        ? await (await fetch(parachainSpecUrl)).text()
        : undefined
      return {
        relayChainSpec,
        parachainSpec,
      }
    }),
  )
}

export const polkadot = smoldotClient(
  "https://raw.githubusercontent.com/paritytech/substrate-connect/main/packages/connect/src/connector/specs/polkadot.json",
)
export const kusama = smoldotClient(
  "https://raw.githubusercontent.com/paritytech/substrate-connect/main/packages/connect/src/connector/specs/ksmcc3.json",
)
export const rococo = smoldotClient(
  "https://raw.githubusercontent.com/paritytech/substrate-connect/main/packages/connect/src/connector/specs/rococo_v2_2.json",
)
export const westend = smoldotClient(
  "https://raw.githubusercontent.com/paritytech/substrate-connect/main/packages/connect/src/connector/specs/westend2.json",
)
