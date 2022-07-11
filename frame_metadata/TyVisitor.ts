import * as U from "../util/mod.ts";
import { Ty, TyType } from "./scale_info.ts";

export type UnknownByTyDefKind = { [Type in TyType]: unknown };

export type TyVisitor<
  Type extends TyType,
  Misc extends unknown[],
  Results extends UnknownByTyDefKind,
> = (
  this: TyVisitors<Results, Misc>,
  typeDef: Ty & { type: Type },
  ...misc: Misc
) => Results[Type];

export type TyVisitors<
  Results extends UnknownByTyDefKind,
  Misc extends unknown[] = [],
> =
  & { [Tag in TyType]: TyVisitor<Tag, Misc, Results> }
  & { visit: (i: number, ...misc: Misc) => U.ValueOf<Results> };
