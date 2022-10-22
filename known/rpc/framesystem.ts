import { AccountId, Hash, Hex, RpcResult } from "./utils.ts";

// https://github.com/paritytech/substrate/blob/eddf888/utils/frame/rpc/system/src/lib.rs#L41
export type FrameSystemRpc = {
  /**
   * Returns the next valid index (aka nonce) for given account.
   *
   * This method takes into consideration all pending transactions
   * currently in the pool and if no transactions are found in the pool
   * it fallbacks to query the index from the runtime (aka. state nonce).
   */
  system_accountNextIndex(account: AccountId): RpcResult<number>;
  account_nextIndex: FrameSystemRpc["system_accountNextIndex"];
  /** Dry run an extrinsic at a given block. Return SCALE encoded ApplyExtrinsicResult. */
  system_dryRun(extrinsic: Hex, at?: Hash): RpcResult<Hex>;
  system_dryRunAt: FrameSystemRpc["system_dryRun"];
};
