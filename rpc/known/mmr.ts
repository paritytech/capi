import { Hash, Hex } from "./utils.ts"

// https://github.com/paritytech/substrate/blob/6c5ac31/primitives/merkle-mountain-range/src/lib.rs#L37
/**
 * A type to describe leaf position in the MMR.
 *
 * Note this is different from [`NodeIndex`], which can be applied to
 * both leafs and inner nodes. Leafs will always have consecutive `LeafIndex`,
 * but might be actually at different positions in the MMR `NodeIndex`.
 */
export type LeafIndex = number

// https://github.com/paritytech/substrate/blob/eddf888/frame/merkle-mountain-range/rpc/src/lib.rs#L49
/** Retrieved MMR leaf and its proof. */
export interface LeafProof {
  /** Block hash the proof was generated for. */
  blockHash: Hash
  /** SCALE-encoded leaf data. */
  leaf: Hex
  /** SCALE-encoded proof data. See [sp_mmr_primitives::Proof]. */
  proof: Hex
}

// https://github.com/paritytech/substrate/blob/eddf888/frame/merkle-mountain-range/rpc/src/lib.rs#L72
/** Retrieved MMR leaves and their proof. */
export interface LeafBatchProof {
  /** Block hash the proof was generated for. */
  blockHash: Hash
  /** SCALE-encoded vector of `LeafData`. */
  leaves: Hex
  /** SCALE-encoded proof data. See [sp_mmr_primitives::Proof]. */
  proof: Hex
}

// https://github.com/paritytech/substrate/blob/eddf888/frame/merkle-mountain-range/rpc/src/lib.rs#L99
export type MmrCalls = {
  /**
   * Generate MMR proof for given leaf index.
   *
   * This method calls into a runtime with MMR pallet included and attempts to generate
   * MMR proof for leaf at given `leaf_index`.
   * Optionally, a block hash at which the runtime should be queried can be specified.
   *
   * Returns the (full) leaf itself and a proof for this leaf (compact encoding, i.e. hash of
   * the leaf). Both parameters are SCALE-encoded.
   */
  mmr_generateProof(leafIndex: LeafIndex, at?: Hash): LeafProof
  /**
   * Generate MMR proof for the given leaf indices.
   *
   * This method calls into a runtime with MMR pallet included and attempts to generate
   * MMR proof for a set of leaves at the given `leaf_indices`.
   * Optionally, a block hash at which the runtime should be queried can be specified.
   *
   * Returns the leaves and a proof for these leaves (compact encoding, i.e. hash of
   * the leaves). Both parameters are SCALE-encoded.
   * The order of entries in the `leaves` field of the returned struct
   * is the same as the order of the entries in `leaf_indices` supplied
   */
  mmr_generateBatchProof(leafIndices: LeafIndex[], at?: Hash): LeafBatchProof
}
