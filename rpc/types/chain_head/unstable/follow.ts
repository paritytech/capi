import * as U from "../../../../util/mod.ts";

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

export interface ChainHeadUnstableFollowInitializedEvent
  extends ChainHeadUnstableFollowEventBase<"initialized">
{
  finalizedBlockHash: U.HashHexString;
  finalizedBlockRuntime: string;
}

export interface ChainHeadUnstableFollowNewBlockEvent
  extends ChainHeadUnstableFollowEventBase<"newBlock">
{
  blockHash: U.HashHexString;
  parentBlockHash: U.HashHexString;
  newRuntime: null; // TODO
}

export interface ChainHeadUnstableFollowBestBlockChangedEvent
  extends ChainHeadUnstableFollowEventBase<"bestBlockChanged">
{
  bestBlockHash: U.HashHexString;
}

export interface ChainHeadUnstableFollowFinalizedEvent
  extends ChainHeadUnstableFollowEventBase<"finalized">
{
  finalizedBlocksHashes: U.HashHexString[];
  prunedBlocksHashes: U.HashHexString[];
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
