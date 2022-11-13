import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export const $accountVote: $.Codec<types.pallet_democracy.vote.AccountVote> = _codec.$63

export const $priorLock: $.Codec<types.pallet_democracy.vote.PriorLock> = _codec.$541

export const $vote: $.Codec<types.pallet_democracy.vote.Vote> = _codec.$64

export const $voting: $.Codec<types.pallet_democracy.vote.Voting> = _codec.$536

export type AccountVote =
  | types.pallet_democracy.vote.AccountVote.Standard
  | types.pallet_democracy.vote.AccountVote.Split
export namespace AccountVote {
  export interface Standard {
    type: "Standard"
    vote: types.pallet_democracy.vote.Vote
    balance: types.u128
  }
  export interface Split {
    type: "Split"
    aye: types.u128
    nay: types.u128
  }
  export function Standard(
    value: Omit<types.pallet_democracy.vote.AccountVote.Standard, "type">,
  ): types.pallet_democracy.vote.AccountVote.Standard {
    return { type: "Standard", ...value }
  }
  export function Split(
    value: Omit<types.pallet_democracy.vote.AccountVote.Split, "type">,
  ): types.pallet_democracy.vote.AccountVote.Split {
    return { type: "Split", ...value }
  }
}

export type PriorLock = [types.u32, types.u128]

export function PriorLock(...value: types.pallet_democracy.vote.PriorLock) {
  return value
}

export type Vote = types.u8

export function Vote(value: types.pallet_democracy.vote.Vote) {
  return value
}

export type Voting =
  | types.pallet_democracy.vote.Voting.Direct
  | types.pallet_democracy.vote.Voting.Delegating
export namespace Voting {
  export interface Direct {
    type: "Direct"
    votes: Array<[types.u32, types.pallet_democracy.vote.AccountVote]>
    delegations: types.pallet_democracy.types.Delegations
    prior: types.pallet_democracy.vote.PriorLock
  }
  export interface Delegating {
    type: "Delegating"
    balance: types.u128
    target: types.sp_core.crypto.AccountId32
    conviction: types.pallet_democracy.conviction.Conviction
    delegations: types.pallet_democracy.types.Delegations
    prior: types.pallet_democracy.vote.PriorLock
  }
  export function Direct(
    value: Omit<types.pallet_democracy.vote.Voting.Direct, "type">,
  ): types.pallet_democracy.vote.Voting.Direct {
    return { type: "Direct", ...value }
  }
  export function Delegating(
    value: Omit<types.pallet_democracy.vote.Voting.Delegating, "type">,
  ): types.pallet_democracy.vote.Voting.Delegating {
    return { type: "Delegating", ...value }
  }
}
