import { alice, bob, charlie, Rune } from "capi"
import { virtualMultisigDeployment } from "capi/patterns/multisig/mod.ts"
import { chain } from "polkadot_dev/mod.ts"

// const virtualMultisig = Rune
//   .constant({
//     members: [alice, bob, charlie]
//       .map(({ publicKey }) => ({ origin: publicKey })),
//   })

await virtualMultisigDeployment(chain, {
  signatories: [alice.publicKey, bob.publicKey, charlie.publicKey],
  threshold: 3,
  configurator: alice,
}).dbg().run()

// const newVirtualMultisig = VirtualMultisig.create({
//   members: [alice, bob, charlie].map(({ publicKey }) => ({ origin: publicKey })),
//   configurator: alice,
// })
// const existingVirtualMultisig = Rune
//   .constant(new Uint8Array())
//   .into(VirtualMultisig, chain)

// existingVirtualMultisig
