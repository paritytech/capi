import { $ } from "./capi.ts"
import * as _codec from "./codecs.ts"
import type * as t from "./mod.ts"

export const $nposCompactSolution16: $.Codec<t.polkadot_runtime.NposCompactSolution16> = _codec.$312

export const $originCaller: $.Codec<t.polkadot_runtime.OriginCaller> = _codec.$256

export const $proxyType: $.Codec<t.polkadot_runtime.ProxyType> = _codec.$79

export const $runtime: $.Codec<t.polkadot_runtime.Runtime> = _codec.$737

export const $runtimeCall: $.Codec<t.polkadot_runtime.RuntimeCall> = _codec.$181

export const $runtimeEvent: $.Codec<t.polkadot_runtime.RuntimeEvent> = _codec.$19

export const $sessionKeys: $.Codec<t.polkadot_runtime.SessionKeys> = _codec.$212

export interface NposCompactSolution16 {
  votes1: Array<[t.Compact<t.u32>, t.Compact<t.u16>]>
  votes2: Array<
    [
      t.Compact<t.u32>,
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      t.Compact<t.u16>,
    ]
  >
  votes3: Array<
    [
      t.Compact<t.u32>,
      [
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      ],
      t.Compact<t.u16>,
    ]
  >
  votes4: Array<
    [
      t.Compact<t.u32>,
      [
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      ],
      t.Compact<t.u16>,
    ]
  >
  votes5: Array<
    [
      t.Compact<t.u32>,
      [
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      ],
      t.Compact<t.u16>,
    ]
  >
  votes6: Array<
    [
      t.Compact<t.u32>,
      [
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      ],
      t.Compact<t.u16>,
    ]
  >
  votes7: Array<
    [
      t.Compact<t.u32>,
      [
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      ],
      t.Compact<t.u16>,
    ]
  >
  votes8: Array<
    [
      t.Compact<t.u32>,
      [
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      ],
      t.Compact<t.u16>,
    ]
  >
  votes9: Array<
    [
      t.Compact<t.u32>,
      [
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      ],
      t.Compact<t.u16>,
    ]
  >
  votes10: Array<
    [
      t.Compact<t.u32>,
      [
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      ],
      t.Compact<t.u16>,
    ]
  >
  votes11: Array<
    [
      t.Compact<t.u32>,
      [
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      ],
      t.Compact<t.u16>,
    ]
  >
  votes12: Array<
    [
      t.Compact<t.u32>,
      [
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      ],
      t.Compact<t.u16>,
    ]
  >
  votes13: Array<
    [
      t.Compact<t.u32>,
      [
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      ],
      t.Compact<t.u16>,
    ]
  >
  votes14: Array<
    [
      t.Compact<t.u32>,
      [
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      ],
      t.Compact<t.u16>,
    ]
  >
  votes15: Array<
    [
      t.Compact<t.u32>,
      [
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      ],
      t.Compact<t.u16>,
    ]
  >
  votes16: Array<
    [
      t.Compact<t.u32>,
      [
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      ],
      t.Compact<t.u16>,
    ]
  >
}

export function NposCompactSolution16(value: t.polkadot_runtime.NposCompactSolution16) {
  return value
}

export type OriginCaller =
  | t.polkadot_runtime.OriginCaller.system
  | t.polkadot_runtime.OriginCaller.Council
  | t.polkadot_runtime.OriginCaller.TechnicalCommittee
  | t.polkadot_runtime.OriginCaller.ParachainsOrigin
  | t.polkadot_runtime.OriginCaller.XcmPallet
  | t.polkadot_runtime.OriginCaller.Void
export namespace OriginCaller {
  export interface system {
    type: "system"
    value: t.frame_support.dispatch.RawOrigin
  }
  export interface Council {
    type: "Council"
    value: t.pallet_collective.RawOrigin
  }
  export interface TechnicalCommittee {
    type: "TechnicalCommittee"
    value: t.pallet_collective.RawOrigin
  }
  export interface ParachainsOrigin {
    type: "ParachainsOrigin"
    value: t.polkadot_runtime_parachains.origin.pallet.Origin
  }
  export interface XcmPallet {
    type: "XcmPallet"
    value: t.pallet_xcm.pallet.Origin
  }
  export interface Void {
    type: "Void"
    value: t.sp_core.Void
  }
  export function system(
    value: t.polkadot_runtime.OriginCaller.system["value"],
  ): t.polkadot_runtime.OriginCaller.system {
    return { type: "system", value }
  }
  export function Council(
    value: t.polkadot_runtime.OriginCaller.Council["value"],
  ): t.polkadot_runtime.OriginCaller.Council {
    return { type: "Council", value }
  }
  export function TechnicalCommittee(
    value: t.polkadot_runtime.OriginCaller.TechnicalCommittee["value"],
  ): t.polkadot_runtime.OriginCaller.TechnicalCommittee {
    return { type: "TechnicalCommittee", value }
  }
  export function ParachainsOrigin(
    value: t.polkadot_runtime.OriginCaller.ParachainsOrigin["value"],
  ): t.polkadot_runtime.OriginCaller.ParachainsOrigin {
    return { type: "ParachainsOrigin", value }
  }
  export function XcmPallet(
    value: t.polkadot_runtime.OriginCaller.XcmPallet["value"],
  ): t.polkadot_runtime.OriginCaller.XcmPallet {
    return { type: "XcmPallet", value }
  }
  export function Void(
    value: t.polkadot_runtime.OriginCaller.Void["value"],
  ): t.polkadot_runtime.OriginCaller.Void {
    return { type: "Void", value }
  }
}

export type ProxyType =
  | "Any"
  | "NonTransfer"
  | "Governance"
  | "Staking"
  | "IdentityJudgement"
  | "CancelProxy"
  | "Auction"

export function Runtime() {
  return null
}

export type Runtime = null

export type RuntimeCall =
  | t.polkadot_runtime.RuntimeCall.System
  | t.polkadot_runtime.RuntimeCall.Scheduler
  | t.polkadot_runtime.RuntimeCall.Preimage
  | t.polkadot_runtime.RuntimeCall.Babe
  | t.polkadot_runtime.RuntimeCall.Timestamp
  | t.polkadot_runtime.RuntimeCall.Indices
  | t.polkadot_runtime.RuntimeCall.Balances
  | t.polkadot_runtime.RuntimeCall.Authorship
  | t.polkadot_runtime.RuntimeCall.Staking
  | t.polkadot_runtime.RuntimeCall.Session
  | t.polkadot_runtime.RuntimeCall.Grandpa
  | t.polkadot_runtime.RuntimeCall.ImOnline
  | t.polkadot_runtime.RuntimeCall.Democracy
  | t.polkadot_runtime.RuntimeCall.Council
  | t.polkadot_runtime.RuntimeCall.TechnicalCommittee
  | t.polkadot_runtime.RuntimeCall.PhragmenElection
  | t.polkadot_runtime.RuntimeCall.TechnicalMembership
  | t.polkadot_runtime.RuntimeCall.Treasury
  | t.polkadot_runtime.RuntimeCall.Claims
  | t.polkadot_runtime.RuntimeCall.Vesting
  | t.polkadot_runtime.RuntimeCall.Utility
  | t.polkadot_runtime.RuntimeCall.Identity
  | t.polkadot_runtime.RuntimeCall.Proxy
  | t.polkadot_runtime.RuntimeCall.Multisig
  | t.polkadot_runtime.RuntimeCall.Bounties
  | t.polkadot_runtime.RuntimeCall.ChildBounties
  | t.polkadot_runtime.RuntimeCall.Tips
  | t.polkadot_runtime.RuntimeCall.ElectionProviderMultiPhase
  | t.polkadot_runtime.RuntimeCall.VoterList
  | t.polkadot_runtime.RuntimeCall.NominationPools
  | t.polkadot_runtime.RuntimeCall.FastUnstake
  | t.polkadot_runtime.RuntimeCall.Configuration
  | t.polkadot_runtime.RuntimeCall.ParasShared
  | t.polkadot_runtime.RuntimeCall.ParaInclusion
  | t.polkadot_runtime.RuntimeCall.ParaInherent
  | t.polkadot_runtime.RuntimeCall.Paras
  | t.polkadot_runtime.RuntimeCall.Initializer
  | t.polkadot_runtime.RuntimeCall.Dmp
  | t.polkadot_runtime.RuntimeCall.Ump
  | t.polkadot_runtime.RuntimeCall.Hrmp
  | t.polkadot_runtime.RuntimeCall.ParasDisputes
  | t.polkadot_runtime.RuntimeCall.Registrar
  | t.polkadot_runtime.RuntimeCall.Slots
  | t.polkadot_runtime.RuntimeCall.Auctions
  | t.polkadot_runtime.RuntimeCall.Crowdloan
  | t.polkadot_runtime.RuntimeCall.XcmPallet
export namespace RuntimeCall {
  export interface System {
    type: "System"
    value: t.frame_system.pallet.Call
  }
  export interface Scheduler {
    type: "Scheduler"
    value: t.pallet_scheduler.pallet.Call
  }
  export interface Preimage {
    type: "Preimage"
    value: t.pallet_preimage.pallet.Call
  }
  export interface Babe {
    type: "Babe"
    value: t.pallet_babe.pallet.Call
  }
  export interface Timestamp {
    type: "Timestamp"
    value: t.pallet_timestamp.pallet.Call
  }
  export interface Indices {
    type: "Indices"
    value: t.pallet_indices.pallet.Call
  }
  export interface Balances {
    type: "Balances"
    value: t.pallet_balances.pallet.Call
  }
  export interface Authorship {
    type: "Authorship"
    value: t.pallet_authorship.pallet.Call
  }
  export interface Staking {
    type: "Staking"
    value: t.pallet_staking.pallet.pallet.Call
  }
  export interface Session {
    type: "Session"
    value: t.pallet_session.pallet.Call
  }
  export interface Grandpa {
    type: "Grandpa"
    value: t.pallet_grandpa.pallet.Call
  }
  export interface ImOnline {
    type: "ImOnline"
    value: t.pallet_im_online.pallet.Call
  }
  export interface Democracy {
    type: "Democracy"
    value: t.pallet_democracy.pallet.Call
  }
  export interface Council {
    type: "Council"
    value: t.pallet_collective.pallet.Call
  }
  export interface TechnicalCommittee {
    type: "TechnicalCommittee"
    value: t.pallet_collective.pallet.Call
  }
  export interface PhragmenElection {
    type: "PhragmenElection"
    value: t.pallet_elections_phragmen.pallet.Call
  }
  export interface TechnicalMembership {
    type: "TechnicalMembership"
    value: t.pallet_membership.pallet.Call
  }
  export interface Treasury {
    type: "Treasury"
    value: t.pallet_treasury.pallet.Call
  }
  export interface Claims {
    type: "Claims"
    value: t.polkadot_runtime_common.claims.pallet.Call
  }
  export interface Vesting {
    type: "Vesting"
    value: t.pallet_vesting.pallet.Call
  }
  export interface Utility {
    type: "Utility"
    value: t.pallet_utility.pallet.Call
  }
  export interface Identity {
    type: "Identity"
    value: t.pallet_identity.pallet.Call
  }
  export interface Proxy {
    type: "Proxy"
    value: t.pallet_proxy.pallet.Call
  }
  export interface Multisig {
    type: "Multisig"
    value: t.pallet_multisig.pallet.Call
  }
  export interface Bounties {
    type: "Bounties"
    value: t.pallet_bounties.pallet.Call
  }
  export interface ChildBounties {
    type: "ChildBounties"
    value: t.pallet_child_bounties.pallet.Call
  }
  export interface Tips {
    type: "Tips"
    value: t.pallet_tips.pallet.Call
  }
  export interface ElectionProviderMultiPhase {
    type: "ElectionProviderMultiPhase"
    value: t.pallet_election_provider_multi_phase.pallet.Call
  }
  export interface VoterList {
    type: "VoterList"
    value: t.pallet_bags_list.pallet.Call
  }
  export interface NominationPools {
    type: "NominationPools"
    value: t.pallet_nomination_pools.pallet.Call
  }
  export interface FastUnstake {
    type: "FastUnstake"
    value: t.pallet_fast_unstake.pallet.Call
  }
  export interface Configuration {
    type: "Configuration"
    value: t.polkadot_runtime_parachains.configuration.pallet.Call
  }
  export interface ParasShared {
    type: "ParasShared"
    value: t.polkadot_runtime_parachains.shared.pallet.Call
  }
  export interface ParaInclusion {
    type: "ParaInclusion"
    value: t.polkadot_runtime_parachains.inclusion.pallet.Call
  }
  export interface ParaInherent {
    type: "ParaInherent"
    value: t.polkadot_runtime_parachains.paras_inherent.pallet.Call
  }
  export interface Paras {
    type: "Paras"
    value: t.polkadot_runtime_parachains.paras.pallet.Call
  }
  export interface Initializer {
    type: "Initializer"
    value: t.polkadot_runtime_parachains.initializer.pallet.Call
  }
  export interface Dmp {
    type: "Dmp"
    value: t.polkadot_runtime_parachains.dmp.pallet.Call
  }
  export interface Ump {
    type: "Ump"
    value: t.polkadot_runtime_parachains.ump.pallet.Call
  }
  export interface Hrmp {
    type: "Hrmp"
    value: t.polkadot_runtime_parachains.hrmp.pallet.Call
  }
  export interface ParasDisputes {
    type: "ParasDisputes"
    value: t.polkadot_runtime_parachains.disputes.pallet.Call
  }
  export interface Registrar {
    type: "Registrar"
    value: t.polkadot_runtime_common.paras_registrar.pallet.Call
  }
  export interface Slots {
    type: "Slots"
    value: t.polkadot_runtime_common.slots.pallet.Call
  }
  export interface Auctions {
    type: "Auctions"
    value: t.polkadot_runtime_common.auctions.pallet.Call
  }
  export interface Crowdloan {
    type: "Crowdloan"
    value: t.polkadot_runtime_common.crowdloan.pallet.Call
  }
  export interface XcmPallet {
    type: "XcmPallet"
    value: t.pallet_xcm.pallet.Call
  }
  export function System(
    value: t.polkadot_runtime.RuntimeCall.System["value"],
  ): t.polkadot_runtime.RuntimeCall.System {
    return { type: "System", value }
  }
  export function Scheduler(
    value: t.polkadot_runtime.RuntimeCall.Scheduler["value"],
  ): t.polkadot_runtime.RuntimeCall.Scheduler {
    return { type: "Scheduler", value }
  }
  export function Preimage(
    value: t.polkadot_runtime.RuntimeCall.Preimage["value"],
  ): t.polkadot_runtime.RuntimeCall.Preimage {
    return { type: "Preimage", value }
  }
  export function Babe(
    value: t.polkadot_runtime.RuntimeCall.Babe["value"],
  ): t.polkadot_runtime.RuntimeCall.Babe {
    return { type: "Babe", value }
  }
  export function Timestamp(
    value: t.polkadot_runtime.RuntimeCall.Timestamp["value"],
  ): t.polkadot_runtime.RuntimeCall.Timestamp {
    return { type: "Timestamp", value }
  }
  export function Indices(
    value: t.polkadot_runtime.RuntimeCall.Indices["value"],
  ): t.polkadot_runtime.RuntimeCall.Indices {
    return { type: "Indices", value }
  }
  export function Balances(
    value: t.polkadot_runtime.RuntimeCall.Balances["value"],
  ): t.polkadot_runtime.RuntimeCall.Balances {
    return { type: "Balances", value }
  }
  export function Authorship(
    value: t.polkadot_runtime.RuntimeCall.Authorship["value"],
  ): t.polkadot_runtime.RuntimeCall.Authorship {
    return { type: "Authorship", value }
  }
  export function Staking(
    value: t.polkadot_runtime.RuntimeCall.Staking["value"],
  ): t.polkadot_runtime.RuntimeCall.Staking {
    return { type: "Staking", value }
  }
  export function Session(
    value: t.polkadot_runtime.RuntimeCall.Session["value"],
  ): t.polkadot_runtime.RuntimeCall.Session {
    return { type: "Session", value }
  }
  export function Grandpa(
    value: t.polkadot_runtime.RuntimeCall.Grandpa["value"],
  ): t.polkadot_runtime.RuntimeCall.Grandpa {
    return { type: "Grandpa", value }
  }
  export function ImOnline(
    value: t.polkadot_runtime.RuntimeCall.ImOnline["value"],
  ): t.polkadot_runtime.RuntimeCall.ImOnline {
    return { type: "ImOnline", value }
  }
  export function Democracy(
    value: t.polkadot_runtime.RuntimeCall.Democracy["value"],
  ): t.polkadot_runtime.RuntimeCall.Democracy {
    return { type: "Democracy", value }
  }
  export function Council(
    value: t.polkadot_runtime.RuntimeCall.Council["value"],
  ): t.polkadot_runtime.RuntimeCall.Council {
    return { type: "Council", value }
  }
  export function TechnicalCommittee(
    value: t.polkadot_runtime.RuntimeCall.TechnicalCommittee["value"],
  ): t.polkadot_runtime.RuntimeCall.TechnicalCommittee {
    return { type: "TechnicalCommittee", value }
  }
  export function PhragmenElection(
    value: t.polkadot_runtime.RuntimeCall.PhragmenElection["value"],
  ): t.polkadot_runtime.RuntimeCall.PhragmenElection {
    return { type: "PhragmenElection", value }
  }
  export function TechnicalMembership(
    value: t.polkadot_runtime.RuntimeCall.TechnicalMembership["value"],
  ): t.polkadot_runtime.RuntimeCall.TechnicalMembership {
    return { type: "TechnicalMembership", value }
  }
  export function Treasury(
    value: t.polkadot_runtime.RuntimeCall.Treasury["value"],
  ): t.polkadot_runtime.RuntimeCall.Treasury {
    return { type: "Treasury", value }
  }
  export function Claims(
    value: t.polkadot_runtime.RuntimeCall.Claims["value"],
  ): t.polkadot_runtime.RuntimeCall.Claims {
    return { type: "Claims", value }
  }
  export function Vesting(
    value: t.polkadot_runtime.RuntimeCall.Vesting["value"],
  ): t.polkadot_runtime.RuntimeCall.Vesting {
    return { type: "Vesting", value }
  }
  export function Utility(
    value: t.polkadot_runtime.RuntimeCall.Utility["value"],
  ): t.polkadot_runtime.RuntimeCall.Utility {
    return { type: "Utility", value }
  }
  export function Identity(
    value: t.polkadot_runtime.RuntimeCall.Identity["value"],
  ): t.polkadot_runtime.RuntimeCall.Identity {
    return { type: "Identity", value }
  }
  export function Proxy(
    value: t.polkadot_runtime.RuntimeCall.Proxy["value"],
  ): t.polkadot_runtime.RuntimeCall.Proxy {
    return { type: "Proxy", value }
  }
  export function Multisig(
    value: t.polkadot_runtime.RuntimeCall.Multisig["value"],
  ): t.polkadot_runtime.RuntimeCall.Multisig {
    return { type: "Multisig", value }
  }
  export function Bounties(
    value: t.polkadot_runtime.RuntimeCall.Bounties["value"],
  ): t.polkadot_runtime.RuntimeCall.Bounties {
    return { type: "Bounties", value }
  }
  export function ChildBounties(
    value: t.polkadot_runtime.RuntimeCall.ChildBounties["value"],
  ): t.polkadot_runtime.RuntimeCall.ChildBounties {
    return { type: "ChildBounties", value }
  }
  export function Tips(
    value: t.polkadot_runtime.RuntimeCall.Tips["value"],
  ): t.polkadot_runtime.RuntimeCall.Tips {
    return { type: "Tips", value }
  }
  export function ElectionProviderMultiPhase(
    value: t.polkadot_runtime.RuntimeCall.ElectionProviderMultiPhase["value"],
  ): t.polkadot_runtime.RuntimeCall.ElectionProviderMultiPhase {
    return { type: "ElectionProviderMultiPhase", value }
  }
  export function VoterList(
    value: t.polkadot_runtime.RuntimeCall.VoterList["value"],
  ): t.polkadot_runtime.RuntimeCall.VoterList {
    return { type: "VoterList", value }
  }
  export function NominationPools(
    value: t.polkadot_runtime.RuntimeCall.NominationPools["value"],
  ): t.polkadot_runtime.RuntimeCall.NominationPools {
    return { type: "NominationPools", value }
  }
  export function FastUnstake(
    value: t.polkadot_runtime.RuntimeCall.FastUnstake["value"],
  ): t.polkadot_runtime.RuntimeCall.FastUnstake {
    return { type: "FastUnstake", value }
  }
  export function Configuration(
    value: t.polkadot_runtime.RuntimeCall.Configuration["value"],
  ): t.polkadot_runtime.RuntimeCall.Configuration {
    return { type: "Configuration", value }
  }
  export function ParasShared(
    value: t.polkadot_runtime.RuntimeCall.ParasShared["value"],
  ): t.polkadot_runtime.RuntimeCall.ParasShared {
    return { type: "ParasShared", value }
  }
  export function ParaInclusion(
    value: t.polkadot_runtime.RuntimeCall.ParaInclusion["value"],
  ): t.polkadot_runtime.RuntimeCall.ParaInclusion {
    return { type: "ParaInclusion", value }
  }
  export function ParaInherent(
    value: t.polkadot_runtime.RuntimeCall.ParaInherent["value"],
  ): t.polkadot_runtime.RuntimeCall.ParaInherent {
    return { type: "ParaInherent", value }
  }
  export function Paras(
    value: t.polkadot_runtime.RuntimeCall.Paras["value"],
  ): t.polkadot_runtime.RuntimeCall.Paras {
    return { type: "Paras", value }
  }
  export function Initializer(
    value: t.polkadot_runtime.RuntimeCall.Initializer["value"],
  ): t.polkadot_runtime.RuntimeCall.Initializer {
    return { type: "Initializer", value }
  }
  export function Dmp(
    value: t.polkadot_runtime.RuntimeCall.Dmp["value"],
  ): t.polkadot_runtime.RuntimeCall.Dmp {
    return { type: "Dmp", value }
  }
  export function Ump(
    value: t.polkadot_runtime.RuntimeCall.Ump["value"],
  ): t.polkadot_runtime.RuntimeCall.Ump {
    return { type: "Ump", value }
  }
  export function Hrmp(
    value: t.polkadot_runtime.RuntimeCall.Hrmp["value"],
  ): t.polkadot_runtime.RuntimeCall.Hrmp {
    return { type: "Hrmp", value }
  }
  export function ParasDisputes(
    value: t.polkadot_runtime.RuntimeCall.ParasDisputes["value"],
  ): t.polkadot_runtime.RuntimeCall.ParasDisputes {
    return { type: "ParasDisputes", value }
  }
  export function Registrar(
    value: t.polkadot_runtime.RuntimeCall.Registrar["value"],
  ): t.polkadot_runtime.RuntimeCall.Registrar {
    return { type: "Registrar", value }
  }
  export function Slots(
    value: t.polkadot_runtime.RuntimeCall.Slots["value"],
  ): t.polkadot_runtime.RuntimeCall.Slots {
    return { type: "Slots", value }
  }
  export function Auctions(
    value: t.polkadot_runtime.RuntimeCall.Auctions["value"],
  ): t.polkadot_runtime.RuntimeCall.Auctions {
    return { type: "Auctions", value }
  }
  export function Crowdloan(
    value: t.polkadot_runtime.RuntimeCall.Crowdloan["value"],
  ): t.polkadot_runtime.RuntimeCall.Crowdloan {
    return { type: "Crowdloan", value }
  }
  export function XcmPallet(
    value: t.polkadot_runtime.RuntimeCall.XcmPallet["value"],
  ): t.polkadot_runtime.RuntimeCall.XcmPallet {
    return { type: "XcmPallet", value }
  }
}

export type RuntimeEvent =
  | t.polkadot_runtime.RuntimeEvent.System
  | t.polkadot_runtime.RuntimeEvent.Scheduler
  | t.polkadot_runtime.RuntimeEvent.Preimage
  | t.polkadot_runtime.RuntimeEvent.Indices
  | t.polkadot_runtime.RuntimeEvent.Balances
  | t.polkadot_runtime.RuntimeEvent.TransactionPayment
  | t.polkadot_runtime.RuntimeEvent.Staking
  | t.polkadot_runtime.RuntimeEvent.Offences
  | t.polkadot_runtime.RuntimeEvent.Session
  | t.polkadot_runtime.RuntimeEvent.Grandpa
  | t.polkadot_runtime.RuntimeEvent.ImOnline
  | t.polkadot_runtime.RuntimeEvent.Democracy
  | t.polkadot_runtime.RuntimeEvent.Council
  | t.polkadot_runtime.RuntimeEvent.TechnicalCommittee
  | t.polkadot_runtime.RuntimeEvent.PhragmenElection
  | t.polkadot_runtime.RuntimeEvent.TechnicalMembership
  | t.polkadot_runtime.RuntimeEvent.Treasury
  | t.polkadot_runtime.RuntimeEvent.Claims
  | t.polkadot_runtime.RuntimeEvent.Vesting
  | t.polkadot_runtime.RuntimeEvent.Utility
  | t.polkadot_runtime.RuntimeEvent.Identity
  | t.polkadot_runtime.RuntimeEvent.Proxy
  | t.polkadot_runtime.RuntimeEvent.Multisig
  | t.polkadot_runtime.RuntimeEvent.Bounties
  | t.polkadot_runtime.RuntimeEvent.ChildBounties
  | t.polkadot_runtime.RuntimeEvent.Tips
  | t.polkadot_runtime.RuntimeEvent.ElectionProviderMultiPhase
  | t.polkadot_runtime.RuntimeEvent.VoterList
  | t.polkadot_runtime.RuntimeEvent.NominationPools
  | t.polkadot_runtime.RuntimeEvent.FastUnstake
  | t.polkadot_runtime.RuntimeEvent.ParaInclusion
  | t.polkadot_runtime.RuntimeEvent.Paras
  | t.polkadot_runtime.RuntimeEvent.Ump
  | t.polkadot_runtime.RuntimeEvent.Hrmp
  | t.polkadot_runtime.RuntimeEvent.ParasDisputes
  | t.polkadot_runtime.RuntimeEvent.Registrar
  | t.polkadot_runtime.RuntimeEvent.Slots
  | t.polkadot_runtime.RuntimeEvent.Auctions
  | t.polkadot_runtime.RuntimeEvent.Crowdloan
  | t.polkadot_runtime.RuntimeEvent.XcmPallet
export namespace RuntimeEvent {
  export interface System {
    type: "System"
    value: t.frame_system.pallet.Event
  }
  export interface Scheduler {
    type: "Scheduler"
    value: t.pallet_scheduler.pallet.Event
  }
  export interface Preimage {
    type: "Preimage"
    value: t.pallet_preimage.pallet.Event
  }
  export interface Indices {
    type: "Indices"
    value: t.pallet_indices.pallet.Event
  }
  export interface Balances {
    type: "Balances"
    value: t.pallet_balances.pallet.Event
  }
  export interface TransactionPayment {
    type: "TransactionPayment"
    value: t.pallet_transaction_payment.pallet.Event
  }
  export interface Staking {
    type: "Staking"
    value: t.pallet_staking.pallet.pallet.Event
  }
  export interface Offences {
    type: "Offences"
    value: t.pallet_offences.pallet.Event
  }
  export interface Session {
    type: "Session"
    value: t.pallet_session.pallet.Event
  }
  export interface Grandpa {
    type: "Grandpa"
    value: t.pallet_grandpa.pallet.Event
  }
  export interface ImOnline {
    type: "ImOnline"
    value: t.pallet_im_online.pallet.Event
  }
  export interface Democracy {
    type: "Democracy"
    value: t.pallet_democracy.pallet.Event
  }
  export interface Council {
    type: "Council"
    value: t.pallet_collective.pallet.Event
  }
  export interface TechnicalCommittee {
    type: "TechnicalCommittee"
    value: t.pallet_collective.pallet.Event
  }
  export interface PhragmenElection {
    type: "PhragmenElection"
    value: t.pallet_elections_phragmen.pallet.Event
  }
  export interface TechnicalMembership {
    type: "TechnicalMembership"
    value: t.pallet_membership.pallet.Event
  }
  export interface Treasury {
    type: "Treasury"
    value: t.pallet_treasury.pallet.Event
  }
  export interface Claims {
    type: "Claims"
    value: t.polkadot_runtime_common.claims.pallet.Event
  }
  export interface Vesting {
    type: "Vesting"
    value: t.pallet_vesting.pallet.Event
  }
  export interface Utility {
    type: "Utility"
    value: t.pallet_utility.pallet.Event
  }
  export interface Identity {
    type: "Identity"
    value: t.pallet_identity.pallet.Event
  }
  export interface Proxy {
    type: "Proxy"
    value: t.pallet_proxy.pallet.Event
  }
  export interface Multisig {
    type: "Multisig"
    value: t.pallet_multisig.pallet.Event
  }
  export interface Bounties {
    type: "Bounties"
    value: t.pallet_bounties.pallet.Event
  }
  export interface ChildBounties {
    type: "ChildBounties"
    value: t.pallet_child_bounties.pallet.Event
  }
  export interface Tips {
    type: "Tips"
    value: t.pallet_tips.pallet.Event
  }
  export interface ElectionProviderMultiPhase {
    type: "ElectionProviderMultiPhase"
    value: t.pallet_election_provider_multi_phase.pallet.Event
  }
  export interface VoterList {
    type: "VoterList"
    value: t.pallet_bags_list.pallet.Event
  }
  export interface NominationPools {
    type: "NominationPools"
    value: t.pallet_nomination_pools.pallet.Event
  }
  export interface FastUnstake {
    type: "FastUnstake"
    value: t.pallet_fast_unstake.pallet.Event
  }
  export interface ParaInclusion {
    type: "ParaInclusion"
    value: t.polkadot_runtime_parachains.inclusion.pallet.Event
  }
  export interface Paras {
    type: "Paras"
    value: t.polkadot_runtime_parachains.paras.pallet.Event
  }
  export interface Ump {
    type: "Ump"
    value: t.polkadot_runtime_parachains.ump.pallet.Event
  }
  export interface Hrmp {
    type: "Hrmp"
    value: t.polkadot_runtime_parachains.hrmp.pallet.Event
  }
  export interface ParasDisputes {
    type: "ParasDisputes"
    value: t.polkadot_runtime_parachains.disputes.pallet.Event
  }
  export interface Registrar {
    type: "Registrar"
    value: t.polkadot_runtime_common.paras_registrar.pallet.Event
  }
  export interface Slots {
    type: "Slots"
    value: t.polkadot_runtime_common.slots.pallet.Event
  }
  export interface Auctions {
    type: "Auctions"
    value: t.polkadot_runtime_common.auctions.pallet.Event
  }
  export interface Crowdloan {
    type: "Crowdloan"
    value: t.polkadot_runtime_common.crowdloan.pallet.Event
  }
  export interface XcmPallet {
    type: "XcmPallet"
    value: t.pallet_xcm.pallet.Event
  }
  export function System(
    value: t.polkadot_runtime.RuntimeEvent.System["value"],
  ): t.polkadot_runtime.RuntimeEvent.System {
    return { type: "System", value }
  }
  export function Scheduler(
    value: t.polkadot_runtime.RuntimeEvent.Scheduler["value"],
  ): t.polkadot_runtime.RuntimeEvent.Scheduler {
    return { type: "Scheduler", value }
  }
  export function Preimage(
    value: t.polkadot_runtime.RuntimeEvent.Preimage["value"],
  ): t.polkadot_runtime.RuntimeEvent.Preimage {
    return { type: "Preimage", value }
  }
  export function Indices(
    value: t.polkadot_runtime.RuntimeEvent.Indices["value"],
  ): t.polkadot_runtime.RuntimeEvent.Indices {
    return { type: "Indices", value }
  }
  export function Balances(
    value: t.polkadot_runtime.RuntimeEvent.Balances["value"],
  ): t.polkadot_runtime.RuntimeEvent.Balances {
    return { type: "Balances", value }
  }
  export function TransactionPayment(
    value: t.polkadot_runtime.RuntimeEvent.TransactionPayment["value"],
  ): t.polkadot_runtime.RuntimeEvent.TransactionPayment {
    return { type: "TransactionPayment", value }
  }
  export function Staking(
    value: t.polkadot_runtime.RuntimeEvent.Staking["value"],
  ): t.polkadot_runtime.RuntimeEvent.Staking {
    return { type: "Staking", value }
  }
  export function Offences(
    value: t.polkadot_runtime.RuntimeEvent.Offences["value"],
  ): t.polkadot_runtime.RuntimeEvent.Offences {
    return { type: "Offences", value }
  }
  export function Session(
    value: t.polkadot_runtime.RuntimeEvent.Session["value"],
  ): t.polkadot_runtime.RuntimeEvent.Session {
    return { type: "Session", value }
  }
  export function Grandpa(
    value: t.polkadot_runtime.RuntimeEvent.Grandpa["value"],
  ): t.polkadot_runtime.RuntimeEvent.Grandpa {
    return { type: "Grandpa", value }
  }
  export function ImOnline(
    value: t.polkadot_runtime.RuntimeEvent.ImOnline["value"],
  ): t.polkadot_runtime.RuntimeEvent.ImOnline {
    return { type: "ImOnline", value }
  }
  export function Democracy(
    value: t.polkadot_runtime.RuntimeEvent.Democracy["value"],
  ): t.polkadot_runtime.RuntimeEvent.Democracy {
    return { type: "Democracy", value }
  }
  export function Council(
    value: t.polkadot_runtime.RuntimeEvent.Council["value"],
  ): t.polkadot_runtime.RuntimeEvent.Council {
    return { type: "Council", value }
  }
  export function TechnicalCommittee(
    value: t.polkadot_runtime.RuntimeEvent.TechnicalCommittee["value"],
  ): t.polkadot_runtime.RuntimeEvent.TechnicalCommittee {
    return { type: "TechnicalCommittee", value }
  }
  export function PhragmenElection(
    value: t.polkadot_runtime.RuntimeEvent.PhragmenElection["value"],
  ): t.polkadot_runtime.RuntimeEvent.PhragmenElection {
    return { type: "PhragmenElection", value }
  }
  export function TechnicalMembership(
    value: t.polkadot_runtime.RuntimeEvent.TechnicalMembership["value"],
  ): t.polkadot_runtime.RuntimeEvent.TechnicalMembership {
    return { type: "TechnicalMembership", value }
  }
  export function Treasury(
    value: t.polkadot_runtime.RuntimeEvent.Treasury["value"],
  ): t.polkadot_runtime.RuntimeEvent.Treasury {
    return { type: "Treasury", value }
  }
  export function Claims(
    value: t.polkadot_runtime.RuntimeEvent.Claims["value"],
  ): t.polkadot_runtime.RuntimeEvent.Claims {
    return { type: "Claims", value }
  }
  export function Vesting(
    value: t.polkadot_runtime.RuntimeEvent.Vesting["value"],
  ): t.polkadot_runtime.RuntimeEvent.Vesting {
    return { type: "Vesting", value }
  }
  export function Utility(
    value: t.polkadot_runtime.RuntimeEvent.Utility["value"],
  ): t.polkadot_runtime.RuntimeEvent.Utility {
    return { type: "Utility", value }
  }
  export function Identity(
    value: t.polkadot_runtime.RuntimeEvent.Identity["value"],
  ): t.polkadot_runtime.RuntimeEvent.Identity {
    return { type: "Identity", value }
  }
  export function Proxy(
    value: t.polkadot_runtime.RuntimeEvent.Proxy["value"],
  ): t.polkadot_runtime.RuntimeEvent.Proxy {
    return { type: "Proxy", value }
  }
  export function Multisig(
    value: t.polkadot_runtime.RuntimeEvent.Multisig["value"],
  ): t.polkadot_runtime.RuntimeEvent.Multisig {
    return { type: "Multisig", value }
  }
  export function Bounties(
    value: t.polkadot_runtime.RuntimeEvent.Bounties["value"],
  ): t.polkadot_runtime.RuntimeEvent.Bounties {
    return { type: "Bounties", value }
  }
  export function ChildBounties(
    value: t.polkadot_runtime.RuntimeEvent.ChildBounties["value"],
  ): t.polkadot_runtime.RuntimeEvent.ChildBounties {
    return { type: "ChildBounties", value }
  }
  export function Tips(
    value: t.polkadot_runtime.RuntimeEvent.Tips["value"],
  ): t.polkadot_runtime.RuntimeEvent.Tips {
    return { type: "Tips", value }
  }
  export function ElectionProviderMultiPhase(
    value: t.polkadot_runtime.RuntimeEvent.ElectionProviderMultiPhase["value"],
  ): t.polkadot_runtime.RuntimeEvent.ElectionProviderMultiPhase {
    return { type: "ElectionProviderMultiPhase", value }
  }
  export function VoterList(
    value: t.polkadot_runtime.RuntimeEvent.VoterList["value"],
  ): t.polkadot_runtime.RuntimeEvent.VoterList {
    return { type: "VoterList", value }
  }
  export function NominationPools(
    value: t.polkadot_runtime.RuntimeEvent.NominationPools["value"],
  ): t.polkadot_runtime.RuntimeEvent.NominationPools {
    return { type: "NominationPools", value }
  }
  export function FastUnstake(
    value: t.polkadot_runtime.RuntimeEvent.FastUnstake["value"],
  ): t.polkadot_runtime.RuntimeEvent.FastUnstake {
    return { type: "FastUnstake", value }
  }
  export function ParaInclusion(
    value: t.polkadot_runtime.RuntimeEvent.ParaInclusion["value"],
  ): t.polkadot_runtime.RuntimeEvent.ParaInclusion {
    return { type: "ParaInclusion", value }
  }
  export function Paras(
    value: t.polkadot_runtime.RuntimeEvent.Paras["value"],
  ): t.polkadot_runtime.RuntimeEvent.Paras {
    return { type: "Paras", value }
  }
  export function Ump(
    value: t.polkadot_runtime.RuntimeEvent.Ump["value"],
  ): t.polkadot_runtime.RuntimeEvent.Ump {
    return { type: "Ump", value }
  }
  export function Hrmp(
    value: t.polkadot_runtime.RuntimeEvent.Hrmp["value"],
  ): t.polkadot_runtime.RuntimeEvent.Hrmp {
    return { type: "Hrmp", value }
  }
  export function ParasDisputes(
    value: t.polkadot_runtime.RuntimeEvent.ParasDisputes["value"],
  ): t.polkadot_runtime.RuntimeEvent.ParasDisputes {
    return { type: "ParasDisputes", value }
  }
  export function Registrar(
    value: t.polkadot_runtime.RuntimeEvent.Registrar["value"],
  ): t.polkadot_runtime.RuntimeEvent.Registrar {
    return { type: "Registrar", value }
  }
  export function Slots(
    value: t.polkadot_runtime.RuntimeEvent.Slots["value"],
  ): t.polkadot_runtime.RuntimeEvent.Slots {
    return { type: "Slots", value }
  }
  export function Auctions(
    value: t.polkadot_runtime.RuntimeEvent.Auctions["value"],
  ): t.polkadot_runtime.RuntimeEvent.Auctions {
    return { type: "Auctions", value }
  }
  export function Crowdloan(
    value: t.polkadot_runtime.RuntimeEvent.Crowdloan["value"],
  ): t.polkadot_runtime.RuntimeEvent.Crowdloan {
    return { type: "Crowdloan", value }
  }
  export function XcmPallet(
    value: t.polkadot_runtime.RuntimeEvent.XcmPallet["value"],
  ): t.polkadot_runtime.RuntimeEvent.XcmPallet {
    return { type: "XcmPallet", value }
  }
}

export interface SessionKeys {
  grandpa: t.sp_finality_grandpa.app.Public
  babe: t.sp_consensus_babe.app.Public
  im_online: t.pallet_im_online.sr25519.app_sr25519.Public
  para_validator: t.polkadot_primitives.v2.validator_app.Public
  para_assignment: t.polkadot_primitives.v2.assignment_app.Public
  authority_discovery: t.sp_authority_discovery.app.Public
}

export function SessionKeys(value: t.polkadot_runtime.SessionKeys) {
  return value
}
