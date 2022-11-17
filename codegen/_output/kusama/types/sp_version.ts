import { $, C } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "./mod.ts"

export interface RuntimeVersion {
  specName: string
  implName: string
  authoringVersion: types.u32
  specVersion: types.u32
  implVersion: types.u32
  apis: Array<[Uint8Array, types.u32]>
  transactionVersion: types.u32
  stateVersion: types.u8
}

export function RuntimeVersion(value: types.sp_version.RuntimeVersion) {
  return value
}
