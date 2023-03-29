import { $, Rune } from "capi"
import { System } from "polkadot_dev/mod.js"
import { types, Uniques } from "statemint/mod.js"

// Reference the first 10 keys of a polkadot dev chain's system account map.
const accountKeys = System.Account.keyPage(10, null)

// Reference the first 10 key-value pairs of a statemint dev chain's uniques class map.
const collectionsEntries = Uniques.Class.entryPage(10, null)

// Evaluate both in parallel and return the results in a record.
const result = await Rune.rec({ accountKeys, collectionsEntries }).run()

// Each key should be of type `Uint8Array`.
$.is($tupleOf($.uint8Array, 10), result.accountKeys)

// Each entry should be of type `[number, types.pallet_uniques.types.CollectionDetails]`
const $collectionEntry = $.tuple($.u8, types.pallet_uniques.types.$collectionDetails)
$.is($tupleOf($collectionEntry, 10), result.collectionsEntries)

// This helper function simplifies creating codecs for page assertion.
function $tupleOf<N>(value: $.Codec<N>, length: number) {
  return $.tuple(...Array.from({ length }, () => value))
}
