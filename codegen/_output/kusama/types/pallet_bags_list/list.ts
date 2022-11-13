import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export const $bag: $.Codec<types.pallet_bags_list.list.Bag> = _codec.$613

export const $listError: $.Codec<types.pallet_bags_list.list.ListError> = _codec.$616

export const $node: $.Codec<types.pallet_bags_list.list.Node> = _codec.$612

export interface Bag {
  head: types.sp_core.crypto.AccountId32 | undefined
  tail: types.sp_core.crypto.AccountId32 | undefined
}

export function Bag(value: types.pallet_bags_list.list.Bag) {
  return value
}

export type ListError = "Duplicate" | "NotHeavier" | "NotInSameBag" | "NodeNotFound"

export interface Node {
  id: types.sp_core.crypto.AccountId32
  prev: types.sp_core.crypto.AccountId32 | undefined
  next: types.sp_core.crypto.AccountId32 | undefined
  bag_upper: types.u64
  score: types.u64
}

export function Node(value: types.pallet_bags_list.list.Node) {
  return value
}
