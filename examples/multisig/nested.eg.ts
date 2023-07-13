/**
 * @title Nested Multisig
 * @description Create two multisigs, one of which is a signatory for the other.
 */
import { polkadotDev } from "@capi/polkadot-dev"
import { assertEquals } from "asserts"
import { createDevUsers, is, Rune, RunicArgs } from "capi"
import { MultisigRune } from "capi/patterns/multisig"
import { signature } from "capi/patterns/signature/polkadot"

/// Create five dev users. The first three serve as signatories of
/// the first multisig (`child`) and the latter serve as
/// signatories of the second multisig (`parent`).
const { alexa, billy, carol, david, ellie } = await createDevUsers()

/// Create the child multisig.
const child = MultisigRune.from(polkadotDev, {
  signatories: [alexa, billy, carol].map(({ publicKey }) => publicKey),
  threshold: 2,
})

/// Create the parent multisig with the child multisig as the third signatory.
const parent = MultisigRune.from(
  polkadotDev,
  Rune.object({
    signatories: Rune.array([
      ...[david, ellie].map(({ publicKey }) => publicKey),
      child.accountId,
    ]),
    threshold: 2,
  }),
)

/// Fund both multisigs.
await polkadotDev.Utility
  .batchAll({
    calls: Rune.array([
      child.fund(2_000_000_000_000n),
      parent.fund(2_000_000_000_000n),
    ]),
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus(`Existential Deposits`)
  .finalized()
  .run()

/// Read both multisig free balances from storage.
const [childFree, parentFree] = await Rune.tuple([
  readFree(child.accountId).dbg("Child free:"),
  readFree(parent.accountId).dbg("Parent free:"),
]).run()

/// Verify existential deposit on both multisigs.
assertEquals(childFree, 2_000_000_000_000n)
assertEquals(parentFree, 2_000_000_000_000n)

function readFree<X>(...[publicKey]: RunicArgs<X, [Uint8Array]>) {
  return polkadotDev.System.Account
    .value(publicKey)
    .unhandle(is(undefined))
    .access("data", "free")
}
