import * as C from "capi/mod.ts"
import { ValueRune } from "capi/mod.ts"
import { Balances, client, System } from "polkadot_dev/mod.ts"
import { MultiAddress } from "polkadot_dev/types/sp_runtime/multiaddress.ts"

const daveBalance = System.Account.entry([C.dave.publicKey])

const multisig = client.multisig({
  signatories: [
    C.alice.publicKey,
    C.bob.publicKey,
    C.charlie.publicKey,
  ],
  threshold: 2,
})

// Transfer initial balance (existential deposit) to multisig address
const existentialDeposit = Balances
  .transfer({
    value: 2_000_000_000_000n,
    dest: MultiAddress.Id(multisig.address),
  })
  .signed({ sender: C.alice })

// The proposal
const call = Balances.transferKeepAlive({
  dest: C.dave.address,
  value: 1230000000000n,
})

// First approval root
const proposalByAlice = multisig
  .ratify({
    sender: C.alice.address,
    call,
  })
  .signed({ sender: C.alice })

// Get the proposal callHash
const callHash = call.hash()

// Approve without executing the proposal
const voteByBob = multisig
  .approve({
    sender: C.bob.address,
    callHash,
  })
  .signed({ sender: C.bob })

// Approve and execute the proposal
const approvalByCharlie = multisig
  .ratify({
    sender: C.charlie.address,
    call,
  })
  .signed({ sender: C.charlie })

console.log(await daveBalance.run())

await existentialDeposit.sent().logEvents("Existential deposit:").finalized().run()

await proposalByAlice.sent().logEvents("Proposal:").finalized().run()

console.log("Is proposed?", await multisig.isProposed(callHash).run())

await voteByBob.sent().logEvents("Vote:").finalized().run()

console.log(
  "Existing approvals",
  await multisig.proposal(callHash).unsafeAs<any>().as(ValueRune).access("approvals").run(),
)

await approvalByCharlie.sent().logEvents("Approval:").finalized().run()

console.log(await daveBalance.run())
