import * as u from "/util/mod.ts";
import * as m from "./Metadata.ts";

export type UnknownByTypeDefKind = { [Tag in m.TypeKind]: unknown };

export type TypeVisitor<
  Tag extends m.TypeKind,
  Misc,
  Results extends UnknownByTypeDefKind,
> = (
  this: TypeVisitors<Results, Misc>,
  typeDef: m.Type & { _tag: Tag },
  misc?: unknown,
) => Results[Tag];

export type TypeVisitors<
  Results extends UnknownByTypeDefKind,
  Misc,
> =
  & { [Tag in m.TypeKind]: TypeVisitor<Tag, Misc, Results> }
  & { visit: (i: number) => u.ValueOf<Results> };
