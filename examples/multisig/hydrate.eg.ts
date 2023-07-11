/**
 * @title Serialization and Hydration
 * @description Creates a multisig, serializes it, and then hydrates it.
 */

import { polkadotDev } from "@capi/polkadot-dev"
import { assertArrayIncludes, assertEquals } from "asserts"
import { createDevUsers, ValueRune } from "capi"
import { MultisigRune } from "capi/patterns/multisig"

const { alexa, billy, carol } = await createDevUsers()

/// Create the multisig. Extract the hex.
const hex = await MultisigRune.from(polkadotDev, {
  signatories: [alexa, billy, carol].map(({ publicKey }) => publicKey),
  threshold: 2,
}).hex.run()

/// Save `hex` however you'd like (i.e. writing to disk, etc.).
save(hex)

// Hydrate the multisig
const multisig = MultisigRune.fromHex(polkadotDev, hex)

const { signatories, threshold } = await multisig.into(ValueRune).run()

// Test hydration
assertEquals(signatories.length, 3)
assertArrayIncludes(signatories, [alexa.publicKey, billy.publicKey, carol.publicKey])
assertEquals(threshold, 2)

// hide-start
// The following noop is solely for explanation. Swap this out with your
// own signed-hex-representation-consuming code.
function save(_hex: string) {}
// hide-end
