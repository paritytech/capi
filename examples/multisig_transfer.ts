import { createKeyMulti } from "../deps/polkadot/util-crypto.ts";
import * as C from "../mod.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";

type KeyringPair = typeof T.alice;

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
U.throwIfError(await createOrApproveMultisigProposal({ sender: T.alice }).bind(env)());

// Get the key of the timepoint
const key = C.keyPageRead(T.polkadot)("Multisig", "Multisigs", 1, [multisigPublicKey])
  .access(0)
  .access(1);

// Get the timepoint itself
const maybe_timepoint = await C.entryRead(T.polkadot)("Multisig", "Multisigs", [
  multisigPublicKey,
  key,
])
  .access("value")
  .access("when")
  .bind(env)();

U.throwIfError(
  await createOrApproveMultisigProposal({ sender: T.bob, maybe_timepoint }).bind(env)(),
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

interface CreateOrApproveProposalProps {
  sender: KeyringPair;
  maybe_timepoint?: Timepoint;
}

interface Timepoint {
  height: number;
  index: number;
}

function createOrApproveMultisigProposal(
  { sender, maybe_timepoint }: CreateOrApproveProposalProps,
) {
  const createEx = (weight?: bigint) => {
    return C.extrinsic({
      client: T.polkadot,
      sender: {
        type: "Id",
        value: sender.publicKey,
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
          .filter((value) => value !== sender.publicKey),
        store_call: false,
        // TODO: use RPC payment.queryInfo(extrinsic, atBlockHash)
        max_weight: {
          ref_time: weight || 133_179_000n,
          proof_size: 0,
        },
        maybe_timepoint,
      },
    })
      .signed((message) => ({
        type: "Sr25519",
        value: sender.sign(message),
      }));
  };
  const withoutActualWeight = createEx().extrinsic;
  const weight = C.payment.queryInfo(T.polkadot)(withoutActualWeight)
    .access("weight");
  C.Z.call(weight, (d) => {
    console.log("queryInfo", d);
  }).bind(env)();
  // FIXME: pass weight as an argument to createEx(weight)
  return createEx().watch(function(status) {
    console.log(status);
    if (C.TransactionStatus.isTerminal(status)) {
      this.stop();
    }
  });
}
