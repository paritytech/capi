import { alice, bob, charlie } from "capi"
import { createVirtualMultisig } from "capi/patterns/multisig/mod.ts"
import { chain } from "polkadot_dev/mod.ts"

await createVirtualMultisig(chain, {
  members: [alice, bob, charlie].map(({ publicKey }) => ({ origin: publicKey })),
  threshold: 3,
  configurator: alice,
}).run()
