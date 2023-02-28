// https://github.com/paritytech/substrate/blob/00cc5f1/utils/frame/rpc/state-trie-migration-rpc/src/lib.rs#L106
export interface MigrationStatusResult {
  topRemainingToMigrate: number
  childRemainingToMigrate: number
}

// https://github.com/paritytech/substrate/blob/00cc5f1/utils/frame/rpc/state-trie-migration-rpc/src/lib.rs#L113
export type StateMigrationCalls = {
  /**
   * Check current migration state.
   *
   * This call is performed locally without submitting any transactions. Thus executing this
   * won't change any state. Nonetheless it is a VERY costly call that should be
   * only exposed to trusted peers.
   */
  state_trieMigrationStatus(at?: string): MigrationStatusResult
}
