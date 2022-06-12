import * as U from "../util/mod.ts";
import * as M from "./Metadata.ts";

export type UnknownByTyDefKind = { [Type in M.TyType]: unknown };

export type TyVisitor<
  Type extends M.TyType,
  Misc extends unknown[],
  Results extends UnknownByTyDefKind,
> = (
  this: TyVisitors<Results, Misc>,
  typeDef: M.Ty & { type: Type },
  ...misc: Misc
) => Results[Type];

export type TyVisitors<
  Results extends UnknownByTyDefKind,
  Misc extends unknown[] = [],
> =
  & { [Tag in M.TyType]: TyVisitor<Tag, Misc, Results> }
  & { visit: (i: number, ...misc: Misc) => U.ValueOf<Results> };
