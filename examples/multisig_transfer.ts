import { KeyringPair } from "../deps/polkadot/keyring/types.ts";
import { createKeyMulti } from "../deps/polkadot/util-crypto.ts";
import * as C from "../mod.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";

// FIXME: remove this check once the Zones .bind(env) fix is merged
const hostname = Deno.env.get("TEST_CTX_HOSTNAME");
const portRaw = Deno.env.get("TEST_CTX_PORT");
if (!hostname || !portRaw) {
  throw new Error("Must be running inside a test ctx");
}

const signatories = T.users
  .slice(0, 3)
  .map(({ publicKey }) => publicKey)
  .sort();
const THRESHOLD = 2;
const multisigPublicKey = createKeyMulti(signatories, THRESHOLD);

// Transfer initial balance (existential deposit) to multisig address
const existentialDeposit = C.extrinsic({
  client: T.polkadot,
  sender: C.compat.multiAddressFromKeypair(T.alice),
  palletName: "Balances",
  methodName: "transfer",
  args: {
    value: 2_000_000_000_000n,
    dest: C.MultiAddress.fromId(multisigPublicKey),
  },
})
  .signed(C.compat.signerFromKeypair(T.alice))
  .watch(function(status) {
    console.log(`Existential deposit:`, status);
    if (C.TransactionStatus.isTerminal(status)) {
      this.stop();
    }
  });

// First approval root
const proposal = createOrApproveMultisigProposal("Proposal", T.alice);

// Get the key of the timepoint
const key = C.keyPageRead(T.polkadot)("Multisig", "Multisigs", 1, [multisigPublicKey])
  .access(0)
  .access(1);

// Get the timepoint itself
const maybeTimepoint = C.entryRead(T.polkadot)("Multisig", "Multisigs", [
  multisigPublicKey,
  key,
])
  .access("value")
  .access("when");

const approval = createOrApproveMultisigProposal("Approval", T.bob, maybeTimepoint);

// check T.dave new balance
const daveBalance = C.entryRead(T.polkadot)("System", "Account", [T.dave.publicKey]);

// TODO: use common env
U.throwIfError(await existentialDeposit.run());
U.throwIfError(await proposal.run());
U.throwIfError(await approval.run());
console.log(U.throwIfError(await daveBalance.run()));

// FIXME: weight calculation (`payment.queryInfo(extrinsic, atBlockHash)`)
function createOrApproveMultisigProposal<
  Rest extends [
    MaybeTimepoint?: C.Z.$<{
      height: number;
      index: number;
    }>,
  ],
>(
  label: string,
  pair: KeyringPair,
  ...[maybeTimepoint]: Rest
) {
  return C.extrinsic({
    client: T.polkadot,
    sender: C.compat.multiAddressFromKeypair(pair),
    palletName: "Multisig",
    methodName: "as_multi",
    args: C.Z.rec({
      threshold: THRESHOLD,
      call: {
        type: "Balances",
        value: {
          type: "transfer_keep_alive",
          dest: C.compat.multiAddressFromKeypair(T.dave),
          value: 1_230_000_000_000n,
        },
      },
      other_signatories: signatories.filter((value) => value !== pair.publicKey),
      store_call: false,
      max_weight: {
        ref_time: 500_000_000n,
        proof_size: 0n,
      },
      maybe_timepoint: maybeTimepoint as Rest[0],
    }),
  })
    .signed(C.compat.signerFromKeypair(pair))
    .watch(function(status) {
      console.log(`${label}:`, status);
      if (C.TransactionStatus.isTerminal(status)) {
        this.stop();
      }
    });
}
