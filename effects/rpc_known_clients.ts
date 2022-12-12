import * as rpc from "../rpc/mod.ts"
import { rpcClient } from "./rpc.ts"

// TODO: do we care to defer effect initialization (not very costly)
function proxyClient(url: string) {
  return rpcClient(rpc.proxyProvider, url)
}

export const polkadot = proxyClient("wss://rpc.polkadot.io")
export const kusama = proxyClient("wss://kusama-rpc.polkadot.io")
export const acala = proxyClient("wss://acala-polkadot.api.onfinality.io/public-ws")
export const rococo = proxyClient("wss://rococo-contracts-rpc.polkadot.io")
export const moonbeam = proxyClient("wss://wss.api.moonbeam.network")
export const statemint = proxyClient("wss://statemint-rpc.polkadot.io")
export const subsocial = proxyClient("wss://para.subsocial.network")
export const westend = proxyClient("wss://westend-rpc.polkadot.io")
export const local = proxyClient("ws://127.0.0.1:9944")
