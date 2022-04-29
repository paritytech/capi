import { EgressMessageBase, IngressOpaqueMessage, MethodName } from "../../common.ts";

export type ChainHeadUnstableFollowEgressMessage = EgressMessageBase<
  MethodName.ChainHeadUnstableFollow,
  [runtime_updates: boolean]
>;

export type ChainHeadUnstableFollowIngressMessage = IngressOpaqueMessage<{
  id: string;
}>;

export type ChainHeadUnstableFollowIngressNotificationMessage =
  | ChainHeadUnstableFollowInitializedEvent
  | ChainHeadUnstableFollowNewBlockEvent
  | ChainHeadUnstableFollowBestBlockChangedEvent
  | ChainHeadUnstableFollowFinalizedEvent
  | ChainHeadUnstableFollowStopEvent;

export const enum ChainHeadUnstableFollowEventKind {
  Initialized = "initialized",
  NewBlock = "newBlock",
  BestBlockChanged = "bestBlockChanged",
  Finalized = "finalized",
  Stop = "stop",
}

interface ChainHeadUnstableFollowEventBase<Kind extends ChainHeadUnstableFollowEventKind> {
  event: Kind;
}

export interface ChainHeadUnstableFollowInitializedEvent
  extends ChainHeadUnstableFollowEventBase<ChainHeadUnstableFollowEventKind.Initialized>
{
  finalizedBlockHash: string;
  finalizedBlockRuntime: string;
}

export interface ChainHeadUnstableFollowNewBlockEvent
  extends ChainHeadUnstableFollowEventBase<ChainHeadUnstableFollowEventKind.NewBlock>
{
  blockHash: string;
  parentBlockHash: string;
  newRuntime: null; // TODO
}

export interface ChainHeadUnstableFollowBestBlockChangedEvent
  extends ChainHeadUnstableFollowEventBase<ChainHeadUnstableFollowEventKind.BestBlockChanged>
{
  bestBlockHash: string;
}

export interface ChainHeadUnstableFollowFinalizedEvent
  extends ChainHeadUnstableFollowEventBase<ChainHeadUnstableFollowEventKind.Finalized>
{
  finalizedBlocksHashes: string[];
  prunedBlocksHashes: string[];
}

export type ChainHeadUnstableFollowStopEvent = ChainHeadUnstableFollowEventBase<ChainHeadUnstableFollowEventKind.Stop>;
