import * as rpc from "../rpc/mod.ts";

export type ErrorDetails = rpc.EnsureErrorDetails<{
  /** Invalid JSON was received by the server. */
  ParseError: [-32700];
  /** The JSON sent is not a valid Request object. */
  InvalidRequest: [-32600];
  /** The method does not exist / is not available. */
  MethodNotFound: [-32601];
  /** Invalid method parameter(s). */
  InvalidParams: [-32602];
  /** Internal JSON-RPC error. */
  InternalError: [-32603];
  /**
   * Other internal server error.
   * Contains a more precise error code and a custom message.
   * Error code must be in the range -32000 to -32099 included.
   */
  ServerError: [number];
  /**
   * Method-specific error.
   * Contains a more precise error code and a custom message.
   * Error code must be outside of the range -32000 to -32700.
   */
  MethodError: [number];
}>;

// TODO:
// type TodoRpc = {
//   state_getChildKeys: TODO_NARROW_METHOD_TYPE;
//   state_getChildReadProof: TODO_NARROW_METHOD_TYPE;
//   state_getChildStorage: TODO_NARROW_METHOD_TYPE;
//   state_getChildStorageHash: TODO_NARROW_METHOD_TYPE;
//   state_getChildStorageSize: TODO_NARROW_METHOD_TYPE;
//   sudo_unstable_p2pDiscover(multiaddr: U.HexEncoded<MultiAddress>): void;
//   sudo_unstable_version(): string;
//   syncstate_genSyncSpec: TODO_NARROW_METHOD_TYPE;
//   transaction_unstable_unwatch(subscription: SubId): void;
//   chainHead_unstable_body(followSubscription: U.HexHash, networkConfig?: T.NetworkConfig): string;
//   chainHead_unstable_call(
//     hash: U.HexHash | null,
//     fn: string,
//     callParameters: U.Hex,
//     networkConfig?: T.NetworkConfig,
//   ): string;
//   chainHead_unstable_genesisHash(): U.HexHash;
//   chainHead_unstable_header(followSubscription: string, hash: U.HexHash): U.Hex | null;
//   chainHead_unstable_stopBody(subscription: string): void;
//   chainHead_unstable_stopCall(subscription: string): void;
//   chainHead_unstable_stopStorage(subscription: string): void;
//   chainHead_unstable_storage(
//     follow_subscription: SubId,
//     hash: U.HexHash,
//     key: U.Hex,
//     childKey?: U.Hex,
//     networkConfig?: T.NetworkConfig,
//   ): string;
//   chainHead_unstable_unfollow(followSubscription: SubId): void;
//   chainHead_unstable_unpin(followSubscription: SubId, hash: U.HexHash): void;
//   chainSpec_unstable_chainName(): string;
//   chainSpec_unstable_genesisHash(): string;
//   chainSpec_unstable_properties(): unknown;
//   chainSpec_getBlockStats(at: U.HexHash): T.BlockStats | null;
//   chainSpec_createBlock: TODO_NARROW_METHOD_TYPE;
//   chainSpec_finalizeBlock: TODO_NARROW_METHOD_TYPE;
//   rpc_methods(): T.RpcMethods;
//   // subscriptions
//   chainHead_unstable_follow(runtimeUpdates: boolean): T.ChainHeadUnstableFollowEvent;
//   transaction_unstable_submitAndWatch(transaction: U.Hex): unknown;
// };
