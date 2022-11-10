import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as pallet from "./pallet.ts"

export const $bounty: $.Codec<t.types.pallet_bounties.Bounty> = _codec.$591

export const $bountyStatus: $.Codec<t.types.pallet_bounties.BountyStatus> = _codec.$592

export interface Bounty {
  proposer: t.types.sp_core.crypto.AccountId32
  value: t.types.u128
  fee: t.types.u128
  curator_deposit: t.types.u128
  bond: t.types.u128
  status: t.types.pallet_bounties.BountyStatus
}

export function Bounty(value: t.types.pallet_bounties.Bounty) {
  return value
}

export type BountyStatus =
  | t.types.pallet_bounties.BountyStatus.Proposed
  | t.types.pallet_bounties.BountyStatus.Approved
  | t.types.pallet_bounties.BountyStatus.Funded
  | t.types.pallet_bounties.BountyStatus.CuratorProposed
  | t.types.pallet_bounties.BountyStatus.Active
  | t.types.pallet_bounties.BountyStatus.PendingPayout
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
    curator: t.types.sp_core.crypto.AccountId32
  }
  export interface Active {
    type: "Active"
    curator: t.types.sp_core.crypto.AccountId32
    update_due: t.types.u32
  }
  export interface PendingPayout {
    type: "PendingPayout"
    curator: t.types.sp_core.crypto.AccountId32
    beneficiary: t.types.sp_core.crypto.AccountId32
    unlock_at: t.types.u32
  }
  export function Proposed(): t.types.pallet_bounties.BountyStatus.Proposed {
    return { type: "Proposed" }
  }
  export function Approved(): t.types.pallet_bounties.BountyStatus.Approved {
    return { type: "Approved" }
  }
  export function Funded(): t.types.pallet_bounties.BountyStatus.Funded {
    return { type: "Funded" }
  }
  export function CuratorProposed(
    value: Omit<t.types.pallet_bounties.BountyStatus.CuratorProposed, "type">,
  ): t.types.pallet_bounties.BountyStatus.CuratorProposed {
    return { type: "CuratorProposed", ...value }
  }
  export function Active(
    value: Omit<t.types.pallet_bounties.BountyStatus.Active, "type">,
  ): t.types.pallet_bounties.BountyStatus.Active {
    return { type: "Active", ...value }
  }
  export function PendingPayout(
    value: Omit<t.types.pallet_bounties.BountyStatus.PendingPayout, "type">,
  ): t.types.pallet_bounties.BountyStatus.PendingPayout {
    return { type: "PendingPayout", ...value }
  }
}
