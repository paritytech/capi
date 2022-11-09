import { $, C } from "./capi.ts"
import type * as t from "./mod.ts"

export const $1: $.Codec<Uint8Array> = $.sizedUint8Array(32)

export const $0: $.Codec<t.sp_core.crypto.AccountId32> = $1

export const $2: $.Codec<t.u8> = $.u8

export const $4: $.Codec<t.u32> = $.u32

export const $6: $.Codec<t.u128> = $.u128

export const $5: $.Codec<t.pallet_balances.AccountData> = $.object(["free", $6], ["reserved", $6], [
  "misc_frozen",
  $6,
], ["fee_frozen", $6])

export const $3: $.Codec<t.frame_system.AccountInfo> = $.object(
  ["nonce", $4],
  ["consumers", $4],
  ["providers", $4],
  ["sufficients", $4],
  ["data", $5],
)

export const $10: $.Codec<t.u64> = $.u64

export const $9: $.Codec<t.Compact<t.u64>> = $.compact($10)

export const $8: $.Codec<t.sp_weights.weight_v2.Weight> = $.object(["ref_time", $9], [
  "proof_size",
  $9,
])

export const $7: $.Codec<t.frame_support.dispatch.PerDispatchClass.$$sp_weights.weight_v2.Weight> =
  $.object(["normal", $8], ["operational", $8], ["mandatory", $8])

export const $11: $.Codec<t.primitive_types.H256> = $1

export const $12: $.Codec<Uint8Array> = $.uint8Array

export const $16: $.Codec<Uint8Array> = $.sizedUint8Array(4)

export const $15: $.Codec<t.sp_runtime.generic.digest.DigestItem> = $.taggedUnion("type", {
  6: ["PreRuntime", ["value", $.tuple($16, $12)]],
  4: ["Consensus", ["value", $.tuple($16, $12)]],
  5: ["Seal", ["value", $.tuple($16, $12)]],
  0: ["Other", ["value", $12]],
  8: ["RuntimeEnvironmentUpdated"],
})

export const $14: $.Codec<Array<t.sp_runtime.generic.digest.DigestItem>> = $.array($15)

export const $13: $.Codec<t.sp_runtime.generic.digest.Digest> = $.object(["logs", $14])

export const $156: $.Codec<t.frame_system.Phase> = $.taggedUnion("type", {
  0: ["ApplyExtrinsic", ["value", $4]],
  1: ["Finalization"],
  2: ["Initialization"],
})

export const $22: $.Codec<t.frame_support.dispatch.DispatchClass> = $.stringUnion({
  0: "Normal",
  1: "Operational",
  2: "Mandatory",
})

export const $23: $.Codec<t.frame_support.dispatch.Pays> = $.stringUnion({ 0: "Yes", 1: "No" })

export const $21: $.Codec<t.frame_support.dispatch.DispatchInfo> = $.object(["weight", $8], [
  "class",
  $22,
], ["pays_fee", $23])

export const $25: $.Codec<t.sp_runtime.ModuleError> = $.object(["index", $2], ["error", $16])

export const $26: $.Codec<t.sp_runtime.TokenError> = $.stringUnion({
  0: "NoFunds",
  1: "WouldDie",
  2: "BelowMinimum",
  3: "CannotCreate",
  4: "UnknownAsset",
  5: "Frozen",
  6: "Unsupported",
})

export const $27: $.Codec<t.sp_runtime.ArithmeticError> = $.stringUnion({
  0: "Underflow",
  1: "Overflow",
  2: "DivisionByZero",
})

export const $28: $.Codec<t.sp_runtime.TransactionalError> = $.stringUnion({
  0: "LimitReached",
  1: "NoLayer",
})

export const $24: $.Codec<t.sp_runtime.DispatchError> = $.taggedUnion("type", {
  0: ["Other"],
  1: ["CannotLookup"],
  2: ["BadOrigin"],
  3: ["Module", ["value", $25]],
  4: ["ConsumerRemaining"],
  5: ["NoProviders"],
  6: ["TooManyConsumers"],
  7: ["Token", ["value", $26]],
  8: ["Arithmetic", ["value", $27]],
  9: ["Transactional", ["value", $28]],
  10: ["Exhausted"],
  11: ["Corruption"],
  12: ["Unavailable"],
})

export const $20: $.Codec<t.frame_system.pallet.Event> = $.taggedUnion("type", {
  0: ["ExtrinsicSuccess", ["dispatch_info", $21]],
  1: ["ExtrinsicFailed", ["dispatch_error", $24], ["dispatch_info", $21]],
  2: ["CodeUpdated"],
  3: ["NewAccount", ["account", $0]],
  4: ["KilledAccount", ["account", $0]],
  5: ["Remarked", ["sender", $0], ["hash", $11]],
})

export const $30: $.Codec<[t.u32, t.u32]> = $.tuple($4, $4)

export const $31: $.Codec<Uint8Array | undefined> = $.option($1)

export const $33: $.Codec<null> = C.$null

export const $32: $.Codec<null | C.ChainError<t.sp_runtime.DispatchError>> = $.result(
  $33,
  $.instance(C.ChainError<t.sp_runtime.DispatchError>, ["value", $24]),
)

export const $29: $.Codec<t.pallet_scheduler.pallet.Event> = $.taggedUnion("type", {
  0: ["Scheduled", ["when", $4], ["index", $4]],
  1: ["Canceled", ["when", $4], ["index", $4]],
  2: ["Dispatched", ["task", $30], ["id", $31], ["result", $32]],
  3: ["CallUnavailable", ["task", $30], ["id", $31]],
  4: ["PeriodicFailed", ["task", $30], ["id", $31]],
  5: ["PermanentlyOverweight", ["task", $30], ["id", $31]],
})

export const $34: $.Codec<t.pallet_preimage.pallet.Event> = $.taggedUnion("type", {
  0: ["Noted", ["hash", $11]],
  1: ["Requested", ["hash", $11]],
  2: ["Cleared", ["hash", $11]],
})

export const $35: $.Codec<t.pallet_indices.pallet.Event> = $.taggedUnion("type", {
  0: ["IndexAssigned", ["who", $0], ["index", $4]],
  1: ["IndexFreed", ["index", $4]],
  2: ["IndexFrozen", ["index", $4], ["who", $0]],
})

export const $37: $.Codec<t.frame_support.traits.tokens.misc.BalanceStatus> = $.stringUnion({
  0: "Free",
  1: "Reserved",
})

export const $36: $.Codec<t.pallet_balances.pallet.Event> = $.taggedUnion("type", {
  0: ["Endowed", ["account", $0], ["free_balance", $6]],
  1: ["DustLost", ["account", $0], ["amount", $6]],
  2: ["Transfer", ["from", $0], ["to", $0], ["amount", $6]],
  3: ["BalanceSet", ["who", $0], ["free", $6], ["reserved", $6]],
  4: ["Reserved", ["who", $0], ["amount", $6]],
  5: ["Unreserved", ["who", $0], ["amount", $6]],
  6: ["ReserveRepatriated", ["from", $0], ["to", $0], ["amount", $6], ["destination_status", $37]],
  7: ["Deposit", ["who", $0], ["amount", $6]],
  8: ["Withdraw", ["who", $0], ["amount", $6]],
  9: ["Slashed", ["who", $0], ["amount", $6]],
})

export const $38: $.Codec<t.pallet_transaction_payment.pallet.Event> = $.taggedUnion("type", {
  0: ["TransactionFeePaid", ["who", $0], ["actual_fee", $6], ["tip", $6]],
})

export const $42: $.Codec<t.sp_arithmetic.per_things.Perbill> = $4

export const $41: $.Codec<t.Compact<t.sp_arithmetic.per_things.Perbill>> = $.compact($42)

export const $43: $.Codec<boolean> = $.bool

export const $40: $.Codec<t.pallet_staking.ValidatorPrefs> = $.object(["commission", $41], [
  "blocked",
  $43,
])

export const $39: $.Codec<t.pallet_staking.pallet.pallet.Event> = $.taggedUnion("type", {
  0: ["EraPaid", ["era_index", $4], ["validator_payout", $6], ["remainder", $6]],
  1: ["Rewarded", ["stash", $0], ["amount", $6]],
  2: ["Slashed", ["staker", $0], ["amount", $6]],
  3: ["OldSlashingReportDiscarded", ["session_index", $4]],
  4: ["StakersElected"],
  5: ["Bonded", ["stash", $0], ["amount", $6]],
  6: ["Unbonded", ["stash", $0], ["amount", $6]],
  7: ["Withdrawn", ["stash", $0], ["amount", $6]],
  8: ["Kicked", ["nominator", $0], ["stash", $0]],
  9: ["StakingElectionFailed"],
  10: ["Chilled", ["stash", $0]],
  11: ["PayoutStarted", ["era_index", $4], ["validator_stash", $0]],
  12: ["ValidatorPrefsSet", ["stash", $0], ["prefs", $40]],
})

export const $45: $.Codec<Uint8Array> = $.sizedUint8Array(16)

export const $44: $.Codec<t.pallet_offences.pallet.Event> = $.taggedUnion("type", {
  0: ["Offence", ["kind", $45], ["timeslot", $12]],
})

export const $46: $.Codec<t.pallet_session.pallet.Event> = $.taggedUnion("type", {
  0: ["NewSession", ["session_index", $4]],
})

export const $51: $.Codec<t.sp_core.ed25519.Public> = $1

export const $50: $.Codec<t.sp_finality_grandpa.app.Public> = $51

export const $49: $.Codec<[t.sp_finality_grandpa.app.Public, t.u64]> = $.tuple($50, $10)

export const $48: $.Codec<Array<[t.sp_finality_grandpa.app.Public, t.u64]>> = $.array($49)

export const $47: $.Codec<t.pallet_grandpa.pallet.Event> = $.taggedUnion("type", {
  0: ["NewAuthorities", ["authority_set", $48]],
  1: ["Paused"],
  2: ["Resumed"],
})

export const $54: $.Codec<t.sp_core.sr25519.Public> = $1

export const $53: $.Codec<t.pallet_im_online.sr25519.app_sr25519.Public> = $54

export const $58: $.Codec<t.Compact<t.u128>> = $.compact($6)

export const $60: $.Codec<t.pallet_staking.IndividualExposure> = $.object(["who", $0], [
  "value",
  $58,
])

export const $59: $.Codec<Array<t.pallet_staking.IndividualExposure>> = $.array($60)

export const $57: $.Codec<t.pallet_staking.Exposure> = $.object(["total", $58], ["own", $58], [
  "others",
  $59,
])

export const $56: $.Codec<[t.sp_core.crypto.AccountId32, t.pallet_staking.Exposure]> = $.tuple(
  $0,
  $57,
)

export const $55: $.Codec<Array<[t.sp_core.crypto.AccountId32, t.pallet_staking.Exposure]>> = $
  .array($56)

export const $52: $.Codec<t.pallet_im_online.pallet.Event> = $.taggedUnion("type", {
  0: ["HeartbeatReceived", ["authority_id", $53]],
  1: ["AllGood"],
  2: ["SomeOffline", ["offline", $55]],
})

export const $62: $.Codec<t.pallet_democracy.vote_threshold.VoteThreshold> = $.stringUnion({
  0: "SuperMajorityApprove",
  1: "SuperMajorityAgainst",
  2: "SimpleMajority",
})

export const $64: $.Codec<t.pallet_democracy.vote.Vote> = $2

export const $63: $.Codec<t.pallet_democracy.vote.AccountVote> = $.taggedUnion("type", {
  0: ["Standard", ["vote", $64], ["balance", $6]],
  1: ["Split", ["aye", $6], ["nay", $6]],
})

export const $61: $.Codec<t.pallet_democracy.pallet.Event> = $.taggedUnion("type", {
  0: ["Proposed", ["proposal_index", $4], ["deposit", $6]],
  1: ["Tabled", ["proposal_index", $4], ["deposit", $6]],
  2: ["ExternalTabled"],
  3: ["Started", ["ref_index", $4], ["threshold", $62]],
  4: ["Passed", ["ref_index", $4]],
  5: ["NotPassed", ["ref_index", $4]],
  6: ["Cancelled", ["ref_index", $4]],
  7: ["Delegated", ["who", $0], ["target", $0]],
  8: ["Undelegated", ["account", $0]],
  9: ["Vetoed", ["who", $0], ["proposal_hash", $11], ["until", $4]],
  10: ["Blacklisted", ["proposal_hash", $11]],
  11: ["Voted", ["voter", $0], ["ref_index", $4], ["vote", $63]],
  12: ["Seconded", ["seconder", $0], ["prop_index", $4]],
  13: ["ProposalCanceled", ["prop_index", $4]],
})

export const $65: $.Codec<t.pallet_collective.pallet.Event> = $.taggedUnion("type", {
  0: ["Proposed", ["account", $0], ["proposal_index", $4], ["proposal_hash", $11], [
    "threshold",
    $4,
  ]],
  1: ["Voted", ["account", $0], ["proposal_hash", $11], ["voted", $43], ["yes", $4], ["no", $4]],
  2: ["Approved", ["proposal_hash", $11]],
  3: ["Disapproved", ["proposal_hash", $11]],
  4: ["Executed", ["proposal_hash", $11], ["result", $32]],
  5: ["MemberExecuted", ["proposal_hash", $11], ["result", $32]],
  6: ["Closed", ["proposal_hash", $11], ["yes", $4], ["no", $4]],
})

export const $66: $.Codec<t.pallet_collective.pallet.Event> = $.taggedUnion("type", {
  0: ["Proposed", ["account", $0], ["proposal_index", $4], ["proposal_hash", $11], [
    "threshold",
    $4,
  ]],
  1: ["Voted", ["account", $0], ["proposal_hash", $11], ["voted", $43], ["yes", $4], ["no", $4]],
  2: ["Approved", ["proposal_hash", $11]],
  3: ["Disapproved", ["proposal_hash", $11]],
  4: ["Executed", ["proposal_hash", $11], ["result", $32]],
  5: ["MemberExecuted", ["proposal_hash", $11], ["result", $32]],
  6: ["Closed", ["proposal_hash", $11], ["yes", $4], ["no", $4]],
})

export const $69: $.Codec<[t.sp_core.crypto.AccountId32, t.u128]> = $.tuple($0, $6)

export const $68: $.Codec<Array<[t.sp_core.crypto.AccountId32, t.u128]>> = $.array($69)

export const $67: $.Codec<t.pallet_elections_phragmen.pallet.Event> = $.taggedUnion("type", {
  0: ["NewTerm", ["new_members", $68]],
  1: ["EmptyTerm"],
  2: ["ElectionError"],
  3: ["MemberKicked", ["member", $0]],
  4: ["Renounced", ["candidate", $0]],
  5: ["CandidateSlashed", ["candidate", $0], ["amount", $6]],
  6: ["SeatHolderSlashed", ["seat_holder", $0], ["amount", $6]],
})

export const $70: $.Codec<t.pallet_membership.pallet.Event> = $.stringUnion({
  0: "MemberAdded",
  1: "MemberRemoved",
  2: "MembersSwapped",
  3: "MembersReset",
  4: "KeyChanged",
  5: "Dummy",
})

export const $71: $.Codec<t.pallet_treasury.pallet.Event> = $.taggedUnion("type", {
  0: ["Proposed", ["proposal_index", $4]],
  1: ["Spending", ["budget_remaining", $6]],
  2: ["Awarded", ["proposal_index", $4], ["award", $6], ["account", $0]],
  3: ["Rejected", ["proposal_index", $4], ["slashed", $6]],
  4: ["Burnt", ["burnt_funds", $6]],
  5: ["Rollover", ["rollover_balance", $6]],
  6: ["Deposit", ["value", $6]],
  7: ["SpendApproved", ["proposal_index", $4], ["amount", $6], ["beneficiary", $0]],
})

export const $74: $.Codec<Uint8Array> = $.sizedUint8Array(20)

export const $73: $.Codec<t.polkadot_runtime_common.claims.EthereumAddress> = $74

export const $72: $.Codec<t.polkadot_runtime_common.claims.pallet.Event> = $.taggedUnion("type", {
  0: ["Claimed", ["who", $0], ["ethereum_address", $73], ["amount", $6]],
})

export const $75: $.Codec<t.pallet_vesting.pallet.Event> = $.taggedUnion("type", {
  0: ["VestingUpdated", ["account", $0], ["unvested", $6]],
  1: ["VestingCompleted", ["account", $0]],
})

export const $76: $.Codec<t.pallet_utility.pallet.Event> = $.taggedUnion("type", {
  0: ["BatchInterrupted", ["index", $4], ["error", $24]],
  1: ["BatchCompleted"],
  2: ["BatchCompletedWithErrors"],
  3: ["ItemCompleted"],
  4: ["ItemFailed", ["error", $24]],
  5: ["DispatchedAs", ["result", $32]],
})

export const $77: $.Codec<t.pallet_identity.pallet.Event> = $.taggedUnion("type", {
  0: ["IdentitySet", ["who", $0]],
  1: ["IdentityCleared", ["who", $0], ["deposit", $6]],
  2: ["IdentityKilled", ["who", $0], ["deposit", $6]],
  3: ["JudgementRequested", ["who", $0], ["registrar_index", $4]],
  4: ["JudgementUnrequested", ["who", $0], ["registrar_index", $4]],
  5: ["JudgementGiven", ["target", $0], ["registrar_index", $4]],
  6: ["RegistrarAdded", ["registrar_index", $4]],
  7: ["SubIdentityAdded", ["sub", $0], ["main", $0], ["deposit", $6]],
  8: ["SubIdentityRemoved", ["sub", $0], ["main", $0], ["deposit", $6]],
  9: ["SubIdentityRevoked", ["sub", $0], ["main", $0], ["deposit", $6]],
})

export const $79: $.Codec<t.polkadot_runtime.ProxyType> = $.stringUnion({
  0: "Any",
  1: "NonTransfer",
  2: "Governance",
  3: "Staking",
  5: "IdentityJudgement",
  6: "CancelProxy",
  7: "Auction",
})

export const $80: $.Codec<t.u16> = $.u16

export const $78: $.Codec<t.pallet_proxy.pallet.Event> = $.taggedUnion("type", {
  0: ["ProxyExecuted", ["result", $32]],
  1: ["PureCreated", ["pure", $0], ["who", $0], ["proxy_type", $79], ["disambiguation_index", $80]],
  2: ["Announced", ["real", $0], ["proxy", $0], ["call_hash", $11]],
  3: ["ProxyAdded", ["delegator", $0], ["delegatee", $0], ["proxy_type", $79], ["delay", $4]],
  4: ["ProxyRemoved", ["delegator", $0], ["delegatee", $0], ["proxy_type", $79], ["delay", $4]],
})

export const $82: $.Codec<t.pallet_multisig.Timepoint> = $.object(["height", $4], ["index", $4])

export const $81: $.Codec<t.pallet_multisig.pallet.Event> = $.taggedUnion("type", {
  0: ["NewMultisig", ["approving", $0], ["multisig", $0], ["call_hash", $1]],
  1: ["MultisigApproval", ["approving", $0], ["timepoint", $82], ["multisig", $0], [
    "call_hash",
    $1,
  ]],
  2: ["MultisigExecuted", ["approving", $0], ["timepoint", $82], ["multisig", $0], [
    "call_hash",
    $1,
  ], ["result", $32]],
  3: ["MultisigCancelled", ["cancelling", $0], ["timepoint", $82], ["multisig", $0], [
    "call_hash",
    $1,
  ]],
})

export const $83: $.Codec<t.pallet_bounties.pallet.Event> = $.taggedUnion("type", {
  0: ["BountyProposed", ["index", $4]],
  1: ["BountyRejected", ["index", $4], ["bond", $6]],
  2: ["BountyBecameActive", ["index", $4]],
  3: ["BountyAwarded", ["index", $4], ["beneficiary", $0]],
  4: ["BountyClaimed", ["index", $4], ["payout", $6], ["beneficiary", $0]],
  5: ["BountyCanceled", ["index", $4]],
  6: ["BountyExtended", ["index", $4]],
})

export const $84: $.Codec<t.pallet_child_bounties.pallet.Event> = $.taggedUnion("type", {
  0: ["Added", ["index", $4], ["child_index", $4]],
  1: ["Awarded", ["index", $4], ["child_index", $4], ["beneficiary", $0]],
  2: ["Claimed", ["index", $4], ["child_index", $4], ["payout", $6], ["beneficiary", $0]],
  3: ["Canceled", ["index", $4], ["child_index", $4]],
})

export const $85: $.Codec<t.pallet_tips.pallet.Event> = $.taggedUnion("type", {
  0: ["NewTip", ["tip_hash", $11]],
  1: ["TipClosing", ["tip_hash", $11]],
  2: ["TipClosed", ["tip_hash", $11], ["who", $0], ["payout", $6]],
  3: ["TipRetracted", ["tip_hash", $11]],
  4: ["TipSlashed", ["tip_hash", $11], ["finder", $0], ["deposit", $6]],
})

export const $87: $.Codec<t.pallet_election_provider_multi_phase.ElectionCompute> = $.stringUnion({
  0: "OnChain",
  1: "Signed",
  2: "Unsigned",
  3: "Fallback",
  4: "Emergency",
})

export const $88: $.Codec<t.sp_npos_elections.ElectionScore> = $.object(["minimal_stake", $6], [
  "sum_stake",
  $6,
], ["sum_stake_squared", $6])

export const $86: $.Codec<t.pallet_election_provider_multi_phase.pallet.Event> = $.taggedUnion(
  "type",
  {
    0: ["SolutionStored", ["compute", $87], ["prev_ejected", $43]],
    1: ["ElectionFinalized", ["compute", $87], ["score", $88]],
    2: ["ElectionFailed"],
    3: ["Rewarded", ["account", $0], ["value", $6]],
    4: ["Slashed", ["account", $0], ["value", $6]],
    5: ["SignedPhaseStarted", ["round", $4]],
    6: ["UnsignedPhaseStarted", ["round", $4]],
  },
)

export const $89: $.Codec<t.pallet_bags_list.pallet.Event> = $.taggedUnion("type", {
  0: ["Rebagged", ["who", $0], ["from", $10], ["to", $10]],
  1: ["ScoreUpdated", ["who", $0], ["new_score", $10]],
})

export const $91: $.Codec<t.pallet_nomination_pools.PoolState> = $.stringUnion({
  0: "Open",
  1: "Blocked",
  2: "Destroying",
})

export const $92: $.Codec<t.sp_core.crypto.AccountId32 | undefined> = $.option($0)

export const $90: $.Codec<t.pallet_nomination_pools.pallet.Event> = $.taggedUnion("type", {
  0: ["Created", ["depositor", $0], ["pool_id", $4]],
  1: ["Bonded", ["member", $0], ["pool_id", $4], ["bonded", $6], ["joined", $43]],
  2: ["PaidOut", ["member", $0], ["pool_id", $4], ["payout", $6]],
  3: ["Unbonded", ["member", $0], ["pool_id", $4], ["balance", $6], ["points", $6], ["era", $4]],
  4: ["Withdrawn", ["member", $0], ["pool_id", $4], ["balance", $6], ["points", $6]],
  5: ["Destroyed", ["pool_id", $4]],
  6: ["StateChanged", ["pool_id", $4], ["new_state", $91]],
  7: ["MemberRemoved", ["pool_id", $4], ["member", $0]],
  8: ["RolesUpdated", ["root", $92], ["state_toggler", $92], ["nominator", $92]],
  9: ["PoolSlashed", ["pool_id", $4], ["balance", $6]],
  10: ["UnbondingPoolSlashed", ["pool_id", $4], ["era", $4], ["balance", $6]],
})

export const $94: $.Codec<Array<t.u32>> = $.array($4)

export const $93: $.Codec<t.pallet_fast_unstake.pallet.Event> = $.taggedUnion("type", {
  0: ["Unstaked", ["stash", $0], ["result", $32]],
  1: ["Slashed", ["stash", $0], ["amount", $6]],
  2: ["Checking", ["stash", $0], ["eras", $94]],
  3: ["Errored", ["stash", $0]],
  4: ["InternalError"],
})

export const $98: $.Codec<t.polkadot_parachain.primitives.Id> = $4

export const $99: $.Codec<t.polkadot_primitives.v2.collator_app.Public> = $54

export const $102: $.Codec<Uint8Array> = $.sizedUint8Array(64)

export const $101: $.Codec<t.sp_core.sr25519.Signature> = $102

export const $100: $.Codec<t.polkadot_primitives.v2.collator_app.Signature> = $101

export const $103: $.Codec<t.polkadot_parachain.primitives.ValidationCodeHash> = $11

export const $97: $.Codec<t.polkadot_primitives.v2.CandidateDescriptor> = $.object(
  ["para_id", $98],
  ["relay_parent", $11],
  ["collator", $99],
  ["persisted_validation_data_hash", $11],
  ["pov_hash", $11],
  ["erasure_root", $11],
  ["signature", $100],
  ["para_head", $11],
  ["validation_code_hash", $103],
)

export const $96: $.Codec<t.polkadot_primitives.v2.CandidateReceipt> = $.object(
  ["descriptor", $97],
  ["commitments_hash", $11],
)

export const $104: $.Codec<t.polkadot_parachain.primitives.HeadData> = $12

export const $105: $.Codec<t.polkadot_primitives.v2.CoreIndex> = $4

export const $106: $.Codec<t.polkadot_primitives.v2.GroupIndex> = $4

export const $95: $.Codec<t.polkadot_runtime_parachains.inclusion.pallet.Event> = $.taggedUnion(
  "type",
  {
    0: ["CandidateBacked", ["value", $.tuple($96, $104, $105, $106)]],
    1: ["CandidateIncluded", ["value", $.tuple($96, $104, $105, $106)]],
    2: ["CandidateTimedOut", ["value", $.tuple($96, $104, $105)]],
  },
)

export const $107: $.Codec<t.polkadot_runtime_parachains.paras.pallet.Event> = $.taggedUnion(
  "type",
  {
    0: ["CurrentCodeUpdated", ["value", $98]],
    1: ["CurrentHeadUpdated", ["value", $98]],
    2: ["CodeUpgradeScheduled", ["value", $98]],
    3: ["NewHeadNoted", ["value", $98]],
    4: ["ActionQueued", ["value", $.tuple($98, $4)]],
    5: ["PvfCheckStarted", ["value", $.tuple($103, $98)]],
    6: ["PvfCheckAccepted", ["value", $.tuple($103, $98)]],
    7: ["PvfCheckRejected", ["value", $.tuple($103, $98)]],
  },
)

export const $110: $.Codec<t.xcm.v2.traits.Error> = $.taggedUnion("type", {
  0: ["Overflow"],
  1: ["Unimplemented"],
  2: ["UntrustedReserveLocation"],
  3: ["UntrustedTeleportLocation"],
  4: ["MultiLocationFull"],
  5: ["MultiLocationNotInvertible"],
  6: ["BadOrigin"],
  7: ["InvalidLocation"],
  8: ["AssetNotFound"],
  9: ["FailedToTransactAsset"],
  10: ["NotWithdrawable"],
  11: ["LocationCannotHold"],
  12: ["ExceedsMaxMessageSize"],
  13: ["DestinationUnsupported"],
  14: ["Transport"],
  15: ["Unroutable"],
  16: ["UnknownClaim"],
  17: ["FailedToDecode"],
  18: ["MaxWeightInvalid"],
  19: ["NotHoldingFees"],
  20: ["TooExpensive"],
  21: ["Trap", ["value", $10]],
  22: ["UnhandledXcmVersion"],
  23: ["WeightLimitReached", ["value", $10]],
  24: ["Barrier"],
  25: ["WeightNotComputable"],
})

export const $109: $.Codec<t.xcm.v2.traits.Outcome> = $.taggedUnion("type", {
  0: ["Complete", ["value", $10]],
  1: ["Incomplete", ["value", $.tuple($10, $110)]],
  2: ["Error", ["value", $110]],
})

export const $108: $.Codec<t.polkadot_runtime_parachains.ump.pallet.Event> = $.taggedUnion("type", {
  0: ["InvalidFormat", ["value", $1]],
  1: ["UnsupportedVersion", ["value", $1]],
  2: ["ExecutedUpward", ["value", $.tuple($1, $109)]],
  3: ["WeightExhausted", ["value", $.tuple($1, $8, $8)]],
  4: ["UpwardMessagesReceived", ["value", $.tuple($98, $4, $4)]],
  5: ["OverweightEnqueued", ["value", $.tuple($98, $1, $10, $8)]],
  6: ["OverweightServiced", ["value", $.tuple($10, $8)]],
})

export const $112: $.Codec<t.polkadot_parachain.primitives.HrmpChannelId> = $.object([
  "sender",
  $98,
], ["recipient", $98])

export const $111: $.Codec<t.polkadot_runtime_parachains.hrmp.pallet.Event> = $.taggedUnion(
  "type",
  {
    0: ["OpenChannelRequested", ["value", $.tuple($98, $98, $4, $4)]],
    1: ["OpenChannelCanceled", ["value", $.tuple($98, $112)]],
    2: ["OpenChannelAccepted", ["value", $.tuple($98, $98)]],
    3: ["ChannelClosed", ["value", $.tuple($98, $112)]],
    4: ["HrmpChannelForceOpened", ["value", $.tuple($98, $98, $4, $4)]],
  },
)

export const $114: $.Codec<t.polkadot_core_primitives.CandidateHash> = $11

export const $115: $.Codec<t.polkadot_runtime_parachains.disputes.DisputeLocation> = $.stringUnion({
  0: "Local",
  1: "Remote",
})

export const $116: $.Codec<t.polkadot_runtime_parachains.disputes.DisputeResult> = $.stringUnion({
  0: "Valid",
  1: "Invalid",
})

export const $113: $.Codec<t.polkadot_runtime_parachains.disputes.pallet.Event> = $.taggedUnion(
  "type",
  {
    0: ["DisputeInitiated", ["value", $.tuple($114, $115)]],
    1: ["DisputeConcluded", ["value", $.tuple($114, $116)]],
    2: ["DisputeTimedOut", ["value", $114]],
    3: ["Revert", ["value", $4]],
  },
)

export const $117: $.Codec<t.polkadot_runtime_common.paras_registrar.pallet.Event> = $.taggedUnion(
  "type",
  {
    0: ["Registered", ["para_id", $98], ["manager", $0]],
    1: ["Deregistered", ["para_id", $98]],
    2: ["Reserved", ["para_id", $98], ["who", $0]],
  },
)

export const $118: $.Codec<t.polkadot_runtime_common.slots.pallet.Event> = $.taggedUnion("type", {
  0: ["NewLeasePeriod", ["lease_period", $4]],
  1: ["Leased", ["para_id", $98], ["leaser", $0], ["period_begin", $4], ["period_count", $4], [
    "extra_reserved",
    $6,
  ], ["total_amount", $6]],
})

export const $119: $.Codec<t.polkadot_runtime_common.auctions.pallet.Event> = $.taggedUnion(
  "type",
  {
    0: ["AuctionStarted", ["auction_index", $4], ["lease_period", $4], ["ending", $4]],
    1: ["AuctionClosed", ["auction_index", $4]],
    2: ["Reserved", ["bidder", $0], ["extra_reserved", $6], ["total_amount", $6]],
    3: ["Unreserved", ["bidder", $0], ["amount", $6]],
    4: ["ReserveConfiscated", ["para_id", $98], ["leaser", $0], ["amount", $6]],
    5: ["BidAccepted", ["bidder", $0], ["para_id", $98], ["amount", $6], ["first_slot", $4], [
      "last_slot",
      $4,
    ]],
    6: ["WinningOffset", ["auction_index", $4], ["block_number", $4]],
  },
)

export const $120: $.Codec<t.polkadot_runtime_common.crowdloan.pallet.Event> = $.taggedUnion(
  "type",
  {
    0: ["Created", ["para_id", $98]],
    1: ["Contributed", ["who", $0], ["fund_index", $98], ["amount", $6]],
    2: ["Withdrew", ["who", $0], ["fund_index", $98], ["amount", $6]],
    3: ["PartiallyRefunded", ["para_id", $98]],
    4: ["AllRefunded", ["para_id", $98]],
    5: ["Dissolved", ["para_id", $98]],
    6: ["HandleBidResult", ["para_id", $98], ["result", $32]],
    7: ["Edited", ["para_id", $98]],
    8: ["MemoUpdated", ["who", $0], ["para_id", $98], ["memo", $12]],
    9: ["AddedToNewRaise", ["para_id", $98]],
  },
)

export const $125: $.Codec<t.Compact<t.u32>> = $.compact($4)

export const $127: $.Codec<Uint8Array> = $12

export const $126: $.Codec<t.xcm.v0.junction.NetworkId> = $.taggedUnion("type", {
  0: ["Any"],
  1: ["Named", ["value", $127]],
  2: ["Polkadot"],
  3: ["Kusama"],
})

export const $128: $.Codec<t.xcm.v0.junction.BodyId> = $.taggedUnion("type", {
  0: ["Unit"],
  1: ["Named", ["value", $127]],
  2: ["Index", ["value", $125]],
  3: ["Executive"],
  4: ["Technical"],
  5: ["Legislative"],
  6: ["Judicial"],
})

export const $129: $.Codec<t.xcm.v0.junction.BodyPart> = $.taggedUnion("type", {
  0: ["Voice"],
  1: ["Members", ["count", $125]],
  2: ["Fraction", ["nom", $125], ["denom", $125]],
  3: ["AtLeastProportion", ["nom", $125], ["denom", $125]],
  4: ["MoreThanProportion", ["nom", $125], ["denom", $125]],
})

export const $124: $.Codec<t.xcm.v1.junction.Junction> = $.taggedUnion("type", {
  0: ["Parachain", ["value", $125]],
  1: ["AccountId32", ["network", $126], ["id", $1]],
  2: ["AccountIndex64", ["network", $126], ["index", $9]],
  3: ["AccountKey20", ["network", $126], ["key", $74]],
  4: ["PalletInstance", ["value", $2]],
  5: ["GeneralIndex", ["value", $58]],
  6: ["GeneralKey", ["value", $127]],
  7: ["OnlyChild"],
  8: ["Plurality", ["id", $128], ["part", $129]],
})

export const $123: $.Codec<t.xcm.v1.multilocation.Junctions> = $.taggedUnion("type", {
  0: ["Here"],
  1: ["X1", ["value", $124]],
  2: ["X2", ["value", $.tuple($124, $124)]],
  3: ["X3", ["value", $.tuple($124, $124, $124)]],
  4: ["X4", ["value", $.tuple($124, $124, $124, $124)]],
  5: ["X5", ["value", $.tuple($124, $124, $124, $124, $124)]],
  6: ["X6", ["value", $.tuple($124, $124, $124, $124, $124, $124)]],
  7: ["X7", ["value", $.tuple($124, $124, $124, $124, $124, $124, $124)]],
  8: ["X8", ["value", $.tuple($124, $124, $124, $124, $124, $124, $124, $124)]],
})

export const $122: $.Codec<t.xcm.v1.multilocation.MultiLocation> = $.object(["parents", $2], [
  "interior",
  $123,
])

export const $136: $.Codec<t.xcm.v1.multiasset.AssetId> = $.taggedUnion("type", {
  0: ["Concrete", ["value", $122]],
  1: ["Abstract", ["value", $12]],
})

export const $139: $.Codec<Uint8Array> = $.sizedUint8Array(8)

export const $138: $.Codec<t.xcm.v1.multiasset.AssetInstance> = $.taggedUnion("type", {
  0: ["Undefined"],
  1: ["Index", ["value", $58]],
  2: ["Array4", ["value", $16]],
  3: ["Array8", ["value", $139]],
  4: ["Array16", ["value", $45]],
  5: ["Array32", ["value", $1]],
  6: ["Blob", ["value", $12]],
})

export const $137: $.Codec<t.xcm.v1.multiasset.Fungibility> = $.taggedUnion("type", {
  0: ["Fungible", ["value", $58]],
  1: ["NonFungible", ["value", $138]],
})

export const $135: $.Codec<t.xcm.v1.multiasset.MultiAsset> = $.object(["id", $136], ["fun", $137])

export const $134: $.Codec<Array<t.xcm.v1.multiasset.MultiAsset>> = $.array($135)

export const $133: $.Codec<t.xcm.v1.multiasset.MultiAssets> = $134

export const $142: $.Codec<[t.u32, t.xcm.v2.traits.Error]> = $.tuple($4, $110)

export const $141: $.Codec<[t.u32, t.xcm.v2.traits.Error] | undefined> = $.option($142)

export const $140: $.Codec<t.xcm.v2.Response> = $.taggedUnion("type", {
  0: ["Null"],
  1: ["Assets", ["value", $133]],
  2: ["ExecutionResult", ["value", $141]],
  3: ["Version", ["value", $4]],
})

export const $143: $.Codec<t.xcm.v0.OriginKind> = $.stringUnion({
  0: "Native",
  1: "SovereignAccount",
  2: "Superuser",
  3: "Xcm",
})

export const $144: $.Codec<{ encoded: Uint8Array }> = $.object(["encoded", $12])

export const $147: $.Codec<t.xcm.v1.multiasset.WildFungibility> = $.stringUnion({
  0: "Fungible",
  1: "NonFungible",
})

export const $146: $.Codec<t.xcm.v1.multiasset.WildMultiAsset> = $.taggedUnion("type", {
  0: ["All"],
  1: ["AllOf", ["id", $136], ["fun", $147]],
})

export const $145: $.Codec<t.xcm.v1.multiasset.MultiAssetFilter> = $.taggedUnion("type", {
  0: ["Definite", ["value", $133]],
  1: ["Wild", ["value", $146]],
})

export const $148: $.Codec<t.xcm.v2.WeightLimit> = $.taggedUnion("type", {
  0: ["Unlimited"],
  1: ["Limited", ["value", $9]],
})

export const $132: $.Codec<t.xcm.v2.Instruction> = $.taggedUnion("type", {
  0: ["WithdrawAsset", ["value", $133]],
  1: ["ReserveAssetDeposited", ["value", $133]],
  2: ["ReceiveTeleportedAsset", ["value", $133]],
  3: ["QueryResponse", ["query_id", $9], ["response", $140], ["max_weight", $9]],
  4: ["TransferAsset", ["assets", $133], ["beneficiary", $122]],
  5: ["TransferReserveAsset", ["assets", $133], ["dest", $122], ["xcm", $.deferred(() => $130)]],
  6: ["Transact", ["origin_type", $143], ["require_weight_at_most", $9], ["call", $144]],
  7: ["HrmpNewChannelOpenRequest", ["sender", $125], ["max_message_size", $125], [
    "max_capacity",
    $125,
  ]],
  8: ["HrmpChannelAccepted", ["recipient", $125]],
  9: ["HrmpChannelClosing", ["initiator", $125], ["sender", $125], ["recipient", $125]],
  10: ["ClearOrigin"],
  11: ["DescendOrigin", ["value", $123]],
  12: ["ReportError", ["query_id", $9], ["dest", $122], ["max_response_weight", $9]],
  13: ["DepositAsset", ["assets", $145], ["max_assets", $125], ["beneficiary", $122]],
  14: ["DepositReserveAsset", ["assets", $145], ["max_assets", $125], ["dest", $122], [
    "xcm",
    $.deferred(() => $130),
  ]],
  15: ["ExchangeAsset", ["give", $145], ["receive", $133]],
  16: ["InitiateReserveWithdraw", ["assets", $145], ["reserve", $122], [
    "xcm",
    $.deferred(() => $130),
  ]],
  17: ["InitiateTeleport", ["assets", $145], ["dest", $122], ["xcm", $.deferred(() => $130)]],
  18: ["QueryHolding", ["query_id", $9], ["dest", $122], ["assets", $145], [
    "max_response_weight",
    $9,
  ]],
  19: ["BuyExecution", ["fees", $135], ["weight_limit", $148]],
  20: ["RefundSurplus"],
  21: ["SetErrorHandler", ["value", $.deferred(() => $130)]],
  22: ["SetAppendix", ["value", $.deferred(() => $130)]],
  23: ["ClearError"],
  24: ["ClaimAsset", ["assets", $133], ["ticket", $122]],
  25: ["Trap", ["value", $9]],
  26: ["SubscribeVersion", ["query_id", $9], ["max_response_weight", $9]],
  27: ["UnsubscribeVersion"],
})

export const $131: $.Codec<Array<t.xcm.v2.Instruction>> = $.array($132)

export const $130: $.Codec<Array<t.xcm.v2.Instruction>> = $131

export const $149: $.Codec<t.xcm.v1.multilocation.MultiLocation | undefined> = $.option($122)

export const $154: $.Codec<t.xcm.v0.junction.Junction> = $.taggedUnion("type", {
  0: ["Parent"],
  1: ["Parachain", ["value", $125]],
  2: ["AccountId32", ["network", $126], ["id", $1]],
  3: ["AccountIndex64", ["network", $126], ["index", $9]],
  4: ["AccountKey20", ["network", $126], ["key", $74]],
  5: ["PalletInstance", ["value", $2]],
  6: ["GeneralIndex", ["value", $58]],
  7: ["GeneralKey", ["value", $127]],
  8: ["OnlyChild"],
  9: ["Plurality", ["id", $128], ["part", $129]],
})

export const $153: $.Codec<t.xcm.v0.multi_location.MultiLocation> = $.taggedUnion("type", {
  0: ["Null"],
  1: ["X1", ["value", $154]],
  2: ["X2", ["value", $.tuple($154, $154)]],
  3: ["X3", ["value", $.tuple($154, $154, $154)]],
  4: ["X4", ["value", $.tuple($154, $154, $154, $154)]],
  5: ["X5", ["value", $.tuple($154, $154, $154, $154, $154)]],
  6: ["X6", ["value", $.tuple($154, $154, $154, $154, $154, $154)]],
  7: ["X7", ["value", $.tuple($154, $154, $154, $154, $154, $154, $154)]],
  8: ["X8", ["value", $.tuple($154, $154, $154, $154, $154, $154, $154, $154)]],
})

export const $152: $.Codec<t.xcm.v0.multi_asset.MultiAsset> = $.taggedUnion("type", {
  0: ["None"],
  1: ["All"],
  2: ["AllFungible"],
  3: ["AllNonFungible"],
  4: ["AllAbstractFungible", ["id", $12]],
  5: ["AllAbstractNonFungible", ["class", $12]],
  6: ["AllConcreteFungible", ["id", $153]],
  7: ["AllConcreteNonFungible", ["class", $153]],
  8: ["AbstractFungible", ["id", $12], ["amount", $58]],
  9: ["AbstractNonFungible", ["class", $12], ["instance", $138]],
  10: ["ConcreteFungible", ["id", $153], ["amount", $58]],
  11: ["ConcreteNonFungible", ["class", $153], ["instance", $138]],
})

export const $151: $.Codec<Array<t.xcm.v0.multi_asset.MultiAsset>> = $.array($152)

export const $150: $.Codec<t.xcm.VersionedMultiAssets> = $.taggedUnion("type", {
  0: ["V0", ["value", $151]],
  1: ["V1", ["value", $133]],
})

export const $155: $.Codec<t.xcm.VersionedMultiLocation> = $.taggedUnion("type", {
  0: ["V0", ["value", $153]],
  1: ["V1", ["value", $122]],
})

export const $121: $.Codec<t.pallet_xcm.pallet.Event> = $.taggedUnion("type", {
  0: ["Attempted", ["value", $109]],
  1: ["Sent", ["value", $.tuple($122, $122, $130)]],
  2: ["UnexpectedResponse", ["value", $.tuple($122, $10)]],
  3: ["ResponseReady", ["value", $.tuple($10, $140)]],
  4: ["Notified", ["value", $.tuple($10, $2, $2)]],
  5: ["NotifyOverweight", ["value", $.tuple($10, $2, $2, $8, $8)]],
  6: ["NotifyDispatchError", ["value", $.tuple($10, $2, $2)]],
  7: ["NotifyDecodeFailed", ["value", $.tuple($10, $2, $2)]],
  8: ["InvalidResponder", ["value", $.tuple($122, $10, $149)]],
  9: ["InvalidResponderVersion", ["value", $.tuple($122, $10)]],
  10: ["ResponseTaken", ["value", $10]],
  11: ["AssetsTrapped", ["value", $.tuple($11, $122, $150)]],
  12: ["VersionChangeNotified", ["value", $.tuple($122, $4)]],
  13: ["SupportedVersionChanged", ["value", $.tuple($122, $4)]],
  14: ["NotifyTargetSendFail", ["value", $.tuple($122, $10, $110)]],
  15: ["NotifyTargetMigrationFail", ["value", $.tuple($155, $10)]],
  16: ["AssetsClaimed", ["value", $.tuple($11, $122, $150)]],
})

export const $19: $.Codec<t.polkadot_runtime.RuntimeEvent> = $.taggedUnion("type", {
  0: ["System", ["value", $20]],
  1: ["Scheduler", ["value", $29]],
  10: ["Preimage", ["value", $34]],
  4: ["Indices", ["value", $35]],
  5: ["Balances", ["value", $36]],
  32: ["TransactionPayment", ["value", $38]],
  7: ["Staking", ["value", $39]],
  8: ["Offences", ["value", $44]],
  9: ["Session", ["value", $46]],
  11: ["Grandpa", ["value", $47]],
  12: ["ImOnline", ["value", $52]],
  14: ["Democracy", ["value", $61]],
  15: ["Council", ["value", $65]],
  16: ["TechnicalCommittee", ["value", $66]],
  17: ["PhragmenElection", ["value", $67]],
  18: ["TechnicalMembership", ["value", $70]],
  19: ["Treasury", ["value", $71]],
  24: ["Claims", ["value", $72]],
  25: ["Vesting", ["value", $75]],
  26: ["Utility", ["value", $76]],
  28: ["Identity", ["value", $77]],
  29: ["Proxy", ["value", $78]],
  30: ["Multisig", ["value", $81]],
  34: ["Bounties", ["value", $83]],
  38: ["ChildBounties", ["value", $84]],
  35: ["Tips", ["value", $85]],
  36: ["ElectionProviderMultiPhase", ["value", $86]],
  37: ["VoterList", ["value", $89]],
  39: ["NominationPools", ["value", $90]],
  40: ["FastUnstake", ["value", $93]],
  53: ["ParaInclusion", ["value", $95]],
  56: ["Paras", ["value", $107]],
  59: ["Ump", ["value", $108]],
  60: ["Hrmp", ["value", $111]],
  62: ["ParasDisputes", ["value", $113]],
  70: ["Registrar", ["value", $117]],
  71: ["Slots", ["value", $118]],
  72: ["Auctions", ["value", $119]],
  73: ["Crowdloan", ["value", $120]],
  99: ["XcmPallet", ["value", $121]],
})

export const $157: $.Codec<Array<t.primitive_types.H256>> = $.array($11)

export const $18: $.Codec<t.frame_system.EventRecord> = $.object(["phase", $156], ["event", $19], [
  "topics",
  $157,
])

export const $17: $.Codec<Array<t.frame_system.EventRecord>> = $.array($18)

export const $158: $.Codec<Array<[t.u32, t.u32]>> = $.array($30)

export const $160: $.Codec<string> = $.str

export const $159: $.Codec<t.frame_system.LastRuntimeUpgradeInfo> = $.object(
  ["spec_version", $125],
  ["spec_name", $160],
)

export const $163: $.Codec<[Uint8Array, Uint8Array]> = $.tuple($12, $12)

export const $162: $.Codec<Array<[Uint8Array, Uint8Array]>> = $.array($163)

export const $164: $.Codec<Array<Uint8Array>> = $.array($12)

export const $161: $.Codec<t.frame_system.pallet.Call> = $.taggedUnion("type", {
  0: ["fill_block", ["ratio", $42]],
  1: ["remark", ["remark", $12]],
  2: ["set_heap_pages", ["pages", $10]],
  3: ["set_code", ["code", $12]],
  4: ["set_code_without_checks", ["code", $12]],
  5: ["set_storage", ["items", $162]],
  6: ["kill_storage", ["keys", $164]],
  7: ["kill_prefix", ["prefix", $12], ["subkeys", $4]],
  8: ["remark_with_event", ["remark", $12]],
})

export const $168: $.Codec<t.sp_weights.weight_v2.Weight | undefined> = $.option($8)

export const $167: $.Codec<t.frame_system.limits.WeightsPerClass> = $.object(
  ["base_extrinsic", $8],
  ["max_extrinsic", $168],
  ["max_total", $168],
  ["reserved", $168],
)

export const $166: $.Codec<
  t.frame_support.dispatch.PerDispatchClass.$$frame_system.limits.WeightsPerClass
> = $.object(["normal", $167], ["operational", $167], ["mandatory", $167])

export const $165: $.Codec<t.frame_system.limits.BlockWeights> = $.object(["base_block", $8], [
  "max_block",
  $8,
], ["per_class", $166])

export const $170: $.Codec<t.frame_support.dispatch.PerDispatchClass.$$u32> = $.object(
  ["normal", $4],
  ["operational", $4],
  ["mandatory", $4],
)

export const $169: $.Codec<t.frame_system.limits.BlockLength> = $.object(["max", $170])

export const $171: $.Codec<t.sp_weights.RuntimeDbWeight> = $.object(["read", $10], ["write", $10])

export const $175: $.Codec<[Uint8Array, t.u32]> = $.tuple($139, $4)

export const $174: $.Codec<Array<[Uint8Array, t.u32]>> = $.array($175)

export const $173: $.Codec<Array<[Uint8Array, t.u32]>> = $174

export const $172: $.Codec<t.sp_version.RuntimeVersion> = $.object(
  ["spec_name", $160],
  ["impl_name", $160],
  ["authoring_version", $4],
  ["spec_version", $4],
  ["impl_version", $4],
  ["apis", $173],
  ["transaction_version", $4],
  ["state_version", $2],
)

export const $176: $.Codec<t.frame_system.pallet.Error> = $.stringUnion({
  0: "InvalidSpecName",
  1: "SpecVersionNeedsToIncrease",
  2: "FailedToExtractRuntimeVersion",
  3: "NonDefaultComposite",
  4: "NonZeroRefCount",
  5: "CallFiltered",
})

export const $448: $.Codec<Uint8Array> = $12

export const $180: $.Codec<t.frame_support.traits.preimages.Bounded> = $.taggedUnion("type", {
  0: ["Legacy", ["hash", $11]],
  1: ["Inline", ["value", $448]],
  2: ["Lookup", ["hash", $11], ["len", $4]],
})

export const $183: $.Codec<[t.u32, t.u32] | undefined> = $.option($30)

export const $257: $.Codec<t.frame_support.dispatch.RawOrigin> = $.taggedUnion("type", {
  0: ["Root"],
  1: ["Signed", ["value", $0]],
  2: ["None"],
})

export const $258: $.Codec<t.pallet_collective.RawOrigin> = $.taggedUnion("type", {
  0: ["Members", ["value", $.tuple($4, $4)]],
  1: ["Member", ["value", $0]],
  2: ["_Phantom"],
})

export const $259: $.Codec<t.pallet_collective.RawOrigin> = $.taggedUnion("type", {
  0: ["Members", ["value", $.tuple($4, $4)]],
  1: ["Member", ["value", $0]],
  2: ["_Phantom"],
})

export const $260: $.Codec<t.polkadot_runtime_parachains.origin.pallet.Origin> = $.taggedUnion(
  "type",
  { 0: ["Parachain", ["value", $98]] },
)

export const $261: $.Codec<t.pallet_xcm.pallet.Origin> = $.taggedUnion("type", {
  0: ["Xcm", ["value", $122]],
  1: ["Response", ["value", $122]],
})

export const $262: $.Codec<t.sp_core.Void> = $.never

export const $256: $.Codec<t.polkadot_runtime.OriginCaller> = $.taggedUnion("type", {
  0: ["system", ["value", $257]],
  15: ["Council", ["value", $258]],
  16: ["TechnicalCommittee", ["value", $259]],
  50: ["ParachainsOrigin", ["value", $260]],
  99: ["XcmPallet", ["value", $261]],
  5: ["Void", ["value", $262]],
})

export const $179: $.Codec<t.pallet_scheduler.Scheduled> = $.object(
  ["maybe_id", $31],
  ["priority", $2],
  ["call", $180],
  ["maybe_periodic", $183],
  ["origin", $256],
)

export const $178: $.Codec<t.pallet_scheduler.Scheduled | undefined> = $.option($179)

export const $449: $.Codec<Array<t.pallet_scheduler.Scheduled | undefined>> = $.array($178)

export const $177: $.Codec<Array<t.pallet_scheduler.Scheduled | undefined>> = $449

export const $182: $.Codec<t.pallet_scheduler.pallet.Call> = $.taggedUnion("type", {
  0: ["schedule", ["when", $4], ["maybe_periodic", $183], ["priority", $2], [
    "call",
    $.deferred(() => $181),
  ]],
  1: ["cancel", ["when", $4], ["index", $4]],
  2: ["schedule_named", ["id", $1], ["when", $4], ["maybe_periodic", $183], ["priority", $2], [
    "call",
    $.deferred(() => $181),
  ]],
  3: ["cancel_named", ["id", $1]],
  4: ["schedule_after", ["after", $4], ["maybe_periodic", $183], ["priority", $2], [
    "call",
    $.deferred(() => $181),
  ]],
  5: [
    "schedule_named_after",
    ["id", $1],
    ["after", $4],
    ["maybe_periodic", $183],
    ["priority", $2],
    ["call", $.deferred(() => $181)],
  ],
})

export const $184: $.Codec<t.pallet_preimage.pallet.Call> = $.taggedUnion("type", {
  0: ["note_preimage", ["bytes", $12]],
  1: ["unnote_preimage", ["hash", $11]],
  2: ["request_preimage", ["hash", $11]],
  3: ["unrequest_preimage", ["hash", $11]],
})

export const $189: $.Codec<t.sp_consensus_babe.app.Public> = $54

export const $190: $.Codec<t.sp_consensus_slots.Slot> = $10

export const $187: $.Codec<t.sp_runtime.generic.header.Header> = $.object(
  ["parent_hash", $11],
  ["number", $125],
  ["state_root", $11],
  ["extrinsics_root", $11],
  ["digest", $13],
)

export const $186: $.Codec<t.sp_consensus_slots.EquivocationProof> = $.object(
  ["offender", $189],
  ["slot", $190],
  ["first_header", $187],
  ["second_header", $187],
)

export const $191: $.Codec<t.sp_session.MembershipProof> = $.object(["session", $4], [
  "trie_nodes",
  $164,
], ["validator_count", $4])

export const $193: $.Codec<[t.u64, t.u64]> = $.tuple($10, $10)

export const $194: $.Codec<t.sp_consensus_babe.AllowedSlots> = $.stringUnion({
  0: "PrimarySlots",
  1: "PrimaryAndSecondaryPlainSlots",
  2: "PrimaryAndSecondaryVRFSlots",
})

export const $192: $.Codec<t.sp_consensus_babe.digests.NextConfigDescriptor> = $.taggedUnion(
  "type",
  { 1: ["V1", ["c", $193], ["allowed_slots", $194]] },
)

export const $185: $.Codec<t.pallet_babe.pallet.Call> = $.taggedUnion("type", {
  0: ["report_equivocation", ["equivocation_proof", $186], ["key_owner_proof", $191]],
  1: ["report_equivocation_unsigned", ["equivocation_proof", $186], ["key_owner_proof", $191]],
  2: ["plan_config_change", ["config", $192]],
})

export const $195: $.Codec<t.pallet_timestamp.pallet.Call> = $.taggedUnion("type", {
  0: ["set", ["now", $9]],
})

export const $198: $.Codec<t.Compact<null>> = $.compact($33)

export const $197: $.Codec<t.sp_runtime.multiaddress.MultiAddress> = $.taggedUnion("type", {
  0: ["Id", ["value", $0]],
  1: ["Index", ["value", $198]],
  2: ["Raw", ["value", $12]],
  3: ["Address32", ["value", $1]],
  4: ["Address20", ["value", $74]],
})

export const $196: $.Codec<t.pallet_indices.pallet.Call> = $.taggedUnion("type", {
  0: ["claim", ["index", $4]],
  1: ["transfer", ["new", $197], ["index", $4]],
  2: ["free", ["index", $4]],
  3: ["force_transfer", ["new", $197], ["index", $4], ["freeze", $43]],
  4: ["freeze", ["index", $4]],
})

export const $199: $.Codec<t.pallet_balances.pallet.Call> = $.taggedUnion("type", {
  0: ["transfer", ["dest", $197], ["value", $58]],
  1: ["set_balance", ["who", $197], ["new_free", $58], ["new_reserved", $58]],
  2: ["force_transfer", ["source", $197], ["dest", $197], ["value", $58]],
  3: ["transfer_keep_alive", ["dest", $197], ["value", $58]],
  4: ["transfer_all", ["dest", $197], ["keep_alive", $43]],
  5: ["force_unreserve", ["who", $197], ["amount", $6]],
})

export const $201: $.Codec<Array<t.sp_runtime.generic.header.Header>> = $.array($187)

export const $200: $.Codec<t.pallet_authorship.pallet.Call> = $.taggedUnion("type", {
  0: ["set_uncles", ["new_uncles", $201]],
})

export const $203: $.Codec<t.pallet_staking.RewardDestination> = $.taggedUnion("type", {
  0: ["Staked"],
  1: ["Stash"],
  2: ["Controller"],
  3: ["Account", ["value", $0]],
  4: ["None"],
})

export const $204: $.Codec<Array<t.sp_runtime.multiaddress.MultiAddress>> = $.array($197)

export const $205: $.Codec<t.sp_arithmetic.per_things.Percent> = $2

export const $206: $.Codec<Array<t.sp_core.crypto.AccountId32>> = $.array($0)

export const $207: $.Codec<t.pallet_staking.pallet.pallet.ConfigOp.$$u128> = $.taggedUnion("type", {
  0: ["Noop"],
  1: ["Set", ["value", $6]],
  2: ["Remove"],
})

export const $208: $.Codec<t.pallet_staking.pallet.pallet.ConfigOp.$$u32> = $.taggedUnion("type", {
  0: ["Noop"],
  1: ["Set", ["value", $4]],
  2: ["Remove"],
})

export const $209: $.Codec<
  t.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Percent
> = $.taggedUnion("type", { 0: ["Noop"], 1: ["Set", ["value", $205]], 2: ["Remove"] })

export const $210: $.Codec<
  t.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Perbill
> = $.taggedUnion("type", { 0: ["Noop"], 1: ["Set", ["value", $42]], 2: ["Remove"] })

export const $202: $.Codec<t.pallet_staking.pallet.pallet.Call> = $.taggedUnion("type", {
  0: ["bond", ["controller", $197], ["value", $58], ["payee", $203]],
  1: ["bond_extra", ["max_additional", $58]],
  2: ["unbond", ["value", $58]],
  3: ["withdraw_unbonded", ["num_slashing_spans", $4]],
  4: ["validate", ["prefs", $40]],
  5: ["nominate", ["targets", $204]],
  6: ["chill"],
  7: ["set_payee", ["payee", $203]],
  8: ["set_controller", ["controller", $197]],
  9: ["set_validator_count", ["new", $125]],
  10: ["increase_validator_count", ["additional", $125]],
  11: ["scale_validator_count", ["factor", $205]],
  12: ["force_no_eras"],
  13: ["force_new_era"],
  14: ["set_invulnerables", ["invulnerables", $206]],
  15: ["force_unstake", ["stash", $0], ["num_slashing_spans", $4]],
  16: ["force_new_era_always"],
  17: ["cancel_deferred_slash", ["era", $4], ["slash_indices", $94]],
  18: ["payout_stakers", ["validator_stash", $0], ["era", $4]],
  19: ["rebond", ["value", $58]],
  20: ["reap_stash", ["stash", $0], ["num_slashing_spans", $4]],
  21: ["kick", ["who", $204]],
  22: [
    "set_staking_configs",
    ["min_nominator_bond", $207],
    ["min_validator_bond", $207],
    ["max_nominator_count", $208],
    ["max_validator_count", $208],
    ["chill_threshold", $209],
    ["min_commission", $210],
  ],
  23: ["chill_other", ["controller", $0]],
  24: ["force_apply_min_commission", ["validator_stash", $0]],
})

export const $213: $.Codec<t.polkadot_primitives.v2.validator_app.Public> = $54

export const $214: $.Codec<t.polkadot_primitives.v2.assignment_app.Public> = $54

export const $215: $.Codec<t.sp_authority_discovery.app.Public> = $54

export const $212: $.Codec<t.polkadot_runtime.SessionKeys> = $.object(
  ["grandpa", $50],
  ["babe", $189],
  ["im_online", $53],
  ["para_validator", $213],
  ["para_assignment", $214],
  ["authority_discovery", $215],
)

export const $211: $.Codec<t.pallet_session.pallet.Call> = $.taggedUnion("type", {
  0: ["set_keys", ["keys", $212], ["proof", $12]],
  1: ["purge_keys"],
})

export const $220: $.Codec<t.finality_grandpa.Prevote> = $.object(["target_hash", $11], [
  "target_number",
  $4,
])

export const $222: $.Codec<t.sp_core.ed25519.Signature> = $102

export const $221: $.Codec<t.sp_finality_grandpa.app.Signature> = $222

export const $223: $.Codec<[t.finality_grandpa.Prevote, t.sp_finality_grandpa.app.Signature]> = $
  .tuple($220, $221)

export const $219: $.Codec<t.finality_grandpa.Equivocation.$$finality_grandpa.Prevote> = $.object(
  ["round_number", $10],
  ["identity", $50],
  ["first", $223],
  ["second", $223],
)

export const $225: $.Codec<t.finality_grandpa.Precommit> = $.object(["target_hash", $11], [
  "target_number",
  $4,
])

export const $226: $.Codec<[t.finality_grandpa.Precommit, t.sp_finality_grandpa.app.Signature]> = $
  .tuple($225, $221)

export const $224: $.Codec<t.finality_grandpa.Equivocation.$$finality_grandpa.Precommit> = $.object(
  ["round_number", $10],
  ["identity", $50],
  ["first", $226],
  ["second", $226],
)

export const $218: $.Codec<t.sp_finality_grandpa.Equivocation> = $.taggedUnion("type", {
  0: ["Prevote", ["value", $219]],
  1: ["Precommit", ["value", $224]],
})

export const $217: $.Codec<t.sp_finality_grandpa.EquivocationProof> = $.object(["set_id", $10], [
  "equivocation",
  $218,
])

export const $216: $.Codec<t.pallet_grandpa.pallet.Call> = $.taggedUnion("type", {
  0: ["report_equivocation", ["equivocation_proof", $217], ["key_owner_proof", $191]],
  1: ["report_equivocation_unsigned", ["equivocation_proof", $217], ["key_owner_proof", $191]],
  2: ["note_stalled", ["delay", $4], ["best_finalized_block_number", $4]],
})

export const $230: $.Codec<t.sp_core.OpaquePeerId> = $12

export const $232: $.Codec<t.sp_core.offchain.OpaqueMultiaddr> = $12

export const $231: $.Codec<Array<t.sp_core.offchain.OpaqueMultiaddr>> = $.array($232)

export const $229: $.Codec<t.sp_core.offchain.OpaqueNetworkState> = $.object(["peer_id", $230], [
  "external_addresses",
  $231,
])

export const $228: $.Codec<t.pallet_im_online.Heartbeat> = $.object(
  ["block_number", $4],
  ["network_state", $229],
  ["session_index", $4],
  ["authority_index", $4],
  ["validators_len", $4],
)

export const $233: $.Codec<t.pallet_im_online.sr25519.app_sr25519.Signature> = $101

export const $227: $.Codec<t.pallet_im_online.pallet.Call> = $.taggedUnion("type", {
  0: ["heartbeat", ["heartbeat", $228], ["signature", $233]],
})

export const $235: $.Codec<t.pallet_democracy.conviction.Conviction> = $.stringUnion({
  0: "None",
  1: "Locked1x",
  2: "Locked2x",
  3: "Locked3x",
  4: "Locked4x",
  5: "Locked5x",
  6: "Locked6x",
})

export const $236: $.Codec<t.u32 | undefined> = $.option($4)

export const $234: $.Codec<t.pallet_democracy.pallet.Call> = $.taggedUnion("type", {
  0: ["propose", ["proposal", $180], ["value", $58]],
  1: ["second", ["proposal", $125]],
  2: ["vote", ["ref_index", $125], ["vote", $63]],
  3: ["emergency_cancel", ["ref_index", $4]],
  4: ["external_propose", ["proposal", $180]],
  5: ["external_propose_majority", ["proposal", $180]],
  6: ["external_propose_default", ["proposal", $180]],
  7: ["fast_track", ["proposal_hash", $11], ["voting_period", $4], ["delay", $4]],
  8: ["veto_external", ["proposal_hash", $11]],
  9: ["cancel_referendum", ["ref_index", $125]],
  10: ["delegate", ["to", $197], ["conviction", $235], ["balance", $6]],
  11: ["undelegate"],
  12: ["clear_public_proposals"],
  13: ["unlock", ["target", $197]],
  14: ["remove_vote", ["index", $4]],
  15: ["remove_other_vote", ["target", $197], ["index", $4]],
  16: ["blacklist", ["proposal_hash", $11], ["maybe_ref_index", $236]],
  17: ["cancel_proposal", ["prop_index", $125]],
})

export const $239: $.Codec<t.sp_weights.OldWeight> = $10

export const $238: $.Codec<t.Compact<t.sp_weights.OldWeight>> = $.compact($239)

export const $237: $.Codec<t.pallet_collective.pallet.Call> = $.taggedUnion("type", {
  0: ["set_members", ["new_members", $206], ["prime", $92], ["old_count", $4]],
  1: ["execute", ["proposal", $.deferred(() => $181)], ["length_bound", $125]],
  2: ["propose", ["threshold", $125], ["proposal", $.deferred(() => $181)], ["length_bound", $125]],
  3: ["vote", ["proposal", $11], ["index", $125], ["approve", $43]],
  4: [
    "close_old_weight",
    ["proposal_hash", $11],
    ["index", $125],
    ["proposal_weight_bound", $238],
    ["length_bound", $125],
  ],
  5: ["disapprove_proposal", ["proposal_hash", $11]],
  6: ["close", ["proposal_hash", $11], ["index", $125], ["proposal_weight_bound", $8], [
    "length_bound",
    $125,
  ]],
})

export const $240: $.Codec<t.pallet_collective.pallet.Call> = $.taggedUnion("type", {
  0: ["set_members", ["new_members", $206], ["prime", $92], ["old_count", $4]],
  1: ["execute", ["proposal", $.deferred(() => $181)], ["length_bound", $125]],
  2: ["propose", ["threshold", $125], ["proposal", $.deferred(() => $181)], ["length_bound", $125]],
  3: ["vote", ["proposal", $11], ["index", $125], ["approve", $43]],
  4: [
    "close_old_weight",
    ["proposal_hash", $11],
    ["index", $125],
    ["proposal_weight_bound", $238],
    ["length_bound", $125],
  ],
  5: ["disapprove_proposal", ["proposal_hash", $11]],
  6: ["close", ["proposal_hash", $11], ["index", $125], ["proposal_weight_bound", $8], [
    "length_bound",
    $125,
  ]],
})

export const $242: $.Codec<t.pallet_elections_phragmen.Renouncing> = $.taggedUnion("type", {
  0: ["Member"],
  1: ["RunnerUp"],
  2: ["Candidate", ["value", $125]],
})

export const $241: $.Codec<t.pallet_elections_phragmen.pallet.Call> = $.taggedUnion("type", {
  0: ["vote", ["votes", $206], ["value", $58]],
  1: ["remove_voter"],
  2: ["submit_candidacy", ["candidate_count", $125]],
  3: ["renounce_candidacy", ["renouncing", $242]],
  4: ["remove_member", ["who", $197], ["slash_bond", $43], ["rerun_election", $43]],
  5: ["clean_defunct_voters", ["num_voters", $4], ["num_defunct", $4]],
})

export const $243: $.Codec<t.pallet_membership.pallet.Call> = $.taggedUnion("type", {
  0: ["add_member", ["who", $197]],
  1: ["remove_member", ["who", $197]],
  2: ["swap_member", ["remove", $197], ["add", $197]],
  3: ["reset_members", ["members", $206]],
  4: ["change_key", ["new", $197]],
  5: ["set_prime", ["who", $197]],
  6: ["clear_prime"],
})

export const $244: $.Codec<t.pallet_treasury.pallet.Call> = $.taggedUnion("type", {
  0: ["propose_spend", ["value", $58], ["beneficiary", $197]],
  1: ["reject_proposal", ["proposal_id", $125]],
  2: ["approve_proposal", ["proposal_id", $125]],
  3: ["spend", ["amount", $58], ["beneficiary", $197]],
  4: ["remove_approval", ["proposal_id", $125]],
})

export const $247: $.Codec<Uint8Array> = $.sizedUint8Array(65)

export const $246: $.Codec<t.polkadot_runtime_common.claims.EcdsaSignature> = $247

export const $249: $.Codec<[t.u128, t.u128, t.u32]> = $.tuple($6, $6, $4)

export const $248: $.Codec<[t.u128, t.u128, t.u32] | undefined> = $.option($249)

export const $251: $.Codec<t.polkadot_runtime_common.claims.StatementKind> = $.stringUnion({
  0: "Regular",
  1: "Saft",
})

export const $250: $.Codec<t.polkadot_runtime_common.claims.StatementKind | undefined> = $.option(
  $251,
)

export const $245: $.Codec<t.polkadot_runtime_common.claims.pallet.Call> = $.taggedUnion("type", {
  0: ["claim", ["dest", $0], ["ethereum_signature", $246]],
  1: ["mint_claim", ["who", $73], ["value", $6], ["vesting_schedule", $248], ["statement", $250]],
  2: ["claim_attest", ["dest", $0], ["ethereum_signature", $246], ["statement", $12]],
  3: ["attest", ["statement", $12]],
  4: ["move_claim", ["old", $73], ["new", $73], ["maybe_preclaim", $92]],
})

export const $253: $.Codec<t.pallet_vesting.vesting_info.VestingInfo> = $.object(["locked", $6], [
  "per_block",
  $6,
], ["starting_block", $4])

export const $252: $.Codec<t.pallet_vesting.pallet.Call> = $.taggedUnion("type", {
  0: ["vest"],
  1: ["vest_other", ["target", $197]],
  2: ["vested_transfer", ["target", $197], ["schedule", $253]],
  3: ["force_vested_transfer", ["source", $197], ["target", $197], ["schedule", $253]],
  4: ["merge_schedules", ["schedule1_index", $4], ["schedule2_index", $4]],
})

export const $255: $.Codec<Array<t.polkadot_runtime.RuntimeCall>> = $.array($.deferred(() => $181))

export const $254: $.Codec<t.pallet_utility.pallet.Call> = $.taggedUnion("type", {
  0: ["batch", ["calls", $255]],
  1: ["as_derivative", ["index", $80], ["call", $.deferred(() => $181)]],
  2: ["batch_all", ["calls", $255]],
  3: ["dispatch_as", ["as_origin", $256], ["call", $.deferred(() => $181)]],
  4: ["force_batch", ["calls", $255]],
})

export const $268: $.Codec<Uint8Array> = $.sizedUint8Array(0)

export const $269: $.Codec<Uint8Array> = $.sizedUint8Array(1)

export const $270: $.Codec<Uint8Array> = $.sizedUint8Array(2)

export const $271: $.Codec<Uint8Array> = $.sizedUint8Array(3)

export const $272: $.Codec<Uint8Array> = $.sizedUint8Array(5)

export const $273: $.Codec<Uint8Array> = $.sizedUint8Array(6)

export const $274: $.Codec<Uint8Array> = $.sizedUint8Array(7)

export const $275: $.Codec<Uint8Array> = $.sizedUint8Array(9)

export const $276: $.Codec<Uint8Array> = $.sizedUint8Array(10)

export const $277: $.Codec<Uint8Array> = $.sizedUint8Array(11)

export const $278: $.Codec<Uint8Array> = $.sizedUint8Array(12)

export const $279: $.Codec<Uint8Array> = $.sizedUint8Array(13)

export const $280: $.Codec<Uint8Array> = $.sizedUint8Array(14)

export const $281: $.Codec<Uint8Array> = $.sizedUint8Array(15)

export const $282: $.Codec<Uint8Array> = $.sizedUint8Array(17)

export const $283: $.Codec<Uint8Array> = $.sizedUint8Array(18)

export const $284: $.Codec<Uint8Array> = $.sizedUint8Array(19)

export const $285: $.Codec<Uint8Array> = $.sizedUint8Array(21)

export const $286: $.Codec<Uint8Array> = $.sizedUint8Array(22)

export const $287: $.Codec<Uint8Array> = $.sizedUint8Array(23)

export const $288: $.Codec<Uint8Array> = $.sizedUint8Array(24)

export const $289: $.Codec<Uint8Array> = $.sizedUint8Array(25)

export const $290: $.Codec<Uint8Array> = $.sizedUint8Array(26)

export const $291: $.Codec<Uint8Array> = $.sizedUint8Array(27)

export const $292: $.Codec<Uint8Array> = $.sizedUint8Array(28)

export const $293: $.Codec<Uint8Array> = $.sizedUint8Array(29)

export const $294: $.Codec<Uint8Array> = $.sizedUint8Array(30)

export const $295: $.Codec<Uint8Array> = $.sizedUint8Array(31)

export const $267: $.Codec<t.pallet_identity.types.Data> = $.taggedUnion("type", {
  0: ["None"],
  1: ["Raw0", ["value", $268]],
  2: ["Raw1", ["value", $269]],
  3: ["Raw2", ["value", $270]],
  4: ["Raw3", ["value", $271]],
  5: ["Raw4", ["value", $16]],
  6: ["Raw5", ["value", $272]],
  7: ["Raw6", ["value", $273]],
  8: ["Raw7", ["value", $274]],
  9: ["Raw8", ["value", $139]],
  10: ["Raw9", ["value", $275]],
  11: ["Raw10", ["value", $276]],
  12: ["Raw11", ["value", $277]],
  13: ["Raw12", ["value", $278]],
  14: ["Raw13", ["value", $279]],
  15: ["Raw14", ["value", $280]],
  16: ["Raw15", ["value", $281]],
  17: ["Raw16", ["value", $45]],
  18: ["Raw17", ["value", $282]],
  19: ["Raw18", ["value", $283]],
  20: ["Raw19", ["value", $284]],
  21: ["Raw20", ["value", $74]],
  22: ["Raw21", ["value", $285]],
  23: ["Raw22", ["value", $286]],
  24: ["Raw23", ["value", $287]],
  25: ["Raw24", ["value", $288]],
  26: ["Raw25", ["value", $289]],
  27: ["Raw26", ["value", $290]],
  28: ["Raw27", ["value", $291]],
  29: ["Raw28", ["value", $292]],
  30: ["Raw29", ["value", $293]],
  31: ["Raw30", ["value", $294]],
  32: ["Raw31", ["value", $295]],
  33: ["Raw32", ["value", $1]],
  34: ["BlakeTwo256", ["value", $1]],
  35: ["Sha256", ["value", $1]],
  36: ["Keccak256", ["value", $1]],
  37: ["ShaThree256", ["value", $1]],
})

export const $266: $.Codec<[t.pallet_identity.types.Data, t.pallet_identity.types.Data]> = $.tuple(
  $267,
  $267,
)

export const $296: $.Codec<Array<[t.pallet_identity.types.Data, t.pallet_identity.types.Data]>> = $
  .array($266)

export const $265: $.Codec<Array<[t.pallet_identity.types.Data, t.pallet_identity.types.Data]>> =
  $296

export const $297: $.Codec<Uint8Array | undefined> = $.option($74)

export const $264: $.Codec<t.pallet_identity.types.IdentityInfo> = $.object(
  ["additional", $265],
  ["display", $267],
  ["legal", $267],
  ["web", $267],
  ["riot", $267],
  ["email", $267],
  ["pgp_fingerprint", $297],
  ["image", $267],
  ["twitter", $267],
)

export const $299: $.Codec<[t.sp_core.crypto.AccountId32, t.pallet_identity.types.Data]> = $.tuple(
  $0,
  $267,
)

export const $298: $.Codec<Array<[t.sp_core.crypto.AccountId32, t.pallet_identity.types.Data]>> = $
  .array($299)

export const $300: $.Codec<t.u64> = $10

export const $302: $.Codec<t.pallet_identity.types.Judgement> = $.taggedUnion("type", {
  0: ["Unknown"],
  1: ["FeePaid", ["value", $6]],
  2: ["Reasonable"],
  3: ["KnownGood"],
  4: ["OutOfDate"],
  5: ["LowQuality"],
  6: ["Erroneous"],
})

export const $263: $.Codec<t.pallet_identity.pallet.Call> = $.taggedUnion("type", {
  0: ["add_registrar", ["account", $197]],
  1: ["set_identity", ["info", $264]],
  2: ["set_subs", ["subs", $298]],
  3: ["clear_identity"],
  4: ["request_judgement", ["reg_index", $125], ["max_fee", $58]],
  5: ["cancel_request", ["reg_index", $4]],
  6: ["set_fee", ["index", $125], ["fee", $58]],
  7: ["set_account_id", ["index", $125], ["new", $197]],
  8: ["set_fields", ["index", $125], ["fields", $300]],
  9: ["provide_judgement", ["reg_index", $125], ["target", $197], ["judgement", $302], [
    "identity",
    $11,
  ]],
  10: ["kill_identity", ["target", $197]],
  11: ["add_sub", ["sub", $197], ["data", $267]],
  12: ["rename_sub", ["sub", $197], ["data", $267]],
  13: ["remove_sub", ["sub", $197]],
  14: ["quit_sub"],
})

export const $304: $.Codec<t.polkadot_runtime.ProxyType | undefined> = $.option($79)

export const $303: $.Codec<t.pallet_proxy.pallet.Call> = $.taggedUnion("type", {
  0: ["proxy", ["real", $197], ["force_proxy_type", $304], ["call", $.deferred(() => $181)]],
  1: ["add_proxy", ["delegate", $197], ["proxy_type", $79], ["delay", $4]],
  2: ["remove_proxy", ["delegate", $197], ["proxy_type", $79], ["delay", $4]],
  3: ["remove_proxies"],
  4: ["create_pure", ["proxy_type", $79], ["delay", $4], ["index", $80]],
  5: ["kill_pure", ["spawner", $197], ["proxy_type", $79], ["index", $80], ["height", $125], [
    "ext_index",
    $125,
  ]],
  6: ["announce", ["real", $197], ["call_hash", $11]],
  7: ["remove_announcement", ["real", $197], ["call_hash", $11]],
  8: ["reject_announcement", ["delegate", $197], ["call_hash", $11]],
  9: ["proxy_announced", ["delegate", $197], ["real", $197], ["force_proxy_type", $304], [
    "call",
    $.deferred(() => $181),
  ]],
})

export const $306: $.Codec<t.pallet_multisig.Timepoint | undefined> = $.option($82)

export const $305: $.Codec<t.pallet_multisig.pallet.Call> = $.taggedUnion("type", {
  0: ["as_multi_threshold_1", ["other_signatories", $206], ["call", $.deferred(() => $181)]],
  1: ["as_multi", ["threshold", $80], ["other_signatories", $206], ["maybe_timepoint", $306], [
    "call",
    $.deferred(() => $181),
  ], ["max_weight", $8]],
  2: [
    "approve_as_multi",
    ["threshold", $80],
    ["other_signatories", $206],
    ["maybe_timepoint", $306],
    ["call_hash", $1],
    ["max_weight", $8],
  ],
  3: ["cancel_as_multi", ["threshold", $80], ["other_signatories", $206], ["timepoint", $82], [
    "call_hash",
    $1,
  ]],
})

export const $307: $.Codec<t.pallet_bounties.pallet.Call> = $.taggedUnion("type", {
  0: ["propose_bounty", ["value", $58], ["description", $12]],
  1: ["approve_bounty", ["bounty_id", $125]],
  2: ["propose_curator", ["bounty_id", $125], ["curator", $197], ["fee", $58]],
  3: ["unassign_curator", ["bounty_id", $125]],
  4: ["accept_curator", ["bounty_id", $125]],
  5: ["award_bounty", ["bounty_id", $125], ["beneficiary", $197]],
  6: ["claim_bounty", ["bounty_id", $125]],
  7: ["close_bounty", ["bounty_id", $125]],
  8: ["extend_bounty_expiry", ["bounty_id", $125], ["remark", $12]],
})

export const $308: $.Codec<t.pallet_child_bounties.pallet.Call> = $.taggedUnion("type", {
  0: ["add_child_bounty", ["parent_bounty_id", $125], ["value", $58], ["description", $12]],
  1: ["propose_curator", ["parent_bounty_id", $125], ["child_bounty_id", $125], ["curator", $197], [
    "fee",
    $58,
  ]],
  2: ["accept_curator", ["parent_bounty_id", $125], ["child_bounty_id", $125]],
  3: ["unassign_curator", ["parent_bounty_id", $125], ["child_bounty_id", $125]],
  4: ["award_child_bounty", ["parent_bounty_id", $125], ["child_bounty_id", $125], [
    "beneficiary",
    $197,
  ]],
  5: ["claim_child_bounty", ["parent_bounty_id", $125], ["child_bounty_id", $125]],
  6: ["close_child_bounty", ["parent_bounty_id", $125], ["child_bounty_id", $125]],
})

export const $309: $.Codec<t.pallet_tips.pallet.Call> = $.taggedUnion("type", {
  0: ["report_awesome", ["reason", $12], ["who", $197]],
  1: ["retract_tip", ["hash", $11]],
  2: ["tip_new", ["reason", $12], ["who", $197], ["tip_value", $58]],
  3: ["tip", ["hash", $11], ["tip_value", $58]],
  4: ["close_tip", ["hash", $11]],
  5: ["slash_tip", ["hash", $11]],
})

export const $315: $.Codec<t.Compact<t.u16>> = $.compact($80)

export const $314: $.Codec<[t.Compact<t.u32>, t.Compact<t.u16>]> = $.tuple($125, $315)

export const $313: $.Codec<Array<[t.Compact<t.u32>, t.Compact<t.u16>]>> = $.array($314)

export const $320: $.Codec<t.sp_arithmetic.per_things.PerU16> = $80

export const $319: $.Codec<t.Compact<t.sp_arithmetic.per_things.PerU16>> = $.compact($320)

export const $318: $.Codec<[t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>]> = $
  .tuple($315, $319)

export const $317: $.Codec<
  [
    t.Compact<t.u32>,
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    t.Compact<t.u16>,
  ]
> = $.tuple($125, $318, $315)

export const $316: $.Codec<
  Array<
    [
      t.Compact<t.u32>,
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      t.Compact<t.u16>,
    ]
  >
> = $.array($317)

export const $323: $.Codec<
  [
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
  ]
> = $.sizedArray($318, 2)

export const $322: $.Codec<
  [
    t.Compact<t.u32>,
    [
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    ],
    t.Compact<t.u16>,
  ]
> = $.tuple($125, $323, $315)

export const $321: $.Codec<
  Array<
    [
      t.Compact<t.u32>,
      [
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      ],
      t.Compact<t.u16>,
    ]
  >
> = $.array($322)

export const $326: $.Codec<
  [
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
  ]
> = $.sizedArray($318, 3)

export const $325: $.Codec<
  [
    t.Compact<t.u32>,
    [
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    ],
    t.Compact<t.u16>,
  ]
> = $.tuple($125, $326, $315)

export const $324: $.Codec<
  Array<
    [
      t.Compact<t.u32>,
      [
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      ],
      t.Compact<t.u16>,
    ]
  >
> = $.array($325)

export const $329: $.Codec<
  [
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
  ]
> = $.sizedArray($318, 4)

export const $328: $.Codec<
  [
    t.Compact<t.u32>,
    [
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    ],
    t.Compact<t.u16>,
  ]
> = $.tuple($125, $329, $315)

export const $327: $.Codec<
  Array<
    [
      t.Compact<t.u32>,
      [
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      ],
      t.Compact<t.u16>,
    ]
  >
> = $.array($328)

export const $332: $.Codec<
  [
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
  ]
> = $.sizedArray($318, 5)

export const $331: $.Codec<
  [
    t.Compact<t.u32>,
    [
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    ],
    t.Compact<t.u16>,
  ]
> = $.tuple($125, $332, $315)

export const $330: $.Codec<
  Array<
    [
      t.Compact<t.u32>,
      [
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      ],
      t.Compact<t.u16>,
    ]
  >
> = $.array($331)

export const $335: $.Codec<
  [
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
  ]
> = $.sizedArray($318, 6)

export const $334: $.Codec<
  [
    t.Compact<t.u32>,
    [
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    ],
    t.Compact<t.u16>,
  ]
> = $.tuple($125, $335, $315)

export const $333: $.Codec<
  Array<
    [
      t.Compact<t.u32>,
      [
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      ],
      t.Compact<t.u16>,
    ]
  >
> = $.array($334)

export const $338: $.Codec<
  [
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
  ]
> = $.sizedArray($318, 7)

export const $337: $.Codec<
  [
    t.Compact<t.u32>,
    [
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    ],
    t.Compact<t.u16>,
  ]
> = $.tuple($125, $338, $315)

export const $336: $.Codec<
  Array<
    [
      t.Compact<t.u32>,
      [
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      ],
      t.Compact<t.u16>,
    ]
  >
> = $.array($337)

export const $341: $.Codec<
  [
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
  ]
> = $.sizedArray($318, 8)

export const $340: $.Codec<
  [
    t.Compact<t.u32>,
    [
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    ],
    t.Compact<t.u16>,
  ]
> = $.tuple($125, $341, $315)

export const $339: $.Codec<
  Array<
    [
      t.Compact<t.u32>,
      [
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      ],
      t.Compact<t.u16>,
    ]
  >
> = $.array($340)

export const $344: $.Codec<
  [
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
  ]
> = $.sizedArray($318, 9)

export const $343: $.Codec<
  [
    t.Compact<t.u32>,
    [
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    ],
    t.Compact<t.u16>,
  ]
> = $.tuple($125, $344, $315)

export const $342: $.Codec<
  Array<
    [
      t.Compact<t.u32>,
      [
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      ],
      t.Compact<t.u16>,
    ]
  >
> = $.array($343)

export const $347: $.Codec<
  [
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
  ]
> = $.sizedArray($318, 10)

export const $346: $.Codec<
  [
    t.Compact<t.u32>,
    [
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    ],
    t.Compact<t.u16>,
  ]
> = $.tuple($125, $347, $315)

export const $345: $.Codec<
  Array<
    [
      t.Compact<t.u32>,
      [
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      ],
      t.Compact<t.u16>,
    ]
  >
> = $.array($346)

export const $350: $.Codec<
  [
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
  ]
> = $.sizedArray($318, 11)

export const $349: $.Codec<
  [
    t.Compact<t.u32>,
    [
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    ],
    t.Compact<t.u16>,
  ]
> = $.tuple($125, $350, $315)

export const $348: $.Codec<
  Array<
    [
      t.Compact<t.u32>,
      [
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      ],
      t.Compact<t.u16>,
    ]
  >
> = $.array($349)

export const $353: $.Codec<
  [
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
  ]
> = $.sizedArray($318, 12)

export const $352: $.Codec<
  [
    t.Compact<t.u32>,
    [
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    ],
    t.Compact<t.u16>,
  ]
> = $.tuple($125, $353, $315)

export const $351: $.Codec<
  Array<
    [
      t.Compact<t.u32>,
      [
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      ],
      t.Compact<t.u16>,
    ]
  >
> = $.array($352)

export const $356: $.Codec<
  [
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
  ]
> = $.sizedArray($318, 13)

export const $355: $.Codec<
  [
    t.Compact<t.u32>,
    [
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    ],
    t.Compact<t.u16>,
  ]
> = $.tuple($125, $356, $315)

export const $354: $.Codec<
  Array<
    [
      t.Compact<t.u32>,
      [
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      ],
      t.Compact<t.u16>,
    ]
  >
> = $.array($355)

export const $359: $.Codec<
  [
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
  ]
> = $.sizedArray($318, 14)

export const $358: $.Codec<
  [
    t.Compact<t.u32>,
    [
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    ],
    t.Compact<t.u16>,
  ]
> = $.tuple($125, $359, $315)

export const $357: $.Codec<
  Array<
    [
      t.Compact<t.u32>,
      [
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      ],
      t.Compact<t.u16>,
    ]
  >
> = $.array($358)

export const $362: $.Codec<
  [
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
  ]
> = $.sizedArray($318, 15)

export const $361: $.Codec<
  [
    t.Compact<t.u32>,
    [
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
    ],
    t.Compact<t.u16>,
  ]
> = $.tuple($125, $362, $315)

export const $360: $.Codec<
  Array<
    [
      t.Compact<t.u32>,
      [
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
        [t.Compact<t.u16>, t.Compact<t.sp_arithmetic.per_things.PerU16>],
      ],
      t.Compact<t.u16>,
    ]
  >
> = $.array($361)

export const $312: $.Codec<t.polkadot_runtime.NposCompactSolution16> = $.object(
  ["votes1", $313],
  ["votes2", $316],
  ["votes3", $321],
  ["votes4", $324],
  ["votes5", $327],
  ["votes6", $330],
  ["votes7", $333],
  ["votes8", $336],
  ["votes9", $339],
  ["votes10", $342],
  ["votes11", $345],
  ["votes12", $348],
  ["votes13", $351],
  ["votes14", $354],
  ["votes15", $357],
  ["votes16", $360],
)

export const $311: $.Codec<t.pallet_election_provider_multi_phase.RawSolution> = $.object(
  ["solution", $312],
  ["score", $88],
  ["round", $4],
)

export const $363: $.Codec<t.pallet_election_provider_multi_phase.SolutionOrSnapshotSize> = $
  .object(["voters", $125], ["targets", $125])

export const $364: $.Codec<t.sp_npos_elections.ElectionScore | undefined> = $.option($88)

export const $367: $.Codec<t.sp_npos_elections.Support> = $.object(["total", $6], ["voters", $68])

export const $366: $.Codec<[t.sp_core.crypto.AccountId32, t.sp_npos_elections.Support]> = $.tuple(
  $0,
  $367,
)

export const $365: $.Codec<Array<[t.sp_core.crypto.AccountId32, t.sp_npos_elections.Support]>> = $
  .array($366)

export const $310: $.Codec<t.pallet_election_provider_multi_phase.pallet.Call> = $.taggedUnion(
  "type",
  {
    0: ["submit_unsigned", ["raw_solution", $311], ["witness", $363]],
    1: ["set_minimum_untrusted_score", ["maybe_next_score", $364]],
    2: ["set_emergency_election_result", ["supports", $365]],
    3: ["submit", ["raw_solution", $311]],
    4: ["governance_fallback", ["maybe_max_voters", $236], ["maybe_max_targets", $236]],
  },
)

export const $368: $.Codec<t.pallet_bags_list.pallet.Call> = $.taggedUnion("type", {
  0: ["rebag", ["dislocated", $197]],
  1: ["put_in_front_of", ["lighter", $197]],
})

export const $370: $.Codec<t.pallet_nomination_pools.BondExtra> = $.taggedUnion("type", {
  0: ["FreeBalance", ["value", $6]],
  1: ["Rewards"],
})

export const $371: $.Codec<t.pallet_nomination_pools.ConfigOp.$$u128> = $.taggedUnion("type", {
  0: ["Noop"],
  1: ["Set", ["value", $6]],
  2: ["Remove"],
})

export const $372: $.Codec<t.pallet_nomination_pools.ConfigOp.$$u32> = $.taggedUnion("type", {
  0: ["Noop"],
  1: ["Set", ["value", $4]],
  2: ["Remove"],
})

export const $373: $.Codec<t.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32> = $
  .taggedUnion("type", { 0: ["Noop"], 1: ["Set", ["value", $0]], 2: ["Remove"] })

export const $369: $.Codec<t.pallet_nomination_pools.pallet.Call> = $.taggedUnion("type", {
  0: ["join", ["amount", $58], ["pool_id", $4]],
  1: ["bond_extra", ["extra", $370]],
  2: ["claim_payout"],
  3: ["unbond", ["member_account", $197], ["unbonding_points", $58]],
  4: ["pool_withdraw_unbonded", ["pool_id", $4], ["num_slashing_spans", $4]],
  5: ["withdraw_unbonded", ["member_account", $197], ["num_slashing_spans", $4]],
  6: ["create", ["amount", $58], ["root", $197], ["nominator", $197], ["state_toggler", $197]],
  7: ["nominate", ["pool_id", $4], ["validators", $206]],
  8: ["set_state", ["pool_id", $4], ["state", $91]],
  9: ["set_metadata", ["pool_id", $4], ["metadata", $12]],
  10: ["set_configs", ["min_join_bond", $371], ["min_create_bond", $371], ["max_pools", $372], [
    "max_members",
    $372,
  ], ["max_members_per_pool", $372]],
  11: ["update_roles", ["pool_id", $4], ["new_root", $373], ["new_nominator", $373], [
    "new_state_toggler",
    $373,
  ]],
  12: ["chill", ["pool_id", $4]],
})

export const $374: $.Codec<t.pallet_fast_unstake.pallet.Call> = $.taggedUnion("type", {
  0: ["register_fast_unstake"],
  1: ["deregister"],
  2: ["control", ["unchecked_eras_to_check", $4]],
})

export const $375: $.Codec<t.polkadot_runtime_parachains.configuration.pallet.Call> = $.taggedUnion(
  "type",
  {
    0: ["set_validation_upgrade_cooldown", ["new", $4]],
    1: ["set_validation_upgrade_delay", ["new", $4]],
    2: ["set_code_retention_period", ["new", $4]],
    3: ["set_max_code_size", ["new", $4]],
    4: ["set_max_pov_size", ["new", $4]],
    5: ["set_max_head_data_size", ["new", $4]],
    6: ["set_parathread_cores", ["new", $4]],
    7: ["set_parathread_retries", ["new", $4]],
    8: ["set_group_rotation_frequency", ["new", $4]],
    9: ["set_chain_availability_period", ["new", $4]],
    10: ["set_thread_availability_period", ["new", $4]],
    11: ["set_scheduling_lookahead", ["new", $4]],
    12: ["set_max_validators_per_core", ["new", $236]],
    13: ["set_max_validators", ["new", $236]],
    14: ["set_dispute_period", ["new", $4]],
    15: ["set_dispute_post_conclusion_acceptance_period", ["new", $4]],
    16: ["set_dispute_max_spam_slots", ["new", $4]],
    17: ["set_dispute_conclusion_by_time_out_period", ["new", $4]],
    18: ["set_no_show_slots", ["new", $4]],
    19: ["set_n_delay_tranches", ["new", $4]],
    20: ["set_zeroth_delay_tranche_width", ["new", $4]],
    21: ["set_needed_approvals", ["new", $4]],
    22: ["set_relay_vrf_modulo_samples", ["new", $4]],
    23: ["set_max_upward_queue_count", ["new", $4]],
    24: ["set_max_upward_queue_size", ["new", $4]],
    25: ["set_max_downward_message_size", ["new", $4]],
    26: ["set_ump_service_total_weight", ["new", $8]],
    27: ["set_max_upward_message_size", ["new", $4]],
    28: ["set_max_upward_message_num_per_candidate", ["new", $4]],
    29: ["set_hrmp_open_request_ttl", ["new", $4]],
    30: ["set_hrmp_sender_deposit", ["new", $6]],
    31: ["set_hrmp_recipient_deposit", ["new", $6]],
    32: ["set_hrmp_channel_max_capacity", ["new", $4]],
    33: ["set_hrmp_channel_max_total_size", ["new", $4]],
    34: ["set_hrmp_max_parachain_inbound_channels", ["new", $4]],
    35: ["set_hrmp_max_parathread_inbound_channels", ["new", $4]],
    36: ["set_hrmp_channel_max_message_size", ["new", $4]],
    37: ["set_hrmp_max_parachain_outbound_channels", ["new", $4]],
    38: ["set_hrmp_max_parathread_outbound_channels", ["new", $4]],
    39: ["set_hrmp_max_message_num_per_candidate", ["new", $4]],
    40: ["set_ump_max_individual_weight", ["new", $8]],
    41: ["set_pvf_checking_enabled", ["new", $43]],
    42: ["set_pvf_voting_ttl", ["new", $4]],
    43: ["set_minimum_validation_upgrade_delay", ["new", $4]],
    44: ["set_bypass_consistency_check", ["new", $43]],
  },
)

export const $376: $.Codec<t.polkadot_runtime_parachains.shared.pallet.Call> = $.never

export const $377: $.Codec<t.polkadot_runtime_parachains.inclusion.pallet.Call> = $.never

export const $383: $.Codec<$.BitSequence> = $.bitSequence

export const $382: $.Codec<t.polkadot_primitives.v2.AvailabilityBitfield> = $383

export const $385: $.Codec<t.polkadot_primitives.v2.ValidatorIndex> = $4

export const $386: $.Codec<t.polkadot_primitives.v2.validator_app.Signature> = $101

export const $381: $.Codec<t.polkadot_primitives.v2.signed.UncheckedSigned> = $.object(
  ["payload", $382],
  ["validator_index", $385],
  ["signature", $386],
)

export const $380: $.Codec<Array<t.polkadot_primitives.v2.signed.UncheckedSigned>> = $.array($381)

export const $392: $.Codec<t.polkadot_core_primitives.OutboundHrmpMessage> = $.object([
  "recipient",
  $98,
], ["data", $12])

export const $391: $.Codec<Array<t.polkadot_core_primitives.OutboundHrmpMessage>> = $.array($392)

export const $394: $.Codec<t.polkadot_parachain.primitives.ValidationCode> = $12

export const $393: $.Codec<t.polkadot_parachain.primitives.ValidationCode | undefined> = $.option(
  $394,
)

export const $390: $.Codec<t.polkadot_primitives.v2.CandidateCommitments> = $.object(
  ["upward_messages", $164],
  ["horizontal_messages", $391],
  ["new_validation_code", $393],
  ["head_data", $104],
  ["processed_downward_messages", $4],
  ["hrmp_watermark", $4],
)

export const $389: $.Codec<t.polkadot_primitives.v2.CommittedCandidateReceipt> = $.object([
  "descriptor",
  $97,
], ["commitments", $390])

export const $396: $.Codec<t.polkadot_primitives.v2.ValidityAttestation> = $.taggedUnion("type", {
  1: ["Implicit", ["value", $386]],
  2: ["Explicit", ["value", $386]],
})

export const $395: $.Codec<Array<t.polkadot_primitives.v2.ValidityAttestation>> = $.array($396)

export const $388: $.Codec<t.polkadot_primitives.v2.BackedCandidate> = $.object(
  ["candidate", $389],
  ["validity_votes", $395],
  ["validator_indices", $383],
)

export const $387: $.Codec<Array<t.polkadot_primitives.v2.BackedCandidate>> = $.array($388)

export const $402: $.Codec<t.polkadot_primitives.v2.ValidDisputeStatementKind> = $.taggedUnion(
  "type",
  {
    0: ["Explicit"],
    1: ["BackingSeconded", ["value", $11]],
    2: ["BackingValid", ["value", $11]],
    3: ["ApprovalChecking"],
  },
)

export const $403: $.Codec<t.polkadot_primitives.v2.InvalidDisputeStatementKind> = $.stringUnion({
  0: "Explicit",
})

export const $401: $.Codec<t.polkadot_primitives.v2.DisputeStatement> = $.taggedUnion("type", {
  0: ["Valid", ["value", $402]],
  1: ["Invalid", ["value", $403]],
})

export const $400: $.Codec<
  [
    t.polkadot_primitives.v2.DisputeStatement,
    t.polkadot_primitives.v2.ValidatorIndex,
    t.polkadot_primitives.v2.validator_app.Signature,
  ]
> = $.tuple($401, $385, $386)

export const $399: $.Codec<
  Array<
    [
      t.polkadot_primitives.v2.DisputeStatement,
      t.polkadot_primitives.v2.ValidatorIndex,
      t.polkadot_primitives.v2.validator_app.Signature,
    ]
  >
> = $.array($400)

export const $398: $.Codec<t.polkadot_primitives.v2.DisputeStatementSet> = $.object(
  ["candidate_hash", $114],
  ["session", $4],
  ["statements", $399],
)

export const $397: $.Codec<Array<t.polkadot_primitives.v2.DisputeStatementSet>> = $.array($398)

export const $379: $.Codec<t.polkadot_primitives.v2.InherentData> = $.object(
  ["bitfields", $380],
  ["backed_candidates", $387],
  ["disputes", $397],
  ["parent_header", $187],
)

export const $378: $.Codec<t.polkadot_runtime_parachains.paras_inherent.pallet.Call> = $
  .taggedUnion("type", { 0: ["enter", ["data", $379]] })

export const $405: $.Codec<t.polkadot_primitives.v2.PvfCheckStatement> = $.object(
  ["accept", $43],
  ["subject", $103],
  ["session_index", $4],
  ["validator_index", $385],
)

export const $404: $.Codec<t.polkadot_runtime_parachains.paras.pallet.Call> = $.taggedUnion(
  "type",
  {
    0: ["force_set_current_code", ["para", $98], ["new_code", $394]],
    1: ["force_set_current_head", ["para", $98], ["new_head", $104]],
    2: ["force_schedule_code_upgrade", ["para", $98], ["new_code", $394], [
      "relay_parent_number",
      $4,
    ]],
    3: ["force_note_new_head", ["para", $98], ["new_head", $104]],
    4: ["force_queue_action", ["para", $98]],
    5: ["add_trusted_validation_code", ["validation_code", $394]],
    6: ["poke_unused_validation_code", ["validation_code_hash", $103]],
    7: ["include_pvf_check_statement", ["stmt", $405], ["signature", $386]],
  },
)

export const $406: $.Codec<t.polkadot_runtime_parachains.initializer.pallet.Call> = $.taggedUnion(
  "type",
  { 0: ["force_approve", ["up_to", $4]] },
)

export const $407: $.Codec<t.polkadot_runtime_parachains.dmp.pallet.Call> = $.never

export const $408: $.Codec<t.polkadot_runtime_parachains.ump.pallet.Call> = $.taggedUnion("type", {
  0: ["service_overweight", ["index", $10], ["weight_limit", $8]],
})

export const $409: $.Codec<t.polkadot_runtime_parachains.hrmp.pallet.Call> = $.taggedUnion("type", {
  0: ["hrmp_init_open_channel", ["recipient", $98], ["proposed_max_capacity", $4], [
    "proposed_max_message_size",
    $4,
  ]],
  1: ["hrmp_accept_open_channel", ["sender", $98]],
  2: ["hrmp_close_channel", ["channel_id", $112]],
  3: ["force_clean_hrmp", ["para", $98], ["inbound", $4], ["outbound", $4]],
  4: ["force_process_hrmp_open", ["channels", $4]],
  5: ["force_process_hrmp_close", ["channels", $4]],
  6: ["hrmp_cancel_open_request", ["channel_id", $112], ["open_requests", $4]],
  7: ["force_open_hrmp_channel", ["sender", $98], ["recipient", $98], ["max_capacity", $4], [
    "max_message_size",
    $4,
  ]],
})

export const $410: $.Codec<t.polkadot_runtime_parachains.disputes.pallet.Call> = $.stringUnion({
  0: "force_unfreeze",
})

export const $411: $.Codec<t.polkadot_runtime_common.paras_registrar.pallet.Call> = $.taggedUnion(
  "type",
  {
    0: ["register", ["id", $98], ["genesis_head", $104], ["validation_code", $394]],
    1: ["force_register", ["who", $0], ["deposit", $6], ["id", $98], ["genesis_head", $104], [
      "validation_code",
      $394,
    ]],
    2: ["deregister", ["id", $98]],
    3: ["swap", ["id", $98], ["other", $98]],
    4: ["remove_lock", ["para", $98]],
    5: ["reserve"],
    6: ["add_lock", ["para", $98]],
    7: ["schedule_code_upgrade", ["para", $98], ["new_code", $394]],
    8: ["set_current_head", ["para", $98], ["new_head", $104]],
  },
)

export const $412: $.Codec<t.polkadot_runtime_common.slots.pallet.Call> = $.taggedUnion("type", {
  0: ["force_lease", ["para", $98], ["leaser", $0], ["amount", $6], ["period_begin", $4], [
    "period_count",
    $4,
  ]],
  1: ["clear_all_leases", ["para", $98]],
  2: ["trigger_onboard", ["para", $98]],
})

export const $414: $.Codec<t.Compact<t.polkadot_parachain.primitives.Id>> = $.compact($98)

export const $413: $.Codec<t.polkadot_runtime_common.auctions.pallet.Call> = $.taggedUnion("type", {
  0: ["new_auction", ["duration", $125], ["lease_period_index", $125]],
  1: ["bid", ["para", $414], ["auction_index", $125], ["first_slot", $125], ["last_slot", $125], [
    "amount",
    $58,
  ]],
  2: ["cancel_auction"],
})

export const $419: $.Codec<Uint8Array> = $.sizedUint8Array(33)

export const $418: $.Codec<t.sp_core.ecdsa.Public> = $419

export const $417: $.Codec<t.sp_runtime.MultiSigner> = $.taggedUnion("type", {
  0: ["Ed25519", ["value", $51]],
  1: ["Sr25519", ["value", $54]],
  2: ["Ecdsa", ["value", $418]],
})

export const $416: $.Codec<t.sp_runtime.MultiSigner | undefined> = $.option($417)

export const $422: $.Codec<t.sp_core.ecdsa.Signature> = $247

export const $421: $.Codec<t.sp_runtime.MultiSignature> = $.taggedUnion("type", {
  0: ["Ed25519", ["value", $222]],
  1: ["Sr25519", ["value", $101]],
  2: ["Ecdsa", ["value", $422]],
})

export const $420: $.Codec<t.sp_runtime.MultiSignature | undefined> = $.option($421)

export const $415: $.Codec<t.polkadot_runtime_common.crowdloan.pallet.Call> = $.taggedUnion(
  "type",
  {
    0: ["create", ["index", $414], ["cap", $58], ["first_period", $125], ["last_period", $125], [
      "end",
      $125,
    ], ["verifier", $416]],
    1: ["contribute", ["index", $414], ["value", $58], ["signature", $420]],
    2: ["withdraw", ["who", $0], ["index", $414]],
    3: ["refund", ["index", $414]],
    4: ["dissolve", ["index", $414]],
    5: ["edit", ["index", $414], ["cap", $58], ["first_period", $125], ["last_period", $125], [
      "end",
      $125,
    ], ["verifier", $416]],
    6: ["add_memo", ["index", $98], ["memo", $12]],
    7: ["poke", ["index", $98]],
    8: ["contribute_all", ["index", $414], ["signature", $420]],
  },
)

export const $428: $.Codec<Array<t.xcm.v0.Xcm>> = $.array($.deferred(() => $425))

export const $427: $.Codec<t.xcm.v0.order.Order> = $.taggedUnion("type", {
  0: ["Null"],
  1: ["DepositAsset", ["assets", $151], ["dest", $153]],
  2: ["DepositReserveAsset", ["assets", $151], ["dest", $153], ["effects", $.deferred(() => $426)]],
  3: ["ExchangeAsset", ["give", $151], ["receive", $151]],
  4: ["InitiateReserveWithdraw", ["assets", $151], ["reserve", $153], [
    "effects",
    $.deferred(() => $426),
  ]],
  5: ["InitiateTeleport", ["assets", $151], ["dest", $153], ["effects", $.deferred(() => $426)]],
  6: ["QueryHolding", ["query_id", $9], ["dest", $153], ["assets", $151]],
  7: ["BuyExecution", ["fees", $152], ["weight", $10], ["debt", $10], ["halt_on_error", $43], [
    "xcm",
    $428,
  ]],
})

export const $426: $.Codec<Array<t.xcm.v0.order.Order>> = $.array($427)

export const $429: $.Codec<t.xcm.v0.Response> = $.taggedUnion("type", {
  0: ["Assets", ["value", $151]],
})

export const $425: $.Codec<t.xcm.v0.Xcm> = $.taggedUnion("type", {
  0: ["WithdrawAsset", ["assets", $151], ["effects", $426]],
  1: ["ReserveAssetDeposit", ["assets", $151], ["effects", $426]],
  2: ["TeleportAsset", ["assets", $151], ["effects", $426]],
  3: ["QueryResponse", ["query_id", $9], ["response", $429]],
  4: ["TransferAsset", ["assets", $151], ["dest", $153]],
  5: ["TransferReserveAsset", ["assets", $151], ["dest", $153], ["effects", $426]],
  6: ["Transact", ["origin_type", $143], ["require_weight_at_most", $10], ["call", $144]],
  7: ["HrmpNewChannelOpenRequest", ["sender", $125], ["max_message_size", $125], [
    "max_capacity",
    $125,
  ]],
  8: ["HrmpChannelAccepted", ["recipient", $125]],
  9: ["HrmpChannelClosing", ["initiator", $125], ["sender", $125], ["recipient", $125]],
  10: ["RelayedFrom", ["who", $153], ["message", $.deferred(() => $425)]],
})

export const $433: $.Codec<Array<t.xcm.v1.Xcm>> = $.array($.deferred(() => $430))

export const $432: $.Codec<t.xcm.v1.order.Order> = $.taggedUnion("type", {
  0: ["Noop"],
  1: ["DepositAsset", ["assets", $145], ["max_assets", $4], ["beneficiary", $122]],
  2: ["DepositReserveAsset", ["assets", $145], ["max_assets", $4], ["dest", $122], [
    "effects",
    $.deferred(() => $431),
  ]],
  3: ["ExchangeAsset", ["give", $145], ["receive", $133]],
  4: ["InitiateReserveWithdraw", ["assets", $145], ["reserve", $122], [
    "effects",
    $.deferred(() => $431),
  ]],
  5: ["InitiateTeleport", ["assets", $145], ["dest", $122], ["effects", $.deferred(() => $431)]],
  6: ["QueryHolding", ["query_id", $9], ["dest", $122], ["assets", $145]],
  7: ["BuyExecution", ["fees", $135], ["weight", $10], ["debt", $10], ["halt_on_error", $43], [
    "instructions",
    $433,
  ]],
})

export const $431: $.Codec<Array<t.xcm.v1.order.Order>> = $.array($432)

export const $434: $.Codec<t.xcm.v1.Response> = $.taggedUnion("type", {
  0: ["Assets", ["value", $133]],
  1: ["Version", ["value", $4]],
})

export const $430: $.Codec<t.xcm.v1.Xcm> = $.taggedUnion("type", {
  0: ["WithdrawAsset", ["assets", $133], ["effects", $431]],
  1: ["ReserveAssetDeposited", ["assets", $133], ["effects", $431]],
  2: ["ReceiveTeleportedAsset", ["assets", $133], ["effects", $431]],
  3: ["QueryResponse", ["query_id", $9], ["response", $434]],
  4: ["TransferAsset", ["assets", $133], ["beneficiary", $122]],
  5: ["TransferReserveAsset", ["assets", $133], ["dest", $122], ["effects", $431]],
  6: ["Transact", ["origin_type", $143], ["require_weight_at_most", $10], ["call", $144]],
  7: ["HrmpNewChannelOpenRequest", ["sender", $125], ["max_message_size", $125], [
    "max_capacity",
    $125,
  ]],
  8: ["HrmpChannelAccepted", ["recipient", $125]],
  9: ["HrmpChannelClosing", ["initiator", $125], ["sender", $125], ["recipient", $125]],
  10: ["RelayedFrom", ["who", $123], ["message", $.deferred(() => $430)]],
  11: ["SubscribeVersion", ["query_id", $9], ["max_response_weight", $9]],
  12: ["UnsubscribeVersion"],
})

export const $424: $.Codec<t.xcm.VersionedXcm> = $.taggedUnion("type", {
  0: ["V0", ["value", $425]],
  1: ["V1", ["value", $430]],
  2: ["V2", ["value", $130]],
})

export const $439: $.Codec<Array<t.xcm.v0.Xcm>> = $.array($.deferred(() => $436))

export const $438: $.Codec<t.xcm.v0.order.Order> = $.taggedUnion("type", {
  0: ["Null"],
  1: ["DepositAsset", ["assets", $151], ["dest", $153]],
  2: ["DepositReserveAsset", ["assets", $151], ["dest", $153], ["effects", $426]],
  3: ["ExchangeAsset", ["give", $151], ["receive", $151]],
  4: ["InitiateReserveWithdraw", ["assets", $151], ["reserve", $153], ["effects", $426]],
  5: ["InitiateTeleport", ["assets", $151], ["dest", $153], ["effects", $426]],
  6: ["QueryHolding", ["query_id", $9], ["dest", $153], ["assets", $151]],
  7: ["BuyExecution", ["fees", $152], ["weight", $10], ["debt", $10], ["halt_on_error", $43], [
    "xcm",
    $439,
  ]],
})

export const $437: $.Codec<Array<t.xcm.v0.order.Order>> = $.array($438)

export const $440: $.Codec<{ encoded: Uint8Array }> = $.object(["encoded", $12])

export const $436: $.Codec<t.xcm.v0.Xcm> = $.taggedUnion("type", {
  0: ["WithdrawAsset", ["assets", $151], ["effects", $437]],
  1: ["ReserveAssetDeposit", ["assets", $151], ["effects", $437]],
  2: ["TeleportAsset", ["assets", $151], ["effects", $437]],
  3: ["QueryResponse", ["query_id", $9], ["response", $429]],
  4: ["TransferAsset", ["assets", $151], ["dest", $153]],
  5: ["TransferReserveAsset", ["assets", $151], ["dest", $153], ["effects", $426]],
  6: ["Transact", ["origin_type", $143], ["require_weight_at_most", $10], ["call", $440]],
  7: ["HrmpNewChannelOpenRequest", ["sender", $125], ["max_message_size", $125], [
    "max_capacity",
    $125,
  ]],
  8: ["HrmpChannelAccepted", ["recipient", $125]],
  9: ["HrmpChannelClosing", ["initiator", $125], ["sender", $125], ["recipient", $125]],
  10: ["RelayedFrom", ["who", $153], ["message", $.deferred(() => $436)]],
})

export const $444: $.Codec<Array<t.xcm.v1.Xcm>> = $.array($.deferred(() => $441))

export const $443: $.Codec<t.xcm.v1.order.Order> = $.taggedUnion("type", {
  0: ["Noop"],
  1: ["DepositAsset", ["assets", $145], ["max_assets", $4], ["beneficiary", $122]],
  2: ["DepositReserveAsset", ["assets", $145], ["max_assets", $4], ["dest", $122], [
    "effects",
    $431,
  ]],
  3: ["ExchangeAsset", ["give", $145], ["receive", $133]],
  4: ["InitiateReserveWithdraw", ["assets", $145], ["reserve", $122], ["effects", $431]],
  5: ["InitiateTeleport", ["assets", $145], ["dest", $122], ["effects", $431]],
  6: ["QueryHolding", ["query_id", $9], ["dest", $122], ["assets", $145]],
  7: ["BuyExecution", ["fees", $135], ["weight", $10], ["debt", $10], ["halt_on_error", $43], [
    "instructions",
    $444,
  ]],
})

export const $442: $.Codec<Array<t.xcm.v1.order.Order>> = $.array($443)

export const $441: $.Codec<t.xcm.v1.Xcm> = $.taggedUnion("type", {
  0: ["WithdrawAsset", ["assets", $133], ["effects", $442]],
  1: ["ReserveAssetDeposited", ["assets", $133], ["effects", $442]],
  2: ["ReceiveTeleportedAsset", ["assets", $133], ["effects", $442]],
  3: ["QueryResponse", ["query_id", $9], ["response", $434]],
  4: ["TransferAsset", ["assets", $133], ["beneficiary", $122]],
  5: ["TransferReserveAsset", ["assets", $133], ["dest", $122], ["effects", $431]],
  6: ["Transact", ["origin_type", $143], ["require_weight_at_most", $10], ["call", $440]],
  7: ["HrmpNewChannelOpenRequest", ["sender", $125], ["max_message_size", $125], [
    "max_capacity",
    $125,
  ]],
  8: ["HrmpChannelAccepted", ["recipient", $125]],
  9: ["HrmpChannelClosing", ["initiator", $125], ["sender", $125], ["recipient", $125]],
  10: ["RelayedFrom", ["who", $123], ["message", $.deferred(() => $441)]],
  11: ["SubscribeVersion", ["query_id", $9], ["max_response_weight", $9]],
  12: ["UnsubscribeVersion"],
})

export const $447: $.Codec<t.xcm.v2.Instruction> = $.taggedUnion("type", {
  0: ["WithdrawAsset", ["value", $133]],
  1: ["ReserveAssetDeposited", ["value", $133]],
  2: ["ReceiveTeleportedAsset", ["value", $133]],
  3: ["QueryResponse", ["query_id", $9], ["response", $140], ["max_weight", $9]],
  4: ["TransferAsset", ["assets", $133], ["beneficiary", $122]],
  5: ["TransferReserveAsset", ["assets", $133], ["dest", $122], ["xcm", $130]],
  6: ["Transact", ["origin_type", $143], ["require_weight_at_most", $9], ["call", $440]],
  7: ["HrmpNewChannelOpenRequest", ["sender", $125], ["max_message_size", $125], [
    "max_capacity",
    $125,
  ]],
  8: ["HrmpChannelAccepted", ["recipient", $125]],
  9: ["HrmpChannelClosing", ["initiator", $125], ["sender", $125], ["recipient", $125]],
  10: ["ClearOrigin"],
  11: ["DescendOrigin", ["value", $123]],
  12: ["ReportError", ["query_id", $9], ["dest", $122], ["max_response_weight", $9]],
  13: ["DepositAsset", ["assets", $145], ["max_assets", $125], ["beneficiary", $122]],
  14: ["DepositReserveAsset", ["assets", $145], ["max_assets", $125], ["dest", $122], [
    "xcm",
    $130,
  ]],
  15: ["ExchangeAsset", ["give", $145], ["receive", $133]],
  16: ["InitiateReserveWithdraw", ["assets", $145], ["reserve", $122], ["xcm", $130]],
  17: ["InitiateTeleport", ["assets", $145], ["dest", $122], ["xcm", $130]],
  18: ["QueryHolding", ["query_id", $9], ["dest", $122], ["assets", $145], [
    "max_response_weight",
    $9,
  ]],
  19: ["BuyExecution", ["fees", $135], ["weight_limit", $148]],
  20: ["RefundSurplus"],
  21: ["SetErrorHandler", ["value", $.deferred(() => $445)]],
  22: ["SetAppendix", ["value", $.deferred(() => $445)]],
  23: ["ClearError"],
  24: ["ClaimAsset", ["assets", $133], ["ticket", $122]],
  25: ["Trap", ["value", $9]],
  26: ["SubscribeVersion", ["query_id", $9], ["max_response_weight", $9]],
  27: ["UnsubscribeVersion"],
})

export const $446: $.Codec<Array<t.xcm.v2.Instruction>> = $.array($447)

export const $445: $.Codec<Array<t.xcm.v2.Instruction>> = $446

export const $435: $.Codec<t.xcm.VersionedXcm> = $.taggedUnion("type", {
  0: ["V0", ["value", $436]],
  1: ["V1", ["value", $441]],
  2: ["V2", ["value", $445]],
})

export const $423: $.Codec<t.pallet_xcm.pallet.Call> = $.taggedUnion("type", {
  0: ["send", ["dest", $155], ["message", $424]],
  1: ["teleport_assets", ["dest", $155], ["beneficiary", $155], ["assets", $150], [
    "fee_asset_item",
    $4,
  ]],
  2: ["reserve_transfer_assets", ["dest", $155], ["beneficiary", $155], ["assets", $150], [
    "fee_asset_item",
    $4,
  ]],
  3: ["execute", ["message", $435], ["max_weight", $10]],
  4: ["force_xcm_version", ["location", $122], ["xcm_version", $4]],
  5: ["force_default_xcm_version", ["maybe_xcm_version", $236]],
  6: ["force_subscribe_version_notify", ["location", $155]],
  7: ["force_unsubscribe_version_notify", ["location", $155]],
  8: ["limited_reserve_transfer_assets", ["dest", $155], ["beneficiary", $155], ["assets", $150], [
    "fee_asset_item",
    $4,
  ], ["weight_limit", $148]],
  9: ["limited_teleport_assets", ["dest", $155], ["beneficiary", $155], ["assets", $150], [
    "fee_asset_item",
    $4,
  ], ["weight_limit", $148]],
})

export const $181: $.Codec<t.polkadot_runtime.RuntimeCall> = $.taggedUnion("type", {
  0: ["System", ["value", $161]],
  1: ["Scheduler", ["value", $182]],
  10: ["Preimage", ["value", $184]],
  2: ["Babe", ["value", $185]],
  3: ["Timestamp", ["value", $195]],
  4: ["Indices", ["value", $196]],
  5: ["Balances", ["value", $199]],
  6: ["Authorship", ["value", $200]],
  7: ["Staking", ["value", $202]],
  9: ["Session", ["value", $211]],
  11: ["Grandpa", ["value", $216]],
  12: ["ImOnline", ["value", $227]],
  14: ["Democracy", ["value", $234]],
  15: ["Council", ["value", $237]],
  16: ["TechnicalCommittee", ["value", $240]],
  17: ["PhragmenElection", ["value", $241]],
  18: ["TechnicalMembership", ["value", $243]],
  19: ["Treasury", ["value", $244]],
  24: ["Claims", ["value", $245]],
  25: ["Vesting", ["value", $252]],
  26: ["Utility", ["value", $254]],
  28: ["Identity", ["value", $263]],
  29: ["Proxy", ["value", $303]],
  30: ["Multisig", ["value", $305]],
  34: ["Bounties", ["value", $307]],
  38: ["ChildBounties", ["value", $308]],
  35: ["Tips", ["value", $309]],
  36: ["ElectionProviderMultiPhase", ["value", $310]],
  37: ["VoterList", ["value", $368]],
  39: ["NominationPools", ["value", $369]],
  40: ["FastUnstake", ["value", $374]],
  51: ["Configuration", ["value", $375]],
  52: ["ParasShared", ["value", $376]],
  53: ["ParaInclusion", ["value", $377]],
  54: ["ParaInherent", ["value", $378]],
  56: ["Paras", ["value", $404]],
  57: ["Initializer", ["value", $406]],
  58: ["Dmp", ["value", $407]],
  59: ["Ump", ["value", $408]],
  60: ["Hrmp", ["value", $409]],
  62: ["ParasDisputes", ["value", $410]],
  70: ["Registrar", ["value", $411]],
  71: ["Slots", ["value", $412]],
  72: ["Auctions", ["value", $413]],
  73: ["Crowdloan", ["value", $415]],
  99: ["XcmPallet", ["value", $423]],
})

export const $188: $.Codec<t.sp_runtime.traits.BlakeTwo256> = C.$null

export const $301: $.Codec<t.pallet_identity.types.IdentityField> = $.stringUnion({
  1: "Display",
  2: "Legal",
  4: "Web",
  8: "Riot",
  16: "Email",
  32: "PgpFingerprint",
  64: "Image",
  128: "Twitter",
})

export const $384: $.Codec<t.bitvec.order.Lsb0> = C.$null

export const $450: $.Codec<t.pallet_scheduler.pallet.Error> = $.stringUnion({
  0: "FailedToSchedule",
  1: "NotFound",
  2: "TargetBlockNumberInPast",
  3: "RescheduleNoChange",
  4: "Named",
})

export const $452: $.Codec<[t.sp_core.crypto.AccountId32, t.u128] | undefined> = $.option($69)

export const $451: $.Codec<t.pallet_preimage.RequestStatus> = $.taggedUnion("type", {
  0: ["Unrequested", ["deposit", $69], ["len", $4]],
  1: ["Requested", ["deposit", $452], ["count", $4], ["len", $236]],
})

export const $453: $.Codec<[t.primitive_types.H256, t.u32]> = $.tuple($11, $4)

export const $454: $.Codec<Uint8Array> = $12

export const $455: $.Codec<t.pallet_preimage.pallet.Error> = $.stringUnion({
  0: "TooBig",
  1: "AlreadyNoted",
  2: "NotAuthorized",
  3: "NotNoted",
  4: "Requested",
  5: "NotRequested",
})

export const $457: $.Codec<[t.sp_consensus_babe.app.Public, t.u64]> = $.tuple($189, $10)

export const $458: $.Codec<Array<[t.sp_consensus_babe.app.Public, t.u64]>> = $.array($457)

export const $456: $.Codec<Array<[t.sp_consensus_babe.app.Public, t.u64]>> = $458

export const $460: $.Codec<Array<Uint8Array>> = $.array($1)

export const $459: $.Codec<Array<Uint8Array>> = $460

export const $463: $.Codec<t.sp_consensus_babe.digests.PrimaryPreDigest> = $.object(
  ["authority_index", $4],
  ["slot", $190],
  ["vrf_output", $1],
  ["vrf_proof", $102],
)

export const $464: $.Codec<t.sp_consensus_babe.digests.SecondaryPlainPreDigest> = $.object([
  "authority_index",
  $4,
], ["slot", $190])

export const $465: $.Codec<t.sp_consensus_babe.digests.SecondaryVRFPreDigest> = $.object(
  ["authority_index", $4],
  ["slot", $190],
  ["vrf_output", $1],
  ["vrf_proof", $102],
)

export const $462: $.Codec<t.sp_consensus_babe.digests.PreDigest> = $.taggedUnion("type", {
  1: ["Primary", ["value", $463]],
  2: ["SecondaryPlain", ["value", $464]],
  3: ["SecondaryVRF", ["value", $465]],
})

export const $461: $.Codec<t.sp_consensus_babe.digests.PreDigest | undefined> = $.option($462)

export const $466: $.Codec<t.sp_consensus_babe.BabeEpochConfiguration> = $.object(["c", $193], [
  "allowed_slots",
  $194,
])

export const $467: $.Codec<t.pallet_babe.pallet.Error> = $.stringUnion({
  0: "InvalidEquivocationProof",
  1: "InvalidKeyOwnershipProof",
  2: "DuplicateOffenceReport",
  3: "InvalidConfiguration",
})

export const $468: $.Codec<[t.sp_core.crypto.AccountId32, t.u128, boolean]> = $.tuple($0, $6, $43)

export const $469: $.Codec<t.pallet_indices.pallet.Error> = $.stringUnion({
  0: "NotAssigned",
  1: "NotOwner",
  2: "InUse",
  3: "NotTransfer",
  4: "Permanent",
})

export const $472: $.Codec<t.pallet_balances.Reasons> = $.stringUnion({
  0: "Fee",
  1: "Misc",
  2: "All",
})

export const $471: $.Codec<t.pallet_balances.BalanceLock> = $.object(["id", $139], ["amount", $6], [
  "reasons",
  $472,
])

export const $473: $.Codec<Array<t.pallet_balances.BalanceLock>> = $.array($471)

export const $470: $.Codec<Array<t.pallet_balances.BalanceLock>> = $473

export const $475: $.Codec<t.pallet_balances.ReserveData> = $.object(["id", $139], ["amount", $6])

export const $476: $.Codec<Array<t.pallet_balances.ReserveData>> = $.array($475)

export const $474: $.Codec<Array<t.pallet_balances.ReserveData>> = $476

export const $477: $.Codec<t.pallet_balances.Releases> = $.stringUnion({
  0: "V1_0_0",
  1: "V2_0_0",
})

export const $478: $.Codec<t.pallet_balances.pallet.Error> = $.stringUnion({
  0: "VestingBalance",
  1: "LiquidityRestrictions",
  2: "InsufficientBalance",
  3: "ExistentialDeposit",
  4: "KeepAlive",
  5: "ExistingVestingSchedule",
  6: "DeadAccount",
  7: "TooManyReserves",
})

export const $479: $.Codec<t.sp_arithmetic.fixed_point.FixedU128> = $6

export const $480: $.Codec<t.pallet_transaction_payment.Releases> = $.stringUnion({
  0: "V1Ancient",
  1: "V2",
})

export const $482: $.Codec<t.pallet_authorship.UncleEntryItem> = $.taggedUnion("type", {
  0: ["InclusionHeight", ["value", $4]],
  1: ["Uncle", ["value", $.tuple($11, $92)]],
})

export const $483: $.Codec<Array<t.pallet_authorship.UncleEntryItem>> = $.array($482)

export const $481: $.Codec<Array<t.pallet_authorship.UncleEntryItem>> = $483

export const $484: $.Codec<t.pallet_authorship.pallet.Error> = $.stringUnion({
  0: "InvalidUncleParent",
  1: "UnclesAlreadySet",
  2: "TooManyUncles",
  3: "GenesisUncle",
  4: "TooHighUncle",
  5: "UncleAlreadyIncluded",
  6: "OldUncle",
})

export const $487: $.Codec<t.pallet_staking.UnlockChunk> = $.object(["value", $58], ["era", $125])

export const $488: $.Codec<Array<t.pallet_staking.UnlockChunk>> = $.array($487)

export const $486: $.Codec<Array<t.pallet_staking.UnlockChunk>> = $488

export const $489: $.Codec<Array<t.u32>> = $94

export const $485: $.Codec<t.pallet_staking.StakingLedger> = $.object(
  ["stash", $0],
  ["total", $58],
  ["active", $58],
  ["unlocking", $486],
  ["claimed_rewards", $489],
)

export const $491: $.Codec<Array<t.sp_core.crypto.AccountId32>> = $206

export const $490: $.Codec<t.pallet_staking.Nominations> = $.object(["targets", $491], [
  "submitted_in",
  $4,
], ["suppressed", $43])

export const $493: $.Codec<t.u64 | undefined> = $.option($10)

export const $492: $.Codec<t.pallet_staking.ActiveEraInfo> = $.object(["index", $4], [
  "start",
  $493,
])

export const $494: $.Codec<[t.u32, t.sp_core.crypto.AccountId32]> = $.tuple($4, $0)

export const $496: $.Codec<Map<t.sp_core.crypto.AccountId32, t.u32>> = $.map($0, $4)

export const $495: $.Codec<t.pallet_staking.EraRewardPoints> = $.object(["total", $4], [
  "individual",
  $496,
])

export const $498: $.Codec<[t.sp_core.crypto.AccountId32, t.u32]> = $.tuple($0, $4)

export const $497: $.Codec<Array<[t.sp_core.crypto.AccountId32, t.u32]>> = $.array($498)

export const $499: $.Codec<t.pallet_staking.Forcing> = $.stringUnion({
  0: "NotForcing",
  1: "ForceNew",
  2: "ForceNone",
  3: "ForceAlways",
})

export const $501: $.Codec<t.pallet_staking.UnappliedSlash> = $.object(
  ["validator", $0],
  ["own", $6],
  ["others", $68],
  ["reporters", $206],
  ["payout", $6],
)

export const $500: $.Codec<Array<t.pallet_staking.UnappliedSlash>> = $.array($501)

export const $502: $.Codec<[t.sp_arithmetic.per_things.Perbill, t.u128]> = $.tuple($42, $6)

export const $503: $.Codec<t.pallet_staking.slashing.SlashingSpans> = $.object(
  ["span_index", $4],
  ["last_start", $4],
  ["last_nonzero_slash", $4],
  ["prior", $94],
)

export const $504: $.Codec<t.pallet_staking.slashing.SpanRecord> = $.object(["slashed", $6], [
  "paid_out",
  $6,
])

export const $506: $.Codec<[t.u32, boolean]> = $.tuple($4, $43)

export const $505: $.Codec<Array<[t.u32, boolean]>> = $.array($506)

export const $507: $.Codec<t.pallet_staking.Releases> = $.stringUnion({
  0: "V1_0_0Ancient",
  1: "V2_0_0",
  2: "V3_0_0",
  3: "V4_0_0",
  4: "V5_0_0",
  5: "V6_0_0",
  6: "V7_0_0",
  7: "V8_0_0",
  8: "V9_0_0",
  9: "V10_0_0",
  10: "V11_0_0",
  11: "V12_0_0",
})

export const $508: $.Codec<t.pallet_staking.pallet.pallet.Error> = $.stringUnion({
  0: "NotController",
  1: "NotStash",
  2: "AlreadyBonded",
  3: "AlreadyPaired",
  4: "EmptyTargets",
  5: "DuplicateIndex",
  6: "InvalidSlashIndex",
  7: "InsufficientBond",
  8: "NoMoreChunks",
  9: "NoUnlockChunk",
  10: "FundedTarget",
  11: "InvalidEraToReward",
  12: "InvalidNumberOfNominations",
  13: "NotSortedAndUnique",
  14: "AlreadyClaimed",
  15: "IncorrectHistoryDepth",
  16: "IncorrectSlashingSpans",
  17: "BadState",
  18: "TooManyTargets",
  19: "BadTarget",
  20: "CannotChillOther",
  21: "TooManyNominators",
  22: "TooManyValidators",
  23: "CommissionTooLow",
  24: "BoundNotMet",
})

export const $509: $.Codec<t.sp_staking.offence.OffenceDetails> = $.object(["offender", $56], [
  "reporters",
  $206,
])

export const $510: $.Codec<[Uint8Array, Uint8Array]> = $.tuple($45, $12)

export const $512: $.Codec<[t.sp_core.crypto.AccountId32, t.polkadot_runtime.SessionKeys]> = $
  .tuple($0, $212)

export const $511: $.Codec<Array<[t.sp_core.crypto.AccountId32, t.polkadot_runtime.SessionKeys]>> =
  $.array($512)

export const $514: $.Codec<t.sp_core.crypto.KeyTypeId> = $16

export const $513: $.Codec<[t.sp_core.crypto.KeyTypeId, Uint8Array]> = $.tuple($514, $12)

export const $515: $.Codec<t.pallet_session.pallet.Error> = $.stringUnion({
  0: "InvalidProof",
  1: "NoAssociatedValidatorId",
  2: "DuplicatedKey",
  3: "NoKeys",
  4: "NoAccount",
})

export const $516: $.Codec<t.pallet_grandpa.StoredState> = $.taggedUnion("type", {
  0: ["Live"],
  1: ["PendingPause", ["scheduled_at", $4], ["delay", $4]],
  2: ["Paused"],
  3: ["PendingResume", ["scheduled_at", $4], ["delay", $4]],
})

export const $518: $.Codec<Array<[t.sp_finality_grandpa.app.Public, t.u64]>> = $48

export const $517: $.Codec<t.pallet_grandpa.StoredPendingChange> = $.object(
  ["scheduled_at", $4],
  ["delay", $4],
  ["next_authorities", $518],
  ["forced", $236],
)

export const $519: $.Codec<t.pallet_grandpa.pallet.Error> = $.stringUnion({
  0: "PauseFailed",
  1: "ResumeFailed",
  2: "ChangePending",
  3: "TooSoon",
  4: "InvalidKeyOwnershipProof",
  5: "InvalidEquivocationProof",
  6: "DuplicateOffenceReport",
})

export const $521: $.Codec<Array<t.pallet_im_online.sr25519.app_sr25519.Public>> = $.array($53)

export const $520: $.Codec<Array<t.pallet_im_online.sr25519.app_sr25519.Public>> = $521

export const $524: $.Codec<Uint8Array> = $12

export const $526: $.Codec<Array<Uint8Array>> = $.array($524)

export const $525: $.Codec<Array<Uint8Array>> = $526

export const $523: $.Codec<t.pallet_im_online.BoundedOpaqueNetworkState> = $.object([
  "peer_id",
  $524,
], ["external_addresses", $525])

export const $522: $.Codec<t.pallet_im_online.BoundedOpaqueNetworkState> = $.lenPrefixed($523)

export const $527: $.Codec<t.pallet_im_online.pallet.Error> = $.stringUnion({
  0: "InvalidKey",
  1: "DuplicatedHeartbeat",
})

export const $529: $.Codec<
  [t.u32, t.frame_support.traits.preimages.Bounded, t.sp_core.crypto.AccountId32]
> = $.tuple($4, $180, $0)

export const $530: $.Codec<
  Array<[t.u32, t.frame_support.traits.preimages.Bounded, t.sp_core.crypto.AccountId32]>
> = $.array($529)

export const $528: $.Codec<
  Array<[t.u32, t.frame_support.traits.preimages.Bounded, t.sp_core.crypto.AccountId32]>
> = $530

export const $532: $.Codec<Array<t.sp_core.crypto.AccountId32>> = $206

export const $531: $.Codec<[Array<t.sp_core.crypto.AccountId32>, t.u128]> = $.tuple($532, $6)

export const $535: $.Codec<t.pallet_democracy.types.Tally> = $.object(["ayes", $6], ["nays", $6], [
  "turnout",
  $6,
])

export const $534: $.Codec<t.pallet_democracy.types.ReferendumStatus> = $.object(
  ["end", $4],
  ["proposal", $180],
  ["threshold", $62],
  ["delay", $4],
  ["tally", $535],
)

export const $533: $.Codec<t.pallet_democracy.types.ReferendumInfo> = $.taggedUnion("type", {
  0: ["Ongoing", ["value", $534]],
  1: ["Finished", ["approved", $43], ["end", $4]],
})

export const $538: $.Codec<[t.u32, t.pallet_democracy.vote.AccountVote]> = $.tuple($4, $63)

export const $539: $.Codec<Array<[t.u32, t.pallet_democracy.vote.AccountVote]>> = $.array($538)

export const $537: $.Codec<Array<[t.u32, t.pallet_democracy.vote.AccountVote]>> = $539

export const $540: $.Codec<t.pallet_democracy.types.Delegations> = $.object(["votes", $6], [
  "capital",
  $6,
])

export const $541: $.Codec<t.pallet_democracy.vote.PriorLock> = $.tuple($4, $6)

export const $536: $.Codec<t.pallet_democracy.vote.Voting> = $.taggedUnion("type", {
  0: ["Direct", ["votes", $537], ["delegations", $540], ["prior", $541]],
  1: ["Delegating", ["balance", $6], ["target", $0], ["conviction", $235], ["delegations", $540], [
    "prior",
    $541,
  ]],
})

export const $542: $.Codec<
  [t.frame_support.traits.preimages.Bounded, t.pallet_democracy.vote_threshold.VoteThreshold]
> = $.tuple($180, $62)

export const $543: $.Codec<[t.u32, Array<t.sp_core.crypto.AccountId32>]> = $.tuple($4, $532)

export const $544: $.Codec<t.pallet_democracy.pallet.Error> = $.stringUnion({
  0: "ValueLow",
  1: "ProposalMissing",
  2: "AlreadyCanceled",
  3: "DuplicateProposal",
  4: "ProposalBlacklisted",
  5: "NotSimpleMajority",
  6: "InvalidHash",
  7: "NoProposal",
  8: "AlreadyVetoed",
  9: "ReferendumInvalid",
  10: "NoneWaiting",
  11: "NotVoter",
  12: "NoPermission",
  13: "AlreadyDelegating",
  14: "InsufficientFunds",
  15: "NotDelegating",
  16: "VotesExist",
  17: "InstantNotAllowed",
  18: "Nonsense",
  19: "WrongUpperBound",
  20: "MaxVotesReached",
  21: "TooMany",
  22: "VotingPeriodLow",
})

export const $545: $.Codec<Array<t.primitive_types.H256>> = $157

export const $546: $.Codec<t.pallet_collective.Votes> = $.object(
  ["index", $4],
  ["threshold", $4],
  ["ayes", $206],
  ["nays", $206],
  ["end", $4],
)

export const $547: $.Codec<t.pallet_collective.pallet.Error> = $.stringUnion({
  0: "NotMember",
  1: "DuplicateProposal",
  2: "ProposalMissing",
  3: "WrongIndex",
  4: "DuplicateVote",
  5: "AlreadyInitialized",
  6: "TooEarly",
  7: "TooManyProposals",
  8: "WrongProposalWeight",
  9: "WrongProposalLength",
})

export const $548: $.Codec<Array<t.primitive_types.H256>> = $157

export const $549: $.Codec<t.pallet_collective.pallet.Error> = $.stringUnion({
  0: "NotMember",
  1: "DuplicateProposal",
  2: "ProposalMissing",
  3: "WrongIndex",
  4: "DuplicateVote",
  5: "AlreadyInitialized",
  6: "TooEarly",
  7: "TooManyProposals",
  8: "WrongProposalWeight",
  9: "WrongProposalLength",
})

export const $551: $.Codec<t.pallet_elections_phragmen.SeatHolder> = $.object(["who", $0], [
  "stake",
  $6,
], ["deposit", $6])

export const $550: $.Codec<Array<t.pallet_elections_phragmen.SeatHolder>> = $.array($551)

export const $552: $.Codec<t.pallet_elections_phragmen.Voter> = $.object(["votes", $206], [
  "stake",
  $6,
], ["deposit", $6])

export const $553: $.Codec<t.pallet_elections_phragmen.pallet.Error> = $.stringUnion({
  0: "UnableToVote",
  1: "NoVotes",
  2: "TooManyVotes",
  3: "MaximumVotesExceeded",
  4: "LowBalance",
  5: "UnableToPayBond",
  6: "MustBeVoter",
  7: "DuplicatedCandidate",
  8: "TooManyCandidates",
  9: "MemberSubmit",
  10: "RunnerUpSubmit",
  11: "InsufficientCandidateFunds",
  12: "NotMember",
  13: "InvalidWitnessData",
  14: "InvalidVoteCount",
  15: "InvalidRenouncing",
  16: "InvalidReplacement",
})

export const $554: $.Codec<Array<t.sp_core.crypto.AccountId32>> = $206

export const $555: $.Codec<t.pallet_membership.pallet.Error> = $.stringUnion({
  0: "AlreadyMember",
  1: "NotMember",
  2: "TooManyMembers",
})

export const $556: $.Codec<t.pallet_treasury.Proposal> = $.object(["proposer", $0], ["value", $6], [
  "beneficiary",
  $0,
], ["bond", $6])

export const $557: $.Codec<Array<t.u32>> = $94

export const $558: $.Codec<t.sp_arithmetic.per_things.Permill> = $4

export const $559: $.Codec<t.u128 | undefined> = $.option($6)

export const $560: $.Codec<t.frame_support.PalletId> = $139

export const $561: $.Codec<t.pallet_treasury.pallet.Error> = $.stringUnion({
  0: "InsufficientProposersBalance",
  1: "InvalidIndex",
  2: "TooManyApprovals",
  3: "InsufficientPermission",
  4: "ProposalNotApproved",
})

export const $562: $.Codec<t.polkadot_runtime_common.claims.pallet.Error> = $.stringUnion({
  0: "InvalidEthereumSignature",
  1: "SignerHasNoClaim",
  2: "SenderHasNoClaim",
  3: "PotUnderflow",
  4: "InvalidStatement",
  5: "VestedBalanceExists",
})

export const $564: $.Codec<Array<t.pallet_vesting.vesting_info.VestingInfo>> = $.array($253)

export const $563: $.Codec<Array<t.pallet_vesting.vesting_info.VestingInfo>> = $564

export const $565: $.Codec<t.pallet_vesting.Releases> = $.stringUnion({ 0: "V0", 1: "V1" })

export const $566: $.Codec<t.pallet_vesting.pallet.Error> = $.stringUnion({
  0: "NotVesting",
  1: "AtMaxVestingSchedules",
  2: "AmountLow",
  3: "ScheduleIndexOutOfBounds",
  4: "InvalidScheduleParams",
})

export const $567: $.Codec<t.pallet_utility.pallet.Error> = $.stringUnion({ 0: "TooManyCalls" })

export const $570: $.Codec<[t.u32, t.pallet_identity.types.Judgement]> = $.tuple($4, $302)

export const $571: $.Codec<Array<[t.u32, t.pallet_identity.types.Judgement]>> = $.array($570)

export const $569: $.Codec<Array<[t.u32, t.pallet_identity.types.Judgement]>> = $571

export const $568: $.Codec<t.pallet_identity.types.Registration> = $.object(["judgements", $569], [
  "deposit",
  $6,
], ["info", $264])

export const $573: $.Codec<Array<t.sp_core.crypto.AccountId32>> = $206

export const $572: $.Codec<[t.u128, Array<t.sp_core.crypto.AccountId32>]> = $.tuple($6, $573)

export const $576: $.Codec<t.pallet_identity.types.RegistrarInfo> = $.object(["account", $0], [
  "fee",
  $6,
], ["fields", $300])

export const $575: $.Codec<t.pallet_identity.types.RegistrarInfo | undefined> = $.option($576)

export const $577: $.Codec<Array<t.pallet_identity.types.RegistrarInfo | undefined>> = $.array(
  $575,
)

export const $574: $.Codec<Array<t.pallet_identity.types.RegistrarInfo | undefined>> = $577

export const $578: $.Codec<t.pallet_identity.pallet.Error> = $.stringUnion({
  0: "TooManySubAccounts",
  1: "NotFound",
  2: "NotNamed",
  3: "EmptyIndex",
  4: "FeeChanged",
  5: "NoIdentity",
  6: "StickyJudgement",
  7: "JudgementGiven",
  8: "InvalidJudgement",
  9: "InvalidIndex",
  10: "InvalidTarget",
  11: "TooManyFields",
  12: "TooManyRegistrars",
  13: "AlreadyClaimed",
  14: "NotSub",
  15: "NotOwned",
  16: "JudgementForDifferentIdentity",
})

export const $581: $.Codec<t.pallet_proxy.ProxyDefinition> = $.object(["delegate", $0], [
  "proxy_type",
  $79,
], ["delay", $4])

export const $582: $.Codec<Array<t.pallet_proxy.ProxyDefinition>> = $.array($581)

export const $580: $.Codec<Array<t.pallet_proxy.ProxyDefinition>> = $582

export const $579: $.Codec<[Array<t.pallet_proxy.ProxyDefinition>, t.u128]> = $.tuple($580, $6)

export const $585: $.Codec<t.pallet_proxy.Announcement> = $.object(
  ["real", $0],
  ["call_hash", $11],
  ["height", $4],
)

export const $586: $.Codec<Array<t.pallet_proxy.Announcement>> = $.array($585)

export const $584: $.Codec<Array<t.pallet_proxy.Announcement>> = $586

export const $583: $.Codec<[Array<t.pallet_proxy.Announcement>, t.u128]> = $.tuple($584, $6)

export const $587: $.Codec<t.pallet_proxy.pallet.Error> = $.stringUnion({
  0: "TooMany",
  1: "NotFound",
  2: "NotProxy",
  3: "Unproxyable",
  4: "Duplicate",
  5: "NoPermission",
  6: "Unannounced",
  7: "NoSelfProxy",
})

export const $588: $.Codec<[t.sp_core.crypto.AccountId32, Uint8Array]> = $.tuple($0, $1)

export const $589: $.Codec<t.pallet_multisig.Multisig> = $.object(["when", $82], ["deposit", $6], [
  "depositor",
  $0,
], ["approvals", $206])

export const $590: $.Codec<t.pallet_multisig.pallet.Error> = $.stringUnion({
  0: "MinimumThreshold",
  1: "AlreadyApproved",
  2: "NoApprovalsNeeded",
  3: "TooFewSignatories",
  4: "TooManySignatories",
  5: "SignatoriesOutOfOrder",
  6: "SenderInSignatories",
  7: "NotFound",
  8: "NotOwner",
  9: "NoTimepoint",
  10: "WrongTimepoint",
  11: "UnexpectedTimepoint",
  12: "MaxWeightTooLow",
  13: "AlreadyStored",
})

export const $592: $.Codec<t.pallet_bounties.BountyStatus> = $.taggedUnion("type", {
  0: ["Proposed"],
  1: ["Approved"],
  2: ["Funded"],
  3: ["CuratorProposed", ["curator", $0]],
  4: ["Active", ["curator", $0], ["update_due", $4]],
  5: ["PendingPayout", ["curator", $0], ["beneficiary", $0], ["unlock_at", $4]],
})

export const $591: $.Codec<t.pallet_bounties.Bounty> = $.object(
  ["proposer", $0],
  ["value", $6],
  ["fee", $6],
  ["curator_deposit", $6],
  ["bond", $6],
  ["status", $592],
)

export const $593: $.Codec<Uint8Array> = $12

export const $594: $.Codec<t.pallet_bounties.pallet.Error> = $.stringUnion({
  0: "InsufficientProposersBalance",
  1: "InvalidIndex",
  2: "ReasonTooBig",
  3: "UnexpectedStatus",
  4: "RequireCurator",
  5: "InvalidValue",
  6: "InvalidFee",
  7: "PendingPayout",
  8: "Premature",
  9: "HasActiveChildBounty",
  10: "TooManyQueued",
})

export const $596: $.Codec<t.pallet_child_bounties.ChildBountyStatus> = $.taggedUnion("type", {
  0: ["Added"],
  1: ["CuratorProposed", ["curator", $0]],
  2: ["Active", ["curator", $0]],
  3: ["PendingPayout", ["curator", $0], ["beneficiary", $0], ["unlock_at", $4]],
})

export const $595: $.Codec<t.pallet_child_bounties.ChildBounty> = $.object(
  ["parent_bounty", $4],
  ["value", $6],
  ["fee", $6],
  ["curator_deposit", $6],
  ["status", $596],
)

export const $597: $.Codec<t.pallet_child_bounties.pallet.Error> = $.stringUnion({
  0: "ParentBountyNotActive",
  1: "InsufficientBountyBalance",
  2: "TooManyChildBounties",
})

export const $598: $.Codec<t.pallet_tips.OpenTip> = $.object(
  ["reason", $11],
  ["who", $0],
  ["finder", $0],
  ["deposit", $6],
  ["closes", $236],
  ["tips", $68],
  ["finders_fee", $43],
)

export const $599: $.Codec<t.pallet_tips.pallet.Error> = $.stringUnion({
  0: "ReasonTooBig",
  1: "AlreadyKnown",
  2: "UnknownTip",
  3: "NotFinder",
  4: "StillOpen",
  5: "Premature",
})

export const $601: $.Codec<[boolean, t.u32]> = $.tuple($43, $4)

export const $600: $.Codec<t.pallet_election_provider_multi_phase.Phase> = $.taggedUnion("type", {
  0: ["Off"],
  1: ["Signed"],
  2: ["Unsigned", ["value", $601]],
  3: ["Emergency"],
})

export const $602: $.Codec<t.pallet_election_provider_multi_phase.ReadySolution> = $.object(
  ["supports", $365],
  ["score", $88],
  ["compute", $87],
)

export const $605: $.Codec<
  [t.sp_core.crypto.AccountId32, t.u64, Array<t.sp_core.crypto.AccountId32>]
> = $.tuple($0, $10, $491)

export const $604: $.Codec<
  Array<[t.sp_core.crypto.AccountId32, t.u64, Array<t.sp_core.crypto.AccountId32>]>
> = $.array($605)

export const $603: $.Codec<t.pallet_election_provider_multi_phase.RoundSnapshot> = $.object([
  "voters",
  $604,
], ["targets", $206])

export const $607: $.Codec<Map<t.sp_npos_elections.ElectionScore, t.u32>> = $.map($88, $4)

export const $606: $.Codec<Map<t.sp_npos_elections.ElectionScore, t.u32>> = $607

export const $609: $.Codec<[t.sp_npos_elections.ElectionScore, t.u32]> = $.tuple($88, $4)

export const $608: $.Codec<Array<[t.sp_npos_elections.ElectionScore, t.u32]>> = $.array($609)

export const $610: $.Codec<t.pallet_election_provider_multi_phase.signed.SignedSubmission> = $
  .object(["who", $0], ["deposit", $6], ["raw_solution", $311], ["call_fee", $6])

export const $611: $.Codec<t.pallet_election_provider_multi_phase.pallet.Error> = $.stringUnion({
  0: "PreDispatchEarlySubmission",
  1: "PreDispatchWrongWinnerCount",
  2: "PreDispatchWeakSubmission",
  3: "SignedQueueFull",
  4: "SignedCannotPayDeposit",
  5: "SignedInvalidWitness",
  6: "SignedTooMuchWeight",
  7: "OcwCallWrongEra",
  8: "MissingSnapshotMetadata",
  9: "InvalidSubmissionIndex",
  10: "CallNotAllowed",
  11: "FallbackFailed",
})

export const $612: $.Codec<t.pallet_bags_list.list.Node> = $.object(
  ["id", $0],
  ["prev", $92],
  ["next", $92],
  ["bag_upper", $10],
  ["score", $10],
)

export const $613: $.Codec<t.pallet_bags_list.list.Bag> = $.object(["head", $92], ["tail", $92])

export const $614: $.Codec<Array<t.u64>> = $.array($10)

export const $616: $.Codec<t.pallet_bags_list.list.ListError> = $.stringUnion({
  0: "Duplicate",
  1: "NotHeavier",
  2: "NotInSameBag",
  3: "NodeNotFound",
})

export const $615: $.Codec<t.pallet_bags_list.pallet.Error> = $.taggedUnion("type", {
  0: ["List", ["value", $616]],
})

export const $619: $.Codec<Map<t.u32, t.u128>> = $.map($4, $6)

export const $618: $.Codec<Map<t.u32, t.u128>> = $619

export const $617: $.Codec<t.pallet_nomination_pools.PoolMember> = $.object(
  ["pool_id", $4],
  ["points", $6],
  ["last_recorded_reward_counter", $479],
  ["unbonding_eras", $618],
)

export const $621: $.Codec<[t.u32, t.u128]> = $.tuple($4, $6)

export const $620: $.Codec<Array<[t.u32, t.u128]>> = $.array($621)

export const $623: $.Codec<t.pallet_nomination_pools.PoolRoles> = $.object(
  ["depositor", $0],
  ["root", $92],
  ["nominator", $92],
  ["state_toggler", $92],
)

export const $622: $.Codec<t.pallet_nomination_pools.BondedPoolInner> = $.object(
  ["points", $6],
  ["state", $91],
  ["member_counter", $4],
  ["roles", $623],
)

export const $624: $.Codec<t.pallet_nomination_pools.RewardPool> = $.object(
  ["last_recorded_reward_counter", $479],
  ["last_recorded_total_payouts", $6],
  ["total_rewards_claimed", $6],
)

export const $626: $.Codec<t.pallet_nomination_pools.UnbondPool> = $.object(["points", $6], [
  "balance",
  $6,
])

export const $628: $.Codec<Map<t.u32, t.pallet_nomination_pools.UnbondPool>> = $.map($4, $626)

export const $627: $.Codec<Map<t.u32, t.pallet_nomination_pools.UnbondPool>> = $628

export const $625: $.Codec<t.pallet_nomination_pools.SubPools> = $.object(["no_era", $626], [
  "with_era",
  $627,
])

export const $630: $.Codec<[t.u32, t.pallet_nomination_pools.UnbondPool]> = $.tuple($4, $626)

export const $629: $.Codec<Array<[t.u32, t.pallet_nomination_pools.UnbondPool]>> = $.array($630)

export const $631: $.Codec<Uint8Array> = $12

export const $633: $.Codec<t.pallet_nomination_pools.pallet.DefensiveError> = $.stringUnion({
  0: "NotEnoughSpaceInUnbondPool",
  1: "PoolNotFound",
  2: "RewardPoolNotFound",
  3: "SubPoolsNotFound",
  4: "BondedStashKilledPrematurely",
})

export const $632: $.Codec<t.pallet_nomination_pools.pallet.Error> = $.taggedUnion("type", {
  0: ["PoolNotFound"],
  1: ["PoolMemberNotFound"],
  2: ["RewardPoolNotFound"],
  3: ["SubPoolsNotFound"],
  4: ["AccountBelongsToOtherPool"],
  5: ["FullyUnbonding"],
  6: ["MaxUnbondingLimit"],
  7: ["CannotWithdrawAny"],
  8: ["MinimumBondNotMet"],
  9: ["OverflowRisk"],
  10: ["NotDestroying"],
  11: ["NotNominator"],
  12: ["NotKickerOrDestroying"],
  13: ["NotOpen"],
  14: ["MaxPools"],
  15: ["MaxPoolMembers"],
  16: ["CanNotChangeState"],
  17: ["DoesNotHavePermission"],
  18: ["MetadataExceedsMaxLen"],
  19: ["Defensive", ["value", $633]],
  20: ["PartialUnbondNotAllowedPermissionlessly"],
})

export const $636: $.Codec<Array<t.u32>> = $94

export const $634: $.Codec<t.pallet_fast_unstake.types.UnstakeRequest> = $.object(["stash", $0], [
  "checked",
  $636,
], ["deposit", $6])

export const $635: $.Codec<t.pallet_fast_unstake.pallet.MaxChecking> = C.$null

export const $637: $.Codec<t.pallet_fast_unstake.pallet.Error> = $.stringUnion({
  0: "NotController",
  1: "AlreadyQueued",
  2: "NotFullyBonded",
  3: "NotQueued",
  4: "AlreadyHead",
  5: "CallNotAllowed",
})

export const $638: $.Codec<t.polkadot_runtime_parachains.configuration.HostConfiguration> = $
  .object(
    ["max_code_size", $4],
    ["max_head_data_size", $4],
    ["max_upward_queue_count", $4],
    ["max_upward_queue_size", $4],
    ["max_upward_message_size", $4],
    ["max_upward_message_num_per_candidate", $4],
    ["hrmp_max_message_num_per_candidate", $4],
    ["validation_upgrade_cooldown", $4],
    ["validation_upgrade_delay", $4],
    ["max_pov_size", $4],
    ["max_downward_message_size", $4],
    ["ump_service_total_weight", $8],
    ["hrmp_max_parachain_outbound_channels", $4],
    ["hrmp_max_parathread_outbound_channels", $4],
    ["hrmp_sender_deposit", $6],
    ["hrmp_recipient_deposit", $6],
    ["hrmp_channel_max_capacity", $4],
    ["hrmp_channel_max_total_size", $4],
    ["hrmp_max_parachain_inbound_channels", $4],
    ["hrmp_max_parathread_inbound_channels", $4],
    ["hrmp_channel_max_message_size", $4],
    ["code_retention_period", $4],
    ["parathread_cores", $4],
    ["parathread_retries", $4],
    ["group_rotation_frequency", $4],
    ["chain_availability_period", $4],
    ["thread_availability_period", $4],
    ["scheduling_lookahead", $4],
    ["max_validators_per_core", $236],
    ["max_validators", $236],
    ["dispute_period", $4],
    ["dispute_post_conclusion_acceptance_period", $4],
    ["dispute_max_spam_slots", $4],
    ["dispute_conclusion_by_time_out_period", $4],
    ["no_show_slots", $4],
    ["n_delay_tranches", $4],
    ["zeroth_delay_tranche_width", $4],
    ["needed_approvals", $4],
    ["relay_vrf_modulo_samples", $4],
    ["ump_max_individual_weight", $8],
    ["pvf_checking_enabled", $43],
    ["pvf_voting_ttl", $4],
    ["minimum_validation_upgrade_delay", $4],
  )

export const $640: $.Codec<[t.u32, t.polkadot_runtime_parachains.configuration.HostConfiguration]> =
  $.tuple($4, $638)

export const $639: $.Codec<
  Array<[t.u32, t.polkadot_runtime_parachains.configuration.HostConfiguration]>
> = $.array($640)

export const $641: $.Codec<t.polkadot_runtime_parachains.configuration.pallet.Error> = $
  .stringUnion({ 0: "InvalidNewValue" })

export const $642: $.Codec<Array<t.polkadot_primitives.v2.ValidatorIndex>> = $.array($385)

export const $643: $.Codec<Array<t.polkadot_primitives.v2.validator_app.Public>> = $.array($213)

export const $644: $.Codec<t.polkadot_runtime_parachains.inclusion.AvailabilityBitfieldRecord> = $
  .object(["bitfield", $382], ["submitted_at", $4])

export const $645: $.Codec<t.polkadot_runtime_parachains.inclusion.CandidatePendingAvailability> = $
  .object(
    ["core", $105],
    ["hash", $114],
    ["descriptor", $97],
    ["availability_votes", $383],
    ["backers", $383],
    ["relay_parent_number", $4],
    ["backed_in_number", $4],
    ["backing_group", $106],
  )

export const $646: $.Codec<t.polkadot_runtime_parachains.inclusion.pallet.Error> = $.stringUnion({
  0: "UnsortedOrDuplicateValidatorIndices",
  1: "UnsortedOrDuplicateDisputeStatementSet",
  2: "UnsortedOrDuplicateBackedCandidates",
  3: "UnexpectedRelayParent",
  4: "WrongBitfieldSize",
  5: "BitfieldAllZeros",
  6: "BitfieldDuplicateOrUnordered",
  7: "ValidatorIndexOutOfBounds",
  8: "InvalidBitfieldSignature",
  9: "UnscheduledCandidate",
  10: "CandidateScheduledBeforeParaFree",
  11: "WrongCollator",
  12: "ScheduledOutOfOrder",
  13: "HeadDataTooLarge",
  14: "PrematureCodeUpgrade",
  15: "NewCodeTooLarge",
  16: "CandidateNotInParentContext",
  17: "InvalidGroupIndex",
  18: "InsufficientBacking",
  19: "InvalidBacking",
  20: "NotCollatorSigned",
  21: "ValidationDataHashMismatch",
  22: "IncorrectDownwardMessageHandling",
  23: "InvalidUpwardMessages",
  24: "HrmpWatermarkMishandling",
  25: "InvalidOutboundHrmp",
  26: "InvalidValidationCodeHash",
  27: "ParaHeadMismatch",
  28: "BitfieldReferencesFreedCore",
})

export const $651: $.Codec<
  [t.polkadot_primitives.v2.ValidatorIndex, t.polkadot_primitives.v2.ValidityAttestation]
> = $.tuple($385, $396)

export const $650: $.Codec<
  Array<[t.polkadot_primitives.v2.ValidatorIndex, t.polkadot_primitives.v2.ValidityAttestation]>
> = $.array($651)

export const $649: $.Codec<
  [
    t.polkadot_primitives.v2.CandidateReceipt,
    Array<[t.polkadot_primitives.v2.ValidatorIndex, t.polkadot_primitives.v2.ValidityAttestation]>,
  ]
> = $.tuple($96, $650)

export const $648: $.Codec<
  Array<
    [
      t.polkadot_primitives.v2.CandidateReceipt,
      Array<
        [t.polkadot_primitives.v2.ValidatorIndex, t.polkadot_primitives.v2.ValidityAttestation]
      >,
    ]
  >
> = $.array($649)

export const $647: $.Codec<t.polkadot_primitives.v2.ScrapedOnChainVotes> = $.object(
  ["session", $4],
  ["backing_validators_per_candidate", $648],
  ["disputes", $397],
)

export const $652: $.Codec<t.polkadot_runtime_parachains.paras_inherent.pallet.Error> = $
  .stringUnion({
    0: "TooManyInclusionInherents",
    1: "InvalidParentHeader",
    2: "CandidateConcludedInvalid",
    3: "InherentOverweight",
    4: "DisputeStatementsUnsortedOrDuplicates",
    5: "DisputeInvalid",
  })

export const $653: $.Codec<Array<Array<t.polkadot_primitives.v2.ValidatorIndex>>> = $.array($642)

export const $658: $.Codec<t.polkadot_primitives.v2.ParathreadClaim> = $.tuple($98, $99)

export const $657: $.Codec<t.polkadot_primitives.v2.ParathreadEntry> = $.object(["claim", $658], [
  "retries",
  $4,
])

export const $656: $.Codec<t.polkadot_runtime_parachains.scheduler.QueuedParathread> = $.object([
  "claim",
  $657,
], ["core_offset", $4])

export const $655: $.Codec<Array<t.polkadot_runtime_parachains.scheduler.QueuedParathread>> = $
  .array($656)

export const $654: $.Codec<t.polkadot_runtime_parachains.scheduler.ParathreadClaimQueue> = $.object(
  ["queue", $655],
  ["next_core_offset", $4],
)

export const $661: $.Codec<t.polkadot_primitives.v2.CoreOccupied> = $.taggedUnion("type", {
  0: ["Parathread", ["value", $657]],
  1: ["Parachain"],
})

export const $660: $.Codec<t.polkadot_primitives.v2.CoreOccupied | undefined> = $.option($661)

export const $659: $.Codec<Array<t.polkadot_primitives.v2.CoreOccupied | undefined>> = $.array(
  $660,
)

export const $662: $.Codec<Array<t.polkadot_parachain.primitives.Id>> = $.array($98)

export const $665: $.Codec<t.polkadot_runtime_parachains.scheduler.AssignmentKind> = $.taggedUnion(
  "type",
  { 0: ["Parachain"], 1: ["Parathread", ["value", $.tuple($99, $4)]] },
)

export const $664: $.Codec<t.polkadot_runtime_parachains.scheduler.CoreAssignment> = $.object(
  ["core", $105],
  ["para_id", $98],
  ["kind", $665],
  ["group_idx", $106],
)

export const $663: $.Codec<Array<t.polkadot_runtime_parachains.scheduler.CoreAssignment>> = $.array(
  $664,
)

export const $668: $.Codec<t.polkadot_runtime_parachains.paras.PvfCheckCause> = $.taggedUnion(
  "type",
  { 0: ["Onboarding", ["value", $98]], 1: ["Upgrade", ["id", $98], ["relay_parent_number", $4]] },
)

export const $667: $.Codec<Array<t.polkadot_runtime_parachains.paras.PvfCheckCause>> = $.array(
  $668,
)

export const $666: $.Codec<t.polkadot_runtime_parachains.paras.PvfCheckActiveVoteState> = $.object(
  ["votes_accept", $383],
  ["votes_reject", $383],
  ["age", $4],
  ["created_at", $4],
  ["causes", $667],
)

export const $669: $.Codec<Array<t.polkadot_parachain.primitives.ValidationCodeHash>> = $.array(
  $103,
)

export const $670: $.Codec<t.polkadot_runtime_parachains.paras.ParaLifecycle> = $.stringUnion({
  0: "Onboarding",
  1: "Parathread",
  2: "Parachain",
  3: "UpgradingParathread",
  4: "DowngradingParachain",
  5: "OffboardingParathread",
  6: "OffboardingParachain",
})

export const $671: $.Codec<[t.polkadot_parachain.primitives.Id, t.u32]> = $.tuple($98, $4)

export const $674: $.Codec<t.polkadot_runtime_parachains.paras.ReplacementTimes> = $.object([
  "expected_at",
  $4,
], ["activated_at", $4])

export const $673: $.Codec<Array<t.polkadot_runtime_parachains.paras.ReplacementTimes>> = $.array(
  $674,
)

export const $672: $.Codec<t.polkadot_runtime_parachains.paras.ParaPastCodeMeta> = $.object([
  "upgrade_times",
  $673,
], ["last_pruned", $236])

export const $675: $.Codec<Array<[t.polkadot_parachain.primitives.Id, t.u32]>> = $.array($671)

export const $676: $.Codec<t.polkadot_primitives.v2.UpgradeGoAhead> = $.stringUnion({
  0: "Abort",
  1: "GoAhead",
})

export const $677: $.Codec<t.polkadot_primitives.v2.UpgradeRestriction> = $.stringUnion({
  0: "Present",
})

export const $678: $.Codec<t.polkadot_runtime_parachains.paras.ParaGenesisArgs> = $.object(
  ["genesis_head", $104],
  ["validation_code", $394],
  ["parachain", $43],
)

export const $679: $.Codec<t.polkadot_runtime_parachains.paras.pallet.Error> = $.stringUnion({
  0: "NotRegistered",
  1: "CannotOnboard",
  2: "CannotOffboard",
  3: "CannotUpgrade",
  4: "CannotDowngrade",
  5: "PvfCheckStatementStale",
  6: "PvfCheckStatementFuture",
  7: "PvfCheckValidatorIndexOutOfBounds",
  8: "PvfCheckInvalidSignature",
  9: "PvfCheckDoubleVote",
  10: "PvfCheckSubjectInvalid",
  11: "PvfCheckDisabled",
  12: "CannotUpgradeCode",
})

export const $681: $.Codec<t.polkadot_runtime_parachains.initializer.BufferedSessionChange> = $
  .object(["validators", $643], ["queued", $643], ["session_index", $4])

export const $680: $.Codec<Array<t.polkadot_runtime_parachains.initializer.BufferedSessionChange>> =
  $.array($681)

export const $683: $.Codec<t.polkadot_core_primitives.InboundDownwardMessage> = $.object([
  "sent_at",
  $4,
], ["msg", $12])

export const $682: $.Codec<Array<t.polkadot_core_primitives.InboundDownwardMessage>> = $.array(
  $683,
)

export const $684: $.Codec<[t.polkadot_parachain.primitives.Id, Uint8Array]> = $.tuple($98, $12)

export const $685: $.Codec<t.polkadot_runtime_parachains.ump.pallet.Error> = $.stringUnion({
  0: "UnknownMessageIndex",
  1: "WeightOverLimit",
})

export const $686: $.Codec<t.polkadot_runtime_parachains.hrmp.HrmpOpenChannelRequest> = $.object(
  ["confirmed", $43],
  ["_age", $4],
  ["sender_deposit", $6],
  ["max_message_size", $4],
  ["max_capacity", $4],
  ["max_total_size", $4],
)

export const $687: $.Codec<Array<t.polkadot_parachain.primitives.HrmpChannelId>> = $.array($112)

export const $689: $.Codec<t.primitive_types.H256 | undefined> = $.option($11)

export const $688: $.Codec<t.polkadot_runtime_parachains.hrmp.HrmpChannel> = $.object(
  ["max_capacity", $4],
  ["max_total_size", $4],
  ["max_message_size", $4],
  ["msg_count", $4],
  ["total_size", $4],
  ["mqc_head", $689],
  ["sender_deposit", $6],
  ["recipient_deposit", $6],
)

export const $691: $.Codec<t.polkadot_core_primitives.InboundHrmpMessage> = $.object([
  "sent_at",
  $4,
], ["data", $12])

export const $690: $.Codec<Array<t.polkadot_core_primitives.InboundHrmpMessage>> = $.array($691)

export const $693: $.Codec<[t.u32, Array<t.polkadot_parachain.primitives.Id>]> = $.tuple($4, $662)

export const $692: $.Codec<Array<[t.u32, Array<t.polkadot_parachain.primitives.Id>]>> = $.array(
  $693,
)

export const $694: $.Codec<t.polkadot_runtime_parachains.hrmp.pallet.Error> = $.stringUnion({
  0: "OpenHrmpChannelToSelf",
  1: "OpenHrmpChannelInvalidRecipient",
  2: "OpenHrmpChannelZeroCapacity",
  3: "OpenHrmpChannelCapacityExceedsLimit",
  4: "OpenHrmpChannelZeroMessageSize",
  5: "OpenHrmpChannelMessageSizeExceedsLimit",
  6: "OpenHrmpChannelAlreadyExists",
  7: "OpenHrmpChannelAlreadyRequested",
  8: "OpenHrmpChannelLimitExceeded",
  9: "AcceptHrmpChannelDoesntExist",
  10: "AcceptHrmpChannelAlreadyConfirmed",
  11: "AcceptHrmpChannelLimitExceeded",
  12: "CloseHrmpChannelUnauthorized",
  13: "CloseHrmpChannelDoesntExist",
  14: "CloseHrmpChannelAlreadyUnderway",
  15: "CancelHrmpOpenChannelUnauthorized",
  16: "OpenHrmpChannelDoesntExist",
  17: "OpenHrmpChannelAlreadyConfirmed",
  18: "WrongWitness",
})

export const $695: $.Codec<Array<t.polkadot_primitives.v2.assignment_app.Public>> = $.array($214)

export const $697: $.Codec<Array<t.sp_authority_discovery.app.Public>> = $.array($215)

export const $696: $.Codec<t.polkadot_primitives.v2.SessionInfo> = $.object(
  ["active_validator_indices", $642],
  ["random_seed", $1],
  ["dispute_period", $4],
  ["validators", $643],
  ["discovery_keys", $697],
  ["assignment_keys", $695],
  ["validator_groups", $653],
  ["n_cores", $4],
  ["zeroth_delay_tranche_width", $4],
  ["relay_vrf_modulo_samples", $4],
  ["n_delay_tranches", $4],
  ["no_show_slots", $4],
  ["needed_approvals", $4],
)

export const $698: $.Codec<[t.u32, t.polkadot_core_primitives.CandidateHash]> = $.tuple($4, $114)

export const $699: $.Codec<t.polkadot_primitives.v2.DisputeState> = $.object(
  ["validators_for", $383],
  ["validators_against", $383],
  ["start", $4],
  ["concluded_at", $236],
)

export const $700: $.Codec<t.polkadot_runtime_parachains.disputes.pallet.Error> = $.stringUnion({
  0: "DuplicateDisputeStatementSets",
  1: "AncientDisputeStatement",
  2: "ValidatorIndexOutOfBounds",
  3: "InvalidSignature",
  4: "DuplicateStatement",
  5: "PotentialSpam",
  6: "SingleSidedDispute",
})

export const $701: $.Codec<t.polkadot_runtime_common.paras_registrar.ParaInfo> = $.object(
  ["manager", $0],
  ["deposit", $6],
  ["locked", $43],
)

export const $702: $.Codec<t.polkadot_runtime_common.paras_registrar.pallet.Error> = $.stringUnion({
  0: "NotRegistered",
  1: "AlreadyRegistered",
  2: "NotOwner",
  3: "CodeTooLarge",
  4: "HeadDataTooLarge",
  5: "NotParachain",
  6: "NotParathread",
  7: "CannotDeregister",
  8: "CannotDowngrade",
  9: "CannotUpgrade",
  10: "ParaLocked",
  11: "NotReserved",
  12: "EmptyCode",
  13: "CannotSwap",
})

export const $703: $.Codec<Array<[t.sp_core.crypto.AccountId32, t.u128] | undefined>> = $.array(
  $452,
)

export const $704: $.Codec<t.polkadot_runtime_common.slots.pallet.Error> = $.stringUnion({
  0: "ParaNotOnboarding",
  1: "LeaseError",
})

export const $705: $.Codec<[t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id]> = $
  .tuple($0, $98)

export const $708: $.Codec<
  [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128]
> = $.tuple($0, $98, $6)

export const $707: $.Codec<
  [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined
> = $.option($708)

export const $706: $.Codec<
  [
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
    [t.sp_core.crypto.AccountId32, t.polkadot_parachain.primitives.Id, t.u128] | undefined,
  ]
> = $.sizedArray($707, 36)

export const $709: $.Codec<t.polkadot_runtime_common.auctions.pallet.Error> = $.stringUnion({
  0: "AuctionInProgress",
  1: "LeasePeriodInPast",
  2: "ParaNotRegistered",
  3: "NotCurrentAuction",
  4: "NotAuction",
  5: "AuctionEnded",
  6: "AlreadyLeasedOut",
})

export const $711: $.Codec<t.polkadot_runtime_common.crowdloan.LastContribution> = $.taggedUnion(
  "type",
  { 0: ["Never"], 1: ["PreEnding", ["value", $4]], 2: ["Ending", ["value", $4]] },
)

export const $710: $.Codec<t.polkadot_runtime_common.crowdloan.FundInfo> = $.object(
  ["depositor", $0],
  ["verifier", $416],
  ["deposit", $6],
  ["raised", $6],
  ["end", $4],
  ["cap", $6],
  ["last_contribution", $711],
  ["first_period", $4],
  ["last_period", $4],
  ["fund_index", $4],
)

export const $712: $.Codec<t.polkadot_runtime_common.crowdloan.pallet.Error> = $.stringUnion({
  0: "FirstPeriodInPast",
  1: "FirstPeriodTooFarInFuture",
  2: "LastPeriodBeforeFirstPeriod",
  3: "LastPeriodTooFarInFuture",
  4: "CannotEndInPast",
  5: "EndTooFarInFuture",
  6: "Overflow",
  7: "ContributionTooSmall",
  8: "InvalidParaId",
  9: "CapExceeded",
  10: "ContributionPeriodOver",
  11: "InvalidOrigin",
  12: "NotParachain",
  13: "LeaseActive",
  14: "BidOrLeaseActive",
  15: "FundNotEnded",
  16: "NoContributions",
  17: "NotReadyToDissolve",
  18: "InvalidSignature",
  19: "MemoTooLarge",
  20: "AlreadyInNewRaise",
  21: "VrfDelayInProgress",
  22: "NoLeasePeriod",
})

export const $715: $.Codec<[t.u8, t.u8]> = $.tuple($2, $2)

export const $714: $.Codec<[t.u8, t.u8] | undefined> = $.option($715)

export const $716: $.Codec<t.xcm.VersionedResponse> = $.taggedUnion("type", {
  0: ["V0", ["value", $429]],
  1: ["V1", ["value", $434]],
  2: ["V2", ["value", $140]],
})

export const $713: $.Codec<t.pallet_xcm.pallet.QueryStatus> = $.taggedUnion("type", {
  0: ["Pending", ["responder", $155], ["maybe_notify", $714], ["timeout", $4]],
  1: ["VersionNotifier", ["origin", $155], ["is_active", $43]],
  2: ["Ready", ["response", $716], ["at", $4]],
})

export const $717: $.Codec<[t.u32, t.xcm.VersionedMultiLocation]> = $.tuple($4, $155)

export const $718: $.Codec<[t.u64, t.u64, t.u32]> = $.tuple($10, $10, $4)

export const $720: $.Codec<[t.xcm.VersionedMultiLocation, t.u32]> = $.tuple($155, $4)

export const $721: $.Codec<Array<[t.xcm.VersionedMultiLocation, t.u32]>> = $.array($720)

export const $719: $.Codec<Array<[t.xcm.VersionedMultiLocation, t.u32]>> = $721

export const $723: $.Codec<Uint8Array | undefined> = $.option($12)

export const $722: $.Codec<t.pallet_xcm.pallet.VersionMigrationStage> = $.taggedUnion("type", {
  0: ["MigrateSupportedVersion"],
  1: ["MigrateVersionNotifiers"],
  2: ["NotifyCurrentTargets", ["value", $723]],
  3: ["MigrateAndNotifyOldTargets"],
})

export const $724: $.Codec<t.pallet_xcm.pallet.Error> = $.stringUnion({
  0: "Unreachable",
  1: "SendFailure",
  2: "Filtered",
  3: "UnweighableMessage",
  4: "DestinationNotInvertible",
  5: "Empty",
  6: "CannotReanchor",
  7: "TooManyAssets",
  8: "InvalidOrigin",
  9: "BadVersion",
  10: "BadLocation",
  11: "NoSubscription",
  12: "AlreadySubscribed",
})

export const $725: $.Codec<Uint8Array> = $12

export const $727: $.Codec<t.frame_system.extensions.check_non_zero_sender.CheckNonZeroSender> =
  C.$null

export const $728: $.Codec<t.frame_system.extensions.check_spec_version.CheckSpecVersion> = C.$null

export const $729: $.Codec<t.frame_system.extensions.check_tx_version.CheckTxVersion> = C.$null

export const $730: $.Codec<t.frame_system.extensions.check_genesis.CheckGenesis> = C.$null

export const $732: $.Codec<C.Era> = C.$era

export const $731: $.Codec<C.Era> = $732

export const $733: $.Codec<t.Compact<t.u32>> = $125

export const $734: $.Codec<t.frame_system.extensions.check_weight.CheckWeight> = C.$null

export const $735: $.Codec<t.Compact<t.u128>> = $58

export const $736: $.Codec<t.polkadot_runtime_common.claims.PrevalidateAttests> = C.$null

export const $726: $.Codec<
  [
    t.frame_system.extensions.check_non_zero_sender.CheckNonZeroSender,
    t.frame_system.extensions.check_spec_version.CheckSpecVersion,
    t.frame_system.extensions.check_tx_version.CheckTxVersion,
    t.frame_system.extensions.check_genesis.CheckGenesis,
    C.Era,
    t.Compact<t.u32>,
    t.frame_system.extensions.check_weight.CheckWeight,
    t.Compact<t.u128>,
    t.polkadot_runtime_common.claims.PrevalidateAttests,
  ]
> = $.tuple($727, $728, $729, $730, $731, $733, $734, $735, $736)

export const $737: $.Codec<t.polkadot_runtime.Runtime> = C.$null

export const _all: $.AnyCodec[] = [
  $0,
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8,
  $9,
  $10,
  $11,
  $12,
  $13,
  $14,
  $15,
  $16,
  $17,
  $18,
  $19,
  $20,
  $21,
  $22,
  $23,
  $24,
  $25,
  $26,
  $27,
  $28,
  $29,
  $30,
  $31,
  $32,
  $33,
  $34,
  $35,
  $36,
  $37,
  $38,
  $39,
  $40,
  $41,
  $42,
  $43,
  $44,
  $45,
  $46,
  $47,
  $48,
  $49,
  $50,
  $51,
  $52,
  $53,
  $54,
  $55,
  $56,
  $57,
  $58,
  $59,
  $60,
  $61,
  $62,
  $63,
  $64,
  $65,
  $66,
  $67,
  $68,
  $69,
  $70,
  $71,
  $72,
  $73,
  $74,
  $75,
  $76,
  $77,
  $78,
  $79,
  $80,
  $81,
  $82,
  $83,
  $84,
  $85,
  $86,
  $87,
  $88,
  $89,
  $90,
  $91,
  $92,
  $93,
  $94,
  $95,
  $96,
  $97,
  $98,
  $99,
  $100,
  $101,
  $102,
  $103,
  $104,
  $105,
  $106,
  $107,
  $108,
  $109,
  $110,
  $111,
  $112,
  $113,
  $114,
  $115,
  $116,
  $117,
  $118,
  $119,
  $120,
  $121,
  $122,
  $123,
  $124,
  $125,
  $126,
  $127,
  $128,
  $129,
  $130,
  $131,
  $132,
  $133,
  $134,
  $135,
  $136,
  $137,
  $138,
  $139,
  $140,
  $141,
  $142,
  $143,
  $144,
  $145,
  $146,
  $147,
  $148,
  $149,
  $150,
  $151,
  $152,
  $153,
  $154,
  $155,
  $156,
  $157,
  $158,
  $159,
  $160,
  $161,
  $162,
  $163,
  $164,
  $165,
  $166,
  $167,
  $168,
  $169,
  $170,
  $171,
  $172,
  $173,
  $174,
  $175,
  $176,
  $177,
  $178,
  $179,
  $180,
  $181,
  $182,
  $183,
  $184,
  $185,
  $186,
  $187,
  $188,
  $189,
  $190,
  $191,
  $192,
  $193,
  $194,
  $195,
  $196,
  $197,
  $198,
  $199,
  $200,
  $201,
  $202,
  $203,
  $204,
  $205,
  $206,
  $207,
  $208,
  $209,
  $210,
  $211,
  $212,
  $213,
  $214,
  $215,
  $216,
  $217,
  $218,
  $219,
  $220,
  $221,
  $222,
  $223,
  $224,
  $225,
  $226,
  $227,
  $228,
  $229,
  $230,
  $231,
  $232,
  $233,
  $234,
  $235,
  $236,
  $237,
  $238,
  $239,
  $240,
  $241,
  $242,
  $243,
  $244,
  $245,
  $246,
  $247,
  $248,
  $249,
  $250,
  $251,
  $252,
  $253,
  $254,
  $255,
  $256,
  $257,
  $258,
  $259,
  $260,
  $261,
  $262,
  $263,
  $264,
  $265,
  $266,
  $267,
  $268,
  $269,
  $270,
  $271,
  $272,
  $273,
  $274,
  $275,
  $276,
  $277,
  $278,
  $279,
  $280,
  $281,
  $282,
  $283,
  $284,
  $285,
  $286,
  $287,
  $288,
  $289,
  $290,
  $291,
  $292,
  $293,
  $294,
  $295,
  $296,
  $297,
  $298,
  $299,
  $300,
  $301,
  $302,
  $303,
  $304,
  $305,
  $306,
  $307,
  $308,
  $309,
  $310,
  $311,
  $312,
  $313,
  $314,
  $315,
  $316,
  $317,
  $318,
  $319,
  $320,
  $321,
  $322,
  $323,
  $324,
  $325,
  $326,
  $327,
  $328,
  $329,
  $330,
  $331,
  $332,
  $333,
  $334,
  $335,
  $336,
  $337,
  $338,
  $339,
  $340,
  $341,
  $342,
  $343,
  $344,
  $345,
  $346,
  $347,
  $348,
  $349,
  $350,
  $351,
  $352,
  $353,
  $354,
  $355,
  $356,
  $357,
  $358,
  $359,
  $360,
  $361,
  $362,
  $363,
  $364,
  $365,
  $366,
  $367,
  $368,
  $369,
  $370,
  $371,
  $372,
  $373,
  $374,
  $375,
  $376,
  $377,
  $378,
  $379,
  $380,
  $381,
  $382,
  $383,
  $384,
  $385,
  $386,
  $387,
  $388,
  $389,
  $390,
  $391,
  $392,
  $393,
  $394,
  $395,
  $396,
  $397,
  $398,
  $399,
  $400,
  $401,
  $402,
  $403,
  $404,
  $405,
  $406,
  $407,
  $408,
  $409,
  $410,
  $411,
  $412,
  $413,
  $414,
  $415,
  $416,
  $417,
  $418,
  $419,
  $420,
  $421,
  $422,
  $423,
  $424,
  $425,
  $426,
  $427,
  $428,
  $429,
  $430,
  $431,
  $432,
  $433,
  $434,
  $435,
  $436,
  $437,
  $438,
  $439,
  $440,
  $441,
  $442,
  $443,
  $444,
  $445,
  $446,
  $447,
  $448,
  $449,
  $450,
  $451,
  $452,
  $453,
  $454,
  $455,
  $456,
  $457,
  $458,
  $459,
  $460,
  $461,
  $462,
  $463,
  $464,
  $465,
  $466,
  $467,
  $468,
  $469,
  $470,
  $471,
  $472,
  $473,
  $474,
  $475,
  $476,
  $477,
  $478,
  $479,
  $480,
  $481,
  $482,
  $483,
  $484,
  $485,
  $486,
  $487,
  $488,
  $489,
  $490,
  $491,
  $492,
  $493,
  $494,
  $495,
  $496,
  $497,
  $498,
  $499,
  $500,
  $501,
  $502,
  $503,
  $504,
  $505,
  $506,
  $507,
  $508,
  $509,
  $510,
  $511,
  $512,
  $513,
  $514,
  $515,
  $516,
  $517,
  $518,
  $519,
  $520,
  $521,
  $522,
  $523,
  $524,
  $525,
  $526,
  $527,
  $528,
  $529,
  $530,
  $531,
  $532,
  $533,
  $534,
  $535,
  $536,
  $537,
  $538,
  $539,
  $540,
  $541,
  $542,
  $543,
  $544,
  $545,
  $546,
  $547,
  $548,
  $549,
  $550,
  $551,
  $552,
  $553,
  $554,
  $555,
  $556,
  $557,
  $558,
  $559,
  $560,
  $561,
  $562,
  $563,
  $564,
  $565,
  $566,
  $567,
  $568,
  $569,
  $570,
  $571,
  $572,
  $573,
  $574,
  $575,
  $576,
  $577,
  $578,
  $579,
  $580,
  $581,
  $582,
  $583,
  $584,
  $585,
  $586,
  $587,
  $588,
  $589,
  $590,
  $591,
  $592,
  $593,
  $594,
  $595,
  $596,
  $597,
  $598,
  $599,
  $600,
  $601,
  $602,
  $603,
  $604,
  $605,
  $606,
  $607,
  $608,
  $609,
  $610,
  $611,
  $612,
  $613,
  $614,
  $615,
  $616,
  $617,
  $618,
  $619,
  $620,
  $621,
  $622,
  $623,
  $624,
  $625,
  $626,
  $627,
  $628,
  $629,
  $630,
  $631,
  $632,
  $633,
  $634,
  $635,
  $636,
  $637,
  $638,
  $639,
  $640,
  $641,
  $642,
  $643,
  $644,
  $645,
  $646,
  $647,
  $648,
  $649,
  $650,
  $651,
  $652,
  $653,
  $654,
  $655,
  $656,
  $657,
  $658,
  $659,
  $660,
  $661,
  $662,
  $663,
  $664,
  $665,
  $666,
  $667,
  $668,
  $669,
  $670,
  $671,
  $672,
  $673,
  $674,
  $675,
  $676,
  $677,
  $678,
  $679,
  $680,
  $681,
  $682,
  $683,
  $684,
  $685,
  $686,
  $687,
  $688,
  $689,
  $690,
  $691,
  $692,
  $693,
  $694,
  $695,
  $696,
  $697,
  $698,
  $699,
  $700,
  $701,
  $702,
  $703,
  $704,
  $705,
  $706,
  $707,
  $708,
  $709,
  $710,
  $711,
  $712,
  $713,
  $714,
  $715,
  $716,
  $717,
  $718,
  $719,
  $720,
  $721,
  $722,
  $723,
  $724,
  $725,
  $726,
  $727,
  $728,
  $729,
  $730,
  $731,
  $732,
  $733,
  $734,
  $735,
  $736,
  $737,
]
