import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

export const NextFeeMultiplier = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "TransactionPayment",
  "NextFeeMultiplier",
  $.tuple(),
  codecs.$479,
)

export const StorageVersion = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "TransactionPayment",
  "StorageVersion",
  $.tuple(),
  codecs.$480,
)
