import { bins, dev, metadata, ws } from "./mod.ts"

const bin = bins({
  polkadot: ["polkadot", "v0.9.38"],
  polkadotParachain: ["polkadot-parachain", "v0.9.380"],
  substrateContractsNode: ["substrate-contracts-node", "v0.24.0"],
  trappistPolkadot: ["polkadot", "v0.9.37"],
  trappistPolkadotParachain: ["polkadot-parachain", "v0.9.370"],
  trappist: ["trappist-collator", "79bba6e"],
})

export const polkadotDev = dev({
  bin: bin.polkadot,
  chain: "polkadot-dev",
})
export const polkadot = ws({
  url: "wss://rpc.polkadot.io/",
  version: "v0.9.40",
})

export const westend = ws({ url: "wss://westend-rpc.polkadot.io/" })
export const statemint = ws({ url: "wss://statemint-rpc.polkadot.io/" })

export const westendDev = dev({
  bin: bin.polkadot,
  chain: "westend-dev",
})
export const contractsDev = dev({
  bin: bin.substrateContractsNode,
  chain: "dev",
})

export const rococoDev = dev({
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

export const rococoDevXcm = dev({
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

export const polkadotFromMetadata = metadata({
  metadata: await Deno.readFile("examples/raw_rpc/metadata"),
})
