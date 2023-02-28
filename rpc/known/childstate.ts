// https://github.com/paritytech/substrate/blob/4d04aba/primitives/storage/src/lib.rs
export type StorageKey = string
export type PrefixedStorageKey = string
export type StorageData = string

// https://github.com/paritytech/substrate/blob/ded44948/client/rpc-api/src/state/helpers.rs#L27
export interface ReadProof {
  /** Block hash used to generate the proof */
  at: string
  /** A proof used to prove that storage entries are included in the storage trie */
  proof: string[]
}

// https://github.com/paritytech/substrate/blob/934fbfd/client/rpc-api/src/child_state/mod.rs#L29
export type ChildStateCalls = {
  /**
   * Returns the keys with prefix from a child storage, leave empty to get all the keys
   * @deprecated [2.0.0] Please use `getKeysPaged` with proper paging support
   */
  childState_getKeys(
    childStorageKey: PrefixedStorageKey,
    prefix: StorageKey,
    hash?: string,
  ): StorageKey[]
  /**
   * Returns the keys with prefix from a child storage with pagination support.
   * Up to `count` keys will be returned.
   * If `start_key` is passed, return next keys in storage in lexicographic order.
   */
  childState_getKeysPaged(
    childStorageKey: PrefixedStorageKey,
    prefix: StorageKey,
    count: number,
    startKey?: StorageKey,
    hash?: string,
  ): StorageKey[]
  /** Returns a child storage entry at a specific block's state. */
  childState_getStorage(
    childStorageKey: PrefixedStorageKey,
    key: StorageKey,
    hash?: string,
  ): StorageData | null
  /** Returns child storage entries for multiple keys at a specific block's state. */
  childState_getStorageEntries(
    childStorageKey: PrefixedStorageKey,
    keys: StorageKey[],
    hash?: string,
  ): (StorageData | null)[]
  /** Returns the hash of a child storage entry at a block's state. */
  childState_getStorageHash(
    childStorageKey: PrefixedStorageKey,
    key: StorageKey,
    hash?: string,
  ): string | null
  /** Returns the size of a child storage entry at a block's state. */
  childState_getStorageSize(
    childStorageKey: PrefixedStorageKey,
    key: StorageKey,
    hash?: string,
  ): number | null
  /** Returns proof of storage for child key entries at a specific block's state. */
  state_getChildReadProof(
    childStorageKey: PrefixedStorageKey,
    keys: StorageKey[],
    hash?: string,
  ): ReadProof
}
