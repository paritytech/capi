import { KeyringPair } from "../deps/polkadot/keyring/types.ts"
import { createKeyMulti } from "../deps/polkadot/util-crypto.ts"
import * as C from "../mod.ts"
import * as T from "../test_util/mod.ts"
import * as U from "../util/mod.ts"

import { extrinsic } from "../codegen/_output/polkadot/mod.ts"
import { Balances, Multisig, System } from "../codegen/_output/polkadot/pallets/mod.ts"

// FIXME: remove this check once the Zones .bind(env) fix is merged
const hostname = Deno.env.get("TEST_CTX_HOSTNAME")
const portRaw = Deno.env.get("TEST_CTX_PORT")
if (!hostname || !portRaw) {
  throw new Error("Must be running inside a test ctx")
}

const signatories = T.users
  .slice(0, 3)
  .map(({ publicKey }) => publicKey)
  .sort()
const THRESHOLD = 2
const multisigPublicKey = createKeyMulti(signatories, THRESHOLD)

// Transfer initial balance (existential deposit) to multisig address
const existentialDeposit = extrinsic({
  sender: C.compat.multiAddressFromKeypair(T.alice),
  call: Balances.transfer({
    value: 2_000_000_000_000n,
    dest: C.MultiAddress.Id(multisigPublicKey),
  }),
})
  .signed(C.compat.signerFromKeypair(T.alice))
  .watch(function(status) {
    console.log(`Existential deposit:`, status)
    if (C.rpc.known.TransactionStatus.isTerminal(status)) {
      this.stop()
    }
  })

// First approval root
const proposal = createOrApproveMultisigProposal("Proposal", T.alice)

// Get the key of the timepoint
const key = Multisig.Multisigs.keys(multisigPublicKey).readPage(1)
  .access(0)
  .access(1)

// Get the timepoint itself
const maybeTimepoint = Multisig.Multisigs.entry(multisigPublicKey, key).read()
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
  pair: KeyringPair,
  ...[maybeTimepoint]: Rest
) {
  const call = Balances.transfer_keep_alive({
    dest: C.compat.multiAddressFromKeypair(T.dave),
    value: 1230000000000n,
  })
  const maxWeight = extrinsic({
    sender: C.MultiAddress.Id(multisigPublicKey),
    call,
  })
    .feeEstimate
    .access("weight")
    .next((weight) => {
      return {
        ref_time: BigInt(weight.ref_time),
        proof_size: BigInt(weight.proof_size),
      }
    })
  return extrinsic({
    sender: C.compat.multiAddressFromKeypair(pair),
    call: C.Z.call.fac(Multisig.as_multi, null!)(C.Z.rec({
      threshold: THRESHOLD,
      call,
      other_signatories: signatories.filter((value) => value !== pair.publicKey),
      store_call: false,
      max_weight: maxWeight,
      maybe_timepoint: maybeTimepoint as Rest[0],
    })),
  })
    .signed(C.compat.signerFromKeypair(pair))
    .watch(function(status) {
      console.log(`${label}:`, status)
      if (C.rpc.known.TransactionStatus.isTerminal(status)) {
        this.stop()
      }
    })
}
