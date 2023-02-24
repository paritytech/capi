import { Hash, Hex, SerdeEnum, Subscription } from "./utils.ts"

// https://github.com/paritytech/substrate/blob/e0ccd00/client/transaction-pool/api/src/lib.rs#L104
/**
 * Possible transaction status events.
 *
 * This events are being emitted by `TransactionPool` watchers,
 * which are also exposed over RPC.
 *
 * The status events can be grouped based on their kinds as:
 * 1. Entering/Moving within the pool:
 * 		- `Future`
 * 		- `Ready`
 * 2. Inside `Ready` queue:
 * 		- `Broadcast`
 * 3. Leaving the pool:
 * 		- `InBlock`
 * 		- `Invalid`
 * 		- `Usurped`
 * 		- `Dropped`
 * 	4. Re-entering the pool:
 * 		- `Retracted`
 * 	5. Block finalized:
 * 		- `Finalized`
 * 		- `FinalityTimeout`
 *
 * The events will always be received in the order described above, however
 * there might be cases where transactions alternate between `Future` and `Ready`
 * pool, and are `Broadcast` in the meantime.
 *
 * There is also only single event causing the transaction to leave the pool.
 * I.e. only one of the listed ones should be triggered.
 *
 * Note that there are conditions that may cause transactions to reappear in the pool.
 * 1. Due to possible forks, the transaction that ends up being in included
 * in one block, may later re-enter the pool or be marked as invalid.
 * 2. Transaction `Dropped` at one point, may later re-enter the pool if some other
 * transactions are removed.
 * 3. `Invalid` transaction may become valid at some point in the future.
 * (Note that runtimes are encouraged to use `UnknownValidity` to inform the pool about
 * such case).
 * 4. `Retracted` transactions might be included in some next block.
 *
 * The stream is considered finished only when either `Finalized` or `FinalityTimeout`
 * event is triggered. You are however free to unsubscribe from notifications at any point.
 * The first one will be emitted when the block, in which transaction was included gets
 * finalized. The `FinalityTimeout` event will be emitted when the block did not reach finality
 * within 512 blocks. This either indicates that finality is not available for your chain,
 * or that finality gadget is lagging behind. If you choose to wait for finality longer, you can
 * re-subscribe for a particular transaction hash manually again.
 */
export type TransactionStatus = SerdeEnum<{
  /** Transaction is part of the future queue. */
  future: void
  /** Transaction is part of the ready queue. */
  ready: void
  /** The transaction has been broadcast to the given peers. */
  broadcast: string[]
  /** Transaction has been included in block with given hash. */
  inBlock: Hash
  /** The block this transaction was included in has been retracted. */
  retracted: Hash
  /**
   * Maximum number of finality watchers has been reached,
   * old watchers are being removed.
   */
  finalityTimeout: Hash
  /** Transaction has been finalized by a finality-gadget, e.g GRANDPA */
  finalized: Hash
  /**
   * Transaction has been replaced in the pool, by another transaction
   * that provides the same tags. (e.g. same (sender, nonce)).
   */
  usurped: Hash
  /** Transaction has been dropped from the pool because of the limit. */
  dropped: void
  /** Transaction is no longer valid in the current state. */
  invalid: void
}>

export namespace TransactionStatus {
  // TODO: convert into type guard?
  export function isTerminal(inQuestion: TransactionStatus): boolean {
    return typeof inQuestion === "string"
      ? inQuestion === "invalid" || inQuestion === "dropped"
      : !!(inQuestion.finalized || inQuestion.finalityTimeout || inQuestion.retracted
        || inQuestion.usurped || inQuestion.inBlock)
  }
}

// https://github.com/paritytech/substrate/blob/e0ccd00/client/rpc-api/src/author/hash.rs
/**
 * RPC Extrinsic or hash
 *
 * Allows to refer to extrinsic either by its raw representation or its hash.
 */
export type ExtrinsicOrHash = SerdeEnum<{
  /** The hash of the extrinsic. */
  hash: Hash
  /** Raw extrinsic bytes. */
  extrinsic: Hex
}>

// https://github.com/paritytech/substrate/blob/e0ccd00/client/rpc-api/src/author/mod.rs#L30
export type AuthorCalls = {
  /** Submit hex-encoded extrinsic for inclusion in block. */
  author_submitExtrinsic(extrinsic: Hex): Hash
  /** Insert a key into the keystore. */
  author_insertKey(keyType: string, suri: string, publicKey: Hex): null
  /** Generate new session keys and returns the corresponding public keys. */
  author_rotateKeys(): Hex
  /**
   * Checks if the keystore has private keys for the given session public keys.
   * `sessionKeys` is the SCALE encoded session keys object from the runtime.
   * Returns `true` iff all private keys could be found.
   */
  author_hasSessionKeys(sessionsKeys: Hex): boolean
  /**
   * Checks if the keystore has private keys for the given public key and key type.
   * Returns `true` if a private key could be found.
   */
  author_hasKey(pubKey: Hex, keyType: string): boolean
  /** Returns all pending extrinsics, potentially grouped by sender.  */
  author_pendingExtrinsics(): Hex[]
  /** Remove given extrinsic from the pool and temporarily ban it to prevent reimporting. */
  author_removeExtrinsic(extrinsics: ExtrinsicOrHash[]): Hex[] // todo
}

export type AuthorSubscriptions = {
  /**
   * Submit an extrinsic to watch.
   *
   * See [`TransactionStatus`](sc_transaction_pool_api::TransactionStatus) for details on
   * transaction life cycle.
   */
  author_submitAndWatchExtrinsic(
    extrinsic: Hex,
  ): Subscription<"author_unwatchExtrinsic", TransactionStatus>
}
