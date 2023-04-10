/**
 * @title Virtual Multisig
 * @stability unstable
 * @description Virtual multisigs simulate an editable multisig. The onchain correlates include:
 *
 * 1. Pure proxies for/administrated by each of the members.
 * 2. A multisig account, formed from those pure proxies.
 * 3. A stash account, administrated by the multisig account.
 *
 * When ratifying virtual multisig proposals, the user implicitly submits a proxy call
 * (through their pure proxy), of a multisig call (through the shared multisig) through
 * a proxy call from the stash account. The complexity of this flow is reduced into a
 * single `ratify` call, the experience of which is the same as with non-virtual multisigs.
 *
 * To edit a virtual multisig, its members can propose the creation of a new multisig,
 * comprised of proxy accounts corresponding to its new members. Finally, the current
 * members ratify a call to give ownership of the stash account to the new multisig.
 *
 * @test_skip
 */

import { Balances, chain, MultiAddress, System, Utility } from "@capi/polkadot-dev"
import { assert } from "asserts"
import { $, createDevUsers, Rune, Sr25519 } from "capi"
import { VirtualMultisigRune } from "capi/patterns/multisig/mod.ts"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { parse } from "../../deps/std/flags.ts"

const { alexa, billy, carol, david } = await createDevUsers()

// To reference a virtual multisig, one must have several pieces of data, including
// the member->proxy account id lookup, the threshold and the stash account id.
// With this state, we can hydrate from / use an existing virtual multisig.
// Let's see if we can hydrate the virtual multisig state from command line arguments.
// If we haven't specified any virtual multisig state, we deploy a new virtual multisig.
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

console.log("State:", state)
$.assert($.str, state)

// Initialize a `VirtualMultisigRune` with the state's scale-encoded hex string.
const vMultisig = VirtualMultisigRune.fromHex(chain, state)

// Transfer funds to the virtual multisig's stash account.
await Balances
  .transfer({
    dest: MultiAddress.Id(vMultisig.stash),
    value: 20_000_000_000_000n,
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Fund stash:")
  .finalized()
  .run()

// Reference David's free balance.
const davidFree = System.Account
  .value(david.publicKey)
  .unhandle(undefined)
  .access("data", "free")

// Retrieve David's initial free.
const davidFreeInitial = await davidFree.run()
console.log("David free initial:", davidFreeInitial)

// Describe the call we wish to dispatch from the virtual multisig's stash.
const call = Balances.transfer({
  dest: david.address,
  value: 1_234_000_000_000n,
})

// Fund Billy and Carol's proxy accounts (existential deposits).
await fundAndRatify("billy", billy).run()
await fundAndRatify("carol", carol).run()

// Retrieve David's final balance.
const davidFreeFinal = await davidFree.run()
console.log("David free final:", davidFreeFinal)

// David's final balance should be greater than the initial.
assert(davidFreeFinal > davidFreeInitial)

function fundAndRatify(name: string, sender: Sr25519) {
  return Utility
    .batchAll({
      calls: Rune.array([
        vMultisig.fundMemberProxy(sender.publicKey, 20_000_000_000_000n),
        vMultisig.ratify(sender.publicKey, call),
      ]),
    })
    .signed(signature({ sender }))
    .sent()
    .dbgStatus(`${name} fund and ratify:`)
    .finalized()
}
