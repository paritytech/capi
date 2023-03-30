/**
 * @title Multisig Transfer
 * @stability unstable
 *
 * Create a multisig account and ratify a vote to execute a transfer from
 * that multisig.
 */

import { assert } from "asserts"
import { $ } from "capi"
import { MultisigRune } from "capi/patterns/multisig/mod.ts"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { Balances, chain, createUsers, System } from "polkadot_dev/mod.js"

const { alexa, billy, carol, david } = await createUsers()

// Initialize the `MultisigRune` with Alexa, Billy and Carol. Set the passing threshold to 2.
const multisig = MultisigRune.from(chain, {
  signatories: [alexa, billy, carol].map(({ publicKey }) => publicKey),
  threshold: 2,
})

// Reference Dave's initial balance. We'll be executing a transfer of some funds to Dave.
const daveBalance = System.Account
  .value(david.publicKey)
  .unhandle(undefined)
  .access("data", "free")

// Execute the `daveBalance` Rune.
const daveBalanceInitial = await daveBalance.run()

// Transfer initial funds to the multisig (existential deposit).
await Balances
  .transfer({
    value: 2_000_000_000_000n,
    dest: multisig.address,
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Existential deposit:")
  .finalized()
  .run()

// Describe the call we wish to dispatch from the multisig.
const call = Balances.transferKeepAlive({
  dest: david.address,
  value: 1_230_000_000_000n,
})

// Propose the call.
await multisig
  .ratify({ call, sender: alexa.address })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Proposal:")
  .finalized()
  .run()

// Check whether the call has been proposed.
const isProposed = await multisig.isProposed(call.hash).run()
assert(isProposed)

// Approve proposal as Billy.
await multisig // TODO: get `ratify` working in place of `approve`
  .approve({ callHash: call.hash, sender: billy.address })
  .signed(signature({ sender: billy }))
  .sent()
  .dbgStatus("First approval:")
  .finalized()
  .run()

const { approvals } = await multisig.proposal(call.hash).run()
$.assert($.array($.sizedUint8Array(32)), approvals)

// Approve the proposal as Carol (final approval).
await multisig
  .ratify({ call, sender: carol.address })
  .signed(signature({ sender: carol }))
  .sent()
  .dbgStatus("Final approval:")
  .finalized()
  .run()

// Check to see whether Dave's balance has in fact changed
const daveBalanceFinal = await daveBalance.run()

// The final balance should be greater than the initial.
assert(daveBalanceFinal > daveBalanceInitial)
