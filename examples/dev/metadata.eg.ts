/**
 * @title Retrieve Chain Metadata
 * @stability unstable – We'll likely restructure the metadata such that we can use its
 * type signature within a type utility to produce constraints over calls and events.
 * Tracked in [881](https://github.com/paritytech/capi/issues/811).
 * @description The chain's metadata (formally-termed "FRAME Metadata") describes all
 * of its runtime properties, including storage, constants, callables, their types and
 * even plain-text descriptions. This metadata serves as the basis off of which we
 * generate chain-specific APIs. Unless you are building an advanced Capi-based library,
 * chances are that you don't need to work with the metadata directly.
 */

import { chain } from "@capi/polkadot-dev/mod.js"

// Execute the metadata Rune.
const metadata = await chain.metadata.run()

console.log("Metadata:", metadata)
