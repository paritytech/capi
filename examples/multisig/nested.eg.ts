/**
 * @title Nested Multisig
 * @description Create two multisigs with a parent-child relationship, where
 * the first multisig (parent) is a signatory to the second multisig (child).
 */
import { polkadotDev } from "@capi/polkadot-dev"
import { assertEquals } from "asserts"
import { createDevUsers, is, Rune } from "capi"
import { MultisigRune } from "capi/patterns/multisig"
import { signature } from "capi/patterns/signature/polkadot"

/// Create five dev users. The first three serve as signatories of
/// the first multisig (`parent`) and the latter serve as signatories of the
/// second multisig (`child`).
const { alexa, billy, carol, david, ellie } = await createDevUsers()

/// Create the parent multisig.
const parent = MultisigRune.from(polkadotDev, {
  signatories: [alexa, billy, carol].map(({ publicKey }) => publicKey),
  threshold: 2,
})

/// Create the child multisig with the parent multisig as the third signatory.
const child = MultisigRune.from(
  polkadotDev,
  Rune.object({
    signatories: Rune.array([
      ...[david, ellie].map(({ publicKey }) => publicKey),
      parent.accountId,
    ]),
    threshold: 2,
  }),
)

/// Fund both multisigs.
await polkadotDev.Utility
  .batchAll({
    calls: Rune.array([
      parent.fund(2_000_000_000_000n),
      child.fund(2_000_000_000_000n),
    ]),
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus(`Existential Deposits`)
  .finalized()
  .run()

/// Verify existential deposit on both multisigs.
const params = [
  [parent.accountId, "Parent"],
  [child.accountId, "Child"],
] as const
await Promise.all((params).map(async ([publicKey, name]) =>
  assertEquals(
    await polkadotDev.System.Account
      .value(publicKey)
      .unhandle(is(undefined))
      .access("data", "free")
      .dbg(`${name} free:`)
      .run(),
    2_000_000_000_000n,
  )
))
