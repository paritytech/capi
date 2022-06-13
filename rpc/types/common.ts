import * as B from "../../branded.ts";

export interface Block {
  block: {
    header: Header;
    extrinsics: B.HexString[];
  };
  justifications?: [number[], number[]][];
}

export interface HeaderDigest {
  logs: B.HexString[];
}

export interface Header {
  digest: HeaderDigest;
  extrinsicsRoot: B.HashHexString;
  number: B.HexU64String;
  parentHash: B.HashHexString;
  stateRoot: B.HashHexString;
}

export interface RuntimeVersion {
  specName: string;
  implName: string;
  authoringVersion: number;
  specVersion: number;
  implVersion: number;
  transactionVersion?: number;
  stateVersion?: number;
  apis: [B.HexString, number][];
}

export interface StorageChangeSet {
  block: B.HashHexString;
  changes: [B.HexString, B.HexString | undefined][];
}

export interface SystemHealth {
  isSyncing: boolean;
  peers: number;
  shouldHavePeers: boolean;
}

export type SystemPeerRole =
  | "AUTHORITY"
  | "FULL"
  | "LIGHT";

export interface SystemPeer {
  peerId: string;
  roles: SystemPeerRole;
  bestHash: B.HashHexString;
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
