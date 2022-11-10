import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $call: $.Codec<t.types.pallet_babe.pallet.Call> = _codec.$185

export const $error: $.Codec<t.types.pallet_babe.pallet.Error> = _codec.$467

/** Contains one variant per dispatchable that can be called by an extrinsic. */
export type Call =
  | t.types.pallet_babe.pallet.Call.report_equivocation
  | t.types.pallet_babe.pallet.Call.report_equivocation_unsigned
  | t.types.pallet_babe.pallet.Call.plan_config_change
export namespace Call {
  /**
   * Report authority equivocation/misbehavior. This method will verify
   * the equivocation proof and validate the given key ownership proof
   * against the extracted offender. If both are valid, the offence will
   * be reported.
   */
  export interface report_equivocation {
    type: "report_equivocation"
    equivocation_proof: t.types.sp_consensus_slots.EquivocationProof
    key_owner_proof: t.types.sp_session.MembershipProof
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
  export interface report_equivocation_unsigned {
    type: "report_equivocation_unsigned"
    equivocation_proof: t.types.sp_consensus_slots.EquivocationProof
    key_owner_proof: t.types.sp_session.MembershipProof
  }
  /**
   * Plan an epoch config change. The epoch config change is recorded and will be enacted on
   * the next call to `enact_epoch_change`. The config will be activated one epoch after.
   * Multiple calls to this method will replace any existing planned config change that had
   * not been enacted yet.
   */
  export interface plan_config_change {
    type: "plan_config_change"
    config: t.types.sp_consensus_babe.digests.NextConfigDescriptor
  }
  /**
   * Report authority equivocation/misbehavior. This method will verify
   * the equivocation proof and validate the given key ownership proof
   * against the extracted offender. If both are valid, the offence will
   * be reported.
   */
  export function report_equivocation(
    value: Omit<t.types.pallet_babe.pallet.Call.report_equivocation, "type">,
  ): t.types.pallet_babe.pallet.Call.report_equivocation {
    return { type: "report_equivocation", ...value }
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
  export function report_equivocation_unsigned(
    value: Omit<t.types.pallet_babe.pallet.Call.report_equivocation_unsigned, "type">,
  ): t.types.pallet_babe.pallet.Call.report_equivocation_unsigned {
    return { type: "report_equivocation_unsigned", ...value }
  }
  /**
   * Plan an epoch config change. The epoch config change is recorded and will be enacted on
   * the next call to `enact_epoch_change`. The config will be activated one epoch after.
   * Multiple calls to this method will replace any existing planned config change that had
   * not been enacted yet.
   */
  export function plan_config_change(
    value: Omit<t.types.pallet_babe.pallet.Call.plan_config_change, "type">,
  ): t.types.pallet_babe.pallet.Call.plan_config_change {
    return { type: "plan_config_change", ...value }
  }
}

/** Custom [dispatch errors](https://docs.substrate.io/main-docs/build/events-errors/) of this pallet. */
export type Error =
  | "InvalidEquivocationProof"
  | "InvalidKeyOwnershipProof"
  | "DuplicateOffenceReport"
  | "InvalidConfiguration"
