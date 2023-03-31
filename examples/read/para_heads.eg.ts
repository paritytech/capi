/**
 * @title Derived-Read a List
 * @stability nearing
 *
 * Model a derived read, in which a list in storage (parachain ids) is
 * retrieved and its elements used to key to another piece of storage
 * (the corresponding parachain heads).
 */

import { $, ArrayRune, ValueRune } from "capi"
import { Paras } from "polkadot/mod.js"

const heads = await Paras.Parachains
  .value()
  .unhandle(undefined)
  .into(ArrayRune)
  .mapArray((id) => Paras.Heads.value(id).unhandle(undefined))
  .into(ValueRune)
  .rehandle(undefined)
  .run()

console.log("Parachain heads:", heads)

$.assert($.option($.array($.uint8Array)), heads)
