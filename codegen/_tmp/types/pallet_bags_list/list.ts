import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export const $bag: $.Codec<types.pallet_bags_list.list.Bag> = codecs.$609
export interface Bag {
  head: types.sp_core.crypto.AccountId32 | undefined
  tail: types.sp_core.crypto.AccountId32 | undefined
}

export function Bag(value: types.pallet_bags_list.list.Bag) {
  return value
}

export const $listError: $.Codec<types.pallet_bags_list.list.ListError> = codecs.$612
export type ListError = "Duplicate" | "NotHeavier" | "NotInSameBag" | "NodeNotFound"

export const $node: $.Codec<types.pallet_bags_list.list.Node> = codecs.$608
export interface Node {
  id: types.sp_core.crypto.AccountId32
  prev: types.sp_core.crypto.AccountId32 | undefined
  next: types.sp_core.crypto.AccountId32 | undefined
  bagUpper: types.u64
  score: types.u64
}

export function Node(value: types.pallet_bags_list.list.Node) {
  return value
}
