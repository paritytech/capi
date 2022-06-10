import * as U from "../../util/mod.ts";

export interface Block {
  block: {
    header: Header;
    extrinsics: U.HexString[];
  };
  justifications?: [number[], number[]][];
}

export interface HeaderDigest {
  logs: U.HexString[];
}

export interface Header {
  digest: HeaderDigest;
  extrinsicsRoot: U.HashHexString;
  number: U.HexU64String;
  parentHash: U.HashHexString;
  stateRoot: U.HashHexString;
}

export interface RuntimeVersion {
  specName: string;
  implName: string;
  authoringVersion: number;
  specVersion: number;
  implVersion: number;
  transactionVersion?: number;
  stateVersion?: number;
  apis: [U.HexString, number][];
}

export interface StorageChangeSet {
  block: U.HashHexString;
  changes: [U.HexString, U.HexString | undefined][];
}

export interface SystemHealth {
  isSyncing: boolean;
  peers: number;
  shouldHavePeers: boolean;
}

export const enum SystemPeerRole {
  Authority = "AUTHORITY",
  FULL = "FULL",
  LIGHT = "LIGHT",
}

export interface SystemPeer {
  peerId: string;
  roles: SystemPeerRole;
  bestHash: U.HashHexString;
  bestNumber: number;
}

export interface NetworkConfig {
  totalAttempts: number;
  maxParallel: number;
  timeoutMs: number;
}

export interface RpcMethods {
  version: bigint;
  methods: string[];
}
