import { Hex, Result, SerdeEnum } from "./utils.ts";

/// A type of supported crypto.
export type StorageKind = SerdeEnum<{
  /// Persistent storage is non-revertible and not fork-aware. It means that any value
  /// set by the offchain worker triggered at block `N(hash1)` is persisted even
  /// if that block is reverted as non-canonical and is available for the worker
  /// that is re-run at block `N(hash2)`.
  /// This storage can be used by offchain workers to handle forks
  /// and coordinate offchain workers running on different forks.
  PERSISTENT: void;
  /// Local storage is revertible and fork-aware. It means that any value
  /// set by the offchain worker triggered at block `N(hash1)` is reverted
  /// if that block is reverted as non-canonical and is NOT available for the worker
  /// that is re-run at block `N(hash2)`.
  LOCAL: void;
}>;

// https://github.com/paritytech/substrate/blob/7d233c2/client/rpc-api/src/offchain/mod.rs#L28
export type OffchainRpc = {
  /// Set offchain local storage under given key and prefix.
  offchain_localStorageSet(kind: StorageKind, key: Hex, value: Hex): Result<null>;
  /// Get offchain local storage under given key and prefix.
  offchain_localStorageGet(kind: StorageKind, key: Hex): Result<Hex | null>;
};
