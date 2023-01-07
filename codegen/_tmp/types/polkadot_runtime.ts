import { $, C } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "./mod.ts"

export const $call: $.Codec<types.polkadot_runtime.Call> = codecs.$181
export type Call =
  | types.polkadot_runtime.Call.System
  | types.polkadot_runtime.Call.Scheduler
  | types.polkadot_runtime.Call.Preimage
  | types.polkadot_runtime.Call.Babe
  | types.polkadot_runtime.Call.Timestamp
  | types.polkadot_runtime.Call.Indices
  | types.polkadot_runtime.Call.Balances
  | types.polkadot_runtime.Call.Authorship
  | types.polkadot_runtime.Call.Staking
  | types.polkadot_runtime.Call.Session
  | types.polkadot_runtime.Call.Grandpa
  | types.polkadot_runtime.Call.ImOnline
  | types.polkadot_runtime.Call.Democracy
  | types.polkadot_runtime.Call.Council
  | types.polkadot_runtime.Call.TechnicalCommittee
  | types.polkadot_runtime.Call.PhragmenElection
  | types.polkadot_runtime.Call.TechnicalMembership
  | types.polkadot_runtime.Call.Treasury
  | types.polkadot_runtime.Call.Claims
  | types.polkadot_runtime.Call.Vesting
  | types.polkadot_runtime.Call.Utility
  | types.polkadot_runtime.Call.Identity
  | types.polkadot_runtime.Call.Proxy
  | types.polkadot_runtime.Call.Multisig
  | types.polkadot_runtime.Call.Bounties
  | types.polkadot_runtime.Call.ChildBounties
  | types.polkadot_runtime.Call.Tips
  | types.polkadot_runtime.Call.ElectionProviderMultiPhase
  | types.polkadot_runtime.Call.VoterList
  | types.polkadot_runtime.Call.NominationPools
  | types.polkadot_runtime.Call.Configuration
  | types.polkadot_runtime.Call.ParasShared
  | types.polkadot_runtime.Call.ParaInclusion
  | types.polkadot_runtime.Call.ParaInherent
  | types.polkadot_runtime.Call.Paras
  | types.polkadot_runtime.Call.Initializer
  | types.polkadot_runtime.Call.Dmp
  | types.polkadot_runtime.Call.Ump
  | types.polkadot_runtime.Call.Hrmp
  | types.polkadot_runtime.Call.ParasDisputes
  | types.polkadot_runtime.Call.Registrar
  | types.polkadot_runtime.Call.Slots
  | types.polkadot_runtime.Call.Auctions
  | types.polkadot_runtime.Call.Crowdloan
  | types.polkadot_runtime.Call.XcmPallet
export namespace Call {
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
    value: types.polkadot_runtime.Call.System["value"],
  ): types.polkadot_runtime.Call.System {
    return { type: "System", value }
  }
  export function Scheduler(
    value: types.polkadot_runtime.Call.Scheduler["value"],
  ): types.polkadot_runtime.Call.Scheduler {
    return { type: "Scheduler", value }
  }
  export function Preimage(
    value: types.polkadot_runtime.Call.Preimage["value"],
  ): types.polkadot_runtime.Call.Preimage {
    return { type: "Preimage", value }
  }
  export function Babe(
    value: types.polkadot_runtime.Call.Babe["value"],
  ): types.polkadot_runtime.Call.Babe {
    return { type: "Babe", value }
  }
  export function Timestamp(
    value: types.polkadot_runtime.Call.Timestamp["value"],
  ): types.polkadot_runtime.Call.Timestamp {
    return { type: "Timestamp", value }
  }
  export function Indices(
    value: types.polkadot_runtime.Call.Indices["value"],
  ): types.polkadot_runtime.Call.Indices {
    return { type: "Indices", value }
  }
  export function Balances(
    value: types.polkadot_runtime.Call.Balances["value"],
  ): types.polkadot_runtime.Call.Balances {
    return { type: "Balances", value }
  }
  export function Authorship(
    value: types.polkadot_runtime.Call.Authorship["value"],
  ): types.polkadot_runtime.Call.Authorship {
    return { type: "Authorship", value }
  }
  export function Staking(
    value: types.polkadot_runtime.Call.Staking["value"],
  ): types.polkadot_runtime.Call.Staking {
    return { type: "Staking", value }
  }
  export function Session(
    value: types.polkadot_runtime.Call.Session["value"],
  ): types.polkadot_runtime.Call.Session {
    return { type: "Session", value }
  }
  export function Grandpa(
    value: types.polkadot_runtime.Call.Grandpa["value"],
  ): types.polkadot_runtime.Call.Grandpa {
    return { type: "Grandpa", value }
  }
  export function ImOnline(
    value: types.polkadot_runtime.Call.ImOnline["value"],
  ): types.polkadot_runtime.Call.ImOnline {
    return { type: "ImOnline", value }
  }
  export function Democracy(
    value: types.polkadot_runtime.Call.Democracy["value"],
  ): types.polkadot_runtime.Call.Democracy {
    return { type: "Democracy", value }
  }
  export function Council(
    value: types.polkadot_runtime.Call.Council["value"],
  ): types.polkadot_runtime.Call.Council {
    return { type: "Council", value }
  }
  export function TechnicalCommittee(
    value: types.polkadot_runtime.Call.TechnicalCommittee["value"],
  ): types.polkadot_runtime.Call.TechnicalCommittee {
    return { type: "TechnicalCommittee", value }
  }
  export function PhragmenElection(
    value: types.polkadot_runtime.Call.PhragmenElection["value"],
  ): types.polkadot_runtime.Call.PhragmenElection {
    return { type: "PhragmenElection", value }
  }
  export function TechnicalMembership(
    value: types.polkadot_runtime.Call.TechnicalMembership["value"],
  ): types.polkadot_runtime.Call.TechnicalMembership {
    return { type: "TechnicalMembership", value }
  }
  export function Treasury(
    value: types.polkadot_runtime.Call.Treasury["value"],
  ): types.polkadot_runtime.Call.Treasury {
    return { type: "Treasury", value }
  }
  export function Claims(
    value: types.polkadot_runtime.Call.Claims["value"],
  ): types.polkadot_runtime.Call.Claims {
    return { type: "Claims", value }
  }
  export function Vesting(
    value: types.polkadot_runtime.Call.Vesting["value"],
  ): types.polkadot_runtime.Call.Vesting {
    return { type: "Vesting", value }
  }
  export function Utility(
    value: types.polkadot_runtime.Call.Utility["value"],
  ): types.polkadot_runtime.Call.Utility {
    return { type: "Utility", value }
  }
  export function Identity(
    value: types.polkadot_runtime.Call.Identity["value"],
  ): types.polkadot_runtime.Call.Identity {
    return { type: "Identity", value }
  }
  export function Proxy(
    value: types.polkadot_runtime.Call.Proxy["value"],
  ): types.polkadot_runtime.Call.Proxy {
    return { type: "Proxy", value }
  }
  export function Multisig(
    value: types.polkadot_runtime.Call.Multisig["value"],
  ): types.polkadot_runtime.Call.Multisig {
    return { type: "Multisig", value }
  }
  export function Bounties(
    value: types.polkadot_runtime.Call.Bounties["value"],
  ): types.polkadot_runtime.Call.Bounties {
    return { type: "Bounties", value }
  }
  export function ChildBounties(
    value: types.polkadot_runtime.Call.ChildBounties["value"],
  ): types.polkadot_runtime.Call.ChildBounties {
    return { type: "ChildBounties", value }
  }
  export function Tips(
    value: types.polkadot_runtime.Call.Tips["value"],
  ): types.polkadot_runtime.Call.Tips {
    return { type: "Tips", value }
  }
  export function ElectionProviderMultiPhase(
    value: types.polkadot_runtime.Call.ElectionProviderMultiPhase["value"],
  ): types.polkadot_runtime.Call.ElectionProviderMultiPhase {
    return { type: "ElectionProviderMultiPhase", value }
  }
  export function VoterList(
    value: types.polkadot_runtime.Call.VoterList["value"],
  ): types.polkadot_runtime.Call.VoterList {
    return { type: "VoterList", value }
  }
  export function NominationPools(
    value: types.polkadot_runtime.Call.NominationPools["value"],
  ): types.polkadot_runtime.Call.NominationPools {
    return { type: "NominationPools", value }
  }
  export function Configuration(
    value: types.polkadot_runtime.Call.Configuration["value"],
  ): types.polkadot_runtime.Call.Configuration {
    return { type: "Configuration", value }
  }
  export function ParasShared(
    value: types.polkadot_runtime.Call.ParasShared["value"],
  ): types.polkadot_runtime.Call.ParasShared {
    return { type: "ParasShared", value }
  }
  export function ParaInclusion(
    value: types.polkadot_runtime.Call.ParaInclusion["value"],
  ): types.polkadot_runtime.Call.ParaInclusion {
    return { type: "ParaInclusion", value }
  }
  export function ParaInherent(
    value: types.polkadot_runtime.Call.ParaInherent["value"],
  ): types.polkadot_runtime.Call.ParaInherent {
    return { type: "ParaInherent", value }
  }
  export function Paras(
    value: types.polkadot_runtime.Call.Paras["value"],
  ): types.polkadot_runtime.Call.Paras {
    return { type: "Paras", value }
  }
  export function Initializer(
    value: types.polkadot_runtime.Call.Initializer["value"],
  ): types.polkadot_runtime.Call.Initializer {
    return { type: "Initializer", value }
  }
  export function Dmp(
    value: types.polkadot_runtime.Call.Dmp["value"],
  ): types.polkadot_runtime.Call.Dmp {
    return { type: "Dmp", value }
  }
  export function Ump(
    value: types.polkadot_runtime.Call.Ump["value"],
  ): types.polkadot_runtime.Call.Ump {
    return { type: "Ump", value }
  }
  export function Hrmp(
    value: types.polkadot_runtime.Call.Hrmp["value"],
  ): types.polkadot_runtime.Call.Hrmp {
    return { type: "Hrmp", value }
  }
  export function ParasDisputes(
    value: types.polkadot_runtime.Call.ParasDisputes["value"],
  ): types.polkadot_runtime.Call.ParasDisputes {
    return { type: "ParasDisputes", value }
  }
  export function Registrar(
    value: types.polkadot_runtime.Call.Registrar["value"],
  ): types.polkadot_runtime.Call.Registrar {
    return { type: "Registrar", value }
  }
  export function Slots(
    value: types.polkadot_runtime.Call.Slots["value"],
  ): types.polkadot_runtime.Call.Slots {
    return { type: "Slots", value }
  }
  export function Auctions(
    value: types.polkadot_runtime.Call.Auctions["value"],
  ): types.polkadot_runtime.Call.Auctions {
    return { type: "Auctions", value }
  }
  export function Crowdloan(
    value: types.polkadot_runtime.Call.Crowdloan["value"],
  ): types.polkadot_runtime.Call.Crowdloan {
    return { type: "Crowdloan", value }
  }
  export function XcmPallet(
    value: types.polkadot_runtime.Call.XcmPallet["value"],
  ): types.polkadot_runtime.Call.XcmPallet {
    return { type: "XcmPallet", value }
  }
}

export const $event: $.Codec<types.polkadot_runtime.Event> = codecs.$18
export type Event =
  | types.polkadot_runtime.Event.System
  | types.polkadot_runtime.Event.Scheduler
  | types.polkadot_runtime.Event.Preimage
  | types.polkadot_runtime.Event.Indices
  | types.polkadot_runtime.Event.Balances
  | types.polkadot_runtime.Event.TransactionPayment
  | types.polkadot_runtime.Event.Staking
  | types.polkadot_runtime.Event.Offences
  | types.polkadot_runtime.Event.Session
  | types.polkadot_runtime.Event.Grandpa
  | types.polkadot_runtime.Event.ImOnline
  | types.polkadot_runtime.Event.Democracy
  | types.polkadot_runtime.Event.Council
  | types.polkadot_runtime.Event.TechnicalCommittee
  | types.polkadot_runtime.Event.PhragmenElection
  | types.polkadot_runtime.Event.TechnicalMembership
  | types.polkadot_runtime.Event.Treasury
  | types.polkadot_runtime.Event.Claims
  | types.polkadot_runtime.Event.Vesting
  | types.polkadot_runtime.Event.Utility
  | types.polkadot_runtime.Event.Identity
  | types.polkadot_runtime.Event.Proxy
  | types.polkadot_runtime.Event.Multisig
  | types.polkadot_runtime.Event.Bounties
  | types.polkadot_runtime.Event.ChildBounties
  | types.polkadot_runtime.Event.Tips
  | types.polkadot_runtime.Event.ElectionProviderMultiPhase
  | types.polkadot_runtime.Event.VoterList
  | types.polkadot_runtime.Event.NominationPools
  | types.polkadot_runtime.Event.ParaInclusion
  | types.polkadot_runtime.Event.Paras
  | types.polkadot_runtime.Event.Ump
  | types.polkadot_runtime.Event.Hrmp
  | types.polkadot_runtime.Event.ParasDisputes
  | types.polkadot_runtime.Event.Registrar
  | types.polkadot_runtime.Event.Slots
  | types.polkadot_runtime.Event.Auctions
  | types.polkadot_runtime.Event.Crowdloan
  | types.polkadot_runtime.Event.XcmPallet
export namespace Event {
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
    value: types.polkadot_runtime.Event.System["value"],
  ): types.polkadot_runtime.Event.System {
    return { type: "System", value }
  }
  export function Scheduler(
    value: types.polkadot_runtime.Event.Scheduler["value"],
  ): types.polkadot_runtime.Event.Scheduler {
    return { type: "Scheduler", value }
  }
  export function Preimage(
    value: types.polkadot_runtime.Event.Preimage["value"],
  ): types.polkadot_runtime.Event.Preimage {
    return { type: "Preimage", value }
  }
  export function Indices(
    value: types.polkadot_runtime.Event.Indices["value"],
  ): types.polkadot_runtime.Event.Indices {
    return { type: "Indices", value }
  }
  export function Balances(
    value: types.polkadot_runtime.Event.Balances["value"],
  ): types.polkadot_runtime.Event.Balances {
    return { type: "Balances", value }
  }
  export function TransactionPayment(
    value: types.polkadot_runtime.Event.TransactionPayment["value"],
  ): types.polkadot_runtime.Event.TransactionPayment {
    return { type: "TransactionPayment", value }
  }
  export function Staking(
    value: types.polkadot_runtime.Event.Staking["value"],
  ): types.polkadot_runtime.Event.Staking {
    return { type: "Staking", value }
  }
  export function Offences(
    value: types.polkadot_runtime.Event.Offences["value"],
  ): types.polkadot_runtime.Event.Offences {
    return { type: "Offences", value }
  }
  export function Session(
    value: types.polkadot_runtime.Event.Session["value"],
  ): types.polkadot_runtime.Event.Session {
    return { type: "Session", value }
  }
  export function Grandpa(
    value: types.polkadot_runtime.Event.Grandpa["value"],
  ): types.polkadot_runtime.Event.Grandpa {
    return { type: "Grandpa", value }
  }
  export function ImOnline(
    value: types.polkadot_runtime.Event.ImOnline["value"],
  ): types.polkadot_runtime.Event.ImOnline {
    return { type: "ImOnline", value }
  }
  export function Democracy(
    value: types.polkadot_runtime.Event.Democracy["value"],
  ): types.polkadot_runtime.Event.Democracy {
    return { type: "Democracy", value }
  }
  export function Council(
    value: types.polkadot_runtime.Event.Council["value"],
  ): types.polkadot_runtime.Event.Council {
    return { type: "Council", value }
  }
  export function TechnicalCommittee(
    value: types.polkadot_runtime.Event.TechnicalCommittee["value"],
  ): types.polkadot_runtime.Event.TechnicalCommittee {
    return { type: "TechnicalCommittee", value }
  }
  export function PhragmenElection(
    value: types.polkadot_runtime.Event.PhragmenElection["value"],
  ): types.polkadot_runtime.Event.PhragmenElection {
    return { type: "PhragmenElection", value }
  }
  export function TechnicalMembership(
    value: types.polkadot_runtime.Event.TechnicalMembership["value"],
  ): types.polkadot_runtime.Event.TechnicalMembership {
    return { type: "TechnicalMembership", value }
  }
  export function Treasury(
    value: types.polkadot_runtime.Event.Treasury["value"],
  ): types.polkadot_runtime.Event.Treasury {
    return { type: "Treasury", value }
  }
  export function Claims(
    value: types.polkadot_runtime.Event.Claims["value"],
  ): types.polkadot_runtime.Event.Claims {
    return { type: "Claims", value }
  }
  export function Vesting(
    value: types.polkadot_runtime.Event.Vesting["value"],
  ): types.polkadot_runtime.Event.Vesting {
    return { type: "Vesting", value }
  }
  export function Utility(
    value: types.polkadot_runtime.Event.Utility["value"],
  ): types.polkadot_runtime.Event.Utility {
    return { type: "Utility", value }
  }
  export function Identity(
    value: types.polkadot_runtime.Event.Identity["value"],
  ): types.polkadot_runtime.Event.Identity {
    return { type: "Identity", value }
  }
  export function Proxy(
    value: types.polkadot_runtime.Event.Proxy["value"],
  ): types.polkadot_runtime.Event.Proxy {
    return { type: "Proxy", value }
  }
  export function Multisig(
    value: types.polkadot_runtime.Event.Multisig["value"],
  ): types.polkadot_runtime.Event.Multisig {
    return { type: "Multisig", value }
  }
  export function Bounties(
    value: types.polkadot_runtime.Event.Bounties["value"],
  ): types.polkadot_runtime.Event.Bounties {
    return { type: "Bounties", value }
  }
  export function ChildBounties(
    value: types.polkadot_runtime.Event.ChildBounties["value"],
  ): types.polkadot_runtime.Event.ChildBounties {
    return { type: "ChildBounties", value }
  }
  export function Tips(
    value: types.polkadot_runtime.Event.Tips["value"],
  ): types.polkadot_runtime.Event.Tips {
    return { type: "Tips", value }
  }
  export function ElectionProviderMultiPhase(
    value: types.polkadot_runtime.Event.ElectionProviderMultiPhase["value"],
  ): types.polkadot_runtime.Event.ElectionProviderMultiPhase {
    return { type: "ElectionProviderMultiPhase", value }
  }
  export function VoterList(
    value: types.polkadot_runtime.Event.VoterList["value"],
  ): types.polkadot_runtime.Event.VoterList {
    return { type: "VoterList", value }
  }
  export function NominationPools(
    value: types.polkadot_runtime.Event.NominationPools["value"],
  ): types.polkadot_runtime.Event.NominationPools {
    return { type: "NominationPools", value }
  }
  export function ParaInclusion(
    value: types.polkadot_runtime.Event.ParaInclusion["value"],
  ): types.polkadot_runtime.Event.ParaInclusion {
    return { type: "ParaInclusion", value }
  }
  export function Paras(
    value: types.polkadot_runtime.Event.Paras["value"],
  ): types.polkadot_runtime.Event.Paras {
    return { type: "Paras", value }
  }
  export function Ump(
    value: types.polkadot_runtime.Event.Ump["value"],
  ): types.polkadot_runtime.Event.Ump {
    return { type: "Ump", value }
  }
  export function Hrmp(
    value: types.polkadot_runtime.Event.Hrmp["value"],
  ): types.polkadot_runtime.Event.Hrmp {
    return { type: "Hrmp", value }
  }
  export function ParasDisputes(
    value: types.polkadot_runtime.Event.ParasDisputes["value"],
  ): types.polkadot_runtime.Event.ParasDisputes {
    return { type: "ParasDisputes", value }
  }
  export function Registrar(
    value: types.polkadot_runtime.Event.Registrar["value"],
  ): types.polkadot_runtime.Event.Registrar {
    return { type: "Registrar", value }
  }
  export function Slots(
    value: types.polkadot_runtime.Event.Slots["value"],
  ): types.polkadot_runtime.Event.Slots {
    return { type: "Slots", value }
  }
  export function Auctions(
    value: types.polkadot_runtime.Event.Auctions["value"],
  ): types.polkadot_runtime.Event.Auctions {
    return { type: "Auctions", value }
  }
  export function Crowdloan(
    value: types.polkadot_runtime.Event.Crowdloan["value"],
  ): types.polkadot_runtime.Event.Crowdloan {
    return { type: "Crowdloan", value }
  }
  export function XcmPallet(
    value: types.polkadot_runtime.Event.XcmPallet["value"],
  ): types.polkadot_runtime.Event.XcmPallet {
    return { type: "XcmPallet", value }
  }
}

export const $nposCompactSolution16: $.Codec<types.polkadot_runtime.NposCompactSolution16> =
  codecs.$312
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

export const $originCaller: $.Codec<types.polkadot_runtime.OriginCaller> = codecs.$255
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

export const $proxyType: $.Codec<types.polkadot_runtime.ProxyType> = codecs.$80
export type ProxyType =
  | "Any"
  | "NonTransfer"
  | "Governance"
  | "Staking"
  | "IdentityJudgement"
  | "CancelProxy"
  | "Auction"

export const $runtime: $.Codec<types.polkadot_runtime.Runtime> = codecs.$728
export type Runtime = null

export function Runtime() {
  return null
}

export const $sessionKeys: $.Codec<types.polkadot_runtime.SessionKeys> = codecs.$212
export interface SessionKeys {
  grandpa: types.sp_finality_grandpa.app.Public
  babe: types.sp_consensus_babe.app.Public
  imOnline: types.pallet_im_online.sr25519.app_sr25519.Public
  paraValidator: types.polkadot_primitives.v2.validator_app.Public
  paraAssignment: types.polkadot_primitives.v2.assignment_app.Public
  authorityDiscovery: types.sp_authority_discovery.app.Public
}

export function SessionKeys(value: types.polkadot_runtime.SessionKeys) {
  return value
}
