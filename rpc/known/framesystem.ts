import { AccountId } from "./utils.ts"

// https://github.com/paritytech/substrate/blob/eddf888/utils/frame/rpc/system/src/lib.rs#L41
export type FrameSystemCalls = {
  /**
   * Returns the next valid index (aka nonce) for given account.
   *
   * This method takes into consideration all pending transactions
   * currently in the pool and if no transactions are found in the pool
   * it fallbacks to query the index from the runtime (aka. state nonce).
   */
  system_accountNextIndex(account: AccountId): number
  account_nextIndex: FrameSystemCalls["system_accountNextIndex"]
  /** Dry run an extrinsic at a given block. Return SCALE encoded ApplyExtrinsicResult. */
  system_dryRun(extrinsic: string, at?: string): string
  system_dryRunAt: FrameSystemCalls["system_dryRun"]
}
