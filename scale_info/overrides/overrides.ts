import { Codec } from "../../deps/scale.ts"
import * as $ from "../../deps/scale.ts"
import { Ty } from "../raw/Ty.ts"
import { ChainError } from "./ChainError.ts"
import { $era } from "./Era.ts"

const isResult = new $.CodecVisitor<boolean>()
  .add($.result<any, any>, () => true)
  .fallback(() => false)

const isOption = new $.CodecVisitor<boolean>()
  .add($.option<any>, () => true)
  .fallback(() => false)

export const overrides: Record<string, (ty: Ty, visit: (i: number) => Codec<any>) => Codec<any>> = {
  Option: (ty, visit) => {
    let $some = visit(ty.params[0]!.ty!)
    if (isOption.visit($some)) {
      $some = $.tuple($some)
    }
    return $.option($some)
  },
  Result: (ty, visit) => {
    let $ok = visit(ty.params[0]!.ty!)
    if (isResult.visit($ok)) {
      $ok = $.tuple($ok)
    }
    return $.result(
      $ok,
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
