import { ValueRune } from "capi"
import { MultisigRune } from "capi/patterns/multisig/mod.ts"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { Balances, chain, System, users } from "polkadot_dev/mod.js"

const [alexa, billy, carol, david] = await users(4)

const multisig = MultisigRune.from({
  signatories: [alexa, billy, carol]
    .map(({ publicKey }) => publicKey),
  threshold: 2,
}, chain)

// Read dave's initial balance (to-be changed by the call)
console.log("Dave initial balance:", await System.Account.value(david.publicKey).run())

// Transfer some funds into the multisig account
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

// The to-be proposed and approved call
const call = Balances.transferKeepAlive({
  dest: david.address,
  value: 1_230_000_000_000n,
})

// Submit a proposal to dispatch the call
await multisig
  .ratify({ call, sender: alexa.address })
  .signed(signature({ sender: alexa }))
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
    sender: billy.address,
  })
  .signed(signature({ sender: billy }))
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
  .ratify({ call, sender: carol.address })
  .signed(signature({ sender: carol }))
  .sent()
  .dbgStatus("Approval:")
  .finalized()
  .run()

// Check to see whether Dave's balance has in fact changed
console.log("Dave final balance:", await System.Account.value(david.publicKey).run())
