import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export const $call: $.Codec<types.pallet_babe.pallet.Call> = codecs.$185
/** Contains one variant per dispatchable that can be called by an extrinsic. */

export type Call =
  | types.pallet_babe.pallet.Call.reportEquivocation
  | types.pallet_babe.pallet.Call.reportEquivocationUnsigned
  | types.pallet_babe.pallet.Call.planConfigChange
export namespace Call {
  /**
   * Report authority equivocation/misbehavior. This method will verify
   * the equivocation proof and validate the given key ownership proof
   * against the extracted offender. If both are valid, the offence will
   * be reported.
   */
  export interface reportEquivocation {
    type: "reportEquivocation"
    equivocationProof: types.sp_consensus_slots.EquivocationProof
    keyOwnerProof: types.sp_session.MembershipProof
  }
  /**
   * Report authority equivocation/misbehavior. This method will verify
   * the equivocation proof and validate the given key ownership proof
   * against the extracted offender. If both are valid, the offence will
   * be reported.
   * This extrinsic must be called unsigned and it is expected that only
   * block authors will call it (validated in `ValidateUnsigned`), as such
   * if the block author is defined it will be defined as the equivocation
   * reporter.
   */
  export interface reportEquivocationUnsigned {
    type: "reportEquivocationUnsigned"
    equivocationProof: types.sp_consensus_slots.EquivocationProof
    keyOwnerProof: types.sp_session.MembershipProof
  }
  /**
   * Plan an epoch config change. The epoch config change is recorded and will be enacted on
   * the next call to `enact_epoch_change`. The config will be activated one epoch after.
   * Multiple calls to this method will replace any existing planned config change that had
   * not been enacted yet.
   */
  export interface planConfigChange {
    type: "planConfigChange"
    config: types.sp_consensus_babe.digests.NextConfigDescriptor
  }
  /**
   * Report authority equivocation/misbehavior. This method will verify
   * the equivocation proof and validate the given key ownership proof
   * against the extracted offender. If both are valid, the offence will
   * be reported.
   */
  export function reportEquivocation(
    value: Omit<types.pallet_babe.pallet.Call.reportEquivocation, "type">,
  ): types.pallet_babe.pallet.Call.reportEquivocation {
    return { type: "reportEquivocation", ...value }
  }
  /**
   * Report authority equivocation/misbehavior. This method will verify
   * the equivocation proof and validate the given key ownership proof
   * against the extracted offender. If both are valid, the offence will
   * be reported.
   * This extrinsic must be called unsigned and it is expected that only
   * block authors will call it (validated in `ValidateUnsigned`), as such
   * if the block author is defined it will be defined as the equivocation
   * reporter.
   */
  export function reportEquivocationUnsigned(
    value: Omit<types.pallet_babe.pallet.Call.reportEquivocationUnsigned, "type">,
  ): types.pallet_babe.pallet.Call.reportEquivocationUnsigned {
    return { type: "reportEquivocationUnsigned", ...value }
  }
  /**
   * Plan an epoch config change. The epoch config change is recorded and will be enacted on
   * the next call to `enact_epoch_change`. The config will be activated one epoch after.
   * Multiple calls to this method will replace any existing planned config change that had
   * not been enacted yet.
   */
  export function planConfigChange(
    value: Omit<types.pallet_babe.pallet.Call.planConfigChange, "type">,
  ): types.pallet_babe.pallet.Call.planConfigChange {
    return { type: "planConfigChange", ...value }
  }
}

export const $error: $.Codec<types.pallet_babe.pallet.Error> = codecs.$464
/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */

export type Error =
  | "InvalidEquivocationProof"
  | "InvalidKeyOwnershipProof"
  | "DuplicateOffenceReport"
  | "InvalidConfiguration"
