/**
 * @title Multisig Hydration
 * @description Creates a multisig and encodes it into a hex string. This hex
 * string is then used to hydrate a new MultisigRune. This is useful if you
 * have created a multisig and want to use it a later date or you want to send
 * it other signatories.
 */

import { polkadotDev } from "@capi/polkadot-dev"
import { assertEquals } from "asserts"
import { createDevUsers } from "capi"
import { MultisigRune } from "capi/patterns/multisig"

const { alexa, billy, carol } = await createDevUsers()

const multisigParams = {
  signatories: [alexa, billy, carol].map(({ publicKey }) => publicKey),
  threshold: 2,
}
/// Create the multisig. Extract the hex.
const multisig = MultisigRune.from(polkadotDev, multisigParams)

assertEquals(await multisig.run(), multisigParams)

const hex = await multisig.hex.run()
/// Save `hex` however you'd like (i.e. writing to disk, etc.).
save(hex)

// Hydrate the multisig
const hydratedMultisig = MultisigRune.fromHex(polkadotDev, hex)

// Test hydration
assertEquals(await hydratedMultisig.run(), multisigParams)

// hide-start
// The following noop is solely for explanation. Swap this out with your
// own signed-hex-representation-consuming code.
function save(_hex: string) {}
// hide-end
