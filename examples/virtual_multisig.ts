import { alice, bob, charlie, dave, Rune } from "capi"
import { VirtualMultisigRune } from "capi/patterns/multisig/mod.ts"
import { Balances, chain, System } from "polkadot_dev/mod.ts"
import { parse } from "../deps/std/flags.ts"

let { stateHex } = parse(Deno.args, { string: ["stateHex"] })
if (!stateHex) {
  stateHex = await VirtualMultisigRune
    .deployment(chain, {
      signatories: [alice.publicKey, bob.publicKey, charlie.publicKey],
      threshold: 2,
      deployer: alice,
    })
    .hex
    .run()
}
console.log(`Virtual multisig state hex: ${stateHex}`)

const vMultisig = VirtualMultisigRune.fromHex(chain, stateHex)

const proposal = Balances.transfer({
  dest: dave.address,
  value: 1_234_567_890n,
})

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
  .chain(() => bobRatify)
  .chain(() => charlieRatify)
  .chain(() => System.Account.entry([dave.publicKey]).dbg())
  .run()
