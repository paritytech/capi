import * as C from "capi/mod.ts"

import { Balances, Multisig, System } from "polkadot_dev/mod.ts"

// FIXME: remove this check once the Zones .bind(env) fix is merged
const hostname = Deno.env.get("TEST_CTX_HOSTNAME")
const portRaw = Deno.env.get("TEST_CTX_PORT")
if (!hostname || !portRaw) {
  throw new Error("Must be running inside a test ctx")
}

const signatories = [C.alice, C.bob, C.charlie].map((pair) => pair.publicKey)
const THRESHOLD = 2
const multisigAddress = C.multisigAddress(signatories, THRESHOLD)

// Transfer initial balance (existential deposit) to multisig address
const existentialDeposit = Balances.transfer({
  value: 2_000_000_000_000n,
  dest: C.MultiAddress.Id(multisigAddress),
})
  .signed({ sender: C.alice })
  .sent
  .logEvents("Existential deposit:")
  .finalizedHash

// First approval root
const proposal = createOrApproveMultisigProposal("Proposal", C.alice)

// Get the key of the timepoint
const key = Multisig.Multisigs.keyPage(1, [multisigAddress]).access(0)

// Get the timepoint itself
const maybeTimepoint = Multisig.Multisigs.entry(key).access("when")

const approval = createOrApproveMultisigProposal("Approval", C.bob, maybeTimepoint)

// check dave new balance
const daveBalance = System.Account.entry([C.dave.publicKey])

await existentialDeposit.run()
await proposal.run()
await approval.run()
console.log(await daveBalance.run())

function createOrApproveMultisigProposal<X>(
  label: string,
  sender: C.Sr25519,
  ...[maybeTimepoint]: C.RunicArgs<X, [
    maybeTimepoint?: { height: number; index: number },
  ]>
) {
  const call = Balances.transferKeepAlive({
    dest: C.dave.address,
    value: 1230000000000n,
  })
  const maxWeight = call.feeEstimate().access("weight")
  return Multisig.asMulti({
    threshold: THRESHOLD,
    call,
    otherSignatories: signatories.filter((value) => value !== sender.publicKey),
    storeCall: false,
    maxWeight,
    maybeTimepoint,
  })
    .signed({ sender })
    .sent
    .logEvents(`${label}:`)
    .finalizedHash
}
