/**
 * @title Determine Storage Sizes of Dev Chains
 * @stability experiment
 * @description The `storageSizes` pattern produces a record––keyed by pallet
 * name––of storage sizes, keyed by storage name. It is unlikely that we'll ever
 * stabilize this pattern, as we don't want to abuse rpc nodes. That being said,
 * this can be helpful in the context of chain development.
 */

import { PolkadotDev } from "@capi/polkadot-dev"
import { $ } from "capi"
import { storageSizes } from "capi/patterns/storage_sizes.ts"

/// Use the storageSizes factory to produce a Rune. Then execute it.
const sizes = await storageSizes(PolkadotDev).run()

/// Ensure `sizes` is of the expected shape.
console.log("Sizes:", sizes)
$.assert($.record($.record($.option($.u32))), sizes)
