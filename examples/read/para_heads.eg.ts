/**
 * @title Derived-Read a List
 * @stability nearing
 * @description Model a derived read, in which a list in storage (parachain ids)
 * is retrieved and its elements used to key to another piece of storage
 * (the corresponding parachain heads).
 */

import { Polkadot } from "@capi/polkadot"
import { $, ArrayRune, ValueRune } from "capi"

/// Retrieve the head for each id in the parachains storage.
const heads = await Polkadot.Paras.Parachains
  .value()
  .unhandle(undefined)
  .into(ArrayRune)
  .mapArray((id) => Polkadot.Paras.Heads.value(id).unhandle(undefined))
  .into(ValueRune)
  .rehandle(undefined)
  .run()

/// Ensure `heads` is of the expected shape.
console.log("Parachain heads:", heads)
$.assert($.option($.array($.uint8Array)), heads)
