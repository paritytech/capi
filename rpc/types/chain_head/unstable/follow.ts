import { HashHexString } from "/rpc/types/branded.ts";

export type ChainHeadUnstableFollowEvent =
  | ChainHeadUnstableFollowInitializedEvent
  | ChainHeadUnstableFollowNewBlockEvent
  | ChainHeadUnstableFollowBestBlockChangedEvent
  | ChainHeadUnstableFollowFinalizedEvent
  | ChainHeadUnstableFollowStopEvent;

export type ChainHeadUnstableFollowEventKind =
  | "initialized"
  | "newBlock"
  | "bestBlockChanged"
  | "finalized"
  | "stop";

interface ChainHeadUnstableFollowEventBase<Kind extends ChainHeadUnstableFollowEventKind> {
  event: Kind;
}

export interface ChainHeadUnstableFollowInitializedEvent extends ChainHeadUnstableFollowEventBase<"initialized"> {
  finalizedBlockHash: HashHexString;
  finalizedBlockRuntime: string;
}

export interface ChainHeadUnstableFollowNewBlockEvent extends ChainHeadUnstableFollowEventBase<"newBlock"> {
  blockHash: HashHexString;
  parentBlockHash: HashHexString;
  newRuntime: null; // TODO
}

export interface ChainHeadUnstableFollowBestBlockChangedEvent
  extends ChainHeadUnstableFollowEventBase<"bestBlockChanged">
{
  bestBlockHash: HashHexString;
}

export interface ChainHeadUnstableFollowFinalizedEvent extends ChainHeadUnstableFollowEventBase<"finalized"> {
  finalizedBlocksHashes: HashHexString[];
  prunedBlocksHashes: HashHexString[];
}

export type ChainHeadUnstableFollowStopEvent = ChainHeadUnstableFollowEventBase<"stop">;

export type MaybeRuntimeSpec = {
  type: "valid";
  spec: RuntimeSpec;
} | {
  type: "invalid";
  error: string;
};

export interface RuntimeSpec {
  specName: string;
  implName: string;
  authoringVersion: number;
  specVersion: number;
  implVersion: number;
  transactionVersion?: number;
  // TODO: type this as the Serde-serialized form of `hashbrown::HashMap`
  apis: unknown;
}
