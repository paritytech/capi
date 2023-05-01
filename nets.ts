import { binary, net } from "./mod.ts"

const polkadotBin = binary("polkadot", "v0.9.38")
const polkadotParachainBin = binary("polkadot-parachain", "v0.9.380")
const substrateContractsNodeBin = binary("substrate-contracts-node", "v0.24.0")
const trappistPolkadotBin = binary("polkadot-parachain", "v0.9.370")
const trappistBin = binary("trappist-collator", "79bba6e")

export const polkadot = net.ws("wss://rpc.polkadot.io/", "v0.9.40")
export const westend = net.ws("wss://westend-rpc.polkadot.io/")
export const statemint = net.ws("wss://statemint-rpc.polkadot.io/")

export const polkadotDev = net.dev(polkadotBin, "polkadot-dev")
export const westendDev = net.dev(polkadotBin, "westend-dev")
export const contractsDev = net.dev(substrateContractsNodeBin, "dev")

export const rococoDev = net.dev(polkadotBin, "rococo-local")
export const rococoDevWestmint = rococoDev.parachain(polkadotParachainBin, "westmint-local", 1000)
export const rococoDevContracts = rococoDev.parachain(
  polkadotParachainBin,
  "contracts-rococo-local",
  2000,
)

export const rococoDevXcm = net.dev(binary("polkadot", "v0.9.37"), "rococo-local")
export const rococoDevXcmStatemine = rococoDevXcm.parachain(
  trappistPolkadotBin,
  "statemine-local",
  1000,
)
export const rococoDevXcmTrappist = rococoDevXcm.parachain(trappistBin, "local", 2000)

export const polkadotFromMetadata = net.metadata(
  await Deno.readFile("examples/raw_rpc/metadata"),
)
