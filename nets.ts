import { autobin, net } from "./mod.ts"

const polkadotBin = autobin("polkadot", "v0.9.38")
const polkadotParachainBin = autobin("polkadot-parachain", "v0.9.380")
const substrateContractsNodeBin = autobin("substrate-contracts-node", "v0.24.0")

export const polkadot = net.fromWs("wss://rpc.polkadot.io/", "v0.9.40")
export const westend = net.fromWs("wss://westend-rpc.polkadot.io/")
export const statemint = net.fromWs("wss://statemint-rpc.polkadot.io/")

export const polkadotDev = net.fromBin(polkadotBin, "polkadot-dev")
export const westendDev = net.fromBin(polkadotBin, "westend-dev")
export const contractsDev = net.fromBin(substrateContractsNodeBin, "dev")

export const rococoDev = net.fromBin(polkadotBin, "rococo-local", undefined, {
  westmint: {
    id: 1000,
    binary: polkadotParachainBin,
    chain: "westmint-local",
  },
  contracts: {
    id: 2000,
    binary: polkadotParachainBin,
    chain: "contracts-rococo-local",
  },
})

export const rococoDevXcm = net.fromBin(autobin("polkadot", "v0.9.37"), "rococo-local", undefined, {
  statemine: {
    id: 1000,
    binary: autobin("polkadot-parachain", "v0.9.370"),
    chain: "statemine-local",
  },
  trappist: {
    id: 2000,
    binary: autobin("trappist-collator", "79bba6e"),
    chain: "local",
  },
})

export const polkadotFromMetadata = net.fromMetadata(
  await Deno.readFile("examples/raw_rpc/metadata"),
)
