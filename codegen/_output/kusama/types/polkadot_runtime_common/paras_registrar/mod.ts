import { $ } from "../../../capi.ts"
import * as _codec from "../../../codecs.ts"
import type * as types from "../../../types/mod.ts"

export * as pallet from "./pallet.ts"

export const $paraInfo: $.Codec<types.polkadot_runtime_common.paras_registrar.ParaInfo> =
  _codec.$701

export interface ParaInfo {
  manager: types.sp_core.crypto.AccountId32
  deposit: types.u128
  locked: boolean
}

export function ParaInfo(value: types.polkadot_runtime_common.paras_registrar.ParaInfo) {
  return value
}
