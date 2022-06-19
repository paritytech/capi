import { EnsureLookup } from "../util/types.ts";
import { LOOKUP } from "./generated.ts";

export type EnsureKnownLookup<
  T,
  L extends { [N in keyof LOOKUP]: T },
> = EnsureLookup<keyof LOOKUP, T, L>;
