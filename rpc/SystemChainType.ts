import * as u from "/_/util/mod.ts";
import * as common from "/rpc/common.ts";
import * as sys from "/system/mod.ts";

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
  Resource extends sys.AnyEffectA<sys.ResourceResolved<Beacon>>,
>(resource: Resource) => {
  return sys.effect<string>()(
    "SystemChainType",
    { resource },
    async (_, resolved) => {
      return common.call(resolved.resource, "system_chainType", u.isStr);
    },
  );
};
