import * as C from "capi/mod.ts"

import { Balances, client, extrinsic, System } from "polkadot_dev/mod.ts"

const signatories = [C.alice, C.bob, C.charlie].map(({ publicKey }) => publicKey)
const multisig = new C.fluent.Multisig(client, signatories, 2)

// Transfer initial balance (existential deposit) to multisig address
const existentialDeposit = extrinsic({
  sender: C.alice.address,
  call: Balances.transfer({
    value: 2_000_000_000_000n,
    dest: C.MultiAddress.Id(multisig.address),
  }),
}).signed(C.alice.sign)

// The proposal
const call = Balances.transferKeepAlive({
  dest: C.dave.address,
  value: 1230000000000n,
})

// First approval root
const proposalByAlice = multisig.ratify({
  sender: C.alice.address,
  call,
}).signed(C.alice.sign)

// TODO: upon fixing effect sys, move timepoint retrieval into ratify
// Get the proposal callHash
const callHash = C.callHash(client)(call)
// const callHash = multisig.proposals(1).access(0).access(1).as<Uint8Array>()

// Get the timepoint
const maybeTimepoint = multisig.proposal(callHash).access("value").access("when")

// Approve without executing the proposal
const voteByBob = multisig.vote({
  sender: C.bob.address,
  callHash,
  maybeTimepoint,
}).signed(C.bob.sign)

// Approve and execute the proposal
const approvalByCharlie = multisig.ratify({
  sender: C.charlie.address,
  call,
  maybeTimepoint,
}).signed(C.charlie.sign)

// check T.dave new balance
const daveBalance = System.Account.entry(C.dave.publicKey).read()

// TODO: use common env
C.throwIfError(await watchExtrinsic(existentialDeposit, "Existential deposit").run())
C.throwIfError(await watchExtrinsic(proposalByAlice, "Proposal").run())
console.log("Is proposed?", C.throwIfError(await multisig.isProposed(callHash).run()))
C.throwIfError(await watchExtrinsic(voteByBob, "Vote").run())
console.log(
  "Existing approvals",
  C.throwIfError(await multisig.proposal(callHash).access("value").access("approvals").run()),
)
C.throwIfError(await watchExtrinsic(approvalByCharlie, "Approval").run())
console.log(C.throwIfError(await daveBalance.run()))

function watchExtrinsic(extrinsic: C.SignedExtrinsic, label: string) {
  return extrinsic
    .watch(({ end }) => (status) => {
      console.log(`${label}:`, status)
      if (C.rpc.known.TransactionStatus.isTerminal(status)) {
        return end()
      }
      return
    })
}
