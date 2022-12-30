import * as C from "http://localhost:5646/@local/mod.ts"
import * as T from "http://localhost:5646/@local/test_util/mod.ts"
import * as U from "http://localhost:5646/@local/util/mod.ts"

import { client } from "http://localhost:5646/@local/proxy/dev:polkadot/@v0.9.36/capi.ts"
import { extrinsic } from "http://localhost:5646/@local/proxy/dev:polkadot/@v0.9.36/mod.ts"
import {
  Balances,
  System,
} from "http://localhost:5646/@local/proxy/dev:polkadot/@v0.9.36/pallets/mod.ts"

// FIXME: remove this check once the Zones .run() fix is merged
const hostname = Deno.env.get("TEST_CTX_HOSTNAME")
const portRaw = Deno.env.get("TEST_CTX_PORT")
if (!hostname || !portRaw) {
  throw new Error("Must be running inside a test ctx")
}

const multisig = new C.fluent.Multisig(
  client,
  T.users.slice(0, 3).map((pair) => pair.publicKey),
  2,
)

// Transfer initial balance (existential deposit) to multisig address
const existentialDeposit = extrinsic({
  sender: T.alice.address,
  call: Balances.transfer({
    value: 2_000_000_000_000n,
    dest: C.MultiAddress.Id(multisig.address),
  }),
})
  .signed(T.alice.sign)

// The proposal
const call = Balances.transferKeepAlive({
  dest: T.dave.address,
  value: 1230000000000n,
})

// First approval root
const proposalByAlice = multisig.ratify({
  sender: T.alice.address,
  call,
})
  .signed(T.alice.sign)

// TODO: upon fixing effect sys, move timepoint retrieval into ratify
// Get the proposal callHash
const callHash = C.callHash(client)(call)
// const callHash = multisig.proposals(1).access(0).access(1).as<Uint8Array>()

// Get the timepoint
const maybeTimepoint = multisig.proposal(callHash).access("value").access("when")

// Approve without executing the proposal
const voteByBob = multisig.vote({
  sender: T.bob.address,
  callHash,
  maybeTimepoint,
})
  .signed(T.bob.sign)

// Approve and execute the proposal
const approvalByCharlie = multisig.ratify({
  sender: T.charlie.address,
  call,
  maybeTimepoint,
})
  .signed(T.charlie.sign)

// check T.dave new balance
const daveBalance = System.Account.entry(T.dave.publicKey).read()

// TODO: use common env
U.throwIfError(await watchExtrinsic(existentialDeposit, "Existential deposit").run())
U.throwIfError(await watchExtrinsic(proposalByAlice, "Proposal").run())
console.log("Is proposed?", U.throwIfError(await multisig.isProposed(callHash).run()))
U.throwIfError(await watchExtrinsic(voteByBob, "Vote").run())
console.log(
  "Existing approvals",
  U.throwIfError(await multisig.proposal(callHash).access("value").access("approvals").run()),
)
U.throwIfError(await watchExtrinsic(approvalByCharlie, "Approval").run())
console.log(U.throwIfError(await daveBalance.run()))

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
