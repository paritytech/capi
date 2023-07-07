import { bins, net } from "./nets/mod.ts"

const bin = bins({
  polkadot: ["polkadot-fast", "v0.9.38"],
  polkadotParachain: ["polkadot-parachain-fast", "v0.9.380"],
  substrateContractsNode: ["substrate-contracts-node", "v0.24.0"],
  trappistPolkadot: ["polkadot", "v0.9.37"],
  trappistPolkadotParachain: ["polkadot-parachain", "v0.9.370"],
  trappist: ["trappist-collator", "79bba6e"],
})

export const polkadotDev = net.dev({
  bin: bin.polkadot,
  chain: "polkadot-dev",
})
export const polkadot = net.ws({
  url: "wss://rpc.polkadot.io/",
  version: "v0.9.40",
})

export const westend = net.ws({ url: "wss://westend-rpc.polkadot.io/" })
export const statemint = net.ws({ url: "wss://statemint-rpc.polkadot.io/" })

export const westendDev = net.dev({
  bin: bin.polkadot,
  chain: "westend-dev",
})
export const contractsDev = net.dev({
  bin: bin.substrateContractsNode,
  chain: "dev",
})

export const rococoDev = net.dev({
  bin: bin.polkadot,
  chain: "rococo-local",
})
export const rococoDevWestmint = rococoDev.parachain({
  bin: bin.polkadotParachain,
  chain: "westmint-local",
  id: 1000,
})
export const rococoDevContracts = rococoDev.parachain({
  bin: bin.polkadotParachain,
  chain: "contracts-rococo-local",
  id: 2000,
})

export const rococoDevXcm = net.dev({
  bin: bin.trappistPolkadot,
  chain: "rococo-local",
})
export const rococoDevXcmTrappist = rococoDevXcm.parachain({
  bin: bin.trappist,
  chain: "local",
  id: 2000,
})
export const rococoDevXcmStatemine = rococoDevXcm.parachain({
  bin: bin.trappistPolkadotParachain,
  chain: "statemine-local",
  id: 1000,
})

export const collectives = net.ws({
  url: "wss://collectives.api.onfinality.io/public-ws",
})

export const spiritnet = net.ws({
  url: "wss://kilt-rpc.dwellir.com",
})
