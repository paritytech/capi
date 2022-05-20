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
  finalizedBlockHash: string;
  finalizedBlockRuntime: string;
}

export interface ChainHeadUnstableFollowNewBlockEvent extends ChainHeadUnstableFollowEventBase<"newBlock"> {
  blockHash: string;
  parentBlockHash: string;
  newRuntime: null; // TODO
}

export interface ChainHeadUnstableFollowBestBlockChangedEvent
  extends ChainHeadUnstableFollowEventBase<"bestBlockChanged">
{
  bestBlockHash: string;
}

export interface ChainHeadUnstableFollowFinalizedEvent extends ChainHeadUnstableFollowEventBase<"finalized"> {
  finalizedBlocksHashes: string[];
  prunedBlocksHashes: string[];
}

export type ChainHeadUnstableFollowStopEvent = ChainHeadUnstableFollowEventBase<"stop">;
