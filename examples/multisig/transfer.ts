import { assert } from "asserts"
import { ValueRune } from "capi"
import { MultisigRune } from "capi/patterns/multisig/mod.ts"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { Balances, chain, createUsers, System } from "polkadot_dev/mod.js"

const { alexa, billy, carol, david } = await createUsers()

const multisig = MultisigRune.from(chain, {
  signatories: [alexa, billy, carol].map(({ publicKey }) => publicKey),
  threshold: 2,
})

const daveBalance = System.Account
  .value(david.publicKey)
  .unhandle(undefined)
  .access("data", "free")
const daveBalanceInitial = await daveBalance.run()
console.log("Dave initial balance:", daveBalanceInitial)

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

const isProposed = await multisig.isProposed(call.hash).run()
console.log("Is proposed?:", isProposed)

await multisig // TODO: get `ratify` working in place of `approve`
  .approve({ callHash: call.hash, sender: billy.address })
  .signed(signature({ sender: billy }))
  .sent()
  .dbgStatus("Vote:")
  .finalized()
  .run()

const { approvals } = await multisig.proposal(call.hash).into(ValueRune).run()
console.log("Existing approvals:", approvals)

await multisig
  .ratify({ call, sender: carol.address })
  .signed(signature({ sender: carol }))
  .sent()
  .dbgStatus("Approval:")
  .finalized()
  .run()

// Check to see whether Dave's balance has in fact changed
const daveBalanceFinal = await daveBalance.run()
console.log("Dave final balance:", daveBalanceFinal)
assert(daveBalanceInitial < daveBalanceFinal)
