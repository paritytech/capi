import { binary, MetadataNet, RelayChain, WsNet } from "./mod.ts"

const polkadotBin = binary("polkadot", "v0.9.38")
const polkadotParachainBin = binary("polkadot-parachain", "v0.9.380")
const substrateContractsNodeBin = binary("substrate-contracts-node", "v0.24.0")

export const polkadot = new WsNet("wss://rpc.polkadot.io/", "v0.9.40")
export const westend = new WsNet("wss://westend-rpc.polkadot.io/")
export const statemint = new WsNet("wss://statemint-rpc.polkadot.io/")

export const polkadotDev = new RelayChain(polkadotBin, "polkadot-dev")
export const westendDev = new RelayChain(polkadotBin, "westend-dev")
export const contractsDev = new RelayChain(substrateContractsNodeBin, "dev")

export const rococoDev = new RelayChain(polkadotBin, "rococo-local")
export const rococoDevWestmint = rococoDev.parachain(polkadotParachainBin, "westmint-local", 1000)
export const rococoDevContracts = rococoDev.parachain(
  polkadotParachainBin,
  "contracts-rococo-local",
  2000,
)

export const rococoDevXcm = new RelayChain(binary("polkadot", "v0.9.37"), "rococo-local")
export const rococoDevXcmStatemint = rococoDevXcm.parachain(
  binary("polkadot-parachain", "v0.9.370"),
  "statemine-local",
  1000,
)
export const rococoDevXcmTrappist = rococoDevXcm.parachain(
  binary("trappist-collator", "79bba6e"),
  "local",
  2000,
)

export const polkadotFromMetadata = new MetadataNet(
  await Deno.readFile("examples/raw_rpc/metadata"),
)
