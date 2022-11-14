import { $, C, client } from "../capi.ts"
import * as _codec from "../codecs.ts"
import type * as types from "../types/mod.ts"

/**
 *  All currently active PVF pre-checking votes.
 *
 *  Invariant:
 *  - There are no PVF pre-checking votes that exists in list but not in the set and vice versa.
 */
export const PvfActiveVoteMap = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Paras",
  "PvfActiveVoteMap",
  $.tuple(_codec.$103),
  _codec.$666,
)

/** The list of all currently active PVF votes. Auxiliary to `PvfActiveVoteMap`. */
export const PvfActiveVoteList = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Paras",
  "PvfActiveVoteList",
  $.tuple(),
  _codec.$669,
)

/**
 *  All parachains. Ordered ascending by `ParaId`. Parathreads are not included.
 *
 *  Consider using the [`ParachainsCache`] type of modifying.
 */
export const Parachains = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Paras",
  "Parachains",
  $.tuple(),
  _codec.$662,
)

/** The current lifecycle of a all known Para IDs. */
export const ParaLifecycles = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Paras",
  "ParaLifecycles",
  $.tuple(_codec.$98),
  _codec.$670,
)

/** The head-data of every registered para. */
export const Heads = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Paras",
  "Heads",
  $.tuple(_codec.$98),
  _codec.$104,
)

/**
 *  The validation code hash of every live para.
 *
 *  Corresponding code can be retrieved with [`CodeByHash`].
 */
export const CurrentCodeHash = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Paras",
  "CurrentCodeHash",
  $.tuple(_codec.$98),
  _codec.$103,
)

/**
 *  Actual past code hash, indicated by the para id as well as the block number at which it
 *  became outdated.
 *
 *  Corresponding code can be retrieved with [`CodeByHash`].
 */
export const PastCodeHash = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Paras",
  "PastCodeHash",
  $.tuple(_codec.$671),
  _codec.$103,
)

/**
 *  Past code of parachains. The parachains themselves may not be registered anymore,
 *  but we also keep their code on-chain for the same amount of time as outdated code
 *  to keep it available for secondary checkers.
 */
export const PastCodeMeta = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Paras",
  "PastCodeMeta",
  $.tuple(_codec.$98),
  _codec.$672,
)

/**
 *  Which paras have past code that needs pruning and the relay-chain block at which the code was replaced.
 *  Note that this is the actual height of the included block, not the expected height at which the
 *  code upgrade would be applied, although they may be equal.
 *  This is to ensure the entire acceptance period is covered, not an offset acceptance period starting
 *  from the time at which the parachain perceives a code upgrade as having occurred.
 *  Multiple entries for a single para are permitted. Ordered ascending by block number.
 */
export const PastCodePruning = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Paras",
  "PastCodePruning",
  $.tuple(),
  _codec.$675,
)

/**
 *  The block number at which the planned code change is expected for a para.
 *  The change will be applied after the first parablock for this ID included which executes
 *  in the context of a relay chain block with a number >= `expected_at`.
 */
export const FutureCodeUpgrades = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Paras",
  "FutureCodeUpgrades",
  $.tuple(_codec.$98),
  _codec.$4,
)

/**
 *  The actual future code hash of a para.
 *
 *  Corresponding code can be retrieved with [`CodeByHash`].
 */
export const FutureCodeHash = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Paras",
  "FutureCodeHash",
  $.tuple(_codec.$98),
  _codec.$103,
)

/**
 *  This is used by the relay-chain to communicate to a parachain a go-ahead with in the upgrade procedure.
 *
 *  This value is absent when there are no upgrades scheduled or during the time the relay chain
 *  performs the checks. It is set at the first relay-chain block when the corresponding parachain
 *  can switch its upgrade function. As soon as the parachain's block is included, the value
 *  gets reset to `None`.
 *
 *  NOTE that this field is used by parachains via merkle storage proofs, therefore changing
 *  the format will require migration of parachains.
 */
export const UpgradeGoAheadSignal = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Paras",
  "UpgradeGoAheadSignal",
  $.tuple(_codec.$98),
  _codec.$676,
)

/**
 *  This is used by the relay-chain to communicate that there are restrictions for performing
 *  an upgrade for this parachain.
 *
 *  This may be a because the parachain waits for the upgrade cooldown to expire. Another
 *  potential use case is when we want to perform some maintenance (such as storage migration)
 *  we could restrict upgrades to make the process simpler.
 *
 *  NOTE that this field is used by parachains via merkle storage proofs, therefore changing
 *  the format will require migration of parachains.
 */
export const UpgradeRestrictionSignal = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Paras",
  "UpgradeRestrictionSignal",
  $.tuple(_codec.$98),
  _codec.$677,
)

/**
 *  The list of parachains that are awaiting for their upgrade restriction to cooldown.
 *
 *  Ordered ascending by block number.
 */
export const UpgradeCooldowns = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Paras",
  "UpgradeCooldowns",
  $.tuple(),
  _codec.$675,
)

/**
 *  The list of upcoming code upgrades. Each item is a pair of which para performs a code
 *  upgrade and at which relay-chain block it is expected at.
 *
 *  Ordered ascending by block number.
 */
export const UpcomingUpgrades = new C.fluent.Storage(
  client,
  "Plain",
  "Default",
  "Paras",
  "UpcomingUpgrades",
  $.tuple(),
  _codec.$675,
)

/** The actions to perform during the start of a specific session index. */
export const ActionsQueue = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Paras",
  "ActionsQueue",
  $.tuple(_codec.$4),
  _codec.$662,
)

/**
 *  Upcoming paras instantiation arguments.
 *
 *  NOTE that after PVF pre-checking is enabled the para genesis arg will have it's code set
 *  to empty. Instead, the code will be saved into the storage right away via `CodeByHash`.
 */
export const UpcomingParasGenesis = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Paras",
  "UpcomingParasGenesis",
  $.tuple(_codec.$98),
  _codec.$678,
)

/** The number of reference on the validation code in [`CodeByHash`] storage. */
export const CodeByHashRefs = new C.fluent.Storage(
  client,
  "Map",
  "Default",
  "Paras",
  "CodeByHashRefs",
  $.tuple(_codec.$103),
  _codec.$4,
)

/**
 *  Validation code stored by its hash.
 *
 *  This storage is consistent with [`FutureCodeHash`], [`CurrentCodeHash`] and
 *  [`PastCodeHash`].
 */
export const CodeByHash = new C.fluent.Storage(
  client,
  "Map",
  "Optional",
  "Paras",
  "CodeByHash",
  $.tuple(_codec.$103),
  _codec.$394,
)

/** Set the storage for the parachain validation code immediately. */
export function force_set_current_code(
  value: Omit<types.polkadot_runtime_parachains.paras.pallet.Call.force_set_current_code, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Paras", value: { ...value, type: "force_set_current_code" } }
}

/** Set the storage for the current parachain head data immediately. */
export function force_set_current_head(
  value: Omit<types.polkadot_runtime_parachains.paras.pallet.Call.force_set_current_head, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Paras", value: { ...value, type: "force_set_current_head" } }
}

/** Schedule an upgrade as if it was scheduled in the given relay parent block. */
export function force_schedule_code_upgrade(
  value: Omit<
    types.polkadot_runtime_parachains.paras.pallet.Call.force_schedule_code_upgrade,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Paras", value: { ...value, type: "force_schedule_code_upgrade" } }
}

/** Note a new block head for para within the context of the current block. */
export function force_note_new_head(
  value: Omit<types.polkadot_runtime_parachains.paras.pallet.Call.force_note_new_head, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Paras", value: { ...value, type: "force_note_new_head" } }
}

/**
 * Put a parachain directly into the next session's action queue.
 * We can't queue it any sooner than this without going into the
 * initializer...
 */
export function force_queue_action(
  value: Omit<types.polkadot_runtime_parachains.paras.pallet.Call.force_queue_action, "type">,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Paras", value: { ...value, type: "force_queue_action" } }
}

/**
 * Adds the validation code to the storage.
 *
 * The code will not be added if it is already present. Additionally, if PVF pre-checking
 * is running for that code, it will be instantly accepted.
 *
 * Otherwise, the code will be added into the storage. Note that the code will be added
 * into storage with reference count 0. This is to account the fact that there are no users
 * for this code yet. The caller will have to make sure that this code eventually gets
 * used by some parachain or removed from the storage to avoid storage leaks. For the latter
 * prefer to use the `poke_unused_validation_code` dispatchable to raw storage manipulation.
 *
 * This function is mainly meant to be used for upgrading parachains that do not follow
 * the go-ahead signal while the PVF pre-checking feature is enabled.
 */
export function add_trusted_validation_code(
  value: Omit<
    types.polkadot_runtime_parachains.paras.pallet.Call.add_trusted_validation_code,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Paras", value: { ...value, type: "add_trusted_validation_code" } }
}

/**
 * Remove the validation code from the storage iff the reference count is 0.
 *
 * This is better than removing the storage directly, because it will not remove the code
 * that was suddenly got used by some parachain while this dispatchable was pending
 * dispatching.
 */
export function poke_unused_validation_code(
  value: Omit<
    types.polkadot_runtime_parachains.paras.pallet.Call.poke_unused_validation_code,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Paras", value: { ...value, type: "poke_unused_validation_code" } }
}

/**
 * Includes a statement for a PVF pre-checking vote. Potentially, finalizes the vote and
 * enacts the results if that was the last vote before achieving the supermajority.
 */
export function include_pvf_check_statement(
  value: Omit<
    types.polkadot_runtime_parachains.paras.pallet.Call.include_pvf_check_statement,
    "type"
  >,
): types.polkadot_runtime.RuntimeCall {
  return { type: "Paras", value: { ...value, type: "include_pvf_check_statement" } }
}
