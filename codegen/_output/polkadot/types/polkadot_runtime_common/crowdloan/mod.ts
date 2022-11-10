import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as t from "../../../mod.ts"

export * as pallet from "./pallet.ts"

export const $fundInfo: $.Codec<t.types.polkadot_runtime_common.crowdloan.FundInfo> = _codec.$710

export const $lastContribution: $.Codec<
  t.types.polkadot_runtime_common.crowdloan.LastContribution
> = _codec.$711

export interface FundInfo {
  depositor: t.types.sp_core.crypto.AccountId32
  verifier: t.types.sp_runtime.MultiSigner | undefined
  deposit: t.types.u128
  raised: t.types.u128
  end: t.types.u32
  cap: t.types.u128
  last_contribution: t.types.polkadot_runtime_common.crowdloan.LastContribution
  first_period: t.types.u32
  last_period: t.types.u32
  fund_index: t.types.u32
}

export function FundInfo(value: t.types.polkadot_runtime_common.crowdloan.FundInfo) {
  return value
}

export type LastContribution =
  | t.types.polkadot_runtime_common.crowdloan.LastContribution.Never
  | t.types.polkadot_runtime_common.crowdloan.LastContribution.PreEnding
  | t.types.polkadot_runtime_common.crowdloan.LastContribution.Ending
export namespace LastContribution {
  export interface Never {
    type: "Never"
  }
  export interface PreEnding {
    type: "PreEnding"
    value: t.types.u32
  }
  export interface Ending {
    type: "Ending"
    value: t.types.u32
  }
  export function Never(): t.types.polkadot_runtime_common.crowdloan.LastContribution.Never {
    return { type: "Never" }
  }
  export function PreEnding(
    value: t.types.polkadot_runtime_common.crowdloan.LastContribution.PreEnding["value"],
  ): t.types.polkadot_runtime_common.crowdloan.LastContribution.PreEnding {
    return { type: "PreEnding", value }
  }
  export function Ending(
    value: t.types.polkadot_runtime_common.crowdloan.LastContribution.Ending["value"],
  ): t.types.polkadot_runtime_common.crowdloan.LastContribution.Ending {
    return { type: "Ending", value }
  }
}
