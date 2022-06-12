import * as U from "../util/mod.ts";
import * as M from "./Metadata.ts";

export type UnknownByTypeDefKind = { [Tag in M.TyType]: unknown };

export type TypeVisitor<
  Tag extends M.TyType,
  Misc extends unknown[],
  Results extends UnknownByTypeDefKind,
> = (
  this: TypeVisitors<Results, Misc>,
  typeDef: M.Ty & { type: Tag },
  ...misc: Misc
) => Results[Tag];

export type TypeVisitors<
  Results extends UnknownByTypeDefKind,
  Misc extends unknown[] = [],
> =
  & { [Tag in M.TyType]: TypeVisitor<Tag, Misc, Results> }
  & { visit: (i: number, ...misc: Misc) => U.ValueOf<Results> };
