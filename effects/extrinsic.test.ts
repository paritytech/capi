import type { KeyringPair } from "https://deno.land/x/polkadot@0.0.8/keyring/types.ts";
import { assertEquals, assertObjectMatch } from "../deps/std/testing/asserts.ts";
import * as C from "../mod.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";
import { run } from "./run.ts";

Deno.test({
  name: "Balances.transfer",
  fn: async (ctx) => {
    await ctx.step("extrinsic events", async () => {
      const extrinsicEvents: string[] = await collectExtrinsicEvents(
        T.westend,
        {
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
        const state = await run(C.entryRead(T.westend, "System", "Account", [T.bob.publicKey]));
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
        T.westend,
        {
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
        T.westend,
        {
          palletName: "Democracy",
          methodName: "propose",
          args: {
            proposal_hash: U.hex.decode(
              "0x123450000000000000000000000000000000000000000000000000000000000" as U.Hex,
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
  config: C.Config,
  { palletName, methodName, args }: Omit<C.ExtrinsicProps, "sender">,
  sender: KeyringPair,
): Promise<string[]> {
  const extrinsicEvents: string[] = [];
  // TODO: get rid of this `any`
  const root = new C.Extrinsic(config as any, {
    sender: {
      type: "Id",
      value: sender.publicKey,
    },
    palletName,
    methodName,
    args,
  })
    .signed((message) => ({
      type: "Sr25519",
      value: sender.sign(message),
    }))
    .watch((stop) => {
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
    });
  U.throwIfError(await run(root));
  return extrinsicEvents;
}
