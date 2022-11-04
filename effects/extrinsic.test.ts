import type { KeyringPair } from "https://deno.land/x/polkadot@0.0.8/keyring/types.ts";
import * as A from "../deps/std/testing/asserts.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";
import { entryRead } from "./entryRead.ts";
import { CallData, Extrinsic } from "./extrinsic.ts";
import { run } from "./run.ts";

Deno.test({
  name: "Balances.transfer",
  fn: async (ctx) => {
    await ctx.step("extrinsic events", async () => {
      await assertExtrinsicStatusOrder({
        sender: T.alice,
        palletName: "Balances",
        methodName: "transfer",
        args: {
          value: 12345n,
          dest: {
            type: "Id",
            value: T.bob.publicKey,
          },
        },
        orderExpectation: ["ready", "inBlock", "finalized"],
      });
    });

    await ctx.step({
      name: "account balance updated",
      fn: async () => {
        const state = await run(entryRead(T.westend)("System", "Account", [T.bob.publicKey]));
        A.assertObjectMatch(state, {
          value: {
            data: { free: 10000000000012345n },
          },
        });
      },
    });
  },
});

Deno.test({
  name: "Treasury.propose_spend",
  fn: async (ctx) => {
    await ctx.step("extrinsic events", async () => {
      await assertExtrinsicStatusOrder({
        sender: T.alice,
        palletName: "Treasury",
        methodName: "propose_spend",
        args: {
          value: 200n,
          beneficiary: {
            type: "Id",
            value: T.bob.publicKey,
          },
        },
        orderExpectation: ["ready", "inBlock", "finalized"],
      });
    });
  },
});

Deno.test({
  name: "Democracy.propose",
  fn: async (ctx) => {
    await ctx.step("extrinsic events", async () => {
      await assertExtrinsicStatusOrder({
        sender: T.alice,
        palletName: "Democracy",
        methodName: "propose",
        args: {
          proposal_hash: U.hex.decode(
            "0x123450000000000000000000000000000000000000000000000000000000000" as U.Hex,
          ),
          value: 2000000000000n,
        },
        orderExpectation: ["ready", "inBlock", "finalized"],
      });
    });
  },
});

interface AssertExtrinsicStatusOrderProps extends CallData {
  orderExpectation: T.extrinsic.StatusOrderExpectation;
  sender: KeyringPair;
}

export async function assertExtrinsicStatusOrder({
  orderExpectation,
  sender,
  ...rest
}: AssertExtrinsicStatusOrderProps) {
  const extrinsicEvents = U.throwIfError(
    await run(T.extrinsic.collectExtrinsicEvents(new Extrinsic({
      client: T.westend,
      sender: {
        type: "Id",
        value: sender.publicKey,
      },
      ...rest,
    })
      .signed((message) => ({
        type: "Sr25519",
        value: sender.sign(message),
      })))),
  );
  T.extrinsic.assertStatusOrder(extrinsicEvents, orderExpectation);
}
