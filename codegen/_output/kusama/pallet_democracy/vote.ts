import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

export const $accountVote: $.Codec<t.pallet_democracy.vote.AccountVote> = _codec.$63

export const $priorLock: $.Codec<t.pallet_democracy.vote.PriorLock> = _codec.$541

export const $vote: $.Codec<t.pallet_democracy.vote.Vote> = _codec.$64

export const $voting: $.Codec<t.pallet_democracy.vote.Voting> = _codec.$536

export type AccountVote =
  | t.pallet_democracy.vote.AccountVote.Standard
  | t.pallet_democracy.vote.AccountVote.Split
export namespace AccountVote {
  export interface Standard {
    type: "Standard"
    vote: t.pallet_democracy.vote.Vote
    balance: t.u128
  }
  export interface Split {
    type: "Split"
    aye: t.u128
    nay: t.u128
  }
  export function Standard(
    value: Omit<t.pallet_democracy.vote.AccountVote.Standard, "type">,
  ): t.pallet_democracy.vote.AccountVote.Standard {
    return { type: "Standard", ...value }
  }
  export function Split(
    value: Omit<t.pallet_democracy.vote.AccountVote.Split, "type">,
  ): t.pallet_democracy.vote.AccountVote.Split {
    return { type: "Split", ...value }
  }
}

export type PriorLock = [t.u32, t.u128]

export function PriorLock(...value: t.pallet_democracy.vote.PriorLock) {
  return value
}

export type Vote = t.u8

export function Vote(value: t.pallet_democracy.vote.Vote) {
  return value
}

export type Voting =
  | t.pallet_democracy.vote.Voting.Direct
  | t.pallet_democracy.vote.Voting.Delegating
export namespace Voting {
  export interface Direct {
    type: "Direct"
    votes: Array<[t.u32, t.pallet_democracy.vote.AccountVote]>
    delegations: t.pallet_democracy.types.Delegations
    prior: t.pallet_democracy.vote.PriorLock
  }
  export interface Delegating {
    type: "Delegating"
    balance: t.u128
    target: t.sp_core.crypto.AccountId32
    conviction: t.pallet_democracy.conviction.Conviction
    delegations: t.pallet_democracy.types.Delegations
    prior: t.pallet_democracy.vote.PriorLock
  }
  export function Direct(
    value: Omit<t.pallet_democracy.vote.Voting.Direct, "type">,
  ): t.pallet_democracy.vote.Voting.Direct {
    return { type: "Direct", ...value }
  }
  export function Delegating(
    value: Omit<t.pallet_democracy.vote.Voting.Delegating, "type">,
  ): t.pallet_democracy.vote.Voting.Delegating {
    return { type: "Delegating", ...value }
  }
}
