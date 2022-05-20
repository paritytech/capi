export interface Block {
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
}

export interface Head {
  digest: {
    logs: string[];
  };
  extrinsicsRoot: string;
  number: string;
  parentHash: string;
  stateRoot: string;
}

export interface RuntimeVersion {
  specName: string;
  implName: string;
  authoringVersion: number;
  specVersion: number;
  implVersion: number;
  transactionVersion?: number;
  stateVersion?: number;
  apis: [string, number][];
}

export interface StorageChangeSet {
  block: string;
  changes: [string, string | undefined][];
}

export interface Cow {
  id: string;
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
  bestHash: string;
  bestNumber: number;
}

export interface NetworkConfig {
  totalAttempts: number;
  maxParallel: number;
  timeoutMs: number;
}
