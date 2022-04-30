import { InitBase, NotifBase, ResBase } from "../../common.ts";

export type ChainHeadUnstableFollowInit = InitBase<"chainHead_unstable_follow", [runtime_updates: boolean]>;

export type ChainHeadUnstableFollowRes = ResBase<{ id: string }>;

export type ChainHeadUnstableFollowNotif = NotifBase<"chainHead_unstable_follow", ChainHeadUnstableFollowEvent>;

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
