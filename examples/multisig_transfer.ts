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

// Signatories must be sorted
const signatories: Uint8Array[] = [
  T.alice.publicKey,
  T.bob.publicKey,
  T.charlie.publicKey,
].sort();
const THRESHOLD = 2;
const multisigPublicKey = createKeyMulti(signatories, THRESHOLD);

// Transfer initial balance (existential deposit) to multisig address
const existentialDeposit = C.extrinsic({
  client: T.polkadot,
  sender: {
    type: "Id",
    value: T.alice.publicKey,
  },
  palletName: "Balances",
  methodName: "transfer",
  args: {
    value: 2_000_000_000_000n,
    dest: {
      type: "Id",
      value: multisigPublicKey,
    },
  },
})
  .signed((message) => ({
    type: "Sr25519",
    value: T.alice.sign(message),
  }))
  .watch(function(status) {
    console.log(status);
    if (C.TransactionStatus.isTerminal(status)) {
      this.stop();
    }
  });

// First approval root
const proposal = createOrApproveMultisigProposal({
  publicKey: T.alice.publicKey,
  sign: (message) => {
    return ({
      type: "Sr25519",
      value: T.alice.sign(message),
    });
  },
});

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

const approval = createOrApproveMultisigProposal({
  publicKey: T.bob.publicKey,
  sign: (message) => ({
    type: "Sr25519",
    value: T.bob.sign(message),
  }),
  maybeTimepoint,
});

// check T.dave new balance
const daveBalance = C.entryRead(T.polkadot)("System", "Account", [T.dave.publicKey]);

const env = C.Z.env();
U.throwIfError(await existentialDeposit.bind(env)());
U.throwIfError(await proposal.bind(env)());
U.throwIfError(await approval.bind(env)());
// U.throwIfError(await daveBalance.bind(env)());

function createOrApproveMultisigProposal({
  publicKey,
  sign,
  maybeTimepoint,
}: {
  publicKey: Uint8Array;
  sign: C.Z.$<C.M.SignExtrinsic>;
  maybeTimepoint?: C.Z.$<{
    height: number;
    index: number;
  }>;
}) {
  const createEx = (weight?: bigint) => {
    return C.extrinsic({
      client: T.polkadot,
      sender: {
        type: "Id",
        value: publicKey,
      },
      palletName: "Multisig",
      methodName: "as_multi",
      args: C.Z.rec({
        threshold: THRESHOLD,
        call: {
          type: "Balances",
          value: {
            type: "transfer_keep_alive",
            dest: {
              type: "Id",
              value: T.dave.publicKey,
            },
            value: 1_230_000_000_000n,
          },
        },
        other_signatories: signatories
          .filter((value) => value !== publicKey),
        store_call: false,
        // FIXME: use RPC payment.queryInfo(extrinsic, atBlockHash)
        // TODO: versions differ between versions of polkadot (will be resolved by using payment query info result)
        max_weight: 500_000_000n,
        // max_weight: weight || {
        //   ref_time: 500_000_000n,
        //   // proof_size: 0,
        // },
        maybe_timepoint: maybeTimepoint,
      }),
    })
      .signed(sign);
  };
  // FIXME: pass weight as an argument to createEx(weight)
  // const withoutActualWeight = createEx().extrinsic;
  // const weight = C.payment.queryInfo(T.polkadot)(withoutActualWeight)
  //   .access("weight");
  // C.Z.call(weight, (d) => {
  //   console.log("queryInfo", d);
  // }).bind(env)();
  return createEx()
    .watch(function(status) {
      console.log(status);
      if (C.TransactionStatus.isTerminal(status)) {
        this.stop();
      }
    });
}
