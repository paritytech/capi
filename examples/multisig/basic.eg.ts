/**
 * @title Multisig Transfer
 * @stability unstable
 * @description Create a multisig account and ratify a vote to execute a transfer from
 * that multisig.
 * @test_skip
 */

import { polkadotDev } from "@capi/polkadot-dev"
import { assert } from "asserts"
import { $, createDevUsers } from "capi"
import { MultisigRune } from "capi/patterns/multisig/mod.ts"
import { signature } from "capi/patterns/signature/polkadot.ts"

const { alexa, billy, carol, david } = await createDevUsers()

/// Initialize the `MultisigRune` with Alexa, Billy and Carol. Set the passing threshold to 2.
const multisig = MultisigRune.from(polkadotDev, {
  signatories: [alexa, billy, carol].map(({ publicKey }) => publicKey),
  threshold: 2,
})

/// Reference David's initial balance. We'll be executing a transfer of some funds to David.
const davidFree = polkadotDev.System.Account
  .value(david.publicKey)
  .unhandle(undefined)
  .access("data", "free")

/// Execute the `davidFree` Rune.
const davidFreeInitial = await davidFree.run()
console.log("David free initial:", davidFreeInitial)

/// Transfer initial funds to the multisig (existential deposit).
await polkadotDev.Balances
  .transfer({
    value: 2_000_000_000_000n,
    dest: multisig.address,
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Existential deposit:")
  .finalized()
  .run()

/// Describe the call we wish to dispatch from the multisig.
const call = polkadotDev.Balances.transferKeepAlive({
  dest: david.address,
  value: 1_230_000_000_000n,
})

/// Propose the call.
await multisig
  .ratify(alexa.address, call)
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Proposal:")
  .finalized()
  .run()

/// Check whether the call has been proposed.
const isProposed = await multisig.isProposed(call.callHash).run()
console.log("Is proposed:", isProposed)
assert(isProposed)

const { approvals } = await multisig
  .proposal(call.callHash)
  .unhandle(undefined)
  .run()

/// `approvals` should be a list of the approvers (account ids).
console.log("Approvals:", approvals)
$.assert($.array($.sizedUint8Array(32)), approvals)

/// Approve proposal as Billy.
await multisig
  .ratify(billy.address, call)
  .signed(signature({ sender: billy }))
  .sent()
  .dbgStatus("Final approval:")
  .finalized()
  .run()

/// Check to see whether David's balance has in fact changed
const davidFreeFinal = await davidFree.run()
console.log("David free final:", davidFreeFinal)

/// The final balance should be greater than the initial.
assert(davidFreeFinal > davidFreeInitial)
