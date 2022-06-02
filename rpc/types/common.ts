import { HashHexString, HexString, HexU64 } from "./branded.ts";

export interface Block {
  block: {
    header: Header;
    extrinsics: HexString[];
  };
  justifications?: [number[], number[]][];
}

export interface HeaderDigest {
  logs: HexString[];
}

export interface Header {
  digest: HeaderDigest;
  extrinsicsRoot: HashHexString;
  number: HexU64;
  parentHash: HashHexString;
  stateRoot: HashHexString;
}

export interface RuntimeVersion {
  specName: string;
  implName: string;
  authoringVersion: number;
  specVersion: number;
  implVersion: number;
  transactionVersion?: number;
  stateVersion?: number;
  apis: [HexString, number][];
}

export interface StorageChangeSet {
  block: HashHexString;
  changes: [HexString, HexString | undefined][];
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
  bestHash: HashHexString;
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
