import { $, C } from "../../../../../capi.ts"
import * as codecs from "../../../../../codecs.ts"
import type * as types from "../../../../mod.ts"

export interface WeightsPerClass {
  normal: types.frame_system.limits.WeightsPerClass
  operational: types.frame_system.limits.WeightsPerClass
  mandatory: types.frame_system.limits.WeightsPerClass
}

export function WeightsPerClass(
  value: types.frame_support.dispatch.PerDispatchClass.$$frame_system.limits.WeightsPerClass,
) {
  return value
}
