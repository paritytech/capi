import { assertEquals, assertObjectMatch } from "../deps/std/testing/asserts.ts";
import * as C from "../mod.ts";
import * as t from "../test-util/mod.ts";
import * as U from "../util/mod.ts";

Deno.test({
  name: "transfer",
  fn: async (ctx) => {
    const config = await t.config({ altRuntime: "westend" });

    await ctx.step("extrinsic events", async () => {
      const extrinsicEvents: string[] = [];

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
        sign(message) {
          return {
            type: "Sr25519",
            value: t.alice.sign(message),
          };
        },
        createWatchHandler(stop) {
          return (event) => {
            if (typeof event.params.result === "string") {
              extrinsicEvents.push(event.params.result);
            } else {
              if (event.params.result.inBlock) {
                extrinsicEvents.push("inBlock");
              } else if (event.params.result.finalized) {
                extrinsicEvents.push("finalized");
                stop();
              } else {
                stop();
              }
            }
          };
        },
      });

      U.throwIfError(await root.run());

      assertEquals(extrinsicEvents, ["ready", "inBlock", "finalized"]);
    });

    await ctx.step({
      name: "account balance",
      ignore: true,
      fn: async () => {
        const root = C.readEntry(config, "System", "Account", [t.bob.publicKey]);

        const state = U.throwIfError(await root.run());

        assertObjectMatch(state, { value: { data: { free: 12345n } } });
      },
    });

    config.close();
  },
});
