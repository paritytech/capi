import { alice, bob, charlie, dave, Rune } from "capi"
import { VirtualMultisigRune } from "capi/patterns/multisig/mod.ts"
import { Balances, chain, System, Utility } from "polkadot_dev/mod.ts"
import { MultiAddress } from "polkadot_dev/types/sp_runtime/multiaddress.ts"
import { parse } from "../deps/std/flags.ts"

let { state } = parse(Deno.args, { string: ["state"] })
if (!state) {
  state = await VirtualMultisigRune
    .deployment(chain, {
      founders: [alice.publicKey, bob.publicKey, charlie.publicKey],
      threshold: 2,
      deployer: alice,
    })
    .hex
    .run()
}

console.log(`Virtual multisig state hex: ${state}`)

const vMultisig = VirtualMultisigRune.hydrate(chain, state)

const fundStash = Balances
  .transfer({
    dest: vMultisig.stash.map(MultiAddress.Id),
    value: 20_000_000_000_000n,
  })
  .signed({ sender: alice })
  .sent()
  .dbgStatus("Fund Stash:")
  .finalized()

const proposal = Balances.transfer({
  dest: dave.address,
  value: 1_234_000_000_000n,
})

const bobTx = Utility
  .batchAll({
    // @ts-ignore: fix upon #656
    calls: Rune.array([
      vMultisig.fundMemberProxy(bob.publicKey, 20_000_000_000_000n),
      vMultisig.ratify(bob.publicKey, proposal),
    ]),
  })
  .signed({ sender: bob })
  .sent()
  .dbgStatus("Bob fund & ratify:")
  .finalized()

const charlieTx = Utility
  .batchAll({
    // @ts-ignore: fix upon #656
    calls: Rune.array([
      vMultisig.fundMemberProxy(charlie.publicKey, 20_000_000_000_000n),
      vMultisig.ratify(charlie.publicKey, proposal),
    ]),
  })
  .signed({ sender: charlie })
  .sent()
  .dbgStatus("Charlie fund & ratify:")
  .finalized()

await Rune
  .chain(() => vMultisig)
  .chain(() => fundStash)
  .chain(() => System.Account.value(dave.publicKey).dbg("Dave Balance Before:"))
  .chain(() => bobTx)
  .chain(() => charlieTx)
  .chain(() => System.Account.value(dave.publicKey).dbg("Dave Balance After:"))
  .run()
