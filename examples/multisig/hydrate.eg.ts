/**
 * @title Multisig Serialization and Hydration
 * @description Create a multisig and encode its state into a hex string. Then
 * use this hex string to hydrate a new MultisigRune. This is useful if you
 * want to share the multisig setup info with the other signatories or a database.
 */

import { polkadotDev } from "@capi/polkadot-dev"
import { assertEquals } from "asserts"
import { createDevUsers } from "capi"
import { MultisigRune } from "capi/patterns/multisig"

/// Create three dev users. These users will serve as signatories of the multisig.
const { alexa, billy, carol } = await createDevUsers()

/// Create the multisig.
const multisig = MultisigRune.from(polkadotDev, {
  signatories: [alexa, billy, carol].map(({ publicKey }) => publicKey),
  threshold: 2,
})

/// Serialize the multisig's state into a hex for later use.
const hex = await multisig.hex.run()

/// Save `hex` however you'd like (i.e. writing to disk, etc.).
save(hex)

/// Hydrate a multisig with the hex from before.
const hydratedMultisig = MultisigRune.fromHex(polkadotDev, hex)

/// Ensure the initially-constructed multisig state is identical to that of
/// the hydrated multisig.
assertEquals(await multisig.run(), await hydratedMultisig.run())

// hide-start
// The following noop is solely for explanation. Swap this out with your
// own hex-representation-consuming code.
function save(_hex: string) {}
// hide-end
