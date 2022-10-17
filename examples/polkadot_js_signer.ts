import { TypeRegistry } from "../deps/polkadot/types.ts";
import * as C from "../mod.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";

const root = C.sendAndWatchExtrinsic({
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
  sign: {
    signPayload(payload) {
      const tr = new TypeRegistry();
      tr.setSignedExtensions(payload.signedExtensions);
      return Promise.resolve(
        tr
          .createType("ExtrinsicPayload", payload, { version: payload.version })
          .sign(T.alice),
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
