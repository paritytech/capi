import { client } from "westend_dev/mod.ts"
import * as A from "../deps/std/testing/asserts.ts"
import * as Z from "../deps/zones.ts"
import { ExtrinsicProps, SignedExtrinsic } from "../effects/extrinsic.ts"
import { Signer } from "../primitives/mod.ts"
import * as rpc from "../rpc/mod.ts"
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
        keypair: U.alice,
        call: {
          type: "Balances",
          value: {
            type: "transfer",
            value: EXISTENTIAL_DEPOSIT_AMOUNT + 12345n,
            dest: {
              type: "Id",
              value: U.bob.publicKey,
            },
          },
        },
        orderExpectation: ["ready", "inBlock", "finalized"],
      })
    })

    await ctx.step({
      name: "account balance updated",
      fn: async () => {
        const state = await entryRead(client)("System", "Account", [kp.publicKey]).run()
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
        keypair: U.alice,
        call: {
          type: "Treasury",
          value: {
            type: "proposeSpend",
            value: 200n,
            beneficiary: {
              type: "Id",
              value: U.bob.publicKey,
            },
          },
        },
        orderExpectation: ["ready", "inBlock", "finalized"],
      })
    })
  },
})

Deno.test({
  name: "Democracy.propose",
  fn: async (ctx) => {
    await ctx.step("extrinsic events", async () => {
      await assertExtrinsicStatusOrder({
        keypair: U.alice,
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
  orderExpectation: StatusOrderExpectation
  keypair: U.Sr25519
  call: unknown
}

export async function assertExtrinsicStatusOrder({
  orderExpectation,
  keypair,
  call,
}: AssertExtrinsicStatusOrderProps) {
  const extrinsicEvents = U.throwIfError(
    await collectExtrinsicEvents(
      extrinsic(client)({
        sender: keypair.address,
        call,
      })
        .signed(keypair.sign),
    ).run(),
  )
  assertStatusOrder(extrinsicEvents, orderExpectation)
}

const k0_ = Symbol()

// TODO: use context / properly scope context / make it accessible outside of subscription lifecycle
// TODO: better zones-level way to share context between effects
function collectExtrinsicEvents<
  Client extends Z.$<rpc.Client>,
  Props extends Z.Rec$<ExtrinsicProps>,
  Sign extends Z.$<Signer>,
>(extrinsic: SignedExtrinsic<Client, Props, Sign>) {
  const events: rpc.known.TransactionStatus[] = []
  return extrinsic
    .watch((ctx) => (status) => {
      events.push(status)
      if (typeof status !== "string" && status.finalized) {
        return ctx.end()
      }
      return
    })
    .next(() => events, k0_)
}

// TODO: is this a common-enough test to merit existence in `test_util`?
// TODO: means of specifying some variability?
function assertStatusOrder(
  statuses: rpc.known.TransactionStatus[],
  statusOrderExpectation: StatusOrderExpectation,
) {
  A.assertEquals(statuses.length, statusOrderExpectation.length)
  for (let i = 0; i < statusOrderExpectation.length; i++) {
    const expected = statusOrderExpectation[i]!
    const actualStatus = statuses[i]!
    if (typeof actualStatus === "string") {
      A.assertEquals(actualStatus, expected)
    } else if (actualStatus.broadcast) {
      A.assert(actualStatus[expected])
    }
  }
}
// TODO: Is it worth narrowing this with some valid assumptions?
//       For instance, we'll never get a `finalized` before `inBlock`.
//       Should we make this a more case-specific tuple with spreads & whatnot?
type StatusOrderExpectation = (
  | "future"
  | "ready"
  | "broadcast"
  | "inBlock"
  | "retracted"
  | "finalityTimeout"
  | "finalized"
  | "usurped"
  | "dropped"
  | "invalid"
)[]
