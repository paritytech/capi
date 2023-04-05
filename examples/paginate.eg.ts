/**
 * @title Paginate
 * @stability unstable
 *
 * Read pages (either of keys or entries) from storage maps.
 */

import { $ } from "capi"
import { System } from "polkadot_dev/mod.js"
import { types, Uniques } from "statemint/mod.js"

// Reference the first 10 keys of a polkadot dev chain's system account map.
const accountKeys = await System.Account.keyPage(10, null).run()

// Each key should be of type `Uint8Array`.
console.log("Account keys:", accountKeys)
$.assert($.sizedArray($.uint8Array, 10), accountKeys)

// Reference the first 10 key-value pairs of a statemint dev chain's uniques class map.
const collectionsEntries = await Uniques.Class.entryPage(10, null).run()

// Each entry should be of type `[number, types.pallet_uniques.types.CollectionDetails]`
console.log("Collections entries:", collectionsEntries)
$.assert(
  $.sizedArray($.tuple($.u32, types.pallet_uniques.types.$collectionDetails), 10),
  collectionsEntries,
)
