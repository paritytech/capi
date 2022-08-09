import * as C from "../mod.ts";
import * as t from "../test-util/mod.ts";
import * as U from "../util/mod.ts";

const config = await t.config();

const root = C
  .chain(config)
  .pallet("Balances")
  .extrinsic("transfer")
  .call({
    value: 12345n,
    dest: {
      type: "Id",
      value: t.bob.publicKey,
    },
  })
  .signed({
    type: "Id",
    value: t.alice.publicKey,
  }, (message) => {
    return {
      type: "Sr25519",
      value: t.alice.sign(message),
    };
  })
  .sendAndWatch((stop) => {
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

U.throwIfError(await root.run());

config.close();
