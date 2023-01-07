import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export * as pallet from "./pallet.ts"

export const $fundInfo: $.Codec<types.polkadot_runtime_common.crowdloan.FundInfo> = codecs.$702
export interface FundInfo {
  depositor: types.sp_core.crypto.AccountId32
  verifier: types.sp_runtime.MultiSigner | undefined
  deposit: types.u128
  raised: types.u128
  end: types.u32
  cap: types.u128
  lastContribution: types.polkadot_runtime_common.crowdloan.LastContribution
  firstPeriod: types.u32
  lastPeriod: types.u32
  fundIndex: types.u32
}

export function FundInfo(value: types.polkadot_runtime_common.crowdloan.FundInfo) {
  return value
}

export const $lastContribution: $.Codec<types.polkadot_runtime_common.crowdloan.LastContribution> =
  codecs.$703
export type LastContribution =
  | types.polkadot_runtime_common.crowdloan.LastContribution.Never
  | types.polkadot_runtime_common.crowdloan.LastContribution.PreEnding
  | types.polkadot_runtime_common.crowdloan.LastContribution.Ending
export namespace LastContribution {
  export interface Never {
    type: "Never"
  }
  export interface PreEnding {
    type: "PreEnding"
    value: types.u32
  }
  export interface Ending {
    type: "Ending"
    value: types.u32
  }
  export function Never(): types.polkadot_runtime_common.crowdloan.LastContribution.Never {
    return { type: "Never" }
  }
  export function PreEnding(
    value: types.polkadot_runtime_common.crowdloan.LastContribution.PreEnding["value"],
  ): types.polkadot_runtime_common.crowdloan.LastContribution.PreEnding {
    return { type: "PreEnding", value }
  }
  export function Ending(
    value: types.polkadot_runtime_common.crowdloan.LastContribution.Ending["value"],
  ): types.polkadot_runtime_common.crowdloan.LastContribution.Ending {
    return { type: "Ending", value }
  }
}
