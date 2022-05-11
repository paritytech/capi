import * as u from "/util/mod.ts";
import * as m from "./Metadata.ts";

export type UnknownByTypeDefKind = { [Tag in m.TypeKind]: unknown };

export type TypeVisitor<
  Tag extends m.TypeKind,
  Results extends UnknownByTypeDefKind,
> = (
  this: TypeVisitors<Results>,
  typeDef: m.Type & { _tag: Tag },
) => Results[Tag];

export type TypeVisitors<Results extends UnknownByTypeDefKind> =
  & { [Tag in m.TypeKind]: TypeVisitor<Tag, Results> }
  & { visit: (i: number) => u.ValueOf<Results> };
