import { assert } from "../_deps/asserts.ts";
import type * as M from "./Metadata.ts";
import { TyType } from "./scale_info.ts";
import { TyVisitors } from "./TyVisitor.ts";

export function toTsType(metadata: M.Metadata, tyI: number) {
  const visitors: TyVisitors<{ [_ in TyType]: string }> = {
    BitSequence(ty) {
      return "";
    },
    Compact(ty) {
      return "";
    },
    Primitive(ty) {
      return "";
    },
    Sequence(ty) {
      return "";
    },
    SizedArray(ty) {
      return "";
    },
    Struct(ty) {
      return "";
    },
    Tuple(ty) {
      return "";
    },
    Union(ty) {
      return "";
    },
    visit(i) {
      const ty = metadata.tys[i];
      assert(ty);
      return visitors[ty.type](ty as never);
    },
  };
  return visitors.visit(tyI);
}
