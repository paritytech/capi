import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $voteThreshold: $.Codec<t.types.pallet_democracy.vote_threshold.VoteThreshold> =
  _codec.$62

export type VoteThreshold = "SuperMajorityApprove" | "SuperMajorityAgainst" | "SimpleMajority"
