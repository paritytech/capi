import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as pallet from "./pallet.ts"

export const $childBounty: $.Codec<t.types.pallet_child_bounties.ChildBounty> = _codec.$595

export const $childBountyStatus: $.Codec<t.types.pallet_child_bounties.ChildBountyStatus> =
  _codec.$596

export interface ChildBounty {
  parent_bounty: t.types.u32
  value: t.types.u128
  fee: t.types.u128
  curator_deposit: t.types.u128
  status: t.types.pallet_child_bounties.ChildBountyStatus
}

export function ChildBounty(value: t.types.pallet_child_bounties.ChildBounty) {
  return value
}

export type ChildBountyStatus =
  | t.types.pallet_child_bounties.ChildBountyStatus.Added
  | t.types.pallet_child_bounties.ChildBountyStatus.CuratorProposed
  | t.types.pallet_child_bounties.ChildBountyStatus.Active
  | t.types.pallet_child_bounties.ChildBountyStatus.PendingPayout
export namespace ChildBountyStatus {
  export interface Added {
    type: "Added"
  }
  export interface CuratorProposed {
    type: "CuratorProposed"
    curator: t.types.sp_core.crypto.AccountId32
  }
  export interface Active {
    type: "Active"
    curator: t.types.sp_core.crypto.AccountId32
  }
  export interface PendingPayout {
    type: "PendingPayout"
    curator: t.types.sp_core.crypto.AccountId32
    beneficiary: t.types.sp_core.crypto.AccountId32
    unlock_at: t.types.u32
  }
  export function Added(): t.types.pallet_child_bounties.ChildBountyStatus.Added {
    return { type: "Added" }
  }
  export function CuratorProposed(
    value: Omit<t.types.pallet_child_bounties.ChildBountyStatus.CuratorProposed, "type">,
  ): t.types.pallet_child_bounties.ChildBountyStatus.CuratorProposed {
    return { type: "CuratorProposed", ...value }
  }
  export function Active(
    value: Omit<t.types.pallet_child_bounties.ChildBountyStatus.Active, "type">,
  ): t.types.pallet_child_bounties.ChildBountyStatus.Active {
    return { type: "Active", ...value }
  }
  export function PendingPayout(
    value: Omit<t.types.pallet_child_bounties.ChildBountyStatus.PendingPayout, "type">,
  ): t.types.pallet_child_bounties.ChildBountyStatus.PendingPayout {
    return { type: "PendingPayout", ...value }
  }
}
