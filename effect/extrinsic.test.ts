import type { KeyringPair } from "https://deno.land/x/polkadot@0.0.8/keyring/types.ts";
import { assertEquals, assertObjectMatch } from "../deps/std/testing/asserts.ts";
import * as C from "../mod.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";

Deno.test({
  name: "Balances.transfer",
  fn: async (ctx) => {
    await ctx.step("extrinsic events", async () => {
      const extrinsicEvents: string[] = await collectExtrinsicEvents(
        {
          config: T.westend,
          palletName: "Balances",
          methodName: "transfer",
          args: {
            value: 12345n,
            dest: {
              type: "Id",
              value: T.bob.publicKey,
            },
          },
        },
        T.alice,
      );

      assertEquals(extrinsicEvents, ["ready", "inBlock", "finalized"]);
    });

    await ctx.step({
      name: "account balance updated",
      fn: async () => {
        const root = C.readEntry(T.westend, "System", "Account", [T.bob.publicKey]);

        const state = await root.run();

        assertObjectMatch(state, { value: { data: { free: 10000000000012345n } } });
      },
    });
  },
});

Deno.test({
  name: "Treasury.propose_spend",
  fn: async (ctx) => {
    await ctx.step("extrinsic events", async () => {
      const extrinsicEvents: string[] = await collectExtrinsicEvents(
        {
          config: T.westend,
          palletName: "Treasury",
          methodName: "propose_spend",
          args: {
            value: 200n,
            beneficiary: {
              type: "Id",
              value: T.bob.publicKey,
            },
          },
        },
        T.alice,
      );

      assertEquals(extrinsicEvents, ["ready", "inBlock", "finalized"]);
    });
  },
});

Deno.test({
  name: "Democracy.propose",
  fn: async (ctx) => {
    await ctx.step("extrinsic events", async () => {
      const extrinsicEvents: string[] = await collectExtrinsicEvents(
        {
          config: T.westend,
          palletName: "Democracy",
          methodName: "propose",
          args: {
            proposal_hash: U.hex.decode(
              "0x123450000000000000000000000000000000000000000000000000000000000",
            ),
            value: 2000000000000n,
          },
        },
        T.alice,
      );

      assertEquals(extrinsicEvents, ["ready", "inBlock", "finalized"]);
    });
  },
});

async function collectExtrinsicEvents(
  { config, palletName, methodName, args }: Pick<
    C.SendAndWatchExtrinsicProps,
    "config" | "palletName" | "methodName" | "args"
  >,
  sender: KeyringPair,
): Promise<string[]> {
  const extrinsicEvents: string[] = [];

  const root = C.sendAndWatchExtrinsic({
    config,
    sender: {
      type: "Id",
      value: sender.publicKey,
    },
    palletName,
    methodName,
    args,
    sign(message) {
      return {
        type: "Sr25519",
        value: sender.sign(message),
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

  await root.run();

  return extrinsicEvents;
}
