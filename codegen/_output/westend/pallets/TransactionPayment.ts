import { $, C, client } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as types from "../types/mod.ts"

export const NextFeeMultiplier = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "TransactionPayment",
  "NextFeeMultiplier",
  $.tuple(),
  _codec.$479,
)

export const StorageVersion = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "TransactionPayment",
  "StorageVersion",
  $.tuple(),
  _codec.$480,
)
