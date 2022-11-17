import * as C from "#capi/mod.ts"
import * as T from "#capi/test_util/mod.ts"
import * as U from "#capi/util/mod.ts"

import { extrinsic } from "#capi/dev:polkadot/@v0.9.31/mod.ts"
import { Balances, Multisig, System } from "#capi/dev:polkadot/@v0.9.31/pallets/mod.ts"

// FIXME: remove this check once the Zones .bind(env) fix is merged
const hostname = Deno.env.get("TEST_CTX_HOSTNAME")
const portRaw = Deno.env.get("TEST_CTX_PORT")
if (!hostname || !portRaw) {
  throw new Error("Must be running inside a test ctx")
}

const signatories = T.users.slice(0, 3).map((pair) => pair.publicKey)
const THRESHOLD = 2
const multisigAddress = U.multisigAddress(signatories, THRESHOLD)

// Transfer initial balance (existential deposit) to multisig address
const existentialDeposit = extrinsic({
  sender: T.alice.address,
  call: Balances.transfer({
    value: 2_000_000_000_000n,
    dest: C.MultiAddress.Id(multisigAddress),
  }),
})
  .signed(T.alice.sign)
  .watch(function(status) {
    console.log(`Existential deposit:`, status)
    if (C.rpc.known.TransactionStatus.isTerminal(status)) {
      this.stop()
    }
  })

// First approval root
const proposal = createOrApproveMultisigProposal("Proposal", T.alice)

// Get the key of the timepoint
const key = Multisig.Multisigs.keys(multisigAddress).readPage(1)
  .access(0)
  .access(1)

// Get the timepoint itself
const maybeTimepoint = Multisig.Multisigs.entry(multisigAddress, key).read()
  .access("value")
  .access("when")

const approval = createOrApproveMultisigProposal("Approval", T.bob, maybeTimepoint)

// check T.dave new balance
const daveBalance = System.Account.entry(T.dave.publicKey).read()

// TODO: use common env
U.throwIfError(await existentialDeposit.run())
U.throwIfError(await proposal.run())
U.throwIfError(await approval.run())
console.log(U.throwIfError(await daveBalance.run()))

function createOrApproveMultisigProposal<
  Rest extends [
    MaybeTimepoint?: C.Z.$<{
      height: number
      index: number
    }>,
  ],
>(
  label: string,
  pair: U.Sr25519,
  ...[maybeTimepoint]: Rest
) {
  const call = Balances.transferKeepAlive({
    dest: T.dave.address,
    value: 1230000000000n,
  })
  const maxWeight = extrinsic({
    sender: C.MultiAddress.Id(multisigAddress),
    call,
  })
    .feeEstimate
    .access("weight")
    .next((weight) => {
      return {
        refTime: BigInt(weight.ref_time),
        proofSize: BigInt(weight.proof_size),
      }
    })
  return extrinsic({
    sender: pair.address,
    call: C.Z.call.fac(Multisig.asMulti, null!)(C.Z.rec({
      threshold: THRESHOLD,
      call,
      otherSignatories: signatories.filter((value) => value !== pair.publicKey),
      storeCall: false,
      maxWeight,
      maybeTimepoint: maybeTimepoint as Rest[0],
    })),
  })
    .signed(pair.sign)
    .watch(function(status) {
      console.log(`${label}:`, status)
      if (C.rpc.known.TransactionStatus.isTerminal(status)) {
        this.stop()
      }
    })
}
