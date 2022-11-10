import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $bag: $.Codec<t.types.pallet_bags_list.list.Bag> = _codec.$613

export const $listError: $.Codec<t.types.pallet_bags_list.list.ListError> = _codec.$616

export const $node: $.Codec<t.types.pallet_bags_list.list.Node> = _codec.$612

export interface Bag {
  head: t.types.sp_core.crypto.AccountId32 | undefined
  tail: t.types.sp_core.crypto.AccountId32 | undefined
}

export function Bag(value: t.types.pallet_bags_list.list.Bag) {
  return value
}

export type ListError = "Duplicate" | "NotHeavier" | "NotInSameBag" | "NodeNotFound"

export interface Node {
  id: t.types.sp_core.crypto.AccountId32
  prev: t.types.sp_core.crypto.AccountId32 | undefined
  next: t.types.sp_core.crypto.AccountId32 | undefined
  bag_upper: t.types.u64
  score: t.types.u64
}

export function Node(value: t.types.pallet_bags_list.list.Node) {
  return value
}
