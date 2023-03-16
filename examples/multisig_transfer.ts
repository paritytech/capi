import { Rune, ValueRune } from "capi"
import { MultisigRune } from "capi/patterns/multisig/mod.ts"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { Balances, chain, System, users } from "polkadot_dev/mod.js"

const [a, b, c, d] = await users(4)

const multisig = Rune
  .constant({
    signatories: [a, b, c].map(({ publicKey }) => publicKey),
    threshold: 2,
  })
  .into(MultisigRune, chain)

// Read dave's initial balance (to-be changed by the call)
console.log("Dave initial balance:", await System.Account.value(d.publicKey).run())

// Transfer some funds into the multisig account
await Balances
  .transfer({
    value: 2_000_000_000_000n,
    dest: multisig.address,
  })
  .signed(signature({ sender: a }))
  .sent()
  .dbgStatus("Existential deposit:")
  .finalized()
  .run()

// The to-be proposed and approved call
const call = Balances.transferKeepAlive({
  dest: d.address,
  value: 1_230_000_000_000n,
})

// Submit a proposal to dispatch the call
await multisig
  .ratify({ call, sender: a.address })
  .signed(signature({ sender: a }))
  .sent()
  .dbgStatus("Proposal:")
  .finalized()
  .run()

// Check if the call has been proposed
console.log("Is proposed?:", await multisig.isProposed(call.hash).run())

// Send a non-executing approval
await multisig
  .approve({
    callHash: call.hash,
    sender: b.address,
  })
  .signed(signature({ sender: b }))
  .sent()
  .dbgStatus("Vote:")
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
  .ratify({ call, sender: c.address })
  .signed(signature({ sender: c }))
  .sent()
  .dbgStatus("Approval:")
  .finalized()
  .run()

// Check to see whether Dave's balance has in fact changed
console.log("Dave final balance:", await System.Account.value(d.publicKey).run())
