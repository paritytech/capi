import { createKeyMulti } from "../deps/polkadot/util-crypto.ts";
import * as C from "../mod.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";

type KeyringPair = typeof T.alice;

// Signatories must be sorted
const SIGNATORIES: Uint8Array[] = [
  T.bob.publicKey,
  T.charlie.publicKey,
  T.alice.publicKey,
];
const THRESHOLD = 2;
const ABC_MULTISIG_ADDRESS = createKeyMulti(SIGNATORIES, THRESHOLD);
const client = T.polkadot;

U.throwIfError(await addBalanceToMultisigAddress().run());
U.throwIfError(await createOrApproveMultisigProposal({ sender: T.alice }).run());
const key = U.throwIfError(await getKey().run());
const timepoint = U.throwIfError(await getTimepoint(key).run()) as unknown as Timepoint;
console.log(timepoint);
U.throwIfError(
  await createOrApproveMultisigProposal({ sender: T.bob, maybe_timepoint: timepoint }).run(),
);

// check T.dave new balance
console.log(
  U.throwIfError(await C.entryRead(T.polkadot)("System", "Account", [T.dave.publicKey]).run()),
);

function addBalanceToMultisigAddress() {
  return C.extrinsic({
    client,
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
        value: ABC_MULTISIG_ADDRESS,
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
      other_signatories: SIGNATORIES
        .filter((value) => value !== sender.publicKey),
      store_call: false,
      // TODO: use RPC payment.queryInfo(extrinsic, atBlockHash)
      max_weight: {
        ref_time: 133_179_000n,
        proof_size: 0,
      },
      maybe_timepoint,
    },
  })
    .signed((message) => ({
      type: "Sr25519",
      value: sender.sign(message),
    }))
    .watch(function(status) {
      console.log(status);
      if (C.TransactionStatus.isTerminal(status)) {
        this.stop();
      }
    });
}

function getKey() {
  // FIXME: why .access(1)
  return C.keyPageRead(client)("Multisig", "Multisigs", 10)
    .access(0)
    .access(1);
}

function getTimepoint(key: unknown) {
  return C.entryRead(client)("Multisig", "Multisigs", [
    ABC_MULTISIG_ADDRESS,
    key,
  ])
    .access("value")
    .access("when");
}
