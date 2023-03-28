/**
 * @title Determine Storage Sizes of Dev Chains
 * @stability experiment
 *
 * The `storageSizes` pattern produces a record––keyed by pallet name––of storage sizes, keyed by storage name.
 * It is unlikely that we'll ever stabilize this feature, as we don't want to abuse rpc nodes.
 * That being said, this can be helpful in the context of chain development.
 */

import { assertInstanceOf } from "asserts"
import { storageSizes } from "capi/patterns/storage_sizes.ts"
import { chain } from "polkadot_dev/mod.js"

// Use the storageSizes factory to produce a Rune. Then execute it.
const sizes = await storageSizes(chain).run()

// `sizes` should be an object.
assertInstanceOf(sizes, Object)
