import { $, C } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "./mod.ts"

export interface NposCompactSolution16 {
  votes1: Array<[types.Compact<types.u32>, types.Compact<types.u16>]>
  votes2: Array<
    [
      types.Compact<types.u32>,
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      types.Compact<types.u16>,
    ]
  >
  votes3: Array<
    [
      types.Compact<types.u32>,
      [
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      ],
      types.Compact<types.u16>,
    ]
  >
  votes4: Array<
    [
      types.Compact<types.u32>,
      [
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      ],
      types.Compact<types.u16>,
    ]
  >
  votes5: Array<
    [
      types.Compact<types.u32>,
      [
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      ],
      types.Compact<types.u16>,
    ]
  >
  votes6: Array<
    [
      types.Compact<types.u32>,
      [
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      ],
      types.Compact<types.u16>,
    ]
  >
  votes7: Array<
    [
      types.Compact<types.u32>,
      [
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      ],
      types.Compact<types.u16>,
    ]
  >
  votes8: Array<
    [
      types.Compact<types.u32>,
      [
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      ],
      types.Compact<types.u16>,
    ]
  >
  votes9: Array<
    [
      types.Compact<types.u32>,
      [
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      ],
      types.Compact<types.u16>,
    ]
  >
  votes10: Array<
    [
      types.Compact<types.u32>,
      [
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      ],
      types.Compact<types.u16>,
    ]
  >
  votes11: Array<
    [
      types.Compact<types.u32>,
      [
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      ],
      types.Compact<types.u16>,
    ]
  >
  votes12: Array<
    [
      types.Compact<types.u32>,
      [
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      ],
      types.Compact<types.u16>,
    ]
  >
  votes13: Array<
    [
      types.Compact<types.u32>,
      [
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      ],
      types.Compact<types.u16>,
    ]
  >
  votes14: Array<
    [
      types.Compact<types.u32>,
      [
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      ],
      types.Compact<types.u16>,
    ]
  >
  votes15: Array<
    [
      types.Compact<types.u32>,
      [
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      ],
      types.Compact<types.u16>,
    ]
  >
  votes16: Array<
    [
      types.Compact<types.u32>,
      [
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      ],
      types.Compact<types.u16>,
    ]
  >
}

export function NposCompactSolution16(value: types.polkadot_runtime.NposCompactSolution16) {
  return value
}

export type OriginCaller =
  | types.polkadot_runtime.OriginCaller.system
  | types.polkadot_runtime.OriginCaller.Council
  | types.polkadot_runtime.OriginCaller.TechnicalCommittee
  | types.polkadot_runtime.OriginCaller.ParachainsOrigin
  | types.polkadot_runtime.OriginCaller.XcmPallet
  | types.polkadot_runtime.OriginCaller.Void
export namespace OriginCaller {
  export interface system {
    type: "system"
    value: types.frame_support.dispatch.RawOrigin
  }
  export interface Council {
    type: "Council"
    value: types.pallet_collective.RawOrigin
  }
  export interface TechnicalCommittee {
    type: "TechnicalCommittee"
    value: types.pallet_collective.RawOrigin
  }
  export interface ParachainsOrigin {
    type: "ParachainsOrigin"
    value: types.polkadot_runtime_parachains.origin.pallet.Origin
  }
  export interface XcmPallet {
    type: "XcmPallet"
    value: types.pallet_xcm.pallet.Origin
  }
  export interface Void {
    type: "Void"
    value: types.sp_core.Void
  }
  export function system(
    value: types.polkadot_runtime.OriginCaller.system["value"],
  ): types.polkadot_runtime.OriginCaller.system {
    return { type: "system", value }
  }
  export function Council(
    value: types.polkadot_runtime.OriginCaller.Council["value"],
  ): types.polkadot_runtime.OriginCaller.Council {
    return { type: "Council", value }
  }
  export function TechnicalCommittee(
    value: types.polkadot_runtime.OriginCaller.TechnicalCommittee["value"],
  ): types.polkadot_runtime.OriginCaller.TechnicalCommittee {
    return { type: "TechnicalCommittee", value }
  }
  export function ParachainsOrigin(
    value: types.polkadot_runtime.OriginCaller.ParachainsOrigin["value"],
  ): types.polkadot_runtime.OriginCaller.ParachainsOrigin {
    return { type: "ParachainsOrigin", value }
  }
  export function XcmPallet(
    value: types.polkadot_runtime.OriginCaller.XcmPallet["value"],
  ): types.polkadot_runtime.OriginCaller.XcmPallet {
    return { type: "XcmPallet", value }
  }
  export function Void(
    value: types.polkadot_runtime.OriginCaller.Void["value"],
  ): types.polkadot_runtime.OriginCaller.Void {
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

export type Runtime = null

export function Runtime() {
  return null
}

export type RuntimeCall =
  | types.polkadot_runtime.RuntimeCall.System
  | types.polkadot_runtime.RuntimeCall.Scheduler
  | types.polkadot_runtime.RuntimeCall.Preimage
  | types.polkadot_runtime.RuntimeCall.Babe
  | types.polkadot_runtime.RuntimeCall.Timestamp
  | types.polkadot_runtime.RuntimeCall.Indices
  | types.polkadot_runtime.RuntimeCall.Balances
  | types.polkadot_runtime.RuntimeCall.Authorship
  | types.polkadot_runtime.RuntimeCall.Staking
  | types.polkadot_runtime.RuntimeCall.Session
  | types.polkadot_runtime.RuntimeCall.Grandpa
  | types.polkadot_runtime.RuntimeCall.ImOnline
  | types.polkadot_runtime.RuntimeCall.Democracy
  | types.polkadot_runtime.RuntimeCall.Council
  | types.polkadot_runtime.RuntimeCall.TechnicalCommittee
  | types.polkadot_runtime.RuntimeCall.PhragmenElection
  | types.polkadot_runtime.RuntimeCall.TechnicalMembership
  | types.polkadot_runtime.RuntimeCall.Treasury
  | types.polkadot_runtime.RuntimeCall.Claims
  | types.polkadot_runtime.RuntimeCall.Vesting
  | types.polkadot_runtime.RuntimeCall.Utility
  | types.polkadot_runtime.RuntimeCall.Identity
  | types.polkadot_runtime.RuntimeCall.Proxy
  | types.polkadot_runtime.RuntimeCall.Multisig
  | types.polkadot_runtime.RuntimeCall.Bounties
  | types.polkadot_runtime.RuntimeCall.ChildBounties
  | types.polkadot_runtime.RuntimeCall.Tips
  | types.polkadot_runtime.RuntimeCall.ElectionProviderMultiPhase
  | types.polkadot_runtime.RuntimeCall.VoterList
  | types.polkadot_runtime.RuntimeCall.NominationPools
  | types.polkadot_runtime.RuntimeCall.FastUnstake
  | types.polkadot_runtime.RuntimeCall.Configuration
  | types.polkadot_runtime.RuntimeCall.ParasShared
  | types.polkadot_runtime.RuntimeCall.ParaInclusion
  | types.polkadot_runtime.RuntimeCall.ParaInherent
  | types.polkadot_runtime.RuntimeCall.Paras
  | types.polkadot_runtime.RuntimeCall.Initializer
  | types.polkadot_runtime.RuntimeCall.Dmp
  | types.polkadot_runtime.RuntimeCall.Ump
  | types.polkadot_runtime.RuntimeCall.Hrmp
  | types.polkadot_runtime.RuntimeCall.ParasDisputes
  | types.polkadot_runtime.RuntimeCall.Registrar
  | types.polkadot_runtime.RuntimeCall.Slots
  | types.polkadot_runtime.RuntimeCall.Auctions
  | types.polkadot_runtime.RuntimeCall.Crowdloan
  | types.polkadot_runtime.RuntimeCall.XcmPallet
export namespace RuntimeCall {
  export interface System {
    type: "System"
    value: types.frame_system.pallet.Call
  }
  export interface Scheduler {
    type: "Scheduler"
    value: types.pallet_scheduler.pallet.Call
  }
  export interface Preimage {
    type: "Preimage"
    value: types.pallet_preimage.pallet.Call
  }
  export interface Babe {
    type: "Babe"
    value: types.pallet_babe.pallet.Call
  }
  export interface Timestamp {
    type: "Timestamp"
    value: types.pallet_timestamp.pallet.Call
  }
  export interface Indices {
    type: "Indices"
    value: types.pallet_indices.pallet.Call
  }
  export interface Balances {
    type: "Balances"
    value: types.pallet_balances.pallet.Call
  }
  export interface Authorship {
    type: "Authorship"
    value: types.pallet_authorship.pallet.Call
  }
  export interface Staking {
    type: "Staking"
    value: types.pallet_staking.pallet.pallet.Call
  }
  export interface Session {
    type: "Session"
    value: types.pallet_session.pallet.Call
  }
  export interface Grandpa {
    type: "Grandpa"
    value: types.pallet_grandpa.pallet.Call
  }
  export interface ImOnline {
    type: "ImOnline"
    value: types.pallet_im_online.pallet.Call
  }
  export interface Democracy {
    type: "Democracy"
    value: types.pallet_democracy.pallet.Call
  }
  export interface Council {
    type: "Council"
    value: types.pallet_collective.pallet.Call
  }
  export interface TechnicalCommittee {
    type: "TechnicalCommittee"
    value: types.pallet_collective.pallet.Call
  }
  export interface PhragmenElection {
    type: "PhragmenElection"
    value: types.pallet_elections_phragmen.pallet.Call
  }
  export interface TechnicalMembership {
    type: "TechnicalMembership"
    value: types.pallet_membership.pallet.Call
  }
  export interface Treasury {
    type: "Treasury"
    value: types.pallet_treasury.pallet.Call
  }
  export interface Claims {
    type: "Claims"
    value: types.polkadot_runtime_common.claims.pallet.Call
  }
  export interface Vesting {
    type: "Vesting"
    value: types.pallet_vesting.pallet.Call
  }
  export interface Utility {
    type: "Utility"
    value: types.pallet_utility.pallet.Call
  }
  export interface Identity {
    type: "Identity"
    value: types.pallet_identity.pallet.Call
  }
  export interface Proxy {
    type: "Proxy"
    value: types.pallet_proxy.pallet.Call
  }
  export interface Multisig {
    type: "Multisig"
    value: types.pallet_multisig.pallet.Call
  }
  export interface Bounties {
    type: "Bounties"
    value: types.pallet_bounties.pallet.Call
  }
  export interface ChildBounties {
    type: "ChildBounties"
    value: types.pallet_child_bounties.pallet.Call
  }
  export interface Tips {
    type: "Tips"
    value: types.pallet_tips.pallet.Call
  }
  export interface ElectionProviderMultiPhase {
    type: "ElectionProviderMultiPhase"
    value: types.pallet_election_provider_multi_phase.pallet.Call
  }
  export interface VoterList {
    type: "VoterList"
    value: types.pallet_bags_list.pallet.Call
  }
  export interface NominationPools {
    type: "NominationPools"
    value: types.pallet_nomination_pools.pallet.Call
  }
  export interface FastUnstake {
    type: "FastUnstake"
    value: types.pallet_fast_unstake.pallet.Call
  }
  export interface Configuration {
    type: "Configuration"
    value: types.polkadot_runtime_parachains.configuration.pallet.Call
  }
  export interface ParasShared {
    type: "ParasShared"
    value: types.polkadot_runtime_parachains.shared.pallet.Call
  }
  export interface ParaInclusion {
    type: "ParaInclusion"
    value: types.polkadot_runtime_parachains.inclusion.pallet.Call
  }
  export interface ParaInherent {
    type: "ParaInherent"
    value: types.polkadot_runtime_parachains.paras_inherent.pallet.Call
  }
  export interface Paras {
    type: "Paras"
    value: types.polkadot_runtime_parachains.paras.pallet.Call
  }
  export interface Initializer {
    type: "Initializer"
    value: types.polkadot_runtime_parachains.initializer.pallet.Call
  }
  export interface Dmp {
    type: "Dmp"
    value: types.polkadot_runtime_parachains.dmp.pallet.Call
  }
  export interface Ump {
    type: "Ump"
    value: types.polkadot_runtime_parachains.ump.pallet.Call
  }
  export interface Hrmp {
    type: "Hrmp"
    value: types.polkadot_runtime_parachains.hrmp.pallet.Call
  }
  export interface ParasDisputes {
    type: "ParasDisputes"
    value: types.polkadot_runtime_parachains.disputes.pallet.Call
  }
  export interface Registrar {
    type: "Registrar"
    value: types.polkadot_runtime_common.paras_registrar.pallet.Call
  }
  export interface Slots {
    type: "Slots"
    value: types.polkadot_runtime_common.slots.pallet.Call
  }
  export interface Auctions {
    type: "Auctions"
    value: types.polkadot_runtime_common.auctions.pallet.Call
  }
  export interface Crowdloan {
    type: "Crowdloan"
    value: types.polkadot_runtime_common.crowdloan.pallet.Call
  }
  export interface XcmPallet {
    type: "XcmPallet"
    value: types.pallet_xcm.pallet.Call
  }
  export function System(
    value: types.polkadot_runtime.RuntimeCall.System["value"],
  ): types.polkadot_runtime.RuntimeCall.System {
    return { type: "System", value }
  }
  export function Scheduler(
    value: types.polkadot_runtime.RuntimeCall.Scheduler["value"],
  ): types.polkadot_runtime.RuntimeCall.Scheduler {
    return { type: "Scheduler", value }
  }
  export function Preimage(
    value: types.polkadot_runtime.RuntimeCall.Preimage["value"],
  ): types.polkadot_runtime.RuntimeCall.Preimage {
    return { type: "Preimage", value }
  }
  export function Babe(
    value: types.polkadot_runtime.RuntimeCall.Babe["value"],
  ): types.polkadot_runtime.RuntimeCall.Babe {
    return { type: "Babe", value }
  }
  export function Timestamp(
    value: types.polkadot_runtime.RuntimeCall.Timestamp["value"],
  ): types.polkadot_runtime.RuntimeCall.Timestamp {
    return { type: "Timestamp", value }
  }
  export function Indices(
    value: types.polkadot_runtime.RuntimeCall.Indices["value"],
  ): types.polkadot_runtime.RuntimeCall.Indices {
    return { type: "Indices", value }
  }
  export function Balances(
    value: types.polkadot_runtime.RuntimeCall.Balances["value"],
  ): types.polkadot_runtime.RuntimeCall.Balances {
    return { type: "Balances", value }
  }
  export function Authorship(
    value: types.polkadot_runtime.RuntimeCall.Authorship["value"],
  ): types.polkadot_runtime.RuntimeCall.Authorship {
    return { type: "Authorship", value }
  }
  export function Staking(
    value: types.polkadot_runtime.RuntimeCall.Staking["value"],
  ): types.polkadot_runtime.RuntimeCall.Staking {
    return { type: "Staking", value }
  }
  export function Session(
    value: types.polkadot_runtime.RuntimeCall.Session["value"],
  ): types.polkadot_runtime.RuntimeCall.Session {
    return { type: "Session", value }
  }
  export function Grandpa(
    value: types.polkadot_runtime.RuntimeCall.Grandpa["value"],
  ): types.polkadot_runtime.RuntimeCall.Grandpa {
    return { type: "Grandpa", value }
  }
  export function ImOnline(
    value: types.polkadot_runtime.RuntimeCall.ImOnline["value"],
  ): types.polkadot_runtime.RuntimeCall.ImOnline {
    return { type: "ImOnline", value }
  }
  export function Democracy(
    value: types.polkadot_runtime.RuntimeCall.Democracy["value"],
  ): types.polkadot_runtime.RuntimeCall.Democracy {
    return { type: "Democracy", value }
  }
  export function Council(
    value: types.polkadot_runtime.RuntimeCall.Council["value"],
  ): types.polkadot_runtime.RuntimeCall.Council {
    return { type: "Council", value }
  }
  export function TechnicalCommittee(
    value: types.polkadot_runtime.RuntimeCall.TechnicalCommittee["value"],
  ): types.polkadot_runtime.RuntimeCall.TechnicalCommittee {
    return { type: "TechnicalCommittee", value }
  }
  export function PhragmenElection(
    value: types.polkadot_runtime.RuntimeCall.PhragmenElection["value"],
  ): types.polkadot_runtime.RuntimeCall.PhragmenElection {
    return { type: "PhragmenElection", value }
  }
  export function TechnicalMembership(
    value: types.polkadot_runtime.RuntimeCall.TechnicalMembership["value"],
  ): types.polkadot_runtime.RuntimeCall.TechnicalMembership {
    return { type: "TechnicalMembership", value }
  }
  export function Treasury(
    value: types.polkadot_runtime.RuntimeCall.Treasury["value"],
  ): types.polkadot_runtime.RuntimeCall.Treasury {
    return { type: "Treasury", value }
  }
  export function Claims(
    value: types.polkadot_runtime.RuntimeCall.Claims["value"],
  ): types.polkadot_runtime.RuntimeCall.Claims {
    return { type: "Claims", value }
  }
  export function Vesting(
    value: types.polkadot_runtime.RuntimeCall.Vesting["value"],
  ): types.polkadot_runtime.RuntimeCall.Vesting {
    return { type: "Vesting", value }
  }
  export function Utility(
    value: types.polkadot_runtime.RuntimeCall.Utility["value"],
  ): types.polkadot_runtime.RuntimeCall.Utility {
    return { type: "Utility", value }
  }
  export function Identity(
    value: types.polkadot_runtime.RuntimeCall.Identity["value"],
  ): types.polkadot_runtime.RuntimeCall.Identity {
    return { type: "Identity", value }
  }
  export function Proxy(
    value: types.polkadot_runtime.RuntimeCall.Proxy["value"],
  ): types.polkadot_runtime.RuntimeCall.Proxy {
    return { type: "Proxy", value }
  }
  export function Multisig(
    value: types.polkadot_runtime.RuntimeCall.Multisig["value"],
  ): types.polkadot_runtime.RuntimeCall.Multisig {
    return { type: "Multisig", value }
  }
  export function Bounties(
    value: types.polkadot_runtime.RuntimeCall.Bounties["value"],
  ): types.polkadot_runtime.RuntimeCall.Bounties {
    return { type: "Bounties", value }
  }
  export function ChildBounties(
    value: types.polkadot_runtime.RuntimeCall.ChildBounties["value"],
  ): types.polkadot_runtime.RuntimeCall.ChildBounties {
    return { type: "ChildBounties", value }
  }
  export function Tips(
    value: types.polkadot_runtime.RuntimeCall.Tips["value"],
  ): types.polkadot_runtime.RuntimeCall.Tips {
    return { type: "Tips", value }
  }
  export function ElectionProviderMultiPhase(
    value: types.polkadot_runtime.RuntimeCall.ElectionProviderMultiPhase["value"],
  ): types.polkadot_runtime.RuntimeCall.ElectionProviderMultiPhase {
    return { type: "ElectionProviderMultiPhase", value }
  }
  export function VoterList(
    value: types.polkadot_runtime.RuntimeCall.VoterList["value"],
  ): types.polkadot_runtime.RuntimeCall.VoterList {
    return { type: "VoterList", value }
  }
  export function NominationPools(
    value: types.polkadot_runtime.RuntimeCall.NominationPools["value"],
  ): types.polkadot_runtime.RuntimeCall.NominationPools {
    return { type: "NominationPools", value }
  }
  export function FastUnstake(
    value: types.polkadot_runtime.RuntimeCall.FastUnstake["value"],
  ): types.polkadot_runtime.RuntimeCall.FastUnstake {
    return { type: "FastUnstake", value }
  }
  export function Configuration(
    value: types.polkadot_runtime.RuntimeCall.Configuration["value"],
  ): types.polkadot_runtime.RuntimeCall.Configuration {
    return { type: "Configuration", value }
  }
  export function ParasShared(
    value: types.polkadot_runtime.RuntimeCall.ParasShared["value"],
  ): types.polkadot_runtime.RuntimeCall.ParasShared {
    return { type: "ParasShared", value }
  }
  export function ParaInclusion(
    value: types.polkadot_runtime.RuntimeCall.ParaInclusion["value"],
  ): types.polkadot_runtime.RuntimeCall.ParaInclusion {
    return { type: "ParaInclusion", value }
  }
  export function ParaInherent(
    value: types.polkadot_runtime.RuntimeCall.ParaInherent["value"],
  ): types.polkadot_runtime.RuntimeCall.ParaInherent {
    return { type: "ParaInherent", value }
  }
  export function Paras(
    value: types.polkadot_runtime.RuntimeCall.Paras["value"],
  ): types.polkadot_runtime.RuntimeCall.Paras {
    return { type: "Paras", value }
  }
  export function Initializer(
    value: types.polkadot_runtime.RuntimeCall.Initializer["value"],
  ): types.polkadot_runtime.RuntimeCall.Initializer {
    return { type: "Initializer", value }
  }
  export function Dmp(
    value: types.polkadot_runtime.RuntimeCall.Dmp["value"],
  ): types.polkadot_runtime.RuntimeCall.Dmp {
    return { type: "Dmp", value }
  }
  export function Ump(
    value: types.polkadot_runtime.RuntimeCall.Ump["value"],
  ): types.polkadot_runtime.RuntimeCall.Ump {
    return { type: "Ump", value }
  }
  export function Hrmp(
    value: types.polkadot_runtime.RuntimeCall.Hrmp["value"],
  ): types.polkadot_runtime.RuntimeCall.Hrmp {
    return { type: "Hrmp", value }
  }
  export function ParasDisputes(
    value: types.polkadot_runtime.RuntimeCall.ParasDisputes["value"],
  ): types.polkadot_runtime.RuntimeCall.ParasDisputes {
    return { type: "ParasDisputes", value }
  }
  export function Registrar(
    value: types.polkadot_runtime.RuntimeCall.Registrar["value"],
  ): types.polkadot_runtime.RuntimeCall.Registrar {
    return { type: "Registrar", value }
  }
  export function Slots(
    value: types.polkadot_runtime.RuntimeCall.Slots["value"],
  ): types.polkadot_runtime.RuntimeCall.Slots {
    return { type: "Slots", value }
  }
  export function Auctions(
    value: types.polkadot_runtime.RuntimeCall.Auctions["value"],
  ): types.polkadot_runtime.RuntimeCall.Auctions {
    return { type: "Auctions", value }
  }
  export function Crowdloan(
    value: types.polkadot_runtime.RuntimeCall.Crowdloan["value"],
  ): types.polkadot_runtime.RuntimeCall.Crowdloan {
    return { type: "Crowdloan", value }
  }
  export function XcmPallet(
    value: types.polkadot_runtime.RuntimeCall.XcmPallet["value"],
  ): types.polkadot_runtime.RuntimeCall.XcmPallet {
    return { type: "XcmPallet", value }
  }
}

export type RuntimeEvent =
  | types.polkadot_runtime.RuntimeEvent.System
  | types.polkadot_runtime.RuntimeEvent.Scheduler
  | types.polkadot_runtime.RuntimeEvent.Preimage
  | types.polkadot_runtime.RuntimeEvent.Indices
  | types.polkadot_runtime.RuntimeEvent.Balances
  | types.polkadot_runtime.RuntimeEvent.TransactionPayment
  | types.polkadot_runtime.RuntimeEvent.Staking
  | types.polkadot_runtime.RuntimeEvent.Offences
  | types.polkadot_runtime.RuntimeEvent.Session
  | types.polkadot_runtime.RuntimeEvent.Grandpa
  | types.polkadot_runtime.RuntimeEvent.ImOnline
  | types.polkadot_runtime.RuntimeEvent.Democracy
  | types.polkadot_runtime.RuntimeEvent.Council
  | types.polkadot_runtime.RuntimeEvent.TechnicalCommittee
  | types.polkadot_runtime.RuntimeEvent.PhragmenElection
  | types.polkadot_runtime.RuntimeEvent.TechnicalMembership
  | types.polkadot_runtime.RuntimeEvent.Treasury
  | types.polkadot_runtime.RuntimeEvent.Claims
  | types.polkadot_runtime.RuntimeEvent.Vesting
  | types.polkadot_runtime.RuntimeEvent.Utility
  | types.polkadot_runtime.RuntimeEvent.Identity
  | types.polkadot_runtime.RuntimeEvent.Proxy
  | types.polkadot_runtime.RuntimeEvent.Multisig
  | types.polkadot_runtime.RuntimeEvent.Bounties
  | types.polkadot_runtime.RuntimeEvent.ChildBounties
  | types.polkadot_runtime.RuntimeEvent.Tips
  | types.polkadot_runtime.RuntimeEvent.ElectionProviderMultiPhase
  | types.polkadot_runtime.RuntimeEvent.VoterList
  | types.polkadot_runtime.RuntimeEvent.NominationPools
  | types.polkadot_runtime.RuntimeEvent.FastUnstake
  | types.polkadot_runtime.RuntimeEvent.ParaInclusion
  | types.polkadot_runtime.RuntimeEvent.Paras
  | types.polkadot_runtime.RuntimeEvent.Ump
  | types.polkadot_runtime.RuntimeEvent.Hrmp
  | types.polkadot_runtime.RuntimeEvent.ParasDisputes
  | types.polkadot_runtime.RuntimeEvent.Registrar
  | types.polkadot_runtime.RuntimeEvent.Slots
  | types.polkadot_runtime.RuntimeEvent.Auctions
  | types.polkadot_runtime.RuntimeEvent.Crowdloan
  | types.polkadot_runtime.RuntimeEvent.XcmPallet
export namespace RuntimeEvent {
  export interface System {
    type: "System"
    value: types.frame_system.pallet.Event
  }
  export interface Scheduler {
    type: "Scheduler"
    value: types.pallet_scheduler.pallet.Event
  }
  export interface Preimage {
    type: "Preimage"
    value: types.pallet_preimage.pallet.Event
  }
  export interface Indices {
    type: "Indices"
    value: types.pallet_indices.pallet.Event
  }
  export interface Balances {
    type: "Balances"
    value: types.pallet_balances.pallet.Event
  }
  export interface TransactionPayment {
    type: "TransactionPayment"
    value: types.pallet_transaction_payment.pallet.Event
  }
  export interface Staking {
    type: "Staking"
    value: types.pallet_staking.pallet.pallet.Event
  }
  export interface Offences {
    type: "Offences"
    value: types.pallet_offences.pallet.Event
  }
  export interface Session {
    type: "Session"
    value: types.pallet_session.pallet.Event
  }
  export interface Grandpa {
    type: "Grandpa"
    value: types.pallet_grandpa.pallet.Event
  }
  export interface ImOnline {
    type: "ImOnline"
    value: types.pallet_im_online.pallet.Event
  }
  export interface Democracy {
    type: "Democracy"
    value: types.pallet_democracy.pallet.Event
  }
  export interface Council {
    type: "Council"
    value: types.pallet_collective.pallet.Event
  }
  export interface TechnicalCommittee {
    type: "TechnicalCommittee"
    value: types.pallet_collective.pallet.Event
  }
  export interface PhragmenElection {
    type: "PhragmenElection"
    value: types.pallet_elections_phragmen.pallet.Event
  }
  export interface TechnicalMembership {
    type: "TechnicalMembership"
    value: types.pallet_membership.pallet.Event
  }
  export interface Treasury {
    type: "Treasury"
    value: types.pallet_treasury.pallet.Event
  }
  export interface Claims {
    type: "Claims"
    value: types.polkadot_runtime_common.claims.pallet.Event
  }
  export interface Vesting {
    type: "Vesting"
    value: types.pallet_vesting.pallet.Event
  }
  export interface Utility {
    type: "Utility"
    value: types.pallet_utility.pallet.Event
  }
  export interface Identity {
    type: "Identity"
    value: types.pallet_identity.pallet.Event
  }
  export interface Proxy {
    type: "Proxy"
    value: types.pallet_proxy.pallet.Event
  }
  export interface Multisig {
    type: "Multisig"
    value: types.pallet_multisig.pallet.Event
  }
  export interface Bounties {
    type: "Bounties"
    value: types.pallet_bounties.pallet.Event
  }
  export interface ChildBounties {
    type: "ChildBounties"
    value: types.pallet_child_bounties.pallet.Event
  }
  export interface Tips {
    type: "Tips"
    value: types.pallet_tips.pallet.Event
  }
  export interface ElectionProviderMultiPhase {
    type: "ElectionProviderMultiPhase"
    value: types.pallet_election_provider_multi_phase.pallet.Event
  }
  export interface VoterList {
    type: "VoterList"
    value: types.pallet_bags_list.pallet.Event
  }
  export interface NominationPools {
    type: "NominationPools"
    value: types.pallet_nomination_pools.pallet.Event
  }
  export interface FastUnstake {
    type: "FastUnstake"
    value: types.pallet_fast_unstake.pallet.Event
  }
  export interface ParaInclusion {
    type: "ParaInclusion"
    value: types.polkadot_runtime_parachains.inclusion.pallet.Event
  }
  export interface Paras {
    type: "Paras"
    value: types.polkadot_runtime_parachains.paras.pallet.Event
  }
  export interface Ump {
    type: "Ump"
    value: types.polkadot_runtime_parachains.ump.pallet.Event
  }
  export interface Hrmp {
    type: "Hrmp"
    value: types.polkadot_runtime_parachains.hrmp.pallet.Event
  }
  export interface ParasDisputes {
    type: "ParasDisputes"
    value: types.polkadot_runtime_parachains.disputes.pallet.Event
  }
  export interface Registrar {
    type: "Registrar"
    value: types.polkadot_runtime_common.paras_registrar.pallet.Event
  }
  export interface Slots {
    type: "Slots"
    value: types.polkadot_runtime_common.slots.pallet.Event
  }
  export interface Auctions {
    type: "Auctions"
    value: types.polkadot_runtime_common.auctions.pallet.Event
  }
  export interface Crowdloan {
    type: "Crowdloan"
    value: types.polkadot_runtime_common.crowdloan.pallet.Event
  }
  export interface XcmPallet {
    type: "XcmPallet"
    value: types.pallet_xcm.pallet.Event
  }
  export function System(
    value: types.polkadot_runtime.RuntimeEvent.System["value"],
  ): types.polkadot_runtime.RuntimeEvent.System {
    return { type: "System", value }
  }
  export function Scheduler(
    value: types.polkadot_runtime.RuntimeEvent.Scheduler["value"],
  ): types.polkadot_runtime.RuntimeEvent.Scheduler {
    return { type: "Scheduler", value }
  }
  export function Preimage(
    value: types.polkadot_runtime.RuntimeEvent.Preimage["value"],
  ): types.polkadot_runtime.RuntimeEvent.Preimage {
    return { type: "Preimage", value }
  }
  export function Indices(
    value: types.polkadot_runtime.RuntimeEvent.Indices["value"],
  ): types.polkadot_runtime.RuntimeEvent.Indices {
    return { type: "Indices", value }
  }
  export function Balances(
    value: types.polkadot_runtime.RuntimeEvent.Balances["value"],
  ): types.polkadot_runtime.RuntimeEvent.Balances {
    return { type: "Balances", value }
  }
  export function TransactionPayment(
    value: types.polkadot_runtime.RuntimeEvent.TransactionPayment["value"],
  ): types.polkadot_runtime.RuntimeEvent.TransactionPayment {
    return { type: "TransactionPayment", value }
  }
  export function Staking(
    value: types.polkadot_runtime.RuntimeEvent.Staking["value"],
  ): types.polkadot_runtime.RuntimeEvent.Staking {
    return { type: "Staking", value }
  }
  export function Offences(
    value: types.polkadot_runtime.RuntimeEvent.Offences["value"],
  ): types.polkadot_runtime.RuntimeEvent.Offences {
    return { type: "Offences", value }
  }
  export function Session(
    value: types.polkadot_runtime.RuntimeEvent.Session["value"],
  ): types.polkadot_runtime.RuntimeEvent.Session {
    return { type: "Session", value }
  }
  export function Grandpa(
    value: types.polkadot_runtime.RuntimeEvent.Grandpa["value"],
  ): types.polkadot_runtime.RuntimeEvent.Grandpa {
    return { type: "Grandpa", value }
  }
  export function ImOnline(
    value: types.polkadot_runtime.RuntimeEvent.ImOnline["value"],
  ): types.polkadot_runtime.RuntimeEvent.ImOnline {
    return { type: "ImOnline", value }
  }
  export function Democracy(
    value: types.polkadot_runtime.RuntimeEvent.Democracy["value"],
  ): types.polkadot_runtime.RuntimeEvent.Democracy {
    return { type: "Democracy", value }
  }
  export function Council(
    value: types.polkadot_runtime.RuntimeEvent.Council["value"],
  ): types.polkadot_runtime.RuntimeEvent.Council {
    return { type: "Council", value }
  }
  export function TechnicalCommittee(
    value: types.polkadot_runtime.RuntimeEvent.TechnicalCommittee["value"],
  ): types.polkadot_runtime.RuntimeEvent.TechnicalCommittee {
    return { type: "TechnicalCommittee", value }
  }
  export function PhragmenElection(
    value: types.polkadot_runtime.RuntimeEvent.PhragmenElection["value"],
  ): types.polkadot_runtime.RuntimeEvent.PhragmenElection {
    return { type: "PhragmenElection", value }
  }
  export function TechnicalMembership(
    value: types.polkadot_runtime.RuntimeEvent.TechnicalMembership["value"],
  ): types.polkadot_runtime.RuntimeEvent.TechnicalMembership {
    return { type: "TechnicalMembership", value }
  }
  export function Treasury(
    value: types.polkadot_runtime.RuntimeEvent.Treasury["value"],
  ): types.polkadot_runtime.RuntimeEvent.Treasury {
    return { type: "Treasury", value }
  }
  export function Claims(
    value: types.polkadot_runtime.RuntimeEvent.Claims["value"],
  ): types.polkadot_runtime.RuntimeEvent.Claims {
    return { type: "Claims", value }
  }
  export function Vesting(
    value: types.polkadot_runtime.RuntimeEvent.Vesting["value"],
  ): types.polkadot_runtime.RuntimeEvent.Vesting {
    return { type: "Vesting", value }
  }
  export function Utility(
    value: types.polkadot_runtime.RuntimeEvent.Utility["value"],
  ): types.polkadot_runtime.RuntimeEvent.Utility {
    return { type: "Utility", value }
  }
  export function Identity(
    value: types.polkadot_runtime.RuntimeEvent.Identity["value"],
  ): types.polkadot_runtime.RuntimeEvent.Identity {
    return { type: "Identity", value }
  }
  export function Proxy(
    value: types.polkadot_runtime.RuntimeEvent.Proxy["value"],
  ): types.polkadot_runtime.RuntimeEvent.Proxy {
    return { type: "Proxy", value }
  }
  export function Multisig(
    value: types.polkadot_runtime.RuntimeEvent.Multisig["value"],
  ): types.polkadot_runtime.RuntimeEvent.Multisig {
    return { type: "Multisig", value }
  }
  export function Bounties(
    value: types.polkadot_runtime.RuntimeEvent.Bounties["value"],
  ): types.polkadot_runtime.RuntimeEvent.Bounties {
    return { type: "Bounties", value }
  }
  export function ChildBounties(
    value: types.polkadot_runtime.RuntimeEvent.ChildBounties["value"],
  ): types.polkadot_runtime.RuntimeEvent.ChildBounties {
    return { type: "ChildBounties", value }
  }
  export function Tips(
    value: types.polkadot_runtime.RuntimeEvent.Tips["value"],
  ): types.polkadot_runtime.RuntimeEvent.Tips {
    return { type: "Tips", value }
  }
  export function ElectionProviderMultiPhase(
    value: types.polkadot_runtime.RuntimeEvent.ElectionProviderMultiPhase["value"],
  ): types.polkadot_runtime.RuntimeEvent.ElectionProviderMultiPhase {
    return { type: "ElectionProviderMultiPhase", value }
  }
  export function VoterList(
    value: types.polkadot_runtime.RuntimeEvent.VoterList["value"],
  ): types.polkadot_runtime.RuntimeEvent.VoterList {
    return { type: "VoterList", value }
  }
  export function NominationPools(
    value: types.polkadot_runtime.RuntimeEvent.NominationPools["value"],
  ): types.polkadot_runtime.RuntimeEvent.NominationPools {
    return { type: "NominationPools", value }
  }
  export function FastUnstake(
    value: types.polkadot_runtime.RuntimeEvent.FastUnstake["value"],
  ): types.polkadot_runtime.RuntimeEvent.FastUnstake {
    return { type: "FastUnstake", value }
  }
  export function ParaInclusion(
    value: types.polkadot_runtime.RuntimeEvent.ParaInclusion["value"],
  ): types.polkadot_runtime.RuntimeEvent.ParaInclusion {
    return { type: "ParaInclusion", value }
  }
  export function Paras(
    value: types.polkadot_runtime.RuntimeEvent.Paras["value"],
  ): types.polkadot_runtime.RuntimeEvent.Paras {
    return { type: "Paras", value }
  }
  export function Ump(
    value: types.polkadot_runtime.RuntimeEvent.Ump["value"],
  ): types.polkadot_runtime.RuntimeEvent.Ump {
    return { type: "Ump", value }
  }
  export function Hrmp(
    value: types.polkadot_runtime.RuntimeEvent.Hrmp["value"],
  ): types.polkadot_runtime.RuntimeEvent.Hrmp {
    return { type: "Hrmp", value }
  }
  export function ParasDisputes(
    value: types.polkadot_runtime.RuntimeEvent.ParasDisputes["value"],
  ): types.polkadot_runtime.RuntimeEvent.ParasDisputes {
    return { type: "ParasDisputes", value }
  }
  export function Registrar(
    value: types.polkadot_runtime.RuntimeEvent.Registrar["value"],
  ): types.polkadot_runtime.RuntimeEvent.Registrar {
    return { type: "Registrar", value }
  }
  export function Slots(
    value: types.polkadot_runtime.RuntimeEvent.Slots["value"],
  ): types.polkadot_runtime.RuntimeEvent.Slots {
    return { type: "Slots", value }
  }
  export function Auctions(
    value: types.polkadot_runtime.RuntimeEvent.Auctions["value"],
  ): types.polkadot_runtime.RuntimeEvent.Auctions {
    return { type: "Auctions", value }
  }
  export function Crowdloan(
    value: types.polkadot_runtime.RuntimeEvent.Crowdloan["value"],
  ): types.polkadot_runtime.RuntimeEvent.Crowdloan {
    return { type: "Crowdloan", value }
  }
  export function XcmPallet(
    value: types.polkadot_runtime.RuntimeEvent.XcmPallet["value"],
  ): types.polkadot_runtime.RuntimeEvent.XcmPallet {
    return { type: "XcmPallet", value }
  }
}

export interface SessionKeys {
  grandpa: types.sp_finality_grandpa.app.Public
  babe: types.sp_consensus_babe.app.Public
  im_online: types.pallet_im_online.sr25519.app_sr25519.Public
  para_validator: types.polkadot_primitives.v2.validator_app.Public
  para_assignment: types.polkadot_primitives.v2.assignment_app.Public
  authority_discovery: types.sp_authority_discovery.app.Public
}

export function SessionKeys(value: types.polkadot_runtime.SessionKeys) {
  return value
}
