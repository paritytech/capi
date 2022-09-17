import { AccId, Result } from "./utils.ts";

// https://github.com/paritytech/substrate/blob/9b01569/client/consensus/babe/rpc/src/lib.rs#L154
/// Holds information about the `slot`'s that can be claimed by a given key.
export interface EpochAuthorship {
  /// the array of primary slots that can be claimed
  primary: number[];
  /// the array of secondary slots that can be claimed
  secondary: number[];
  /// The array of secondary VRF slots that can be claimed.
  secondary_vrf: number[];
}

// https://github.com/paritytech/substrate/blob/9b01569/client/consensus/babe/rpc/src/lib.rs#L44
export type BabeRpc = {
  /**
   * Returns data about which slots (primary or secondary) can be claimed in
   * the current epoch with the keys in the keystore.
   */
  babe_epochAuthorship(): Result<Record<AccId, EpochAuthorship>>;
};
