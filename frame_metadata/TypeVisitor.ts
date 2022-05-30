import * as U from "/util/mod.ts";
import * as M from "./Metadata.ts";

export type UnknownByTypeDefKind = { [Tag in M.TypeKind]: unknown };

export type TypeVisitor<
  Tag extends M.TypeKind,
  Misc extends unknown[],
  Results extends UnknownByTypeDefKind,
> = (
  this: TypeVisitors<Results, Misc>,
  typeDef: M.Type & { _tag: Tag },
  ...misc: Misc
) => Results[Tag];

export type TypeVisitors<
  Results extends UnknownByTypeDefKind,
  Misc extends unknown[] = [],
> =
  & { [Tag in M.TypeKind]: TypeVisitor<Tag, Misc, Results> }
  & { visit: (i: number, ...misc: Misc) => U.ValueOf<Results> };
