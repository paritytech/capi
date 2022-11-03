import * as A from "../deps/std/testing/asserts.ts";
import * as Z from "../deps/zones.ts";
import { ExtrinsicProps, SignedExtrinsic } from "../effects/extrinsic.ts";
import * as M from "../frame_metadata/mod.ts";
import * as known from "../known/rpc/mod.ts";

// TODO: use context / properly scope context / make it accessible outside of subscription lifecycle
// TODO: better zones-level way to share context between effects
export function collectExtrinsicEvents<
  Props extends Z.Rec$<ExtrinsicProps>,
  Sign extends Z.$<M.SignExtrinsic>,
>(
  extrinsic: SignedExtrinsic<Props, Sign>,
) {
  const events: known.TransactionStatus[] = [];
  return Z.call(
    extrinsic.watch(function(status) {
      events.push(status);
      if (known.TransactionStatus.isTerminal(status)) {
        this.stop();
      }
    }),
    () => events,
  );
}

export function assertTransactionStatusOrder(
  statuses: known.TransactionStatus[],
  expectedOrder: ExpectedOrder,
) {
  A.assertEquals(statuses.length, expectedOrder.length);
  for (let i = 0; i < expectedOrder.length; i++) {
    const expected = expectedOrder[i]!;
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
type ExpectedOrder = (
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
