import { $, BitSequence, ChainError, Era } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export * as pallet from "./pallet.ts"

export const $bounty: $.Codec<t.pallet_bounties.Bounty> = _codec.$591

export const $bountyStatus: $.Codec<t.pallet_bounties.BountyStatus> = _codec.$592

export interface Bounty {
  proposer: t.sp_core.crypto.AccountId32
  value: t.u128
  fee: t.u128
  curator_deposit: t.u128
  bond: t.u128
  status: t.pallet_bounties.BountyStatus
}

export function Bounty(value: t.pallet_bounties.Bounty) {
  return value
}

export type BountyStatus =
  | t.pallet_bounties.BountyStatus.Proposed
  | t.pallet_bounties.BountyStatus.Approved
  | t.pallet_bounties.BountyStatus.Funded
  | t.pallet_bounties.BountyStatus.CuratorProposed
  | t.pallet_bounties.BountyStatus.Active
  | t.pallet_bounties.BountyStatus.PendingPayout
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
    curator: t.sp_core.crypto.AccountId32
  }
  export interface Active {
    type: "Active"
    curator: t.sp_core.crypto.AccountId32
    update_due: t.u32
  }
  export interface PendingPayout {
    type: "PendingPayout"
    curator: t.sp_core.crypto.AccountId32
    beneficiary: t.sp_core.crypto.AccountId32
    unlock_at: t.u32
  }
  export function Proposed(): t.pallet_bounties.BountyStatus.Proposed {
    return { type: "Proposed" }
  }
  export function Approved(): t.pallet_bounties.BountyStatus.Approved {
    return { type: "Approved" }
  }
  export function Funded(): t.pallet_bounties.BountyStatus.Funded {
    return { type: "Funded" }
  }
  export function CuratorProposed(
    value: Omit<t.pallet_bounties.BountyStatus.CuratorProposed, "type">,
  ): t.pallet_bounties.BountyStatus.CuratorProposed {
    return { type: "CuratorProposed", ...value }
  }
  export function Active(
    value: Omit<t.pallet_bounties.BountyStatus.Active, "type">,
  ): t.pallet_bounties.BountyStatus.Active {
    return { type: "Active", ...value }
  }
  export function PendingPayout(
    value: Omit<t.pallet_bounties.BountyStatus.PendingPayout, "type">,
  ): t.pallet_bounties.BountyStatus.PendingPayout {
    return { type: "PendingPayout", ...value }
  }
}
