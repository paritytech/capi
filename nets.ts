import { autobin, dev, metadata, ws } from "./mod.ts"

const bin = autobin({
  polkadot: ["polkadot", "v0.9.38"],
  polkadotParachain: ["polkadot-parachain", "v0.9.380"],
  substrateContractsNode: ["substrate-contracts-node", "v0.24.0"],
  trappistPolkadot: ["polkadot", "v0.9.37"],
  trappistPolkadotParachain: ["polkadot-parachain", "v0.9.370"],
  trappist: ["trappist-collator", "79bba6e"],
})

export const polkadotDev = dev(bin.polkadot, "polkadot-dev")
export const polkadot = ws("wss://rpc.polkadot.io/", "v0.9.40")

export const westend = ws("wss://westend-rpc.polkadot.io/")
export const statemint = ws("wss://statemint-rpc.polkadot.io/")

export const westendDev = dev(bin.polkadot, "westend-dev")
export const contractsDev = dev(bin.substrateContractsNode, "dev")

export const rococoDev = dev(bin.polkadot, "rococo-local")
export const rococoDevWestmint = rococoDev
  .parachain(bin.polkadotParachain, "westmint-local", 1000)
export const rococoDevContracts = rococoDev
  .parachain(bin.polkadotParachain, "contracts-rococo-local", 2000)

export const rococoDevXcm = dev(bin.trappistPolkadot, "rococo-local")
export const rococoDevXcmTrappist = rococoDevXcm
  .parachain(bin.trappist, "local", 2000)
export const rococoDevXcmStatemine = rococoDevXcm
  .parachain(bin.trappistPolkadotParachain, "statemine-local", 1000)

export const polkadotFromMetadata = metadata(await Deno.readFile("examples/raw_rpc/metadata"))
