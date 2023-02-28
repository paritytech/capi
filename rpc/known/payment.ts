import { NumberOrHex, SerdeEnum } from "./utils.ts"

// https://github.com/paritytech/substrate/blob/3e71d606b7d1e91d9c1701c0a443530eefca1a39/primitives/weights/src/weight_v2.rs#L29
export interface Weight {
  // The weight of computational time used based on some reference hardware.
  ref_time: bigint
  // The weight of storage space used by proof of validity.
  proof_size: bigint
}

// https://github.com/paritytech/substrate/blob/23bb5a6/frame/transaction-payment/src/types.rs#L99
/**
 * Information related to a dispatchable's class, weight, and fee that can be queried from the
 * runtime.
 */
export interface RuntimeDispatchInfo {
  weight: Weight
  class: DispatchClass
  partialFee: number
}

// https://github.com/paritytech/substrate/blob/23bb5a6255bbcd7ce2999044710428bc4a7a924f/frame/support/src/dispatch.rs#L140
/**
 * A generalized group of dispatch types.
 *
 * NOTE whenever upgrading the enum make sure to also update
 * [DispatchClass::all] and [DispatchClass::non_mandatory] helper functions.
 */
export type DispatchClass = SerdeEnum<{
  /** A normal dispatch. */
  normal: void
  /** An operational dispatch. */
  operational: void
  /**
   * A mandatory dispatch. These kinds of dispatch are always included regardless of their
   * weight, therefore it is critical that they are separately validated to ensure that a
   * malicious validator cannot craft a valid but impossibly heavy block. Usually this just
   * means ensuring that the extrinsic can only be included once and that it is always very
   * light.
   *
   * Do *NOT* use it for extrinsics that can be heavy.
   *
   * The only real use case for this is inherent extrinsics that are required to execute in a
   * block for the block to be valid, and it solves the issue in the case that the block
   * initialization is sufficiently heavy to mean that those inherents do not fit into the
   * block. Essentially, we assume that in these exceptional circumstances, it is better to
   * allow an overweight block to be created than to not allow any block at all to be created.
   */
  mandatory: void
}>

// https://github.com/paritytech/substrate/blob/23bb5a6/frame/transaction-payment/src/types.rs#L69
/**
 * The `FeeDetails` is composed of:
 *   - (Optional) `inclusion_fee`: Only the `Pays::Yes` transaction can have the inclusion fee.
 *   - `tip`: If included in the transaction, the tip will be added on top. Only signed
 *     transactions can have a tip.
 */
export interface FeeDetails {
  inclusionFee?: InclusionFee
  tip: NumberOrHex
}

// https://github.com/paritytech/substrate/blob/23bb5a6/frame/transaction-payment/src/types.rs#L33
/** The base fee and adjusted weight and length fees constitute the _inclusion fee_. */
export interface InclusionFee {
  /**
   * This is the minimum amount a user pays for a transaction. It is declared
   * as a base _weight_ in the runtime and converted to a fee using `WeightToFee`.
   */
  baseFee: NumberOrHex
  /** The length fee, the amount paid for the encoded length (in bytes) of the transaction. */
  lenFee: NumberOrHex
  /**
   * - `targeted_fee_adjustment`: This is a multiplier that can tune the final fee based on the
   *   congestion of the network.
   * - `weight_fee`: This amount is computed based on the weight of the transaction. Weight
   * accounts for the execution time of a transaction.
   *
   * adjusted_weight_fee = targeted_fee_adjustment * weight_fee
   */
  adjustedWeightFee: NumberOrHex
}

// https://github.com/paritytech/substrate/blob/eddf888/frame/transaction-payment/rpc/src/lib.rs#L41
export type TransactionPaymentCalls = {
  payment_queryInfo(extrinsic: string, at?: string): RuntimeDispatchInfo
  payment_queryFeeDetails(extrinsic: string, at?: string): FeeDetails
}
