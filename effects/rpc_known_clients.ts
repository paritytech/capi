import * as Z from "../deps/zones.ts"
import * as rpc from "../rpc/mod.ts"
import { rpcClient } from "./rpc.ts"

// TODO: do we care to defer effect initialization (not very costly)
function proxyClient(url: string) {
  return rpcClient(rpc.proxyProvider, url)
}

function smoldotClient(relayChainSpecUrl: string, parachainSpecUrl?: string) {
  return rpcClient(
    rpc.smoldotProvider,
    // TODO: update to Z.call when types are fixed in Zones
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

export const polkadot = {
  proxy: proxyClient("wss://rpc.polkadot.io"),
  smoldot: smoldotClient(
    "https://raw.githubusercontent.com/paritytech/substrate-connect/main/packages/connect/src/connector/specs/polkadot.json",
  ),
}
export const kusama = {
  proxy: proxyClient("wss://kusama-rpc.polkadot.io"),
  smoldot: smoldotClient(
    "https://raw.githubusercontent.com/paritytech/substrate-connect/main/packages/connect/src/connector/specs/ksmcc3.json",
  ),
}
export const acala = {
  proxy: proxyClient("wss://acala-polkadot.api.onfinality.io/public-ws"),
}
export const rococo = {
  proxy: proxyClient("wss://rococo-contracts-rpc.polkadot.io"),
  smoldot: smoldotClient(
    "https://raw.githubusercontent.com/paritytech/substrate-connect/main/packages/connect/src/connector/specs/rococo_v2_2.json",
  ),
}
export const moonbeam = {
  proxy: proxyClient("wss://wss.api.moonbeam.network"),
}
export const statemint = {
  proxy: proxyClient("wss://statemint-rpc.polkadot.io"),
}
export const subsocial = {
  proxy: proxyClient("wss://para.subsocial.network"),
}
export const westend = {
  proxy: proxyClient("wss://westend-rpc.polkadot.io"),
  smoldot: smoldotClient(
    "https://raw.githubusercontent.com/paritytech/substrate-connect/main/packages/connect/src/connector/specs/westend2.json",
  ),
}
