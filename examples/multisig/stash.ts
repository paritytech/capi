/**
 * @title Multisig Administration Of Pure Proxy Stash
 * @stability unstable
 *
 * Administrate a stash account (pure proxy) through a multisig with three signatories.
 */

import { assert } from "asserts"
import { MultisigRune } from "capi/patterns/multisig/mod.ts"
import { filterPureCreatedEvents } from "capi/patterns/proxy/mod.ts"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { Balances, chain, createUsers, Proxy, System } from "polkadot_dev/mod.js"
import { MultiAddress } from "polkadot_dev/types/sp_runtime/multiaddress.js"

const { alexa, billy, carol } = await createUsers()

// Initialize the `MultisigRune` with Alexa, Billy and Carol. Set the passing threshold to 2.
const multisig = MultisigRune.from(chain, {
  signatories: [alexa, billy, carol].map(({ publicKey }) => publicKey),
  threshold: 2,
})

// Send funds to the multisig (existential deposit).
await Balances
  .transfer({
    value: 20_000_000_000_000n,
    dest: multisig.address,
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Existential deposit:")
  .finalized()
  .run()

// Describe the call which we wish to dispatch from the multisig account:
// the creation of the stash / pure proxy, belonging to the multisig account itself.
const call = Proxy.createPure({
  proxyType: "Any",
  delay: 0,
  index: 0,
})

// Propose the stash creation call.
await multisig
  .ratify({ call, sender: alexa.address })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Proposal:")
  .finalized()
  .run()

// Approve the stash creation call and extract the pure creation event, which should
// contain its account id.
const stashAccountId = await multisig
  .ratify({ call, sender: billy.address })
  .signed(signature({ sender: billy }))
  .sent()
  .dbgStatus("Approval:")
  .finalizedEvents()
  .pipe(filterPureCreatedEvents)
  .access(0, "pure")
  .run()

// Send funds to the stash (existential deposit).
await Balances
  .transfer({
    value: 20_000_000_000_000n,
    dest: MultiAddress.Id(stashAccountId),
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Fund Stash:")
  .finalized()
  .run()

// Ensure that the funds arrived successfully.
const stashFree = await System.Account
  .value(stashAccountId)
  .unhandle(undefined)
  .access("data", "free")
  .run()

// The stash's free should be greater than zero.
assert(stashFree > 0)
