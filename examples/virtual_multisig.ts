import { alice, bob, charlie, dave, MultiAddress, Rune } from "capi"
import { VirtualMultisigRune } from "capi/patterns/multisig/mod.ts"
import { Balances, chain, System } from "polkadot_dev/mod.ts"
import { parse } from "../deps/std/flags.ts"

let { state } = parse(Deno.args, { string: ["state"] })
if (!state) {
  state = await VirtualMultisigRune.deployment(chain, {
    founders: [alice.publicKey, bob.publicKey, charlie.publicKey],
    threshold: 2,
    deployer: alice,
  }).hex.run()
}

console.log(`Virtual multisig state hex: ${state}`)

const vMultisig = VirtualMultisigRune.fromHex(chain, state)

const fundStash = Balances
  .transfer({
    dest: vMultisig.stash.map(MultiAddress.Id),
    value: 20_000_000_000_000n,
  })
  .signed({ sender: alice })
  .sent()
  .dbgStatus("Fund Stash:")
  .finalized()

const fundBobProxy = vMultisig.fundSenderProxy(bob.publicKey, 20_000_000_000_000n)
  .signed({ sender: bob })
  .sent()
  .dbgStatus("Fund Bob Proxy:")
  .finalized()

const fundCharlieProxy = vMultisig.fundSenderProxy(charlie.publicKey, 20_000_000_000_000n)
  .signed({ sender: charlie })
  .sent()
  .dbgStatus("Fund Charlie Proxy:")
  .finalized()

const proposal = Balances.transfer({
  dest: dave.address,
  value: 1_234_000_000_000n,
})

const bobRatify = vMultisig
  .ratify(bob.publicKey, proposal)
  .signed({ sender: bob })
  .sent()
  .dbgStatus("Bob ratify:")
  .finalized()

const charlieRatify = vMultisig
  .ratify(charlie.publicKey, proposal)
  .signed({ sender: charlie })
  .sent()
  .dbgStatus("Charlie ratify:")
  .finalized()

await Rune
  .chain(() => vMultisig)
  .chain(() => fundStash)
  .chain(() => fundBobProxy)
  .chain(() => fundCharlieProxy)
  .chain(() =>
    Rune.tuple([
      System.Account.entry(Rune.tuple([vMultisig.stash])).dbg("Stash Balance Before"),
      System.Account.entry([dave.publicKey]).dbg("Dave Balance Before"),
    ])
  )
  .chain(() => bobRatify)
  .chain(() => charlieRatify)
  .chain(() =>
    Rune.tuple([
      System.Account.entry(Rune.tuple([vMultisig.stash])).dbg("Stash Balance After"),
      System.Account.entry([dave.publicKey]).dbg("Dave Balance After"),
    ])
  ).run()
