/**
 * @title Paginate
 * @stability unstable
 *
 * Read pages (either of keys or entries) from storage maps.
 */

import { System, types } from "@capi/polkadot-dev/mod.js"
import { $ } from "capi"

// Reference the first 10 keys of a polkadot dev chain's system account map.
const accountKeys = await System.Account.keyPage(10, null).run()

// Each key should be of type `Uint8Array`.
console.log("Account keys:", accountKeys)
$.assert($.sizedArray($.uint8Array, 10), accountKeys)

// Reference the first 10 key-value pairs of a polkadot dev chain's system account map.
const accountEntries = await System.Account.entryPage(10, null).run()

// Each entry should be of type `[Uint8Array, AccountInfo]`
console.log("Account entries:", accountEntries)
$.assert(
  $.sizedArray($.tuple($.uint8Array, types.frame_system.$accountInfo), 10),
  accountEntries,
)
