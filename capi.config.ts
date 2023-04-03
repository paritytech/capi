import { binary, CapiConfig } from "./capn/mod.ts"

const polkadot = binary("polkadot", "v0.9.37")
const polkadotParachain = binary("polkadot-parachain", "v0.9.370")
const substrateContractsNode = binary("substrate-contracts-node", "v0.24.0")

export const config: CapiConfig = {
  server: "https://capi-dev-delegatee-dkvt8vt7xdkg.deno.dev/",
  chains: {
    polkadot: {
      url: "wss://rpc.polkadot.io/",
      version: "v0.9.40",
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
  },
  networks: {
    rococoDev: {
      relay: {
        binary: polkadot,
        chain: "rococo-local",
        nodes: 4,
      },
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
  },
}
