/**
 * @title Nested Multisig
 * @description Create a multisig account and use it as a signatory for another
 * multisig.
 */
import { polkadotDev } from "@capi/polkadot-dev"
import { assertEquals } from "asserts"
import { createDevUsers, is, Rune } from "capi"
import { MultisigRune } from "capi/patterns/multisig"
import { signature } from "capi/patterns/signature/polkadot"

const { alexa, billy, carol, david, ellie } = await createDevUsers()

// Create first multisig.
const multisigA = MultisigRune
  .from(polkadotDev, {
    signatories: [alexa, billy, carol].map(({ publicKey }) => publicKey),
    threshold: 2,
  })

// Create second multisig with first multisig as a signatory
const multisigB = MultisigRune
  .from(
    polkadotDev,
    Rune.object({
      signatories: Rune.array([
        ...[david, ellie].map(({ publicKey }) => publicKey),
        multisigA.accountId,
      ]),
      threshold: 2,
    }),
  )

// Fund both multisigs
await polkadotDev.Utility
  .batchAll({
    calls: Rune.array([
      multisigA.fund(2_000_000_000_000n),
      multisigB.fund(2_000_000_000_000n),
    ]),
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus(`Existential Deposits`)
  .finalized()
  .run()

const multisigAFree = await polkadotDev.System.Account
  .value(multisigA.accountId)
  .unhandle(is(undefined))
  .access("data", "free")
  .run()
console.log("Multisig A free:", multisigAFree)

const multisigBFree = await polkadotDev.System.Account
  .value(multisigB.accountId)
  .unhandle(is(undefined))
  .access("data", "free")
  .run()
console.log("Multisig B free:", multisigBFree)

assertEquals(multisigAFree, 2_000_000_000_000n)
assertEquals(multisigBFree, 2_000_000_000_000n)
