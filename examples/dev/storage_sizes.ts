/**
 * @title Determine Storage Sizes of Dev Chains
 * @stability unstable
 *
 * The `storageSizes` pattern produces a record––keyed by pallet name––of storage sizes, keyed by storage name.
 * It is unlikely that we'll ever stabilize this feature, as we don't want to abuse rpc nodes.
 * That being said, this can be helpful in the context of chain development.
 */

import { storageSizes } from "capi/patterns/storage_sizes.ts"
import { chain } from "polkadot_dev/mod.js"

const result = await storageSizes(chain).run()

console.log(result)
