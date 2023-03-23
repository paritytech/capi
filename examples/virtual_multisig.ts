import { Rune } from "capi"
import { VirtualMultisigRune } from "capi/patterns/multisig/mod.ts"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { Balances, chain, System, users, Utility } from "polkadot_dev/mod.js"
import { MultiAddress } from "polkadot_dev/types/sp_runtime/multiaddress.js"
import { parse } from "../deps/std/flags.ts"

const [alexa, billy, carol, david] = await users(4)

let { state } = parse(Deno.args, { string: ["state"] })
if (!state) {
  state = await VirtualMultisigRune
    .deployment(chain, {
      founders: [alexa.publicKey, billy.publicKey, carol.publicKey],
      threshold: 2,
      deployer: alexa.address,
    }, signature({ sender: alexa }))
    .hex
    .run()
}

console.log(`Virtual multisig state hex: ${state}`)

const vMultisig = VirtualMultisigRune.hydrate(chain, state)

await Balances
  .transfer({
    dest: MultiAddress.Id(vMultisig.stash),
    value: 20_000_000_000_000n,
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Fund Stash:")
  .finalizedHash()
  .run()

console.log("Dave balance before:", await System.Account.value(david.publicKey).run())

const proposal = Balances.transfer({
  dest: david.address,
  value: 1_234_000_000_000n,
})

await Utility
  .batchAll({
    calls: Rune.array([
      vMultisig.fundMemberProxy(billy.publicKey, 20_000_000_000_000n),
      vMultisig.ratify(billy.publicKey, proposal),
    ]),
  })
  .signed(signature({ sender: billy }))
  .sent()
  .dbgStatus("Bob fund & ratify:")
  .finalizedHash()
  .run()

await Utility
  .batchAll({
    calls: Rune.array([
      vMultisig.fundMemberProxy(carol.publicKey, 20_000_000_000_000n),
      vMultisig.ratify(carol.publicKey, proposal),
    ]),
  })
  .signed(signature({ sender: carol }))
  .sent()
  .dbgStatus("Charlie fund & ratify:")
  .finalizedHash()
  .run()

console.log("Dave balance after:", await System.Account.value(david.publicKey).run())
