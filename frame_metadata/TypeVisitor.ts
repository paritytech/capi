import * as u from "/util/mod.ts";
import * as m from "./Metadata.ts";

export type UnknownByTypeDefKind = { [Tag in m.TypeKind]: unknown };

export type TypeVisitor<
  Tag extends m.TypeKind,
  Misc extends unknown[],
  Results extends UnknownByTypeDefKind,
> = (
  this: TypeVisitors<Results, Misc>,
  typeDef: m.Type & { _tag: Tag },
  ...misc: Misc
) => Results[Tag];

export type TypeVisitors<
  Results extends UnknownByTypeDefKind,
  Misc extends unknown[] = [],
> =
  & { [Tag in m.TypeKind]: TypeVisitor<Tag, Misc, Results> }
  & { visit: (i: number, ...misc: Misc) => u.ValueOf<Results> };
