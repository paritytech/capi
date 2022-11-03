import * as C from "../mod.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";

const recipients = [T.bob, T.charlie, T.dave, T.eve];
const balances = C.ls(
  ...recipients.map(({ publicKey }) => {
    return C.entryRead(T.westend, "System", "Account", [publicKey])
      .access("value")
      .access("data")
      .access("free")
      .as<bigint>();
  }),
);

const extrinsic = new C.Extrinsic(T.westend, {
  sender: {
    type: "Id",
    value: T.alice.publicKey,
  },
  palletName: "Utility",
  methodName: "batch_all",
  args: {
    calls: recipients.map(({ publicKey }) => ({
      type: "Balances",
      value: {
        type: "transfer",
        dest: {
          type: "Id",
          value: publicKey,
        },
        value: 12345n,
      },
    })),
  },
})
  .signed((message) => ({
    type: "Sr25519",
    value: T.alice.sign(message),
  }))
  .watch((stop) => {
    return (event) => {
      if (typeof event.params.result === "string") {
        console.log("Extrinsic", event.params.result);
      } else {
        if (event.params.result.inBlock) {
          console.log("Extrinsic in block", event.params.result.inBlock);
        } else if (event.params.result.finalized) {
          console.log("Extrinsic finalized as of", event.params.result.finalized);
          stop();
        } else {
          console.log("Misc", event.params.result);
          stop();
        }
      }
    };
  });

const initialBalances = U.throwIfError(await C.run(balances));
U.throwIfError(await C.run(extrinsic));
const balancesAfterExtrinsicFinalized = U.throwIfError(await C.run(balances));

console.log({
  initialBalances,
  balancesAfterExtrinsicFinalized,
});
