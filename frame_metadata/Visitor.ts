import { LookupOf, TagBearer } from "/_/util/mod.ts";
import * as V14 from "/frame_metadata/V14.ts";

export type TypeDefVisitorMethod<Tag extends V14.TypeDefKind, Results extends LookupOf<V14.TypeDefKind>> = (
  this: TypeDefVisitor<Results>,
  typeDef: V14.TypeDef & TagBearer<Tag>,
) => Results[Tag];

export type TypeDefVisitor<Results extends LookupOf<V14.TypeDefKind>> = {
  [Tag in V14.TypeDefKind]: TypeDefVisitorMethod<Tag, Results>;
};
