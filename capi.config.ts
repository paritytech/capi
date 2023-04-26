import { binary, Config } from "./mod.ts"

const polkadot = binary("polkadot", "v0.9.38")
const polkadotParachain = binary("polkadot-parachain", "v0.9.380")
const substrateContractsNode = binary("substrate-contracts-node", "v0.24.0")

export const config: Config = {
  server: "http://localhost:4646/",
  chains: {
    polkadot: {
      url: "wss://rpc.polkadot.io/",
      version: "v0.9.40",
    },
    westend: {
      url: "wss://westend-rpc.polkadot.io/",
      version: "latest",
    },
    statemint: {
      url: "wss://statemint-rpc.polkadot.io/",
      version: "latest",
    },
    polkadotDev: {
      binary: polkadot,
      chain: "polkadot-dev",
    },
    westendDev: {
      binary: polkadot,
      chain: "westend-dev",
    },
    contractsDev: {
      binary: substrateContractsNode,
      chain: "dev",
    },
    rococoDev: {
      binary: polkadot,
      chain: "rococo-local",
      parachains: {
        westmint: {
          id: 1000,
          binary: polkadotParachain,
          chain: "westmint-local",
        },
        contracts: {
          id: 2000,
          binary: polkadotParachain,
          chain: "contracts-rococo-local",
        },
      },
    },
    rococoDevXcm: {
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
    },
    polkadotFromMetadata: {
      metadata: await Deno.readFile("examples/raw_rpc/metadata"),
    },
  },
}
