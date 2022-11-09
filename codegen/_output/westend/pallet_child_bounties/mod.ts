import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export * as pallet from "./pallet.ts"

export const $childBounty: $.Codec<t.pallet_child_bounties.ChildBounty> = _codec.$595

export const $childBountyStatus: $.Codec<t.pallet_child_bounties.ChildBountyStatus> = _codec.$596

export interface ChildBounty {
  parent_bounty: t.u32
  value: t.u128
  fee: t.u128
  curator_deposit: t.u128
  status: t.pallet_child_bounties.ChildBountyStatus
}

export function ChildBounty(value: t.pallet_child_bounties.ChildBounty) {
  return value
}

export type ChildBountyStatus =
  | t.pallet_child_bounties.ChildBountyStatus.Added
  | t.pallet_child_bounties.ChildBountyStatus.CuratorProposed
  | t.pallet_child_bounties.ChildBountyStatus.Active
  | t.pallet_child_bounties.ChildBountyStatus.PendingPayout
export namespace ChildBountyStatus {
  export interface Added {
    type: "Added"
  }
  export interface CuratorProposed {
    type: "CuratorProposed"
    curator: t.sp_core.crypto.AccountId32
  }
  export interface Active {
    type: "Active"
    curator: t.sp_core.crypto.AccountId32
  }
  export interface PendingPayout {
    type: "PendingPayout"
    curator: t.sp_core.crypto.AccountId32
    beneficiary: t.sp_core.crypto.AccountId32
    unlock_at: t.u32
  }
  export function Added(): t.pallet_child_bounties.ChildBountyStatus.Added {
    return { type: "Added" }
  }
  export function CuratorProposed(
    value: Omit<t.pallet_child_bounties.ChildBountyStatus.CuratorProposed, "type">,
  ): t.pallet_child_bounties.ChildBountyStatus.CuratorProposed {
    return { type: "CuratorProposed", ...value }
  }
  export function Active(
    value: Omit<t.pallet_child_bounties.ChildBountyStatus.Active, "type">,
  ): t.pallet_child_bounties.ChildBountyStatus.Active {
    return { type: "Active", ...value }
  }
  export function PendingPayout(
    value: Omit<t.pallet_child_bounties.ChildBountyStatus.PendingPayout, "type">,
  ): t.pallet_child_bounties.ChildBountyStatus.PendingPayout {
    return { type: "PendingPayout", ...value }
  }
}
