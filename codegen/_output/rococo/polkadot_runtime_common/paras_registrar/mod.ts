import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export * as pallet from "./pallet.ts"

export const $paraInfo: $.Codec<t.polkadot_runtime_common.paras_registrar.ParaInfo> = _codec.$701

export interface ParaInfo {
  manager: t.sp_core.crypto.AccountId32
  deposit: t.u128
  locked: boolean
}

export function ParaInfo(value: t.polkadot_runtime_common.paras_registrar.ParaInfo) {
  return value
}
