import { $, C, client } from "../capi.ts"
import * as codecs from "../codecs.ts"
import type * as types from "../types/mod.ts"

/** Current epoch index. */
export const EpochIndex = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Babe",
  "EpochIndex",
  $.tuple(),
  codecs.$9,
)

/** Current epoch authorities. */
export const Authorities = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Babe",
  "Authorities",
  $.tuple(),
  codecs.$452,
)

/**
 *  The slot at which the first epoch actually started. This is 0
 *  until the first block of the chain.
 */
export const GenesisSlot = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Babe",
  "GenesisSlot",
  $.tuple(),
  codecs.$190,
)

/** Current slot number. */
export const CurrentSlot = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Babe",
  "CurrentSlot",
  $.tuple(),
  codecs.$190,
)

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
export const Randomness = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Babe",
  "Randomness",
  $.tuple(),
  codecs.$1,
)

/** Pending epoch configuration change that will be applied when the next epoch is enacted. */
export const PendingEpochConfigChange = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "Babe",
  "PendingEpochConfigChange",
  $.tuple(),
  codecs.$192,
)

/** Next epoch randomness. */
export const NextRandomness = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Babe",
  "NextRandomness",
  $.tuple(),
  codecs.$1,
)

/** Next epoch authorities. */
export const NextAuthorities = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Babe",
  "NextAuthorities",
  $.tuple(),
  codecs.$452,
)

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
export const SegmentIndex = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Babe",
  "SegmentIndex",
  $.tuple(),
  codecs.$4,
)

/** TWOX-NOTE: `SegmentIndex` is an increasing integer, so this is okay. */
export const UnderConstruction = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Babe",
  "UnderConstruction",
  $.tuple(codecs.$4),
  codecs.$455,
)

/**
 *  Temporary value (cleared at block finalization) which is `Some`
 *  if per-block initialization has already been called for current block.
 */
export const Initialized = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "Babe",
  "Initialized",
  $.tuple(),
  codecs.$457,
)

/**
 *  This field should always be populated during block processing unless
 *  secondary plain slots are enabled (which don't contain a VRF output).
 *
 *  It is set in `on_finalize`, before it will contain the value from the last block.
 */
export const AuthorVrfRandomness = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Babe",
  "AuthorVrfRandomness",
  $.tuple(),
  codecs.$462,
)

/**
 *  The block numbers when the last and current epoch have started, respectively `N-1` and
 *  `N`.
 *  NOTE: We track this is in order to annotate the block number when a given pool of
 *  entropy was fixed (i.e. it was known to chain observers). Since epochs are defined in
 *  slots, which may be skipped, the block numbers may not line up with the slot numbers.
 */
export const EpochStart = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Babe",
  "EpochStart",
  $.tuple(),
  codecs.$29,
)

/**
 *  How late the current block is compared to its parent.
 *
 *  This entry is populated as part of block execution and is cleaned up
 *  on block finalization. Querying this storage entry outside of block
 *  execution context should always yield zero.
 */
export const Lateness = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Babe",
  "Lateness",
  $.tuple(),
  codecs.$4,
)

/**
 *  The configuration for the current epoch. Should never be `None` as it is initialized in
 *  genesis.
 */
export const EpochConfig = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "Babe",
  "EpochConfig",
  $.tuple(),
  codecs.$463,
)

/**
 *  The configuration for the next epoch, `None` if the config will not change
 *  (you can fallback to `EpochConfig` instead in that case).
 */
export const NextEpochConfig = new C.fluent.Storage(
  client,
  "Plain",
  "Optional",
  "Babe",
  "NextEpochConfig",
  $.tuple(),
  codecs.$463,
)

/**
 * Report authority equivocation/misbehavior. This method will verify
 * the equivocation proof and validate the given key ownership proof
 * against the extracted offender. If both are valid, the offence will
 * be reported.
 */
export function reportEquivocation(
  value: Omit<types.pallet_babe.pallet.Call.reportEquivocation, "type">,
) {
  return { type: "Babe", value: { ...value, type: "reportEquivocation" } }
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
) {
  return { type: "Babe", value: { ...value, type: "reportEquivocationUnsigned" } }
}

/**
 * Plan an epoch config change. The epoch config change is recorded and will be enacted on
 * the next call to `enact_epoch_change`. The config will be activated one epoch after.
 * Multiple calls to this method will replace any existing planned config change that had
 * not been enacted yet.
 */
export function planConfigChange(
  value: Omit<types.pallet_babe.pallet.Call.planConfigChange, "type">,
) {
  return { type: "Babe", value: { ...value, type: "planConfigChange" } }
}

/**
 *  The amount of time, in slots, that each epoch should last.
 *  NOTE: Currently it is not possible to change the epoch duration after
 *  the chain has started. Attempting to do so will brick block production.
 */
export const EpochDuration: types.u64 = codecs.$9.decode(C.hex.decode("6009000000000000" as C.Hex))

/**
 *  The expected average block time at which BABE should be creating
 *  blocks. Since BABE is probabilistic it is not trivial to figure out
 *  what the expected average block time should be based on the slot
 *  duration and the security parameter `c` (where `1 - c` represents
 *  the probability of a slot being empty).
 */
export const ExpectedBlockTime: types.u64 = codecs.$9.decode(
  C.hex.decode("7017000000000000" as C.Hex),
)

/** Max number of authorities allowed */
export const MaxAuthorities: types.u32 = codecs.$4.decode(C.hex.decode("a0860100" as C.Hex))
