import { TagBearer } from "/_/util/bearer.ts";
import * as V14 from "/frame_metadata/V14.ts";

export type UnknownByTypeDefKind = { [Tag in V14.TypeDefKind]: unknown };
export type EnsureAllTypeDefKindsAccountedFor<T extends UnknownByTypeDefKind> = T;

export type StorageTransformer<Tag extends V14.TypeDefKind, Results extends UnknownByTypeDefKind> = (
  this: StorageTransformers<Results>,
  typeDef: V14.TypeDef & TagBearer<Tag>,
) => Results[Tag];

export type StorageTransformers<Results extends UnknownByTypeDefKind> = {
  [Tag in V14.TypeDefKind]: StorageTransformer<Tag, Results>;
};
