/**
 * @title Retrieve Chain Metadata
 * @description The chain's metadata (formally-termed "FRAME Metadata") describes all
 * of its runtime properties, including storage, constants, callables, their types and
 * even plain-text descriptions. This metadata serves as the basis off of which we
 * generate chain-specific APIs. Unless you are building an advanced Capi-based library,
 * chances are that you don't need to work with the metadata directly.
 * @test_skip
 */

import { polkadotDev } from "@capi/polkadot-dev"
import { Scope } from "capi"

/// Execute the metadata Rune.
const metadata = await polkadotDev.metadata.run(new Scope())

console.log("Metadata:", metadata)
