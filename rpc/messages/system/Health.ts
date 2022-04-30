import { InitBase, ResBase } from "../common.ts";

export type SystemHealthInit = InitBase<"system_health">;

export type SystemHealthRes = ResBase<{
  isSyncing: boolean;
  peers: number;
  shouldHavePeers: boolean;
}>;
