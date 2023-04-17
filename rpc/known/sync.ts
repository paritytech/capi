// https://github.com/paritytech/substrate/blob/eddf8883/client/sync-state-rpc/src/lib.rs#L128
export type SyncCalls = {
  // https://github.com/paritytech/substrate/blob/eddf8883/client/sync-state-rpc/src/lib.rs#L131
  /** Returns the JSON serialized chainspec running the node, with a sync state. */
  sync_state_genSyncSpec(raw: boolean): unknown
}
