import * as A from "../deps/std/testing/asserts.ts";
import * as Z from "../deps/zones.ts";
import { ExtrinsicProps, SignedExtrinsic } from "../effects/extrinsic.ts";
import * as M from "../frame_metadata/mod.ts";
import * as known from "../known/rpc/mod.ts";

const k0_ = Symbol();

// TODO: use context / properly scope context / make it accessible outside of subscription lifecycle
// TODO: better zones-level way to share context between effects
export function collectExtrinsicEvents<
  Props extends Z.Rec$<ExtrinsicProps>,
  Sign extends Z.$<M.Signer>,
>(extrinsic: SignedExtrinsic<Props, Sign>) {
  const events: known.TransactionStatus[] = [];
  return extrinsic
    .watch(function(status) {
      events.push(status);
      if (known.TransactionStatus.isTerminal(status)) {
        this.stop();
      }
    })
    .next(() => events, k0_);
}

// TODO: is this a common-enough test to merit existence in `test_util`?
// TODO: means of specifying some variability?
export function assertStatusOrder(
  statuses: known.TransactionStatus[],
  statusOrderExpectation: StatusOrderExpectation,
) {
  A.assertEquals(statuses.length, statusOrderExpectation.length);
  for (let i = 0; i < statusOrderExpectation.length; i++) {
    const expected = statusOrderExpectation[i]!;
    const actualStatus = statuses[i]!;
    if (typeof actualStatus === "string") {
      A.assertEquals(actualStatus, expected);
    } else if (actualStatus.broadcast) {
      A.assert(actualStatus[expected]);
    }
  }
}
// TODO: Is it worth narrowing this with some valid assumptions?
//       For instance, we'll never get a `finalized` before `inBlock`.
//       Should we make this a more case-specific tuple with spreads & whatnot?
export type StatusOrderExpectation = (
  | "future"
  | "ready"
  | "broadcast"
  | "inBlock"
  | "retracted"
  | "finalityTimeout"
  | "finalized"
  | "usurped"
  | "dropped"
  | "invalid"
)[];
