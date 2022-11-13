import { $ } from "../../../../../capi.ts"
import * as _codec from "../../../../../codecs.ts"
import type * as types from "../../../../../types/mod.ts"

export const $weightsPerClass: $.Codec<
  types.frame_support.dispatch.PerDispatchClass.$$frame_system.limits.WeightsPerClass
> = _codec.$166

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
