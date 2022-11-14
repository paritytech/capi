import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export type VoteThreshold = "SuperMajorityApprove" | "SuperMajorityAgainst" | "SimpleMajority"
