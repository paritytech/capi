import { Flatten, ValueOf } from "./types.ts";

export type TaggedUnion<
  TagKey extends PropertyKey,
  Tag extends PropertyKey,
  T extends {
    [_ in Tag]: Record<PropertyKey, any>;
  },
> = ValueOf<
  {
    [K in Tag]: Flatten<
      & { [_ in TagKey]: K }
      & T[K]
    >;
  }
>;
