import { $, C } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as pallet from "./pallet.ts"

export interface ChildBounty {
  parent_bounty: types.u32
  value: types.u128
  fee: types.u128
  curator_deposit: types.u128
  status: types.pallet_child_bounties.ChildBountyStatus
}

export function ChildBounty(value: types.pallet_child_bounties.ChildBounty) {
  return value
}

export type ChildBountyStatus =
  | types.pallet_child_bounties.ChildBountyStatus.Added
  | types.pallet_child_bounties.ChildBountyStatus.CuratorProposed
  | types.pallet_child_bounties.ChildBountyStatus.Active
  | types.pallet_child_bounties.ChildBountyStatus.PendingPayout
export namespace ChildBountyStatus {
  export interface Added {
    type: "Added"
  }
  export interface CuratorProposed {
    type: "CuratorProposed"
    curator: types.sp_core.crypto.AccountId32
  }
  export interface Active {
    type: "Active"
    curator: types.sp_core.crypto.AccountId32
  }
  export interface PendingPayout {
    type: "PendingPayout"
    curator: types.sp_core.crypto.AccountId32
    beneficiary: types.sp_core.crypto.AccountId32
    unlock_at: types.u32
  }
  export function Added(): types.pallet_child_bounties.ChildBountyStatus.Added {
    return { type: "Added" }
  }
  export function CuratorProposed(
    value: Omit<types.pallet_child_bounties.ChildBountyStatus.CuratorProposed, "type">,
  ): types.pallet_child_bounties.ChildBountyStatus.CuratorProposed {
    return { type: "CuratorProposed", ...value }
  }
  export function Active(
    value: Omit<types.pallet_child_bounties.ChildBountyStatus.Active, "type">,
  ): types.pallet_child_bounties.ChildBountyStatus.Active {
    return { type: "Active", ...value }
  }
  export function PendingPayout(
    value: Omit<types.pallet_child_bounties.ChildBountyStatus.PendingPayout, "type">,
  ): types.pallet_child_bounties.ChildBountyStatus.PendingPayout {
    return { type: "PendingPayout", ...value }
  }
}
