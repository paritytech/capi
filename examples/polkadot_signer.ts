import { TypeRegistry } from "../deps/polkadot/types.ts";
import * as C from "../mod.ts";
import * as t from "../test_util/mod.ts";
import * as U from "../util/mod.ts";

const config = await t.config({ altRuntime: "westend" });

const root = C.sendAndWatchExtrinsic({
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
  sign: {
    signPayload(payload) {
      const tr = new TypeRegistry();
      tr.setSignedExtensions(payload.signedExtensions);
      return Promise.resolve(
        tr
          .createType("ExtrinsicPayload", payload, { version: payload.version })
          .sign(t.alice),
      );
    },
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

U.throwIfError(await root.run());

config.close();
