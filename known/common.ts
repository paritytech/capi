import { EnsureLookup } from "../util/types.ts";
import { Ss58Lookup } from "./generated.ts";

export type NetworkName = Ss58Lookup["network"];

export type EnsureKnownLookup<
  T,
  L extends { [N in NetworkName]: T },
> = EnsureLookup<NetworkName, T, L>;
