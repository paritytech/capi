import * as C from "../mod.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";

const root = new C.ExtrinsicSentWatch({
  config: T.westend,
  sender: {
    type: "Id",
    value: T.alice.publicKey,
  },
  palletName: "Balances",
  methodName: "transfer",
  args: {
    value: 12345n,
    dest: {
      type: "Id",
      value: T.bob.publicKey,
    },
  },
  sign(message) {
    return {
      type: "Sr25519",
      value: T.alice.sign(message),
    };
  },
  createWatchHandler(stop) {
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
  },
});

U.throwIfError(await C.run(root));
