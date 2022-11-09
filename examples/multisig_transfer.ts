// FIXME: remove this check once the Zones .bind(env) fix is merged
const hostname = Deno.env.get("TEST_CTX_HOSTNAME");
const portRaw = Deno.env.get("TEST_CTX_PORT");
if (!hostname || !portRaw) {
  throw new Error("Must be running inside a test ctx");
}

import { createKeyMulti } from "../deps/polkadot/util-crypto.ts";
import * as C from "../mod.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";

// Signatories must be sorted
const signatories: Uint8Array[] = [
  T.alice.publicKey,
  T.bob.publicKey,
  T.charlie.publicKey,
].sort();
const THRESHOLD = 2;
const multisigPublicKey = createKeyMulti(signatories, THRESHOLD);

const env = C.Z.env();

// Transfer initial balance (existential deposit) to multisig address
U.throwIfError(await addBalanceToMultisigAddress().bind(env)());

// Create proposal
U.throwIfError(
  await createOrApproveMultisigProposal({
    publicKey: T.alice.publicKey,
    sign: C.Z.call(0, () =>
      (message) => ({
        type: "Sr25519",
        value: T.alice.sign(message),
      })),
  }).bind(env)(),
);

// Get the key of the timepoint
const key = C.keyPageRead(T.polkadot)("Multisig", "Multisigs", 1, [multisigPublicKey])
  .access(0)
  .access(1);

// Get the timepoint itself
const maybeTimepoint = await C.entryRead(T.polkadot)("Multisig", "Multisigs", [
  multisigPublicKey,
  key,
])
  .access("value")
  .access("when")
  .bind(env)();

U.throwIfError(
  await createOrApproveMultisigProposal({
    publicKey: T.bob.publicKey,
    sign: C.Z.call(0, () =>
      (message) => ({
        type: "Sr25519",
        value: T.bob.sign(message),
      })),
    maybeTimepoint,
  }).bind(env)(),
);

// check T.dave new balance
console.log(
  U.throwIfError(
    await C.entryRead(T.polkadot)("System", "Account", [T.dave.publicKey]).bind(env)(),
  ),
);

function addBalanceToMultisigAddress() {
  return C.extrinsic({
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
}

function createOrApproveMultisigProposal(
  {
    publicKey,
    sign,
    maybeTimepoint,
  }: {
    publicKey: Uint8Array;
    sign: C.Z.$<C.M.SignExtrinsic>;
    maybeTimepoint?: {
      height: number;
      index: number;
    };
  },
) {
  const createEx = (weight?: bigint) => {
    return C.extrinsic({
      client: T.polkadot,
      sender: {
        type: "Id",
        value: publicKey,
      },
      palletName: "Multisig",
      methodName: "as_multi",
      args: {
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
        max_weight: weight || {
          ref_time: 500_000_000n,
          proof_size: 0,
        },
        maybe_timepoint: maybeTimepoint,
      },
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
  return createEx().watch(function(status) {
    console.log(status);
    if (C.TransactionStatus.isTerminal(status)) {
      this.stop();
    }
  });
}
