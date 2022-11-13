import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export * as pallet from "./pallet.ts"

export const $bounty: $.Codec<types.pallet_bounties.Bounty> = _codec.$591

export const $bountyStatus: $.Codec<types.pallet_bounties.BountyStatus> = _codec.$592

export interface Bounty {
  proposer: types.sp_core.crypto.AccountId32
  value: types.u128
  fee: types.u128
  curator_deposit: types.u128
  bond: types.u128
  status: types.pallet_bounties.BountyStatus
}

export function Bounty(value: types.pallet_bounties.Bounty) {
  return value
}

export type BountyStatus =
  | types.pallet_bounties.BountyStatus.Proposed
  | types.pallet_bounties.BountyStatus.Approved
  | types.pallet_bounties.BountyStatus.Funded
  | types.pallet_bounties.BountyStatus.CuratorProposed
  | types.pallet_bounties.BountyStatus.Active
  | types.pallet_bounties.BountyStatus.PendingPayout
export namespace BountyStatus {
  export interface Proposed {
    type: "Proposed"
  }
  export interface Approved {
    type: "Approved"
  }
  export interface Funded {
    type: "Funded"
  }
  export interface CuratorProposed {
    type: "CuratorProposed"
    curator: types.sp_core.crypto.AccountId32
  }
  export interface Active {
    type: "Active"
    curator: types.sp_core.crypto.AccountId32
    update_due: types.u32
  }
  export interface PendingPayout {
    type: "PendingPayout"
    curator: types.sp_core.crypto.AccountId32
    beneficiary: types.sp_core.crypto.AccountId32
    unlock_at: types.u32
  }
  export function Proposed(): types.pallet_bounties.BountyStatus.Proposed {
    return { type: "Proposed" }
  }
  export function Approved(): types.pallet_bounties.BountyStatus.Approved {
    return { type: "Approved" }
  }
  export function Funded(): types.pallet_bounties.BountyStatus.Funded {
    return { type: "Funded" }
  }
  export function CuratorProposed(
    value: Omit<types.pallet_bounties.BountyStatus.CuratorProposed, "type">,
  ): types.pallet_bounties.BountyStatus.CuratorProposed {
    return { type: "CuratorProposed", ...value }
  }
  export function Active(
    value: Omit<types.pallet_bounties.BountyStatus.Active, "type">,
  ): types.pallet_bounties.BountyStatus.Active {
    return { type: "Active", ...value }
  }
  export function PendingPayout(
    value: Omit<types.pallet_bounties.BountyStatus.PendingPayout, "type">,
  ): types.pallet_bounties.BountyStatus.PendingPayout {
    return { type: "PendingPayout", ...value }
  }
}
