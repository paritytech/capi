import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export const $voteThreshold: $.Codec<types.pallet_democracy.vote_threshold.VoteThreshold> =
  codecs.$63
export type VoteThreshold = "SuperMajorityApprove" | "SuperMajorityAgainst" | "SimpleMajority"
