import { alice, bob, charlie, dave, MultisigRune, Rune, ValueRune } from "capi"
import { Balances, client, System } from "polkadot_dev/mod.ts"
import { MultiAddress } from "polkadot_dev/types/sp_runtime/multiaddress.ts"

const multisig = Rune
  .resolve({
    signatories: [alice.publicKey, bob.publicKey, charlie.publicKey],
    threshold: 2,
  })
  .into(MultisigRune, client)

// Read dave's initial balance (to-be changed by the call)
console.log("Dave initial balance:", await System.Account.entry([dave.publicKey]).run())

// Transfer some funds into the multisig account
await Balances
  .transfer({
    value: 2_000_000_000_000n,
    dest: MultiAddress.Id(multisig.address),
  })
  .signed({ sender: alice })
  .sent()
  .logStatus("Existential deposit:")
  .finalized()
  .run()

// The to-be proposed and approved call
const call = Balances.transferKeepAlive({
  dest: dave.address,
  value: 1_230_000_000_000n,
})

// Submit a proposal to dispatch the call
await multisig
  .ratify({ call, sender: alice.address })
  .signed({ sender: alice })
  .sent()
  .logStatus("Proposal:")
  .finalized()
  .run()

// Check if the call has been proposed
console.log("Is proposed?:", await multisig.isProposed(call.hash).run())

// Send a non-executing approval
await multisig
  .approve({
    callHash: call.hash,
    sender: bob.address,
  })
  .signed({ sender: bob })
  .sent()
  .logStatus("Vote:")
  .finalized()
  .run()

// Check for existing approval(s)
console.log(
  "Existing approvals:",
  await multisig
    .proposal(call.hash)
    .unsafeAs<any>()
    .into(ValueRune)
    .access("approvals")
    .run(),
)

// Send the executing (final) approval
await multisig
  .ratify({ call, sender: charlie.address })
  .signed({ sender: charlie })
  .sent()
  .logStatus("Approval:")
  .finalized()
  .run()

// Check to see whether Dave's balance has in fact changed
console.log("Dave final balance:", await System.Account.entry([dave.publicKey]).run())
