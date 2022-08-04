import * as t from "../../test-util/mod.ts";
import * as U from "../../util/mod.ts";
import * as Z from "../mod.ts";

await t.ctx(async (config) => {
  const tx = Z.sendAndWatchExtrinsic(
    config,
    {
      type: "Id",
      value: t.p.alice.publicKey,
    },
    "Balances",
    "transfer",
    {
      dest: {
        type: "Id",
        value: t.p.bob.publicKey,
      },
      value: 12345n,
    },
    (message) => {
      return {
        type: "Sr25519",
        value: t.p.alice.sign(message),
      };
    },
    (stop) => {
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
  );
  U.throwIfError(await Z.run(tx));
}, { altRuntime: "westend" });
