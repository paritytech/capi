import * as A from "../deps/std/testing/asserts.ts"
import * as T from "../test_util/mod.ts"
import * as U from "../util/mod.ts"
import { Sr25519 } from "../util/mod.ts"
import { entryRead } from "./entryRead.ts"
import { extrinsic } from "./extrinsic.ts"

const EXISTENTIAL_DEPOSIT_AMOUNT = 10_000_000_000n

Deno.test({
  name: "Balances.transfer",
  fn: async (ctx) => {
    const kp = Sr25519.fromSeed(crypto.getRandomValues(new Uint8Array(32)))

    await ctx.step("extrinsic events", async () => {
      await assertExtrinsicStatusOrder({
        keypair: T.alice,
        call: {
          type: "Balances",
          value: {
            type: "transfer",
            value: EXISTENTIAL_DEPOSIT_AMOUNT + 12345n,
            dest: {
              type: "Id",
              value: kp.publicKey,
            },
          },
        },
        orderExpectation: ["ready", "inBlock", "finalized"],
      })
    })

    await ctx.step({
      name: "account balance updated",
      fn: async () => {
        const state = await entryRead(T.westend)("System", "Account", [kp.publicKey]).run()
        A.assertObjectMatch(state, {
          value: {
            data: { free: EXISTENTIAL_DEPOSIT_AMOUNT + 12345n },
          },
        })
      },
    })
  },
})

Deno.test({
  name: "Treasury.propose_spend",
  fn: async (ctx) => {
    await ctx.step("extrinsic events", async () => {
      await assertExtrinsicStatusOrder({
        keypair: T.alice,
        call: {
          type: "Treasury",
          value: {
            type: "proposeSpend",
            value: 200n,
            beneficiary: {
              type: "Id",
              value: T.bob.publicKey,
            },
          },
        },
        orderExpectation: ["ready", "inBlock", "finalized"],
      })
    })
  },
})

Deno.test({
  // TODO update for new polkadot
  ignore: true,
  name: "Democracy.propose",
  fn: async (ctx) => {
    await ctx.step("extrinsic events", async () => {
      await assertExtrinsicStatusOrder({
        keypair: T.alice,
        call: {
          type: "Democracy",
          value: {
            type: "propose",
            proposal: {
              type: "Inline",
              value: U.hex.decode(
                "0x123450000000000000000000000000000000000000000000000000000000000",
              ),
            },
            value: 2000000000000n,
          },
        },
        orderExpectation: ["ready", "inBlock", "finalized"],
      })
    })
  },
})

interface AssertExtrinsicStatusOrderProps {
  orderExpectation: T.extrinsic.StatusOrderExpectation
  keypair: U.Sr25519
  call: unknown
}

export async function assertExtrinsicStatusOrder({
  orderExpectation,
  keypair,
  call,
}: AssertExtrinsicStatusOrderProps) {
  const extrinsicEvents = U.throwIfError(
    await T.extrinsic.collectExtrinsicEvents(
      extrinsic(T.westend)({
        sender: keypair.address,
        call,
      })
        .signed(keypair.sign),
    ).run(),
  )
  T.extrinsic.assertStatusOrder(extrinsicEvents, orderExpectation)
}
