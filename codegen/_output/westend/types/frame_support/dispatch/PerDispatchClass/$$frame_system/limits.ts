import { $ } from "../../../../../capi.ts"
import * as _codec from "../../../../../codecs.ts"
import type * as t from "../../../../../mod.ts"

export const $weightsPerClass: $.Codec<
  t.types.frame_support.dispatch.PerDispatchClass.$$frame_system.limits.WeightsPerClass
> = _codec.$166

export interface WeightsPerClass {
  normal: t.types.frame_system.limits.WeightsPerClass
  operational: t.types.frame_system.limits.WeightsPerClass
  mandatory: t.types.frame_system.limits.WeightsPerClass
}

export function WeightsPerClass(
  value: t.types.frame_support.dispatch.PerDispatchClass.$$frame_system.limits.WeightsPerClass,
) {
  return value
}
