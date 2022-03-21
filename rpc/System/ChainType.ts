import * as u from "/_/util/mod.ts";
import { call } from "/rpc/common.ts";
import * as s from "/system/mod.ts";

// // TODO: do we want to type the ok value as a tagged union instead?
// export enum ChainTypeKind {
//   Development = "Development",
//   Local = "Local",
//   Live = "Live",
//   Custom = "Custom",
// }
// export type ChainType =
//   | u.TagBearer<ChainTypeKind.Development>
//   | u.TagBearer<ChainTypeKind.Local>
//   | u.TagBearer<ChainTypeKind.Live>
//   | u.TagBearer<ChainTypeKind.Custom> & { custom: string };

export const SystemChainType = <
  Beacon,
  Resource extends s.AnyEffectA<s.ResourceResolved<Beacon>>,
>(resource: Resource) => {
  return s.effect<string>()(
    "SystemChainType",
    { resource },
    (_, resolved) => {
      return call(resolved.resource, "system_chainType", u.isStr);
    },
  );
};
