import * as u from "/_/util/mod.ts";

export const enum MethodName {
  ChainGetBlock = "chain_getBlock",
  ChainGetBlockHash = "chain_getBlockHash",
  ChainGetFinalizedHead = "chain_getFinalizedHead",
  ChainSubscribeAllHeads = "chain_subscribeAllHeads",

  SystemChain = "system_chain",
  SystemChainType = "system_chainType",
  SystemHealth = "system_health",
  SystemLocalListenAddresses = "system_localListenAddresses",
  SystemLocalPeerId = "system_localPeerId",
  SystemName = "system_name",
  SystemNodeRoles = "system_nodeRoles",
  SystemProperties = "system_properties",
  SystemReservedPeers = "system_reservedPeers",
  SystemSyncState = "system_syncState",
  SystemVersion = "system_version",

  StateGetMetadata = "state_getMetadata",
  StateGetStorage = "state_getStorage",
}

export type IoLookup = u.EnsureLookup<MethodName, [string[], unknown], {
  [MethodName.ChainGetBlock]: [[] | [string], ChainGetBlockResult];
  [MethodName.ChainGetBlockHash]: [[string], string];
  [MethodName.ChainGetFinalizedHead]: [[string], string];
  [MethodName.ChainSubscribeAllHeads]: [[], unknown];

  [MethodName.SystemChain]: [[], string];
  [MethodName.SystemChainType]: [[], SystemChainTypeResult];
  [MethodName.SystemHealth]: [[], SystemHealthResult];
  [MethodName.SystemLocalListenAddresses]: [[], string[]];
  [MethodName.SystemLocalPeerId]: [[], string];
  [MethodName.SystemName]: [[], string];
  [MethodName.SystemNodeRoles]: [[], SystemNodeRolesResult];
  [MethodName.SystemProperties]: [[], SystemPropertiesResult];
  [MethodName.SystemReservedPeers]: [[], unknown[]]; // TODO: type this
  [MethodName.SystemSyncState]: [[], SystemSyncStateResult];
  [MethodName.SystemVersion]: [[], string];

  [MethodName.StateGetMetadata]: [[string], string];
  [MethodName.StateGetStorage]: [[string], string];
}>;

// TODO: how do we differentiate blocks from signed blocks?
export interface ChainGetBlockResult {
  block: {
    extrinsics: string[];
    header: {
      digest: {
        logs: string[];
      };
      extrinsicsRoot: string;
      number: string;
      parentHash: string;
      stateRoot: string;
    };
  };
  justifications: null; // TODO...
}

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
