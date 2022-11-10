import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $accountVote: $.Codec<t.types.pallet_democracy.vote.AccountVote> = _codec.$63

export const $priorLock: $.Codec<t.types.pallet_democracy.vote.PriorLock> = _codec.$541

export const $vote: $.Codec<t.types.pallet_democracy.vote.Vote> = _codec.$64

export const $voting: $.Codec<t.types.pallet_democracy.vote.Voting> = _codec.$536

export type AccountVote =
  | t.types.pallet_democracy.vote.AccountVote.Standard
  | t.types.pallet_democracy.vote.AccountVote.Split
export namespace AccountVote {
  export interface Standard {
    type: "Standard"
    vote: t.types.pallet_democracy.vote.Vote
    balance: t.types.u128
  }
  export interface Split {
    type: "Split"
    aye: t.types.u128
    nay: t.types.u128
  }
  export function Standard(
    value: Omit<t.types.pallet_democracy.vote.AccountVote.Standard, "type">,
  ): t.types.pallet_democracy.vote.AccountVote.Standard {
    return { type: "Standard", ...value }
  }
  export function Split(
    value: Omit<t.types.pallet_democracy.vote.AccountVote.Split, "type">,
  ): t.types.pallet_democracy.vote.AccountVote.Split {
    return { type: "Split", ...value }
  }
}

export type PriorLock = [t.types.u32, t.types.u128]

export function PriorLock(...value: t.types.pallet_democracy.vote.PriorLock) {
  return value
}

export type Vote = t.types.u8

export function Vote(value: t.types.pallet_democracy.vote.Vote) {
  return value
}

export type Voting =
  | t.types.pallet_democracy.vote.Voting.Direct
  | t.types.pallet_democracy.vote.Voting.Delegating
export namespace Voting {
  export interface Direct {
    type: "Direct"
    votes: Array<[t.types.u32, t.types.pallet_democracy.vote.AccountVote]>
    delegations: t.types.pallet_democracy.types.Delegations
    prior: t.types.pallet_democracy.vote.PriorLock
  }
  export interface Delegating {
    type: "Delegating"
    balance: t.types.u128
    target: t.types.sp_core.crypto.AccountId32
    conviction: t.types.pallet_democracy.conviction.Conviction
    delegations: t.types.pallet_democracy.types.Delegations
    prior: t.types.pallet_democracy.vote.PriorLock
  }
  export function Direct(
    value: Omit<t.types.pallet_democracy.vote.Voting.Direct, "type">,
  ): t.types.pallet_democracy.vote.Voting.Direct {
    return { type: "Direct", ...value }
  }
  export function Delegating(
    value: Omit<t.types.pallet_democracy.vote.Voting.Delegating, "type">,
  ): t.types.pallet_democracy.vote.Voting.Delegating {
    return { type: "Delegating", ...value }
  }
}
