import * as common from "/rpc/common.ts";
import * as sys from "/system/mod.ts";

export interface SystemHealthResolved {
  isSyncing: boolean;
  peers: number;
  shouldHavePeers: boolean;
}

export const isSystemHealthResolved = (inQuestion: any): inQuestion is SystemHealthResolved => {
  return typeof inQuestion.isSyncing === "boolean"
    && typeof inQuestion.peers === "number"
    && typeof inQuestion.shouldHavePeers === "boolean";
};

export const SystemHealth = <
  Beacon,
  Resource extends sys.AnyEffectA<sys.ResourceResolved<Beacon>>,
>(resource: Resource) => {
  return sys.effect<SystemHealthResolved>()(
    "SystemHealth",
    { resource },
    async (_, resolved) => {
      return common.call(resolved.resource, "system_health", isSystemHealthResolved);
    },
  );
};
