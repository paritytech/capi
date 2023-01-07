import { $, C } from "../../../capi.ts"
import * as codecs from "../../../codecs.ts"
import type * as types from "../../mod.ts"

export * as pallet from "./pallet.ts"

export const $paraInfo: $.Codec<types.polkadot_runtime_common.paras_registrar.ParaInfo> =
  codecs.$693
export interface ParaInfo {
  manager: types.sp_core.crypto.AccountId32
  deposit: types.u128
  locked: boolean
}

export function ParaInfo(value: types.polkadot_runtime_common.paras_registrar.ParaInfo) {
  return value
}
