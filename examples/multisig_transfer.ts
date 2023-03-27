import { Rune, ValueRune } from "capi"
import { MultisigRune } from "capi/patterns/multisig/mod.ts"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { Balances, chain, createUsers, System } from "polkadot_dev/mod.js"

const [alexa, billy, carol, david] = await createUsers(4)

const multisig = Rune
  .constant({
    signatories: [alexa, billy, carol].map(({ publicKey }) => publicKey),
    threshold: 2,
  })
  .into(MultisigRune, chain)

console.log("Dave initial balance:", await System.Account.value(david.publicKey).run())

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

const call = Balances.transferKeepAlive({
  dest: david.address,
  value: 1_230_000_000_000n,
})

await multisig
  .ratify({ call, sender: alexa.address })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Proposal:")
  .finalized()
  .run()

console.log("Is proposed?:", await multisig.isProposed(call.hash).run())

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

console.log(
  "Existing approvals:",
  await multisig
    .proposal(call.hash)
    .into(ValueRune)
    .access("approvals")
    .run(),
)

await multisig
  .ratify({ call, sender: carol.address })
  .signed(signature({ sender: carol }))
  .sent()
  .dbgStatus("Approval:")
  .finalized()
  .run()

// Check to see whether Dave's balance has in fact changed
console.log("Dave final balance:", await System.Account.value(david.publicKey).run())
