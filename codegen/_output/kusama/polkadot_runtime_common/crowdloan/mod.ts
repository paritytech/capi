import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as pallet from "./pallet.ts"

export const $fundInfo: $.Codec<t.polkadot_runtime_common.crowdloan.FundInfo> = _codec.$710

export const $lastContribution: $.Codec<t.polkadot_runtime_common.crowdloan.LastContribution> =
  _codec.$711

export interface FundInfo {
  depositor: t.sp_core.crypto.AccountId32
  verifier: t.sp_runtime.MultiSigner | undefined
  deposit: t.u128
  raised: t.u128
  end: t.u32
  cap: t.u128
  last_contribution: t.polkadot_runtime_common.crowdloan.LastContribution
  first_period: t.u32
  last_period: t.u32
  fund_index: t.u32
}

export function FundInfo(value: t.polkadot_runtime_common.crowdloan.FundInfo) {
  return value
}

export type LastContribution =
  | t.polkadot_runtime_common.crowdloan.LastContribution.Never
  | t.polkadot_runtime_common.crowdloan.LastContribution.PreEnding
  | t.polkadot_runtime_common.crowdloan.LastContribution.Ending
export namespace LastContribution {
  export interface Never {
    type: "Never"
  }
  export interface PreEnding {
    type: "PreEnding"
    value: t.u32
  }
  export interface Ending {
    type: "Ending"
    value: t.u32
  }
  export function Never(): t.polkadot_runtime_common.crowdloan.LastContribution.Never {
    return { type: "Never" }
  }
  export function PreEnding(
    value: t.polkadot_runtime_common.crowdloan.LastContribution.PreEnding["value"],
  ): t.polkadot_runtime_common.crowdloan.LastContribution.PreEnding {
    return { type: "PreEnding", value }
  }
  export function Ending(
    value: t.polkadot_runtime_common.crowdloan.LastContribution.Ending["value"],
  ): t.polkadot_runtime_common.crowdloan.LastContribution.Ending {
    return { type: "Ending", value }
  }
}
