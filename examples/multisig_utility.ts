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
  }
}

/**
 * Steps
 * 1. create a multisig address for alice, bob and charlie
 * 2. add some balance or assume that there is balance in the multisig address
 * 3. get the encoded call data for a transfer from multisig address to dan address
 * 4. as alice, multisig.asMulti([bob, charlie], threshold, calldata)
 * 5. get timepoint from step 4
 * 6. as bob, multisig.asMulti([alice, charlie], threshold, calldata, timepoint)
 * 7. validate dan address new balance
 */

declare const ALICE: Uint8Array;
declare const BOB: Uint8Array;
declare const CHARLIE: Uint8Array;
declare const DAN: Uint8Array;
const SIGNATORIES: Uint8Array[] = [ALICE, BOB, CHARLIE];
declare const THRESHOLD: number;

const multiSigAddress = await C.MultiSig.create(
  SIGNATORIES,
  THRESHOLD,
);

console.log(multiSigAddress);

const [callData, callHash] = C.MultiSig.transferCall(config, multiSigAddress, DAN, 1);

// 1st approval
await C.MultiSig.approve(config, ALICE, [BOB, CHARLIE], callData);
// TODO: sign as alice

// 2nd approval
const { when: timepoint } = await C.MultiSig.pending(multiSigAddress, callHash);
await C.MultiSig.approve(config, BOB, [ALICE, CHARLIE], callData, timepoint);
// TODO: sign as bob

// 3rd call to assert DAN new balance
const root = C.readEntry(config, "System", "Account", [DAN]);

console.log(await root.run());
