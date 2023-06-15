/**
 * @title Paginate
 * @description Read pages (either of keys or entries) from storage maps.
 */

import { $accountInfo, polkadotDev } from "@capi/polkadot-dev"
import { $, Scope } from "capi"

const scope = new Scope()

// Reference the first 10 keys of a polkadot dev chain's system account map.
const accountKeys = await polkadotDev.System.Account.keys({ limit: 10 }).run(scope)

/// Each key should be of type `Uint8Array`.
console.log("Account keys:", accountKeys)
$.assert($.sizedArray($.uint8Array, 10), accountKeys)

/// Reference the first 10 key-value pairs of a polkadot dev chain's system account map.
const accountEntries = await polkadotDev.System.Account.entries({ limit: 10 }).run(scope)

/// Each entry should be of type `[Uint8Array, AccountInfo]`
console.log("Account entries:", accountEntries)
$.assert(
  $.sizedArray($.tuple($.uint8Array, $accountInfo), 10),
  accountEntries,
)
