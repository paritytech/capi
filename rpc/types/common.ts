import * as U from "../../util/mod.ts";

export interface Block {
  block: {
    header: Header;
    extrinsics: U.Hex[];
  };
  justifications?: [number[], number[]][];
}

export interface HeaderDigest {
  logs: U.Hex[];
}

export interface Header {
  digest: HeaderDigest;
  extrinsicsRoot: U.HexHash;
  number: U.U64;
  parentHash: U.HexHash;
  stateRoot: U.HexHash;
}

export interface RuntimeVersion {
  specName: string;
  implName: string;
  authoringVersion: number;
  specVersion: number;
  implVersion: number;
  transactionVersion?: number;
  stateVersion?: number;
  apis: [U.Hex, number][];
}

export interface StorageChangeSet {
  block: U.HexHash;
  changes: [U.Hex, U.Hex | undefined][];
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
  bestHash: U.HexHash;
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
