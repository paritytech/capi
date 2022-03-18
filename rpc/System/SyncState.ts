import * as common from "/rpc/common.ts";
import * as sys from "/system/mod.ts";

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
  Resource extends sys.AnyEffectA<sys.ResourceResolved<Beacon>>,
>(resource: Resource) => {
  return sys.effect<SystemSyncStateResolved>()(
    "SystemSyncState",
    { resource },
    (_, resolved) => {
      return common.call(resolved.resource, "system_syncState", isSystemSyncStateResolved);
    },
  );
};
