import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export * as conviction from "./conviction.ts"
export * as pallet from "./pallet.ts"
export * as types from "./types.ts"
export * as vote from "./vote.ts"
export * as vote_threshold from "./vote_threshold.ts"

export const $preimageStatus: $.Codec<types.pallet_democracy.PreimageStatus> = codecs.$527
export type PreimageStatus =
  | types.pallet_democracy.PreimageStatus.Missing
  | types.pallet_democracy.PreimageStatus.Available
export namespace PreimageStatus {
  export interface Missing {
    type: "Missing"
    value: types.u32
  }
  export interface Available {
    type: "Available"
    data: Uint8Array
    provider: types.sp_core.crypto.AccountId32
    deposit: types.u128
    since: types.u32
    expiry: types.u32 | undefined
  }
  export function Missing(
    value: types.pallet_democracy.PreimageStatus.Missing["value"],
  ): types.pallet_democracy.PreimageStatus.Missing {
    return { type: "Missing", value }
  }
  export function Available(
    value: Omit<types.pallet_democracy.PreimageStatus.Available, "type">,
  ): types.pallet_democracy.PreimageStatus.Available {
    return { type: "Available", ...value }
  }
}

export const $releases: $.Codec<types.pallet_democracy.Releases> = codecs.$538
export type Releases = "V1"
