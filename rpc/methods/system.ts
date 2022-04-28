export const enum SystemChainTypeResult {
  Development = "Development",
  Local = "Local",
  Live = "Live",
  Custom = "Custom",
}

export interface SystemHealthResult {
  isSyncing: boolean;
  peers: number;
  shouldHavePeers: boolean;
}

export enum SystemNodeRoleKind {
  Full = "Full",
  LightClient = "LightClient",
  Authority = "Authority",
}
// TODO: narrow to possible sets
export type SystemNodeRolesResult = SystemNodeRoleKind[];

export interface SystemPropertiesResult {
  // TODO: literally-type this
  ss58Format: number;
  tokenDecimals: number;
  tokenSymbol: string;
}

export interface SystemSyncStateResult {
  currentBlock: number;
  highestBlock: number;
  startingBlock: number;
}
