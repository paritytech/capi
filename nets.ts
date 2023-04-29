import { binary, devnet, rawNet, wsNet } from "./mod.ts"

const polkadotBin = binary("polkadot", "v0.9.38")
const polkadotParachainBin = binary("polkadot-parachain", "v0.9.380")
const substrateContractsNodeBin = binary("substrate-contracts-node", "v0.24.0")

export const polkadot = wsNet({
  url: "wss://rpc.polkadot.io/",
  version: "v0.9.40",
})

export const westend = wsNet({
  url: "wss://westend-rpc.polkadot.io/",
  version: "latest",
})

export const statemint = wsNet({
  url: "wss://statemint-rpc.polkadot.io/",
  version: "latest",
})

export const polkadotDev = devnet({
  binary: polkadotBin,
  chain: "polkadot-dev",
})

export const westendDev = devnet({
  binary: polkadotBin,
  chain: "westend-dev",
})

export const contractsDev = devnet({
  binary: substrateContractsNodeBin,
  chain: "dev",
})

export const rococoDev = devnet({
  binary: polkadotBin,
  chain: "rococo-local",
  parachains: {
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
  },
})

export const rococoDevXcm = devnet({
  binary: binary("polkadot", "v0.9.37"),
  chain: "rococo-local",
  parachains: {
    statemine: {
      id: 1000,
      binary: binary("polkadot-parachain", "v0.9.370"),
      chain: "statemine-local",
    },
    trappist: {
      id: 2000,
      binary: binary("trappist-collator", "79bba6e"),
      chain: "local",
    },
  },
})

export const polkadotFromMetadata = rawNet(
  await Deno.readFile("examples/raw_rpc/metadata"),
)
