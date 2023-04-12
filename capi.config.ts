import { binary, CapiConfig } from "./mod.ts"

const polkadot = binary("polkadot", "v0.9.38")
const polkadotParachain = binary("polkadot-parachain", "v0.9.380")
const substrateContractsNode = binary("substrate-contracts-node", "v0.24.0")

export const config: CapiConfig = {
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
        statemine: {
          id: 1000,
          binary: polkadotParachain,
          chain: "statemine-local",
        },
        contracts: {
          id: 2000,
          binary: polkadotParachain,
          chain: "contracts-rococo-local",
        },
      },
    },
    rococoWestmint: {
      binary: polkadot,
      chain: "rococo-local",
      parachains: {
        westmint: {
          id: 1000,
          binary: polkadotParachain,
          chain: "westmint-local",
        },
      },
    },
  },
}
