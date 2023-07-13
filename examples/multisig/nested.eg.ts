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
/// the first multisig and the latter serve as signatories of the
/// second multisig.
const { alexa, billy, carol, david, ellie } = await createDevUsers()

/// Create the first multisig.
const nestedMultisig = MultisigRune.from(polkadotDev, {
  signatories: [alexa, billy, carol].map(({ publicKey }) => publicKey),
  threshold: 2,
})

/// Create second multisig with first multisig as a signatory.
const multisig = MultisigRune.from(
  polkadotDev,
  Rune.object({
    signatories: Rune.array([
      nestedMultisig.accountId,
      ...[david, ellie].map(({ publicKey }) => publicKey),
    ]),
    threshold: 2,
  }),
)

/// Fund both multisigs.
await polkadotDev.Utility
  .batchAll({
    calls: Rune.array([
      nestedMultisig.fund(2_000_000_000_000n),
      multisig.fund(2_000_000_000_000n),
    ]),
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus(`Existential Deposits`)
  .finalized()
  .run()

/// Read both multisig free balances from storage.
const [nestedMultisigFree, multisigFree] = await Rune.tuple([
  readFree(nestedMultisig.accountId).dbg("Nested Multisig free:"),
  readFree(multisig.accountId).dbg("Multisig free:"),
]).run()

/// Verify existential deposit on both multisigs.
assertEquals(nestedMultisigFree, 2_000_000_000_000n)
assertEquals(multisigFree, 2_000_000_000_000n)

function readFree<X>(...[publicKey]: RunicArgs<X, [Uint8Array]>) {
  return polkadotDev.System.Account
    .value(publicKey)
    .unhandle(is(undefined))
    .access("data", "free")
}
