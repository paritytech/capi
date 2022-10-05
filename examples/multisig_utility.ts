import { Atom } from "../effect/mod.ts";
import * as C from "../mod.ts";
import * as t from "../test_util/mod.ts";

const config = await t.config();

type Config = typeof config;

type Timepoint = any;
type PendingApproval = {
  when: Timepoint;
  approvals: Uint8Array[];
};

type ExtrinsicCall = [CallData: Uint8Array, CallHash: Uint8Array];

declare module "../mod.ts" {
  namespace MultiSig {
    function create(
      signatories: Uint8Array[],
      threshold: number,
    ): Uint8Array;

    function transferCall(
      config: Config,
      from: Uint8Array,
      to: Uint8Array,
      balance: number,
    ): ExtrinsicCall;

    // uses extrinsic multisig.asMulti
    function approve(
      config: Config,
      sender: Uint8Array,
      otherSignatories: Uint8Array[],
      callData: Uint8Array,
      timepoint?: Timepoint, // required for final approval
    ): Promise<void>;

    function cancel(
      config: Config,
      sender: Uint8Array,
      otherSignatories: Uint8Array[],
      timepoint: Timepoint,
      callHash: Uint8Array,
    ): Promise<void>;

    // uses storage multisig.multisigs
    function pending(
      multiSigAddress: Uint8Array,
      callHash: Uint8Array,
    ): Promise<PendingApproval>;

    function from(
      signatories: Uint8Array[],
      threshold: number,
    ): MultisigAddress;
  }

  class MultisigAddress {
    pending(callHash: Uint8Array): MultisigProposal;
    call(cb: (multisigAddress: Uint8Array) => ExtrinsicCall): MultisigExecutingProposal;
  }

  class MultisigProposal {
    approve(sender: Uint8Array, timepoint?: Timepoint): MultisigTransaction;
  }

  class MultisigExecutingProposal {
    approve(sender: Uint8Array, timepoint?: Timepoint): MultisigTransaction;
    cancel(sender: Uint8Array, timepoint?: Timepoint): MultisigTransaction;
  }

  class MultisigTransaction {
    sign(cb: (message: Uint8Array) => Uint8Array): this;
    send(): Atom<string, any, any>;
  }
}

/**
 * Steps
 * 1. create a multisig address for alice, bob and charlie
 * 2. add some balance or assume that there is balance in the multisig address
 * 3. get the encoded call data for a transfer from multisig address to dave address
 * 4. as alice, multisig.asMulti([bob, charlie], threshold, calldata)
 * 5. get timepoint from step 4
 * 6. as bob, multisig.asMulti([alice, charlie], threshold, calldata, timepoint)
 * 7. validate dave address new balance
 */

const ALICE = t.alice.publicKey;
const BOB = t.bob.publicKey;
const CHARLIE = t.charlie.publicKey;
const DAVE = t.dave.publicKey;
const SIGNATORIES: Uint8Array[] = [ALICE, BOB, CHARLIE];
declare const THRESHOLD: number;

const multiSigAddress = await C.MultiSig.create(
  SIGNATORIES,
  THRESHOLD,
);

console.log(multiSigAddress);

const [callData, callHash] = C.MultiSig.transferCall(config, multiSigAddress, DAVE, 1);

// 1st approval
await C.MultiSig.approve(config, ALICE, [BOB, CHARLIE], callData);
// TODO: sign as alice

// 2nd approval
const { when: timepoint } = await C.MultiSig.pending(multiSigAddress, callHash);
await C.MultiSig.approve(config, BOB, [ALICE, CHARLIE], callData, timepoint);
// TODO: sign as bob

// 3rd call to assert DAN new balance
const root = C.readEntry(config, "System", "Account", [DAVE]);

console.log(await root.run());

const createOrExecuteProposal = C.MultiSig
  .from(SIGNATORIES, THRESHOLD)
  .call(
    (multisigAddress) => C.MultiSig.transferCall(config, multisigAddress, DAVE, 10),
  )
  .approve(t.alice.publicKey)
  .sign((m) => t.alice.sign(m))
  .send();

await createOrExecuteProposal.run();

const approvePendingProposal = C.MultiSig
  .from(SIGNATORIES, THRESHOLD)
  .pending(callHash)
  .approve(t.bob.publicKey)
  .sign((m) => t.bob.sign(m))
  .send();

await approvePendingProposal.run();

const cancelProposal = C.MultiSig
  .from(SIGNATORIES, THRESHOLD)
  .call(
    (multisigAddress) => C.MultiSig.transferCall(config, multisigAddress, DAVE, 10),
  )
  .cancel(t.alice.publicKey)
  .sign((m) => t.alice.sign(m))
  .send();

await cancelProposal.run();
