/**
 * @title Retrieve chain metadata
 * @stability stable
 *
 * The chain's metadata (formally-termed "FRAME Metadata") describes all of its runtime properties,
 * including storage, constants, callables, their types and even plain-text descriptions.
 * This metadata serves as the basis off of which we generate Chain-specific APIs. Unless you are
 * building an advanced Capi-based library, chances are that you don't need to work with the metadata directly.
 */

import { chain } from "polkadot_dev/mod.js"

const result = await chain.metadata.run()

console.log(result)
