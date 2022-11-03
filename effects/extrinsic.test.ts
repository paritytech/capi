import type { KeyringPair } from "https://deno.land/x/polkadot@0.0.8/keyring/types.ts";
import * as A from "../deps/std/testing/asserts.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";
import { entryRead } from "./entryRead.ts";
import { CallData, Extrinsic } from "./extrinsic.ts";
import { run } from "./run.ts";

const client = await T.westend.client;

Deno.test({
  name: "Balances.transfer",
  fn: async (ctx) => {
    await ctx.step("extrinsic events", async () => {
      const events = U.throwIfError(
        await run(
          T.collectExtrinsicEvents(testExtrinsic({
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
          })),
        ),
      );
      T.assertTransactionStatusOrder(events, ["ready", "inBlock", "finalized"]);
    });

    await ctx.step({
      name: "account balance updated",
      fn: async () => {
        const state = await run(entryRead(client)("System", "Account", [T.bob.publicKey]));
        A.assertObjectMatch(state, { value: { data: { free: 10000000000012345n } } });
      },
    });
  },
});

Deno.test({
  name: "Treasury.propose_spend",
  fn: async (ctx) => {
    await ctx.step("extrinsic events", async () => {
      const events = U.throwIfError(
        await run(
          T.collectExtrinsicEvents(testExtrinsic({
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
          })),
        ),
      );
      T.assertTransactionStatusOrder(events, ["ready", "inBlock", "finalized"]);
    });
  },
});

Deno.test({
  name: "Democracy.propose",
  fn: async (ctx) => {
    await ctx.step("extrinsic events", async () => {
      const extrinsicEvents = U.throwIfError(
        await run(
          T.collectExtrinsicEvents(testExtrinsic({
            sender: T.alice,
            palletName: "Democracy",
            methodName: "propose",
            args: {
              proposal_hash: U.hex.decode(
                "0x123450000000000000000000000000000000000000000000000000000000000" as U.Hex,
              ),
              value: 2000000000000n,
            },
          })),
        ),
      );
      T.assertTransactionStatusOrder(extrinsicEvents, ["ready", "inBlock", "finalized"]);
    });
  },
});

interface TestExtrinsicProps extends CallData {
  sender: KeyringPair;
}
function testExtrinsic({ sender, palletName, methodName, args }: TestExtrinsicProps) {
  return new Extrinsic({
    client,
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
    }));
}
