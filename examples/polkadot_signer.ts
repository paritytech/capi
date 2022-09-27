import { TypeRegistry } from "https://deno.land/x/polkadot@0.0.8/types/mod.ts";
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
  .signed(
    {
      type: "Id",
      value: t.alice.publicKey,
    },
    {
      signPayload(payload: any) {
        const tr = new TypeRegistry();
        tr.setSignedExtensions(payload.signedExtensions);
        return Promise.resolve(
          tr
            .createType("ExtrinsicPayload", payload, { version: payload.version })
            .sign(t.alice),
        );
      },
    },
  )
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
        }
      }
    };
  });

U.throwIfError(await root.run());
