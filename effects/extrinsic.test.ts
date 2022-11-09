import { KeyringPair } from "../deps/polkadot/keyring/types.ts";
import * as A from "../deps/std/testing/asserts.ts";
import * as M from "../frame_metadata/mod.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";
import { entryRead } from "./entryRead.ts";
import { CallData, extrinsic } from "./extrinsic.ts";

Deno.test({
  name: "Balances.transfer",
  fn: async (ctx) => {
    await ctx.step("extrinsic events", async () => {
      await assertExtrinsicStatusOrder({
        keypair: T.alice,
        palletName: "Balances",
        methodName: "transfer",
        args: {
          value: 12345n,
          dest: M.MultiAddress.fromKeypair(T.bob),
        },
        orderExpectation: ["ready", "inBlock", "finalized"],
      });
    });

    await ctx.step({
      name: "account balance updated",
      fn: async () => {
        const state = await entryRead(T.westend)("System", "Account", [T.bob.publicKey]).run();
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
        keypair: T.alice,
        palletName: "Treasury",
        methodName: "propose_spend",
        args: {
          value: 200n,
          beneficiary: M.MultiAddress.fromKeypair(T.bob),
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
        keypair: T.alice,
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
  keypair: KeyringPair;
}

export async function assertExtrinsicStatusOrder({
  orderExpectation,
  keypair,
  ...rest
}: AssertExtrinsicStatusOrderProps) {
  const extrinsicEvents = U.throwIfError(
    await T.extrinsic.collectExtrinsicEvents(
      extrinsic({
        client: T.westend,
        sender: M.MultiAddress.fromKeypair(keypair),
        ...rest,
      })
        .signed(M.Signer.fromKeypair(keypair)),
    ).run(),
  );
  T.extrinsic.assertStatusOrder(extrinsicEvents, orderExpectation);
}
