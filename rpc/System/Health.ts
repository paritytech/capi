import { call } from "/rpc/common.ts";
import * as s from "/system/mod.ts";

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
  Resource extends s.AnyEffectA<s.ResourceResolved<Beacon>>,
>(resource: Resource) => {
  return s.effect<SystemHealthResolved>()(
    "SystemHealth",
    { resource },
    (_, resolved) => {
      return call(resolved.resource, "system_health", isSystemHealthResolved);
    },
  );
};
