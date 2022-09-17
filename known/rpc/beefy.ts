import { Hash, Hex, Result, Subscription } from "./utils.ts";

// https://github.com/paritytech/substrate/blob/317808a/client/beefy/rpc/src/lib.rs#L84
export type BeefyRpc = {
  /** Returns the block most recently finalized by BEEFY, alongside side its justification. */
  beefy_subscribeJustifications(): Result<
    Subscription<"beefy_subscribeJustifications", Hex>
  >;
  /**
   * Returns hash of the latest BEEFY finalized block as seen by this client.
   *
   * The latest BEEFY block might not be available if the BEEFY gadget is not running
   * in the network or if the client is still initializing or syncing with the network.
   * In such case an error would be returned.
   */
  beefy_getFinalizedHead(): Result<Hash>;
};
