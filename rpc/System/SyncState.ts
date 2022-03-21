import { call } from "/rpc/common.ts";
import * as s from "/system/mod.ts";

export interface SystemSyncStateResolved {
  currentBlock: number;
  highestBlock: number;
  startingBlock: number;
}

export const isSystemSyncStateResolved = (inQuestion: any): inQuestion is SystemSyncStateResolved => {
  return typeof inQuestion.currentBlock === "number"
    && typeof inQuestion.highestBlock === "number"
    && typeof inQuestion.startingBlock === "number";
};

export const SystemSyncState = <
  Beacon,
  Resource extends s.AnyEffectA<s.ResourceResolved<Beacon>>,
>(resource: Resource) => {
  return s.effect<SystemSyncStateResolved>()(
    "SystemSyncState",
    { resource },
    (_, resolved) => {
      return call(resolved.resource, "system_syncState", isSystemSyncStateResolved);
    },
  );
};
