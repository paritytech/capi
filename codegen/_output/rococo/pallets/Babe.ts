import { $ } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as t from "../mod.ts"

/**
 *  This field should always be populated during block processing unless
 *  secondary plain slots are enabled (which don't contain a VRF output).
 *
 *  It is set in `on_finalize`, before it will contain the value from the last block.
 */
export const AuthorVrfRandomness = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$31,
}

/** Current epoch authorities. */
export const Authorities = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$456,
}

/** Current slot number. */
export const CurrentSlot = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$190,
}

/**
 *  The configuration for the current epoch. Should never be `None` as it is initialized in
 *  genesis.
 */
export const EpochConfig = {
  type: "Plain",
  modifier: "Optional",
  hashers: [],
  key: [],
  value: _codec.$466,
}

/** Current epoch index. */
export const EpochIndex = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$10,
}

/**
 *  The block numbers when the last and current epoch have started, respectively `N-1` and
 *  `N`.
 *  NOTE: We track this is in order to annotate the block number when a given pool of
 *  entropy was fixed (i.e. it was known to chain observers). Since epochs are defined in
 *  slots, which may be skipped, the block numbers may not line up with the slot numbers.
 */
export const EpochStart = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$30,
}

/**
 *  The slot at which the first epoch actually started. This is 0
 *  until the first block of the chain.
 */
export const GenesisSlot = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$190,
}

/**
 *  Temporary value (cleared at block finalization) which is `Some`
 *  if per-block initialization has already been called for current block.
 */
export const Initialized = {
  type: "Plain",
  modifier: "Optional",
  hashers: [],
  key: [],
  value: _codec.$461,
}

/**
 *  How late the current block is compared to its parent.
 *
 *  This entry is populated as part of block execution and is cleaned up
 *  on block finalization. Querying this storage entry outside of block
 *  execution context should always yield zero.
 */
export const Lateness = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/** Next epoch authorities. */
export const NextAuthorities = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$456,
}

/**
 *  The configuration for the next epoch, `None` if the config will not change
 *  (you can fallback to `EpochConfig` instead in that case).
 */
export const NextEpochConfig = {
  type: "Plain",
  modifier: "Optional",
  hashers: [],
  key: [],
  value: _codec.$466,
}

/** Next epoch randomness. */
export const NextRandomness = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$1,
}

/** Pending epoch configuration change that will be applied when the next epoch is enacted. */
export const PendingEpochConfigChange = {
  type: "Plain",
  modifier: "Optional",
  hashers: [],
  key: [],
  value: _codec.$192,
}

/**
 *  The epoch randomness for the *current* epoch.
 *
 *  # Security
 *
 *  This MUST NOT be used for gambling, as it can be influenced by a
 *  malicious validator in the short term. It MAY be used in many
 *  cryptographic protocols, however, so long as one remembers that this
 *  (like everything else on-chain) it is public. For example, it can be
 *  used where a number is needed that cannot have been chosen by an
 *  adversary, for purposes such as public-coin zero-knowledge proofs.
 */
export const Randomness = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$1,
}

/**
 *  Randomness under construction.
 *
 *  We make a trade-off between storage accesses and list length.
 *  We store the under-construction randomness in segments of up to
 *  `UNDER_CONSTRUCTION_SEGMENT_LENGTH`.
 *
 *  Once a segment reaches this length, we begin the next one.
 *  We reset all segments and return to `0` at the beginning of every
 *  epoch.
 */
export const SegmentIndex = {
  type: "Plain",
  modifier: "Default",
  hashers: [],
  key: [],
  value: _codec.$4,
}

/** TWOX-NOTE: `SegmentIndex` is an increasing integer, so this is okay. */
export const UnderConstruction = {
  type: "Map",
  modifier: "Default",
  hashers: ["Twox64Concat"],
  key: $.tuple(_codec.$4),
  value: _codec.$459,
}

/**
 * Plan an epoch config change. The epoch config change is recorded and will be enacted on
 * the next call to `enact_epoch_change`. The config will be activated one epoch after.
 * Multiple calls to this method will replace any existing planned config change that had
 * not been enacted yet.
 */
export function plan_config_change(
  value: Omit<t.pallet_babe.pallet.Call.plan_config_change, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Babe", value: { ...value, type: "plan_config_change" } }
}

/**
 * Report authority equivocation/misbehavior. This method will verify
 * the equivocation proof and validate the given key ownership proof
 * against the extracted offender. If both are valid, the offence will
 * be reported.
 */
export function report_equivocation(
  value: Omit<t.pallet_babe.pallet.Call.report_equivocation, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Babe", value: { ...value, type: "report_equivocation" } }
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
  value: Omit<t.pallet_babe.pallet.Call.report_equivocation_unsigned, "type">,
): t.polkadot_runtime.RuntimeCall {
  return { type: "Babe", value: { ...value, type: "report_equivocation_unsigned" } }
}
