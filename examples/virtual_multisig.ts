import { alice, bob, charlie, dave, Rune } from "capi"
import { virtualMultisigDeployment } from "capi/patterns/multisig/mod.ts"
import { chain, System } from "polkadot_dev/mod.ts"
import * as base64 from "../deps/std/encoding/base64.ts"

const vMultisig = virtualMultisigDeployment(chain, {
  signatories: [alice.publicKey, bob.publicKey, charlie.publicKey],
  threshold: 2,
  deployer: alice,
})

const multisigState = vMultisig.hex.map(base64.encode).dbg("Virtual multisig state:")

const proposal = chain.extrinsic(Rune.rec({
  type: "Balances",
  value: Rune.rec({
    type: "transfer" as const,
    dest: dave.address,
    value: 1_234_567_890n,
  }),
}))

const bobRatify = vMultisig
  .ratify(1, proposal)
  .signed({ sender: bob })
  .sent()
  .dbgStatus("Bob ratify:")
  .finalized()

const charlieRatify = vMultisig
  .ratify(1, proposal)
  .signed({ sender: charlie })
  .sent()
  .dbgStatus("Charlie ratify:")
  .finalized()

await Rune
  .chain(() => vMultisig)
  .chain(() => multisigState)
  .chain(() => bobRatify)
  .chain(() => charlieRatify)
  .chain(() => System.Account.entry([dave.publicKey]).dbg())
  .run()
