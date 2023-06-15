/**
 * @title Derived-Read a List
 * @stability nearing
 * @description Model a derived read, in which a list in storage (parachain ids)
 * is retrieved and its elements used to key to another piece of storage
 * (the corresponding parachain heads).
 */

import { polkadot } from "@capi/polkadot"
import { $, ArrayRune, is, Scope, ValueRune } from "capi"

/// Retrieve the head for each id in the parachains storage.
const heads = await polkadot.Paras.Parachains
  .value()
  .unhandle(is(undefined))
  .into(ArrayRune)
  .mapArray((id) => polkadot.Paras.Heads.value(id).unhandle(is(undefined)))
  .into(ValueRune)
  .rehandle(is(undefined))
  .run(new Scope())

/// Ensure `heads` is of the expected shape.
console.log("Parachain heads:", heads)
$.assert($.option($.array($.uint8Array)), heads)
