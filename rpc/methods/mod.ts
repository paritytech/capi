import * as u from "/_/util/mod.ts";
import { ChainGetBlockResult } from "./chain.ts";
import {
  SystemChainTypeResult,
  SystemHealthResult,
  SystemNodeRolesResult,
  SystemPropertiesResult,
  SystemSyncStateResult,
} from "./system.ts";

export * from "./chain.ts";
export * from "./system.ts";

export const enum MethodName {
  ChainGetBlock = "chain_getBlock",
  ChainGetBlockHash = "chain_getBlockHash",
  ChainGetFinalizedHead = "chain_getFinalizedHead",

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
  [MethodName.ChainGetBlock]: [[string], ChainGetBlockResult];
  [MethodName.ChainGetBlockHash]: [[string], string];
  [MethodName.ChainGetFinalizedHead]: [[string], string];

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
