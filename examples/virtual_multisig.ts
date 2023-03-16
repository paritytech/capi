import { Rune } from "capi"
import { VirtualMultisigRune } from "capi/patterns/multisig/mod.ts"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { Balances, chain, System, users, Utility } from "polkadot_dev/mod.js"
import { MultiAddress } from "polkadot_dev/types/sp_runtime/multiaddress.js"
import { parse } from "../deps/std/flags.ts"

const [a, b, c, d] = await users(4)

let { state } = parse(Deno.args, { string: ["state"] })
if (!state) {
  state = await VirtualMultisigRune
    .deployment(chain, {
      founders: [a.publicKey, b.publicKey, c.publicKey],
      threshold: 2,
      deployer: a,
    })
    .hex
    .run()
}

console.log(`Virtual multisig state hex: ${state}`)

const vMultisig = VirtualMultisigRune.hydrate(chain, state)

const fundStash = Balances
  .transfer({
    dest: MultiAddress.Id(vMultisig.stash),
    value: 20_000_000_000_000n,
  })
  .signed(signature({ sender: a }))
  .sent()
  .dbgStatus("Fund Stash:")
  .finalized()

const proposal = Balances.transfer({
  dest: d.address,
  value: 1_234_000_000_000n,
})

const bobTx = Utility
  .batchAll({
    // @ts-ignore: fix upon #656
    calls: Rune.array([
      vMultisig.fundMemberProxy(b.publicKey, 20_000_000_000_000n),
      vMultisig.ratify(b.publicKey, proposal),
    ]),
  })
  .signed(signature({ sender: b }))
  .sent()
  .dbgStatus("Bob fund & ratify:")
  .finalized()

const charlieTx = Utility
  .batchAll({
    // @ts-ignore: fix upon #656
    calls: Rune.array([
      vMultisig.fundMemberProxy(c.publicKey, 20_000_000_000_000n),
      vMultisig.ratify(c.publicKey, proposal),
    ]),
  })
  .signed(signature({ sender: c }))
  .sent()
  .dbgStatus("Charlie fund & ratify:")
  .finalized()

await Rune
  .chain(() => vMultisig)
  .chain(() => fundStash)
  .chain(() => System.Account.value(d.publicKey).dbg("Dave Balance Before:"))
  .chain(() => bobTx)
  .chain(() => charlieTx)
  .chain(() => System.Account.value(d.publicKey).dbg("Dave Balance After:"))
  .run()
