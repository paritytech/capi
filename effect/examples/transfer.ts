import * as t from "../../test-util/mod.ts";
import * as U from "../../util/mod.ts";
import * as Z from "../mod.ts";

const config = await t.config({ altRuntime: "westend" });

const root = Z.sendAndWatchExtrinsic({
  config,
  sender: {
    type: "Id",
    value: t.alice.publicKey,
  },
  palletName: "Balances",
  methodName: "transfer",
  args: {
    value: 12345n,
    dest: {
      type: "Id",
      value: t.bob.publicKey,
    },
  },
  sign(message) {
    return {
      type: "Sr25519",
      value: t.alice.sign(message),
    };
  },
  createWatchHandler(stop) {
    return (message) => {
      if (typeof message.params.result === "string") {
        console.log("Extrinsic", message.params.result);
      } else {
        if (message.params.result.inBlock) {
          console.log("Extrinsic in block", message.params.result.inBlock);
        } else if (message.params.result.finalized) {
          console.log("Extrinsic finalized as of", message.params.result.finalized);
          stop();
        } else {
          console.log("Misc", message.params.result);
          stop();
        }
      }
    };
  },
});
U.throwIfError(await Z.run(root));

config.close();
