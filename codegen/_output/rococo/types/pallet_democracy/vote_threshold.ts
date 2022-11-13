import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as types from "../../types/mod.ts"

export const $voteThreshold: $.Codec<types.pallet_democracy.vote_threshold.VoteThreshold> =
  _codec.$62

export type VoteThreshold = "SuperMajorityApprove" | "SuperMajorityAgainst" | "SimpleMajority"
