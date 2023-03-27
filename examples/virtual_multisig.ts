import { Rune, Sr25519 } from "capi"
import { VirtualMultisigRune } from "capi/patterns/multisig/mod.ts"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { Balances, chain, System, users, Utility } from "polkadot_dev/mod.js"
import { MultiAddress } from "polkadot_dev/types/sp_runtime/multiaddress.js"
import { parse } from "../deps/std/flags.ts"

const [alexa, billy, carol, david] = await users(4)

let { state } = parse(Deno.args, { string: ["state"] })
if (!state) {
  state = await VirtualMultisigRune
    .deployment(/* TODO: simplify */ chain, {
      founders: [alexa.publicKey, billy.publicKey, carol.publicKey],
      threshold: 2,
      deployer: alexa.address,
    }, signature({ sender: alexa })).hex.run()
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
  .finalized()
  .run()

const daveBalance = System.Account.value(david.publicKey)

console.log("Dave balance before:", await daveBalance.run())

const proposal = Balances.transfer({
  dest: david.address,
  value: 1_234_000_000_000n,
})

await fundAndRatify("billy", carol).run()
await fundAndRatify("carol", carol).run()

console.log("Dave balance after:", await daveBalance.run())

function fundAndRatify(name: string, sender: Sr25519) {
  return Utility
    .batchAll({
      calls: Rune.array([
        vMultisig.fundMemberProxy(sender.publicKey, 20_000_000_000_000n),
        vMultisig.ratify(sender.publicKey, proposal),
      ]),
    })
    .signed(signature({ sender }))
    .sent()
    .dbgStatus(`${name} fund & ratify:`)
    .finalized()
}
