/**
 * @title Determine Storage Sizes of Dev Chains
 * @description The `storageSizes` pattern produces a record––keyed by pallet
 * name––of storage sizes, keyed by storage name. It is unlikely that we'll ever
 * stabilize this pattern, as we don't want to abuse rpc nodes. That being said,
 * this can be helpful in the context of chain development.
 */

import { polkadotDev } from "@capi/polkadot-dev"
import { $ } from "capi"
import { storageSizes } from "capi/patterns/unstable/storage_sizes"

/// Use the storageSizes factory to produce a Rune. Then execute it.
const sizes = await storageSizes(polkadotDev).run()

/// Ensure `sizes` is of the expected shape.
console.log("Sizes:", sizes)
$.assert($.record($.record($.option($.u32))), sizes)
