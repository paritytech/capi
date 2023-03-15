import { Codec } from "../../deps/scale.ts"
import * as $ from "../../deps/scale.ts"
import { Ty } from "../raw/Ty.ts"
import { ChainError } from "./ChainError.ts"
import { $era } from "./Era.ts"

export const overrides: Record<string, (ty: Ty, visit: (i: number) => Codec<any>) => Codec<any>> = {
  Option: (ty, visit) => {
    return $.option(visit(ty.params[0]!.ty!))
  },
  Result: (ty, visit) => {
    return $.result(
      visit(ty.params[0]!.ty!),
      $.instance(
        ChainError,
        $.tuple(visit(ty.params[1]!.ty!)),
        ChainError.toArgs,
      ),
    )
  },
  BTreeMap: (ty, visit) => {
    return $.map(visit(ty.params[0]!.ty!), visit(ty.params[1]!.ty!))
  },
  BTreeSet: (ty, visit) => {
    return $.set(visit(ty.params[0]!.ty!))
  },
  "frame_support::traits::misc::WrapperOpaque": (ty, visit) => {
    return $.lenPrefixed(visit(ty.params[0]!.ty!))
  },
  "frame_support::traits::misc::WrapperKeepOpaque": (ty, visit) => {
    return $.lenPrefixed(visit(ty.params[0]!.ty!))
  },
  "sp_runtime::generic::era::Era": () => {
    return $era
  },
}
