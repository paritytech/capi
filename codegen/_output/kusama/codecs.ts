import { $, C } from "./capi.ts"
import type * as types from "./types/mod.ts"

export const $1: $.Codec<Uint8Array> = $.sizedUint8Array(32)

export const $0: $.Codec<types.sp_core.crypto.AccountId32> = $1

export const $2: $.Codec<types.u8> = $.u8

export const $4: $.Codec<types.u32> = $.u32

export const $6: $.Codec<types.u128> = $.u128

export const $5: $.Codec<types.pallet_balances.AccountData> = $.object(
  ["free", $6],
  ["reserved", $6],
  ["miscFrozen", $6],
  ["feeFrozen", $6],
)

export const $3: $.Codec<types.frame_system.AccountInfo> = $.object(
  ["nonce", $4],
  ["consumers", $4],
  ["providers", $4],
  ["sufficients", $4],
  ["data", $5],
)

export const $10: $.Codec<types.u64> = $.u64

export const $9: $.Codec<types.Compact<types.u64>> = $.compact($10)

export const $8: $.Codec<types.sp_weights.weight_v2.Weight> = $.object(["refTime", $9], [
  "proofSize",
  $9,
])

export const $7: $.Codec<
  types.frame_support.dispatch.PerDispatchClass.$$sp_weights.weight_v2.Weight
> = $.object(["normal", $8], ["operational", $8], ["mandatory", $8])

export const $11: $.Codec<types.primitive_types.H256> = $1

export const $12: $.Codec<Uint8Array> = $.uint8Array

export const $16: $.Codec<Uint8Array> = $.sizedUint8Array(4)

export const $15: $.Codec<types.sp_runtime.generic.digest.DigestItem> = $.taggedUnion("type", {
  6: ["PreRuntime", ["value", $.tuple($16, $12)]],
  4: ["Consensus", ["value", $.tuple($16, $12)]],
  5: ["Seal", ["value", $.tuple($16, $12)]],
  0: ["Other", ["value", $12]],
  8: ["RuntimeEnvironmentUpdated"],
})

export const $14: $.Codec<Array<types.sp_runtime.generic.digest.DigestItem>> = $.array($15)

export const $13: $.Codec<types.sp_runtime.generic.digest.Digest> = $.object(["logs", $14])

export const $156: $.Codec<types.frame_system.Phase> = $.taggedUnion("type", {
  0: ["ApplyExtrinsic", ["value", $4]],
  1: ["Finalization"],
  2: ["Initialization"],
})

export const $22: $.Codec<types.frame_support.dispatch.DispatchClass> = $.stringUnion({
  0: "Normal",
  1: "Operational",
  2: "Mandatory",
})

export const $23: $.Codec<types.frame_support.dispatch.Pays> = $.stringUnion({ 0: "Yes", 1: "No" })

export const $21: $.Codec<types.frame_support.dispatch.DispatchInfo> = $.object(["weight", $8], [
  "class",
  $22,
], ["paysFee", $23])

export const $25: $.Codec<types.sp_runtime.ModuleError> = $.object(["index", $2], ["error", $16])

export const $26: $.Codec<types.sp_runtime.TokenError> = $.stringUnion({
  0: "NoFunds",
  1: "WouldDie",
  2: "BelowMinimum",
  3: "CannotCreate",
  4: "UnknownAsset",
  5: "Frozen",
  6: "Unsupported",
})

export const $27: $.Codec<types.sp_runtime.ArithmeticError> = $.stringUnion({
  0: "Underflow",
  1: "Overflow",
  2: "DivisionByZero",
})

export const $28: $.Codec<types.sp_runtime.TransactionalError> = $.stringUnion({
  0: "LimitReached",
  1: "NoLayer",
})

export const $24: $.Codec<types.sp_runtime.DispatchError> = $.taggedUnion("type", {
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

export const $20: $.Codec<types.frame_system.pallet.Event> = $.taggedUnion("type", {
  0: ["ExtrinsicSuccess", ["dispatchInfo", $21]],
  1: ["ExtrinsicFailed", ["dispatchError", $24], ["dispatchInfo", $21]],
  2: ["CodeUpdated"],
  3: ["NewAccount", ["account", $0]],
  4: ["KilledAccount", ["account", $0]],
  5: ["Remarked", ["sender", $0], ["hash", $11]],
})

export const $30: $.Codec<[types.u32, types.u32]> = $.tuple($4, $4)

export const $31: $.Codec<Uint8Array | undefined> = $.option($1)

export const $33: $.Codec<null> = C.$null

export const $32: $.Codec<null | C.ChainError<types.sp_runtime.DispatchError>> = $.result(
  $33,
  $.instance(C.ChainError<$.Native<typeof $24>>, ["value", $24]),
)

export const $29: $.Codec<types.pallet_scheduler.pallet.Event> = $.taggedUnion("type", {
  0: ["Scheduled", ["when", $4], ["index", $4]],
  1: ["Canceled", ["when", $4], ["index", $4]],
  2: ["Dispatched", ["task", $30], ["id", $31], ["result", $32]],
  3: ["CallUnavailable", ["task", $30], ["id", $31]],
  4: ["PeriodicFailed", ["task", $30], ["id", $31]],
  5: ["PermanentlyOverweight", ["task", $30], ["id", $31]],
})

export const $34: $.Codec<types.pallet_preimage.pallet.Event> = $.taggedUnion("type", {
  0: ["Noted", ["hash", $11]],
  1: ["Requested", ["hash", $11]],
  2: ["Cleared", ["hash", $11]],
})

export const $35: $.Codec<types.pallet_indices.pallet.Event> = $.taggedUnion("type", {
  0: ["IndexAssigned", ["who", $0], ["index", $4]],
  1: ["IndexFreed", ["index", $4]],
  2: ["IndexFrozen", ["index", $4], ["who", $0]],
})

export const $37: $.Codec<types.frame_support.traits.tokens.misc.BalanceStatus> = $.stringUnion({
  0: "Free",
  1: "Reserved",
})

export const $36: $.Codec<types.pallet_balances.pallet.Event> = $.taggedUnion("type", {
  0: ["Endowed", ["account", $0], ["freeBalance", $6]],
  1: ["DustLost", ["account", $0], ["amount", $6]],
  2: ["Transfer", ["from", $0], ["to", $0], ["amount", $6]],
  3: ["BalanceSet", ["who", $0], ["free", $6], ["reserved", $6]],
  4: ["Reserved", ["who", $0], ["amount", $6]],
  5: ["Unreserved", ["who", $0], ["amount", $6]],
  6: ["ReserveRepatriated", ["from", $0], ["to", $0], ["amount", $6], ["destinationStatus", $37]],
  7: ["Deposit", ["who", $0], ["amount", $6]],
  8: ["Withdraw", ["who", $0], ["amount", $6]],
  9: ["Slashed", ["who", $0], ["amount", $6]],
})

export const $38: $.Codec<types.pallet_transaction_payment.pallet.Event> = $.taggedUnion("type", {
  0: ["TransactionFeePaid", ["who", $0], ["actualFee", $6], ["tip", $6]],
})

export const $42: $.Codec<types.sp_arithmetic.per_things.Perbill> = $4

export const $41: $.Codec<types.Compact<types.sp_arithmetic.per_things.Perbill>> = $.compact($42)

export const $43: $.Codec<boolean> = $.bool

export const $40: $.Codec<types.pallet_staking.ValidatorPrefs> = $.object(["commission", $41], [
  "blocked",
  $43,
])

export const $39: $.Codec<types.pallet_staking.pallet.pallet.Event> = $.taggedUnion("type", {
  0: ["EraPaid", ["eraIndex", $4], ["validatorPayout", $6], ["remainder", $6]],
  1: ["Rewarded", ["stash", $0], ["amount", $6]],
  2: ["Slashed", ["staker", $0], ["amount", $6]],
  3: ["OldSlashingReportDiscarded", ["sessionIndex", $4]],
  4: ["StakersElected"],
  5: ["Bonded", ["stash", $0], ["amount", $6]],
  6: ["Unbonded", ["stash", $0], ["amount", $6]],
  7: ["Withdrawn", ["stash", $0], ["amount", $6]],
  8: ["Kicked", ["nominator", $0], ["stash", $0]],
  9: ["StakingElectionFailed"],
  10: ["Chilled", ["stash", $0]],
  11: ["PayoutStarted", ["eraIndex", $4], ["validatorStash", $0]],
  12: ["ValidatorPrefsSet", ["stash", $0], ["prefs", $40]],
})

export const $45: $.Codec<Uint8Array> = $.sizedUint8Array(16)

export const $44: $.Codec<types.pallet_offences.pallet.Event> = $.taggedUnion("type", {
  0: ["Offence", ["kind", $45], ["timeslot", $12]],
})

export const $46: $.Codec<types.pallet_session.pallet.Event> = $.taggedUnion("type", {
  0: ["NewSession", ["sessionIndex", $4]],
})

export const $51: $.Codec<types.sp_core.ed25519.Public> = $1

export const $50: $.Codec<types.sp_finality_grandpa.app.Public> = $51

export const $49: $.Codec<[types.sp_finality_grandpa.app.Public, types.u64]> = $.tuple($50, $10)

export const $48: $.Codec<Array<[types.sp_finality_grandpa.app.Public, types.u64]>> = $.array($49)

export const $47: $.Codec<types.pallet_grandpa.pallet.Event> = $.taggedUnion("type", {
  0: ["NewAuthorities", ["authoritySet", $48]],
  1: ["Paused"],
  2: ["Resumed"],
})

export const $54: $.Codec<types.sp_core.sr25519.Public> = $1

export const $53: $.Codec<types.pallet_im_online.sr25519.app_sr25519.Public> = $54

export const $58: $.Codec<types.Compact<types.u128>> = $.compact($6)

export const $60: $.Codec<types.pallet_staking.IndividualExposure> = $.object(["who", $0], [
  "value",
  $58,
])

export const $59: $.Codec<Array<types.pallet_staking.IndividualExposure>> = $.array($60)

export const $57: $.Codec<types.pallet_staking.Exposure> = $.object(["total", $58], ["own", $58], [
  "others",
  $59,
])

export const $56: $.Codec<[types.sp_core.crypto.AccountId32, types.pallet_staking.Exposure]> = $
  .tuple($0, $57)

export const $55: $.Codec<
  Array<[types.sp_core.crypto.AccountId32, types.pallet_staking.Exposure]>
> = $.array($56)

export const $52: $.Codec<types.pallet_im_online.pallet.Event> = $.taggedUnion("type", {
  0: ["HeartbeatReceived", ["authorityId", $53]],
  1: ["AllGood"],
  2: ["SomeOffline", ["offline", $55]],
})

export const $62: $.Codec<types.pallet_democracy.vote_threshold.VoteThreshold> = $.stringUnion({
  0: "SuperMajorityApprove",
  1: "SuperMajorityAgainst",
  2: "SimpleMajority",
})

export const $64: $.Codec<types.pallet_democracy.vote.Vote> = $2

export const $63: $.Codec<types.pallet_democracy.vote.AccountVote> = $.taggedUnion("type", {
  0: ["Standard", ["vote", $64], ["balance", $6]],
  1: ["Split", ["aye", $6], ["nay", $6]],
})

export const $61: $.Codec<types.pallet_democracy.pallet.Event> = $.taggedUnion("type", {
  0: ["Proposed", ["proposalIndex", $4], ["deposit", $6]],
  1: ["Tabled", ["proposalIndex", $4], ["deposit", $6]],
  2: ["ExternalTabled"],
  3: ["Started", ["refIndex", $4], ["threshold", $62]],
  4: ["Passed", ["refIndex", $4]],
  5: ["NotPassed", ["refIndex", $4]],
  6: ["Cancelled", ["refIndex", $4]],
  7: ["Delegated", ["who", $0], ["target", $0]],
  8: ["Undelegated", ["account", $0]],
  9: ["Vetoed", ["who", $0], ["proposalHash", $11], ["until", $4]],
  10: ["Blacklisted", ["proposalHash", $11]],
  11: ["Voted", ["voter", $0], ["refIndex", $4], ["vote", $63]],
  12: ["Seconded", ["seconder", $0], ["propIndex", $4]],
  13: ["ProposalCanceled", ["propIndex", $4]],
})

export const $65: $.Codec<types.pallet_collective.pallet.Event> = $.taggedUnion("type", {
  0: ["Proposed", ["account", $0], ["proposalIndex", $4], ["proposalHash", $11], ["threshold", $4]],
  1: ["Voted", ["account", $0], ["proposalHash", $11], ["voted", $43], ["yes", $4], ["no", $4]],
  2: ["Approved", ["proposalHash", $11]],
  3: ["Disapproved", ["proposalHash", $11]],
  4: ["Executed", ["proposalHash", $11], ["result", $32]],
  5: ["MemberExecuted", ["proposalHash", $11], ["result", $32]],
  6: ["Closed", ["proposalHash", $11], ["yes", $4], ["no", $4]],
})

export const $66: $.Codec<types.pallet_collective.pallet.Event> = $.taggedUnion("type", {
  0: ["Proposed", ["account", $0], ["proposalIndex", $4], ["proposalHash", $11], ["threshold", $4]],
  1: ["Voted", ["account", $0], ["proposalHash", $11], ["voted", $43], ["yes", $4], ["no", $4]],
  2: ["Approved", ["proposalHash", $11]],
  3: ["Disapproved", ["proposalHash", $11]],
  4: ["Executed", ["proposalHash", $11], ["result", $32]],
  5: ["MemberExecuted", ["proposalHash", $11], ["result", $32]],
  6: ["Closed", ["proposalHash", $11], ["yes", $4], ["no", $4]],
})

export const $69: $.Codec<[types.sp_core.crypto.AccountId32, types.u128]> = $.tuple($0, $6)

export const $68: $.Codec<Array<[types.sp_core.crypto.AccountId32, types.u128]>> = $.array($69)

export const $67: $.Codec<types.pallet_elections_phragmen.pallet.Event> = $.taggedUnion("type", {
  0: ["NewTerm", ["newMembers", $68]],
  1: ["EmptyTerm"],
  2: ["ElectionError"],
  3: ["MemberKicked", ["member", $0]],
  4: ["Renounced", ["candidate", $0]],
  5: ["CandidateSlashed", ["candidate", $0], ["amount", $6]],
  6: ["SeatHolderSlashed", ["seatHolder", $0], ["amount", $6]],
})

export const $70: $.Codec<types.pallet_membership.pallet.Event> = $.stringUnion({
  0: "MemberAdded",
  1: "MemberRemoved",
  2: "MembersSwapped",
  3: "MembersReset",
  4: "KeyChanged",
  5: "Dummy",
})

export const $71: $.Codec<types.pallet_treasury.pallet.Event> = $.taggedUnion("type", {
  0: ["Proposed", ["proposalIndex", $4]],
  1: ["Spending", ["budgetRemaining", $6]],
  2: ["Awarded", ["proposalIndex", $4], ["award", $6], ["account", $0]],
  3: ["Rejected", ["proposalIndex", $4], ["slashed", $6]],
  4: ["Burnt", ["burntFunds", $6]],
  5: ["Rollover", ["rolloverBalance", $6]],
  6: ["Deposit", ["value", $6]],
  7: ["SpendApproved", ["proposalIndex", $4], ["amount", $6], ["beneficiary", $0]],
})

export const $74: $.Codec<Uint8Array> = $.sizedUint8Array(20)

export const $73: $.Codec<types.polkadot_runtime_common.claims.EthereumAddress> = $74

export const $72: $.Codec<types.polkadot_runtime_common.claims.pallet.Event> = $.taggedUnion(
  "type",
  { 0: ["Claimed", ["who", $0], ["ethereumAddress", $73], ["amount", $6]] },
)

export const $75: $.Codec<types.pallet_vesting.pallet.Event> = $.taggedUnion("type", {
  0: ["VestingUpdated", ["account", $0], ["unvested", $6]],
  1: ["VestingCompleted", ["account", $0]],
})

export const $76: $.Codec<types.pallet_utility.pallet.Event> = $.taggedUnion("type", {
  0: ["BatchInterrupted", ["index", $4], ["error", $24]],
  1: ["BatchCompleted"],
  2: ["BatchCompletedWithErrors"],
  3: ["ItemCompleted"],
  4: ["ItemFailed", ["error", $24]],
  5: ["DispatchedAs", ["result", $32]],
})

export const $77: $.Codec<types.pallet_identity.pallet.Event> = $.taggedUnion("type", {
  0: ["IdentitySet", ["who", $0]],
  1: ["IdentityCleared", ["who", $0], ["deposit", $6]],
  2: ["IdentityKilled", ["who", $0], ["deposit", $6]],
  3: ["JudgementRequested", ["who", $0], ["registrarIndex", $4]],
  4: ["JudgementUnrequested", ["who", $0], ["registrarIndex", $4]],
  5: ["JudgementGiven", ["target", $0], ["registrarIndex", $4]],
  6: ["RegistrarAdded", ["registrarIndex", $4]],
  7: ["SubIdentityAdded", ["sub", $0], ["main", $0], ["deposit", $6]],
  8: ["SubIdentityRemoved", ["sub", $0], ["main", $0], ["deposit", $6]],
  9: ["SubIdentityRevoked", ["sub", $0], ["main", $0], ["deposit", $6]],
})

export const $79: $.Codec<types.polkadot_runtime.ProxyType> = $.stringUnion({
  0: "Any",
  1: "NonTransfer",
  2: "Governance",
  3: "Staking",
  5: "IdentityJudgement",
  6: "CancelProxy",
  7: "Auction",
})

export const $80: $.Codec<types.u16> = $.u16

export const $78: $.Codec<types.pallet_proxy.pallet.Event> = $.taggedUnion("type", {
  0: ["ProxyExecuted", ["result", $32]],
  1: ["PureCreated", ["pure", $0], ["who", $0], ["proxyType", $79], ["disambiguationIndex", $80]],
  2: ["Announced", ["real", $0], ["proxy", $0], ["callHash", $11]],
  3: ["ProxyAdded", ["delegator", $0], ["delegatee", $0], ["proxyType", $79], ["delay", $4]],
  4: ["ProxyRemoved", ["delegator", $0], ["delegatee", $0], ["proxyType", $79], ["delay", $4]],
})

export const $82: $.Codec<types.pallet_multisig.Timepoint> = $.object(["height", $4], ["index", $4])

export const $81: $.Codec<types.pallet_multisig.pallet.Event> = $.taggedUnion("type", {
  0: ["NewMultisig", ["approving", $0], ["multisig", $0], ["callHash", $1]],
  1: ["MultisigApproval", ["approving", $0], ["timepoint", $82], ["multisig", $0], [
    "callHash",
    $1,
  ]],
  2: [
    "MultisigExecuted",
    ["approving", $0],
    ["timepoint", $82],
    ["multisig", $0],
    ["callHash", $1],
    ["result", $32],
  ],
  3: ["MultisigCancelled", ["cancelling", $0], ["timepoint", $82], ["multisig", $0], [
    "callHash",
    $1,
  ]],
})

export const $83: $.Codec<types.pallet_bounties.pallet.Event> = $.taggedUnion("type", {
  0: ["BountyProposed", ["index", $4]],
  1: ["BountyRejected", ["index", $4], ["bond", $6]],
  2: ["BountyBecameActive", ["index", $4]],
  3: ["BountyAwarded", ["index", $4], ["beneficiary", $0]],
  4: ["BountyClaimed", ["index", $4], ["payout", $6], ["beneficiary", $0]],
  5: ["BountyCanceled", ["index", $4]],
  6: ["BountyExtended", ["index", $4]],
})

export const $84: $.Codec<types.pallet_child_bounties.pallet.Event> = $.taggedUnion("type", {
  0: ["Added", ["index", $4], ["childIndex", $4]],
  1: ["Awarded", ["index", $4], ["childIndex", $4], ["beneficiary", $0]],
  2: ["Claimed", ["index", $4], ["childIndex", $4], ["payout", $6], ["beneficiary", $0]],
  3: ["Canceled", ["index", $4], ["childIndex", $4]],
})

export const $85: $.Codec<types.pallet_tips.pallet.Event> = $.taggedUnion("type", {
  0: ["NewTip", ["tipHash", $11]],
  1: ["TipClosing", ["tipHash", $11]],
  2: ["TipClosed", ["tipHash", $11], ["who", $0], ["payout", $6]],
  3: ["TipRetracted", ["tipHash", $11]],
  4: ["TipSlashed", ["tipHash", $11], ["finder", $0], ["deposit", $6]],
})

export const $87: $.Codec<types.pallet_election_provider_multi_phase.ElectionCompute> = $
  .stringUnion({ 0: "OnChain", 1: "Signed", 2: "Unsigned", 3: "Fallback", 4: "Emergency" })

export const $88: $.Codec<types.sp_npos_elections.ElectionScore> = $.object(["minimalStake", $6], [
  "sumStake",
  $6,
], ["sumStakeSquared", $6])

export const $86: $.Codec<types.pallet_election_provider_multi_phase.pallet.Event> = $.taggedUnion(
  "type",
  {
    0: ["SolutionStored", ["compute", $87], ["prevEjected", $43]],
    1: ["ElectionFinalized", ["compute", $87], ["score", $88]],
    2: ["ElectionFailed"],
    3: ["Rewarded", ["account", $0], ["value", $6]],
    4: ["Slashed", ["account", $0], ["value", $6]],
    5: ["SignedPhaseStarted", ["round", $4]],
    6: ["UnsignedPhaseStarted", ["round", $4]],
  },
)

export const $89: $.Codec<types.pallet_bags_list.pallet.Event> = $.taggedUnion("type", {
  0: ["Rebagged", ["who", $0], ["from", $10], ["to", $10]],
  1: ["ScoreUpdated", ["who", $0], ["newScore", $10]],
})

export const $91: $.Codec<types.pallet_nomination_pools.PoolState> = $.stringUnion({
  0: "Open",
  1: "Blocked",
  2: "Destroying",
})

export const $92: $.Codec<types.sp_core.crypto.AccountId32 | undefined> = $.option($0)

export const $90: $.Codec<types.pallet_nomination_pools.pallet.Event> = $.taggedUnion("type", {
  0: ["Created", ["depositor", $0], ["poolId", $4]],
  1: ["Bonded", ["member", $0], ["poolId", $4], ["bonded", $6], ["joined", $43]],
  2: ["PaidOut", ["member", $0], ["poolId", $4], ["payout", $6]],
  3: ["Unbonded", ["member", $0], ["poolId", $4], ["balance", $6], ["points", $6], ["era", $4]],
  4: ["Withdrawn", ["member", $0], ["poolId", $4], ["balance", $6], ["points", $6]],
  5: ["Destroyed", ["poolId", $4]],
  6: ["StateChanged", ["poolId", $4], ["newState", $91]],
  7: ["MemberRemoved", ["poolId", $4], ["member", $0]],
  8: ["RolesUpdated", ["root", $92], ["stateToggler", $92], ["nominator", $92]],
  9: ["PoolSlashed", ["poolId", $4], ["balance", $6]],
  10: ["UnbondingPoolSlashed", ["poolId", $4], ["era", $4], ["balance", $6]],
})

export const $94: $.Codec<Array<types.u32>> = $.array($4)

export const $93: $.Codec<types.pallet_fast_unstake.pallet.Event> = $.taggedUnion("type", {
  0: ["Unstaked", ["stash", $0], ["result", $32]],
  1: ["Slashed", ["stash", $0], ["amount", $6]],
  2: ["Checking", ["stash", $0], ["eras", $94]],
  3: ["Errored", ["stash", $0]],
  4: ["InternalError"],
})

export const $98: $.Codec<types.polkadot_parachain.primitives.Id> = $4

export const $99: $.Codec<types.polkadot_primitives.v2.collator_app.Public> = $54

export const $102: $.Codec<Uint8Array> = $.sizedUint8Array(64)

export const $101: $.Codec<types.sp_core.sr25519.Signature> = $102

export const $100: $.Codec<types.polkadot_primitives.v2.collator_app.Signature> = $101

export const $103: $.Codec<types.polkadot_parachain.primitives.ValidationCodeHash> = $11

export const $97: $.Codec<types.polkadot_primitives.v2.CandidateDescriptor> = $.object(
  ["paraId", $98],
  ["relayParent", $11],
  ["collator", $99],
  ["persistedValidationDataHash", $11],
  ["povHash", $11],
  ["erasureRoot", $11],
  ["signature", $100],
  ["paraHead", $11],
  ["validationCodeHash", $103],
)

export const $96: $.Codec<types.polkadot_primitives.v2.CandidateReceipt> = $.object([
  "descriptor",
  $97,
], ["commitmentsHash", $11])

export const $104: $.Codec<types.polkadot_parachain.primitives.HeadData> = $12

export const $105: $.Codec<types.polkadot_primitives.v2.CoreIndex> = $4

export const $106: $.Codec<types.polkadot_primitives.v2.GroupIndex> = $4

export const $95: $.Codec<types.polkadot_runtime_parachains.inclusion.pallet.Event> = $.taggedUnion(
  "type",
  {
    0: ["CandidateBacked", ["value", $.tuple($96, $104, $105, $106)]],
    1: ["CandidateIncluded", ["value", $.tuple($96, $104, $105, $106)]],
    2: ["CandidateTimedOut", ["value", $.tuple($96, $104, $105)]],
  },
)

export const $107: $.Codec<types.polkadot_runtime_parachains.paras.pallet.Event> = $.taggedUnion(
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

export const $110: $.Codec<types.xcm.v2.traits.Error> = $.taggedUnion("type", {
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

export const $109: $.Codec<types.xcm.v2.traits.Outcome> = $.taggedUnion("type", {
  0: ["Complete", ["value", $10]],
  1: ["Incomplete", ["value", $.tuple($10, $110)]],
  2: ["Error", ["value", $110]],
})

export const $108: $.Codec<types.polkadot_runtime_parachains.ump.pallet.Event> = $.taggedUnion(
  "type",
  {
    0: ["InvalidFormat", ["value", $1]],
    1: ["UnsupportedVersion", ["value", $1]],
    2: ["ExecutedUpward", ["value", $.tuple($1, $109)]],
    3: ["WeightExhausted", ["value", $.tuple($1, $8, $8)]],
    4: ["UpwardMessagesReceived", ["value", $.tuple($98, $4, $4)]],
    5: ["OverweightEnqueued", ["value", $.tuple($98, $1, $10, $8)]],
    6: ["OverweightServiced", ["value", $.tuple($10, $8)]],
  },
)

export const $112: $.Codec<types.polkadot_parachain.primitives.HrmpChannelId> = $.object([
  "sender",
  $98,
], ["recipient", $98])

export const $111: $.Codec<types.polkadot_runtime_parachains.hrmp.pallet.Event> = $.taggedUnion(
  "type",
  {
    0: ["OpenChannelRequested", ["value", $.tuple($98, $98, $4, $4)]],
    1: ["OpenChannelCanceled", ["value", $.tuple($98, $112)]],
    2: ["OpenChannelAccepted", ["value", $.tuple($98, $98)]],
    3: ["ChannelClosed", ["value", $.tuple($98, $112)]],
    4: ["HrmpChannelForceOpened", ["value", $.tuple($98, $98, $4, $4)]],
  },
)

export const $114: $.Codec<types.polkadot_core_primitives.CandidateHash> = $11

export const $115: $.Codec<types.polkadot_runtime_parachains.disputes.DisputeLocation> = $
  .stringUnion({ 0: "Local", 1: "Remote" })

export const $116: $.Codec<types.polkadot_runtime_parachains.disputes.DisputeResult> = $
  .stringUnion({ 0: "Valid", 1: "Invalid" })

export const $113: $.Codec<types.polkadot_runtime_parachains.disputes.pallet.Event> = $.taggedUnion(
  "type",
  {
    0: ["DisputeInitiated", ["value", $.tuple($114, $115)]],
    1: ["DisputeConcluded", ["value", $.tuple($114, $116)]],
    2: ["DisputeTimedOut", ["value", $114]],
    3: ["Revert", ["value", $4]],
  },
)

export const $117: $.Codec<types.polkadot_runtime_common.paras_registrar.pallet.Event> = $
  .taggedUnion("type", {
    0: ["Registered", ["paraId", $98], ["manager", $0]],
    1: ["Deregistered", ["paraId", $98]],
    2: ["Reserved", ["paraId", $98], ["who", $0]],
  })

export const $118: $.Codec<types.polkadot_runtime_common.slots.pallet.Event> = $.taggedUnion(
  "type",
  {
    0: ["NewLeasePeriod", ["leasePeriod", $4]],
    1: ["Leased", ["paraId", $98], ["leaser", $0], ["periodBegin", $4], ["periodCount", $4], [
      "extraReserved",
      $6,
    ], ["totalAmount", $6]],
  },
)

export const $119: $.Codec<types.polkadot_runtime_common.auctions.pallet.Event> = $.taggedUnion(
  "type",
  {
    0: ["AuctionStarted", ["auctionIndex", $4], ["leasePeriod", $4], ["ending", $4]],
    1: ["AuctionClosed", ["auctionIndex", $4]],
    2: ["Reserved", ["bidder", $0], ["extraReserved", $6], ["totalAmount", $6]],
    3: ["Unreserved", ["bidder", $0], ["amount", $6]],
    4: ["ReserveConfiscated", ["paraId", $98], ["leaser", $0], ["amount", $6]],
    5: ["BidAccepted", ["bidder", $0], ["paraId", $98], ["amount", $6], ["firstSlot", $4], [
      "lastSlot",
      $4,
    ]],
    6: ["WinningOffset", ["auctionIndex", $4], ["blockNumber", $4]],
  },
)

export const $120: $.Codec<types.polkadot_runtime_common.crowdloan.pallet.Event> = $.taggedUnion(
  "type",
  {
    0: ["Created", ["paraId", $98]],
    1: ["Contributed", ["who", $0], ["fundIndex", $98], ["amount", $6]],
    2: ["Withdrew", ["who", $0], ["fundIndex", $98], ["amount", $6]],
    3: ["PartiallyRefunded", ["paraId", $98]],
    4: ["AllRefunded", ["paraId", $98]],
    5: ["Dissolved", ["paraId", $98]],
    6: ["HandleBidResult", ["paraId", $98], ["result", $32]],
    7: ["Edited", ["paraId", $98]],
    8: ["MemoUpdated", ["who", $0], ["paraId", $98], ["memo", $12]],
    9: ["AddedToNewRaise", ["paraId", $98]],
  },
)

export const $125: $.Codec<types.Compact<types.u32>> = $.compact($4)

export const $127: $.Codec<Uint8Array> = $12

export const $126: $.Codec<types.xcm.v0.junction.NetworkId> = $.taggedUnion("type", {
  0: ["Any"],
  1: ["Named", ["value", $127]],
  2: ["Polkadot"],
  3: ["Kusama"],
})

export const $128: $.Codec<types.xcm.v0.junction.BodyId> = $.taggedUnion("type", {
  0: ["Unit"],
  1: ["Named", ["value", $127]],
  2: ["Index", ["value", $125]],
  3: ["Executive"],
  4: ["Technical"],
  5: ["Legislative"],
  6: ["Judicial"],
})

export const $129: $.Codec<types.xcm.v0.junction.BodyPart> = $.taggedUnion("type", {
  0: ["Voice"],
  1: ["Members", ["count", $125]],
  2: ["Fraction", ["nom", $125], ["denom", $125]],
  3: ["AtLeastProportion", ["nom", $125], ["denom", $125]],
  4: ["MoreThanProportion", ["nom", $125], ["denom", $125]],
})

export const $124: $.Codec<types.xcm.v1.junction.Junction> = $.taggedUnion("type", {
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

export const $123: $.Codec<types.xcm.v1.multilocation.Junctions> = $.taggedUnion("type", {
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

export const $122: $.Codec<types.xcm.v1.multilocation.MultiLocation> = $.object(["parents", $2], [
  "interior",
  $123,
])

export const $136: $.Codec<types.xcm.v1.multiasset.AssetId> = $.taggedUnion("type", {
  0: ["Concrete", ["value", $122]],
  1: ["Abstract", ["value", $12]],
})

export const $139: $.Codec<Uint8Array> = $.sizedUint8Array(8)

export const $138: $.Codec<types.xcm.v1.multiasset.AssetInstance> = $.taggedUnion("type", {
  0: ["Undefined"],
  1: ["Index", ["value", $58]],
  2: ["Array4", ["value", $16]],
  3: ["Array8", ["value", $139]],
  4: ["Array16", ["value", $45]],
  5: ["Array32", ["value", $1]],
  6: ["Blob", ["value", $12]],
})

export const $137: $.Codec<types.xcm.v1.multiasset.Fungibility> = $.taggedUnion("type", {
  0: ["Fungible", ["value", $58]],
  1: ["NonFungible", ["value", $138]],
})

export const $135: $.Codec<types.xcm.v1.multiasset.MultiAsset> = $.object(["id", $136], [
  "fun",
  $137,
])

export const $134: $.Codec<Array<types.xcm.v1.multiasset.MultiAsset>> = $.array($135)

export const $133: $.Codec<types.xcm.v1.multiasset.MultiAssets> = $134

export const $142: $.Codec<[types.u32, types.xcm.v2.traits.Error]> = $.tuple($4, $110)

export const $141: $.Codec<[types.u32, types.xcm.v2.traits.Error] | undefined> = $.option($142)

export const $140: $.Codec<types.xcm.v2.Response> = $.taggedUnion("type", {
  0: ["Null"],
  1: ["Assets", ["value", $133]],
  2: ["ExecutionResult", ["value", $141]],
  3: ["Version", ["value", $4]],
})

export const $143: $.Codec<types.xcm.v0.OriginKind> = $.stringUnion({
  0: "Native",
  1: "SovereignAccount",
  2: "Superuser",
  3: "Xcm",
})

export const $144: $.Codec<types.xcm.double_encoded.DoubleEncoded> = $.object(["encoded", $12])

export const $147: $.Codec<types.xcm.v1.multiasset.WildFungibility> = $.stringUnion({
  0: "Fungible",
  1: "NonFungible",
})

export const $146: $.Codec<types.xcm.v1.multiasset.WildMultiAsset> = $.taggedUnion("type", {
  0: ["All"],
  1: ["AllOf", ["id", $136], ["fun", $147]],
})

export const $145: $.Codec<types.xcm.v1.multiasset.MultiAssetFilter> = $.taggedUnion("type", {
  0: ["Definite", ["value", $133]],
  1: ["Wild", ["value", $146]],
})

export const $148: $.Codec<types.xcm.v2.WeightLimit> = $.taggedUnion("type", {
  0: ["Unlimited"],
  1: ["Limited", ["value", $9]],
})

export const $132: $.Codec<types.xcm.v2.Instruction> = $.taggedUnion("type", {
  0: ["WithdrawAsset", ["value", $133]],
  1: ["ReserveAssetDeposited", ["value", $133]],
  2: ["ReceiveTeleportedAsset", ["value", $133]],
  3: ["QueryResponse", ["queryId", $9], ["response", $140], ["maxWeight", $9]],
  4: ["TransferAsset", ["assets", $133], ["beneficiary", $122]],
  5: ["TransferReserveAsset", ["assets", $133], ["dest", $122], ["xcm", $.deferred(() => $130)]],
  6: ["Transact", ["originType", $143], ["requireWeightAtMost", $9], ["call", $144]],
  7: ["HrmpNewChannelOpenRequest", ["sender", $125], ["maxMessageSize", $125], [
    "maxCapacity",
    $125,
  ]],
  8: ["HrmpChannelAccepted", ["recipient", $125]],
  9: ["HrmpChannelClosing", ["initiator", $125], ["sender", $125], ["recipient", $125]],
  10: ["ClearOrigin"],
  11: ["DescendOrigin", ["value", $123]],
  12: ["ReportError", ["queryId", $9], ["dest", $122], ["maxResponseWeight", $9]],
  13: ["DepositAsset", ["assets", $145], ["maxAssets", $125], ["beneficiary", $122]],
  14: ["DepositReserveAsset", ["assets", $145], ["maxAssets", $125], ["dest", $122], [
    "xcm",
    $.deferred(() => $130),
  ]],
  15: ["ExchangeAsset", ["give", $145], ["receive", $133]],
  16: ["InitiateReserveWithdraw", ["assets", $145], ["reserve", $122], [
    "xcm",
    $.deferred(() => $130),
  ]],
  17: ["InitiateTeleport", ["assets", $145], ["dest", $122], ["xcm", $.deferred(() => $130)]],
  18: ["QueryHolding", ["queryId", $9], ["dest", $122], ["assets", $145], [
    "maxResponseWeight",
    $9,
  ]],
  19: ["BuyExecution", ["fees", $135], ["weightLimit", $148]],
  20: ["RefundSurplus"],
  21: ["SetErrorHandler", ["value", $.deferred(() => $130)]],
  22: ["SetAppendix", ["value", $.deferred(() => $130)]],
  23: ["ClearError"],
  24: ["ClaimAsset", ["assets", $133], ["ticket", $122]],
  25: ["Trap", ["value", $9]],
  26: ["SubscribeVersion", ["queryId", $9], ["maxResponseWeight", $9]],
  27: ["UnsubscribeVersion"],
})

export const $131: $.Codec<Array<types.xcm.v2.Instruction>> = $.array($132)

export const $130: $.Codec<types.xcm.v2.Xcm> = $131

export const $149: $.Codec<types.xcm.v1.multilocation.MultiLocation | undefined> = $.option($122)

export const $154: $.Codec<types.xcm.v0.junction.Junction> = $.taggedUnion("type", {
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

export const $153: $.Codec<types.xcm.v0.multi_location.MultiLocation> = $.taggedUnion("type", {
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

export const $152: $.Codec<types.xcm.v0.multi_asset.MultiAsset> = $.taggedUnion("type", {
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

export const $151: $.Codec<Array<types.xcm.v0.multi_asset.MultiAsset>> = $.array($152)

export const $150: $.Codec<types.xcm.VersionedMultiAssets> = $.taggedUnion("type", {
  0: ["V0", ["value", $151]],
  1: ["V1", ["value", $133]],
})

export const $155: $.Codec<types.xcm.VersionedMultiLocation> = $.taggedUnion("type", {
  0: ["V0", ["value", $153]],
  1: ["V1", ["value", $122]],
})

export const $121: $.Codec<types.pallet_xcm.pallet.Event> = $.taggedUnion("type", {
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

export const $19: $.Codec<types.polkadot_runtime.RuntimeEvent> = $.taggedUnion("type", {
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

export const $157: $.Codec<Array<types.primitive_types.H256>> = $.array($11)

export const $18: $.Codec<types.frame_system.EventRecord> = $.object(["phase", $156], [
  "event",
  $19,
], ["topics", $157])

export const $17: $.Codec<Array<types.frame_system.EventRecord>> = $.array($18)

export const $158: $.Codec<Array<[types.u32, types.u32]>> = $.array($30)

export const $160: $.Codec<string> = $.str

export const $159: $.Codec<types.frame_system.LastRuntimeUpgradeInfo> = $.object([
  "specVersion",
  $125,
], ["specName", $160])

export const $163: $.Codec<[Uint8Array, Uint8Array]> = $.tuple($12, $12)

export const $162: $.Codec<Array<[Uint8Array, Uint8Array]>> = $.array($163)

export const $164: $.Codec<Array<Uint8Array>> = $.array($12)

export const $161: $.Codec<types.frame_system.pallet.Call> = $.taggedUnion("type", {
  0: ["fillBlock", ["ratio", $42]],
  1: ["remark", ["remark", $12]],
  2: ["setHeapPages", ["pages", $10]],
  3: ["setCode", ["code", $12]],
  4: ["setCodeWithoutChecks", ["code", $12]],
  5: ["setStorage", ["items", $162]],
  6: ["killStorage", ["keys", $164]],
  7: ["killPrefix", ["prefix", $12], ["subkeys", $4]],
  8: ["remarkWithEvent", ["remark", $12]],
})

export const $168: $.Codec<types.sp_weights.weight_v2.Weight | undefined> = $.option($8)

export const $167: $.Codec<types.frame_system.limits.WeightsPerClass> = $.object(
  ["baseExtrinsic", $8],
  ["maxExtrinsic", $168],
  ["maxTotal", $168],
  ["reserved", $168],
)

export const $166: $.Codec<
  types.frame_support.dispatch.PerDispatchClass.$$frame_system.limits.WeightsPerClass
> = $.object(["normal", $167], ["operational", $167], ["mandatory", $167])

export const $165: $.Codec<types.frame_system.limits.BlockWeights> = $.object(["baseBlock", $8], [
  "maxBlock",
  $8,
], ["perClass", $166])

export const $170: $.Codec<types.frame_support.dispatch.PerDispatchClass.$$u32> = $.object(
  ["normal", $4],
  ["operational", $4],
  ["mandatory", $4],
)

export const $169: $.Codec<types.frame_system.limits.BlockLength> = $.object(["max", $170])

export const $171: $.Codec<types.sp_weights.RuntimeDbWeight> = $.object(["read", $10], [
  "write",
  $10,
])

export const $175: $.Codec<[Uint8Array, types.u32]> = $.tuple($139, $4)

export const $174: $.Codec<Array<[Uint8Array, types.u32]>> = $.array($175)

export const $173: $.Codec<Array<[Uint8Array, types.u32]>> = $174

export const $172: $.Codec<types.sp_version.RuntimeVersion> = $.object(
  ["specName", $160],
  ["implName", $160],
  ["authoringVersion", $4],
  ["specVersion", $4],
  ["implVersion", $4],
  ["apis", $173],
  ["transactionVersion", $4],
  ["stateVersion", $2],
)

export const $176: $.Codec<types.frame_system.pallet.Error> = $.stringUnion({
  0: "InvalidSpecName",
  1: "SpecVersionNeedsToIncrease",
  2: "FailedToExtractRuntimeVersion",
  3: "NonDefaultComposite",
  4: "NonZeroRefCount",
  5: "CallFiltered",
})

export const $448: $.Codec<Uint8Array> = $12

export const $180: $.Codec<types.frame_support.traits.preimages.Bounded> = $.taggedUnion("type", {
  0: ["Legacy", ["hash", $11]],
  1: ["Inline", ["value", $448]],
  2: ["Lookup", ["hash", $11], ["len", $4]],
})

export const $183: $.Codec<[types.u32, types.u32] | undefined> = $.option($30)

export const $257: $.Codec<types.frame_support.dispatch.RawOrigin> = $.taggedUnion("type", {
  0: ["Root"],
  1: ["Signed", ["value", $0]],
  2: ["None"],
})

export const $258: $.Codec<types.pallet_collective.RawOrigin> = $.taggedUnion("type", {
  0: ["Members", ["value", $.tuple($4, $4)]],
  1: ["Member", ["value", $0]],
  2: ["Phantom"],
})

export const $259: $.Codec<types.pallet_collective.RawOrigin> = $.taggedUnion("type", {
  0: ["Members", ["value", $.tuple($4, $4)]],
  1: ["Member", ["value", $0]],
  2: ["Phantom"],
})

export const $260: $.Codec<types.polkadot_runtime_parachains.origin.pallet.Origin> = $.taggedUnion(
  "type",
  { 0: ["Parachain", ["value", $98]] },
)

export const $261: $.Codec<types.pallet_xcm.pallet.Origin> = $.taggedUnion("type", {
  0: ["Xcm", ["value", $122]],
  1: ["Response", ["value", $122]],
})

export const $262: $.Codec<types.sp_core.Void> = $.never

export const $256: $.Codec<types.polkadot_runtime.OriginCaller> = $.taggedUnion("type", {
  0: ["system", ["value", $257]],
  15: ["Council", ["value", $258]],
  16: ["TechnicalCommittee", ["value", $259]],
  50: ["ParachainsOrigin", ["value", $260]],
  99: ["XcmPallet", ["value", $261]],
  5: ["Void", ["value", $262]],
})

export const $179: $.Codec<types.pallet_scheduler.Scheduled> = $.object(
  ["maybeId", $31],
  ["priority", $2],
  ["call", $180],
  ["maybePeriodic", $183],
  ["origin", $256],
)

export const $178: $.Codec<types.pallet_scheduler.Scheduled | undefined> = $.option($179)

export const $449: $.Codec<Array<types.pallet_scheduler.Scheduled | undefined>> = $.array($178)

export const $177: $.Codec<Array<types.pallet_scheduler.Scheduled | undefined>> = $449

export const $182: $.Codec<types.pallet_scheduler.pallet.Call> = $.taggedUnion("type", {
  0: ["schedule", ["when", $4], ["maybePeriodic", $183], ["priority", $2], [
    "call",
    $.deferred(() => $181),
  ]],
  1: ["cancel", ["when", $4], ["index", $4]],
  2: ["scheduleNamed", ["id", $1], ["when", $4], ["maybePeriodic", $183], ["priority", $2], [
    "call",
    $.deferred(() => $181),
  ]],
  3: ["cancelNamed", ["id", $1]],
  4: ["scheduleAfter", ["after", $4], ["maybePeriodic", $183], ["priority", $2], [
    "call",
    $.deferred(() => $181),
  ]],
  5: ["scheduleNamedAfter", ["id", $1], ["after", $4], ["maybePeriodic", $183], ["priority", $2], [
    "call",
    $.deferred(() => $181),
  ]],
})

export const $184: $.Codec<types.pallet_preimage.pallet.Call> = $.taggedUnion("type", {
  0: ["notePreimage", ["bytes", $12]],
  1: ["unnotePreimage", ["hash", $11]],
  2: ["requestPreimage", ["hash", $11]],
  3: ["unrequestPreimage", ["hash", $11]],
})

export const $189: $.Codec<types.sp_consensus_babe.app.Public> = $54

export const $190: $.Codec<types.sp_consensus_slots.Slot> = $10

export const $187: $.Codec<types.sp_runtime.generic.header.Header> = $.object(
  ["parentHash", $11],
  ["number", $125],
  ["stateRoot", $11],
  ["extrinsicsRoot", $11],
  ["digest", $13],
)

export const $186: $.Codec<types.sp_consensus_slots.EquivocationProof> = $.object(
  ["offender", $189],
  ["slot", $190],
  ["firstHeader", $187],
  ["secondHeader", $187],
)

export const $191: $.Codec<types.sp_session.MembershipProof> = $.object(["session", $4], [
  "trieNodes",
  $164,
], ["validatorCount", $4])

export const $193: $.Codec<[types.u64, types.u64]> = $.tuple($10, $10)

export const $194: $.Codec<types.sp_consensus_babe.AllowedSlots> = $.stringUnion({
  0: "PrimarySlots",
  1: "PrimaryAndSecondaryPlainSlots",
  2: "PrimaryAndSecondaryVRFSlots",
})

export const $192: $.Codec<types.sp_consensus_babe.digests.NextConfigDescriptor> = $.taggedUnion(
  "type",
  { 1: ["V1", ["c", $193], ["allowedSlots", $194]] },
)

export const $185: $.Codec<types.pallet_babe.pallet.Call> = $.taggedUnion("type", {
  0: ["reportEquivocation", ["equivocationProof", $186], ["keyOwnerProof", $191]],
  1: ["reportEquivocationUnsigned", ["equivocationProof", $186], ["keyOwnerProof", $191]],
  2: ["planConfigChange", ["config", $192]],
})

export const $195: $.Codec<types.pallet_timestamp.pallet.Call> = $.taggedUnion("type", {
  0: ["set", ["now", $9]],
})

export const $198: $.Codec<types.Compact<null>> = $.compact($33)

export const $197: $.Codec<types.sp_runtime.multiaddress.MultiAddress> = $.taggedUnion("type", {
  0: ["Id", ["value", $0]],
  1: ["Index", ["value", $198]],
  2: ["Raw", ["value", $12]],
  3: ["Address32", ["value", $1]],
  4: ["Address20", ["value", $74]],
})

export const $196: $.Codec<types.pallet_indices.pallet.Call> = $.taggedUnion("type", {
  0: ["claim", ["index", $4]],
  1: ["transfer", ["new", $197], ["index", $4]],
  2: ["free", ["index", $4]],
  3: ["forceTransfer", ["new", $197], ["index", $4], ["freeze", $43]],
  4: ["freeze", ["index", $4]],
})

export const $199: $.Codec<types.pallet_balances.pallet.Call> = $.taggedUnion("type", {
  0: ["transfer", ["dest", $197], ["value", $58]],
  1: ["setBalance", ["who", $197], ["newFree", $58], ["newReserved", $58]],
  2: ["forceTransfer", ["source", $197], ["dest", $197], ["value", $58]],
  3: ["transferKeepAlive", ["dest", $197], ["value", $58]],
  4: ["transferAll", ["dest", $197], ["keepAlive", $43]],
  5: ["forceUnreserve", ["who", $197], ["amount", $6]],
})

export const $201: $.Codec<Array<types.sp_runtime.generic.header.Header>> = $.array($187)

export const $200: $.Codec<types.pallet_authorship.pallet.Call> = $.taggedUnion("type", {
  0: ["setUncles", ["newUncles", $201]],
})

export const $203: $.Codec<types.pallet_staking.RewardDestination> = $.taggedUnion("type", {
  0: ["Staked"],
  1: ["Stash"],
  2: ["Controller"],
  3: ["Account", ["value", $0]],
  4: ["None"],
})

export const $204: $.Codec<Array<types.sp_runtime.multiaddress.MultiAddress>> = $.array($197)

export const $205: $.Codec<types.sp_arithmetic.per_things.Percent> = $2

export const $206: $.Codec<Array<types.sp_core.crypto.AccountId32>> = $.array($0)

export const $207: $.Codec<types.pallet_staking.pallet.pallet.ConfigOp.$$u128> = $.taggedUnion(
  "type",
  { 0: ["Noop"], 1: ["Set", ["value", $6]], 2: ["Remove"] },
)

export const $208: $.Codec<types.pallet_staking.pallet.pallet.ConfigOp.$$u32> = $.taggedUnion(
  "type",
  { 0: ["Noop"], 1: ["Set", ["value", $4]], 2: ["Remove"] },
)

export const $209: $.Codec<
  types.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Percent
> = $.taggedUnion("type", { 0: ["Noop"], 1: ["Set", ["value", $205]], 2: ["Remove"] })

export const $210: $.Codec<
  types.pallet_staking.pallet.pallet.ConfigOp.$$sp_arithmetic.per_things.Perbill
> = $.taggedUnion("type", { 0: ["Noop"], 1: ["Set", ["value", $42]], 2: ["Remove"] })

export const $202: $.Codec<types.pallet_staking.pallet.pallet.Call> = $.taggedUnion("type", {
  0: ["bond", ["controller", $197], ["value", $58], ["payee", $203]],
  1: ["bondExtra", ["maxAdditional", $58]],
  2: ["unbond", ["value", $58]],
  3: ["withdrawUnbonded", ["numSlashingSpans", $4]],
  4: ["validate", ["prefs", $40]],
  5: ["nominate", ["targets", $204]],
  6: ["chill"],
  7: ["setPayee", ["payee", $203]],
  8: ["setController", ["controller", $197]],
  9: ["setValidatorCount", ["new", $125]],
  10: ["increaseValidatorCount", ["additional", $125]],
  11: ["scaleValidatorCount", ["factor", $205]],
  12: ["forceNoEras"],
  13: ["forceNewEra"],
  14: ["setInvulnerables", ["invulnerables", $206]],
  15: ["forceUnstake", ["stash", $0], ["numSlashingSpans", $4]],
  16: ["forceNewEraAlways"],
  17: ["cancelDeferredSlash", ["era", $4], ["slashIndices", $94]],
  18: ["payoutStakers", ["validatorStash", $0], ["era", $4]],
  19: ["rebond", ["value", $58]],
  20: ["reapStash", ["stash", $0], ["numSlashingSpans", $4]],
  21: ["kick", ["who", $204]],
  22: [
    "setStakingConfigs",
    ["minNominatorBond", $207],
    ["minValidatorBond", $207],
    ["maxNominatorCount", $208],
    ["maxValidatorCount", $208],
    ["chillThreshold", $209],
    ["minCommission", $210],
  ],
  23: ["chillOther", ["controller", $0]],
  24: ["forceApplyMinCommission", ["validatorStash", $0]],
})

export const $213: $.Codec<types.polkadot_primitives.v2.validator_app.Public> = $54

export const $214: $.Codec<types.polkadot_primitives.v2.assignment_app.Public> = $54

export const $215: $.Codec<types.sp_authority_discovery.app.Public> = $54

export const $212: $.Codec<types.polkadot_runtime.SessionKeys> = $.object(
  ["grandpa", $50],
  ["babe", $189],
  ["imOnline", $53],
  ["paraValidator", $213],
  ["paraAssignment", $214],
  ["authorityDiscovery", $215],
)

export const $211: $.Codec<types.pallet_session.pallet.Call> = $.taggedUnion("type", {
  0: ["setKeys", ["keys", $212], ["proof", $12]],
  1: ["purgeKeys"],
})

export const $220: $.Codec<types.finality_grandpa.Prevote> = $.object(["targetHash", $11], [
  "targetNumber",
  $4,
])

export const $222: $.Codec<types.sp_core.ed25519.Signature> = $102

export const $221: $.Codec<types.sp_finality_grandpa.app.Signature> = $222

export const $223: $.Codec<
  [types.finality_grandpa.Prevote, types.sp_finality_grandpa.app.Signature]
> = $.tuple($220, $221)

export const $219: $.Codec<types.finality_grandpa.Equivocation.$$finality_grandpa.Prevote> = $
  .object(["roundNumber", $10], ["identity", $50], ["first", $223], ["second", $223])

export const $225: $.Codec<types.finality_grandpa.Precommit> = $.object(["targetHash", $11], [
  "targetNumber",
  $4,
])

export const $226: $.Codec<
  [types.finality_grandpa.Precommit, types.sp_finality_grandpa.app.Signature]
> = $.tuple($225, $221)

export const $224: $.Codec<types.finality_grandpa.Equivocation.$$finality_grandpa.Precommit> = $
  .object(["roundNumber", $10], ["identity", $50], ["first", $226], ["second", $226])

export const $218: $.Codec<types.sp_finality_grandpa.Equivocation> = $.taggedUnion("type", {
  0: ["Prevote", ["value", $219]],
  1: ["Precommit", ["value", $224]],
})

export const $217: $.Codec<types.sp_finality_grandpa.EquivocationProof> = $.object(["setId", $10], [
  "equivocation",
  $218,
])

export const $216: $.Codec<types.pallet_grandpa.pallet.Call> = $.taggedUnion("type", {
  0: ["reportEquivocation", ["equivocationProof", $217], ["keyOwnerProof", $191]],
  1: ["reportEquivocationUnsigned", ["equivocationProof", $217], ["keyOwnerProof", $191]],
  2: ["noteStalled", ["delay", $4], ["bestFinalizedBlockNumber", $4]],
})

export const $230: $.Codec<types.sp_core.OpaquePeerId> = $12

export const $232: $.Codec<types.sp_core.offchain.OpaqueMultiaddr> = $12

export const $231: $.Codec<Array<types.sp_core.offchain.OpaqueMultiaddr>> = $.array($232)

export const $229: $.Codec<types.sp_core.offchain.OpaqueNetworkState> = $.object(["peerId", $230], [
  "externalAddresses",
  $231,
])

export const $228: $.Codec<types.pallet_im_online.Heartbeat> = $.object(
  ["blockNumber", $4],
  ["networkState", $229],
  ["sessionIndex", $4],
  ["authorityIndex", $4],
  ["validatorsLen", $4],
)

export const $233: $.Codec<types.pallet_im_online.sr25519.app_sr25519.Signature> = $101

export const $227: $.Codec<types.pallet_im_online.pallet.Call> = $.taggedUnion("type", {
  0: ["heartbeat", ["heartbeat", $228], ["signature", $233]],
})

export const $235: $.Codec<types.pallet_democracy.conviction.Conviction> = $.stringUnion({
  0: "None",
  1: "Locked1x",
  2: "Locked2x",
  3: "Locked3x",
  4: "Locked4x",
  5: "Locked5x",
  6: "Locked6x",
})

export const $236: $.Codec<types.u32 | undefined> = $.option($4)

export const $234: $.Codec<types.pallet_democracy.pallet.Call> = $.taggedUnion("type", {
  0: ["propose", ["proposal", $180], ["value", $58]],
  1: ["second", ["proposal", $125]],
  2: ["vote", ["refIndex", $125], ["vote", $63]],
  3: ["emergencyCancel", ["refIndex", $4]],
  4: ["externalPropose", ["proposal", $180]],
  5: ["externalProposeMajority", ["proposal", $180]],
  6: ["externalProposeDefault", ["proposal", $180]],
  7: ["fastTrack", ["proposalHash", $11], ["votingPeriod", $4], ["delay", $4]],
  8: ["vetoExternal", ["proposalHash", $11]],
  9: ["cancelReferendum", ["refIndex", $125]],
  10: ["delegate", ["to", $197], ["conviction", $235], ["balance", $6]],
  11: ["undelegate"],
  12: ["clearPublicProposals"],
  13: ["unlock", ["target", $197]],
  14: ["removeVote", ["index", $4]],
  15: ["removeOtherVote", ["target", $197], ["index", $4]],
  16: ["blacklist", ["proposalHash", $11], ["maybeRefIndex", $236]],
  17: ["cancelProposal", ["propIndex", $125]],
})

export const $239: $.Codec<types.sp_weights.OldWeight> = $10

export const $238: $.Codec<types.Compact<types.sp_weights.OldWeight>> = $.compact($239)

export const $237: $.Codec<types.pallet_collective.pallet.Call> = $.taggedUnion("type", {
  0: ["setMembers", ["newMembers", $206], ["prime", $92], ["oldCount", $4]],
  1: ["execute", ["proposal", $.deferred(() => $181)], ["lengthBound", $125]],
  2: ["propose", ["threshold", $125], ["proposal", $.deferred(() => $181)], ["lengthBound", $125]],
  3: ["vote", ["proposal", $11], ["index", $125], ["approve", $43]],
  4: ["closeOldWeight", ["proposalHash", $11], ["index", $125], ["proposalWeightBound", $238], [
    "lengthBound",
    $125,
  ]],
  5: ["disapproveProposal", ["proposalHash", $11]],
  6: ["close", ["proposalHash", $11], ["index", $125], ["proposalWeightBound", $8], [
    "lengthBound",
    $125,
  ]],
})

export const $240: $.Codec<types.pallet_collective.pallet.Call> = $.taggedUnion("type", {
  0: ["setMembers", ["newMembers", $206], ["prime", $92], ["oldCount", $4]],
  1: ["execute", ["proposal", $.deferred(() => $181)], ["lengthBound", $125]],
  2: ["propose", ["threshold", $125], ["proposal", $.deferred(() => $181)], ["lengthBound", $125]],
  3: ["vote", ["proposal", $11], ["index", $125], ["approve", $43]],
  4: ["closeOldWeight", ["proposalHash", $11], ["index", $125], ["proposalWeightBound", $238], [
    "lengthBound",
    $125,
  ]],
  5: ["disapproveProposal", ["proposalHash", $11]],
  6: ["close", ["proposalHash", $11], ["index", $125], ["proposalWeightBound", $8], [
    "lengthBound",
    $125,
  ]],
})

export const $242: $.Codec<types.pallet_elections_phragmen.Renouncing> = $.taggedUnion("type", {
  0: ["Member"],
  1: ["RunnerUp"],
  2: ["Candidate", ["value", $125]],
})

export const $241: $.Codec<types.pallet_elections_phragmen.pallet.Call> = $.taggedUnion("type", {
  0: ["vote", ["votes", $206], ["value", $58]],
  1: ["removeVoter"],
  2: ["submitCandidacy", ["candidateCount", $125]],
  3: ["renounceCandidacy", ["renouncing", $242]],
  4: ["removeMember", ["who", $197], ["slashBond", $43], ["rerunElection", $43]],
  5: ["cleanDefunctVoters", ["numVoters", $4], ["numDefunct", $4]],
})

export const $243: $.Codec<types.pallet_membership.pallet.Call> = $.taggedUnion("type", {
  0: ["addMember", ["who", $197]],
  1: ["removeMember", ["who", $197]],
  2: ["swapMember", ["remove", $197], ["add", $197]],
  3: ["resetMembers", ["members", $206]],
  4: ["changeKey", ["new", $197]],
  5: ["setPrime", ["who", $197]],
  6: ["clearPrime"],
})

export const $244: $.Codec<types.pallet_treasury.pallet.Call> = $.taggedUnion("type", {
  0: ["proposeSpend", ["value", $58], ["beneficiary", $197]],
  1: ["rejectProposal", ["proposalId", $125]],
  2: ["approveProposal", ["proposalId", $125]],
  3: ["spend", ["amount", $58], ["beneficiary", $197]],
  4: ["removeApproval", ["proposalId", $125]],
})

export const $247: $.Codec<Uint8Array> = $.sizedUint8Array(65)

export const $246: $.Codec<types.polkadot_runtime_common.claims.EcdsaSignature> = $247

export const $249: $.Codec<[types.u128, types.u128, types.u32]> = $.tuple($6, $6, $4)

export const $248: $.Codec<[types.u128, types.u128, types.u32] | undefined> = $.option($249)

export const $251: $.Codec<types.polkadot_runtime_common.claims.StatementKind> = $.stringUnion({
  0: "Regular",
  1: "Saft",
})

export const $250: $.Codec<types.polkadot_runtime_common.claims.StatementKind | undefined> = $
  .option($251)

export const $245: $.Codec<types.polkadot_runtime_common.claims.pallet.Call> = $.taggedUnion(
  "type",
  {
    0: ["claim", ["dest", $0], ["ethereumSignature", $246]],
    1: ["mintClaim", ["who", $73], ["value", $6], ["vestingSchedule", $248], ["statement", $250]],
    2: ["claimAttest", ["dest", $0], ["ethereumSignature", $246], ["statement", $12]],
    3: ["attest", ["statement", $12]],
    4: ["moveClaim", ["old", $73], ["new", $73], ["maybePreclaim", $92]],
  },
)

export const $253: $.Codec<types.pallet_vesting.vesting_info.VestingInfo> = $.object(
  ["locked", $6],
  ["perBlock", $6],
  ["startingBlock", $4],
)

export const $252: $.Codec<types.pallet_vesting.pallet.Call> = $.taggedUnion("type", {
  0: ["vest"],
  1: ["vestOther", ["target", $197]],
  2: ["vestedTransfer", ["target", $197], ["schedule", $253]],
  3: ["forceVestedTransfer", ["source", $197], ["target", $197], ["schedule", $253]],
  4: ["mergeSchedules", ["schedule1Index", $4], ["schedule2Index", $4]],
})

export const $255: $.Codec<Array<types.polkadot_runtime.RuntimeCall>> = $.array(
  $.deferred(() => $181),
)

export const $254: $.Codec<types.pallet_utility.pallet.Call> = $.taggedUnion("type", {
  0: ["batch", ["calls", $255]],
  1: ["asDerivative", ["index", $80], ["call", $.deferred(() => $181)]],
  2: ["batchAll", ["calls", $255]],
  3: ["dispatchAs", ["asOrigin", $256], ["call", $.deferred(() => $181)]],
  4: ["forceBatch", ["calls", $255]],
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

export const $267: $.Codec<types.pallet_identity.types.Data> = $.taggedUnion("type", {
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

export const $266: $.Codec<[types.pallet_identity.types.Data, types.pallet_identity.types.Data]> = $
  .tuple($267, $267)

export const $296: $.Codec<
  Array<[types.pallet_identity.types.Data, types.pallet_identity.types.Data]>
> = $.array($266)

export const $265: $.Codec<
  Array<[types.pallet_identity.types.Data, types.pallet_identity.types.Data]>
> = $296

export const $297: $.Codec<Uint8Array | undefined> = $.option($74)

export const $264: $.Codec<types.pallet_identity.types.IdentityInfo> = $.object(
  ["additional", $265],
  ["display", $267],
  ["legal", $267],
  ["web", $267],
  ["riot", $267],
  ["email", $267],
  ["pgpFingerprint", $297],
  ["image", $267],
  ["twitter", $267],
)

export const $299: $.Codec<[types.sp_core.crypto.AccountId32, types.pallet_identity.types.Data]> = $
  .tuple($0, $267)

export const $298: $.Codec<
  Array<[types.sp_core.crypto.AccountId32, types.pallet_identity.types.Data]>
> = $.array($299)

export const $300: $.Codec<types.u64> = $10

export const $302: $.Codec<types.pallet_identity.types.Judgement> = $.taggedUnion("type", {
  0: ["Unknown"],
  1: ["FeePaid", ["value", $6]],
  2: ["Reasonable"],
  3: ["KnownGood"],
  4: ["OutOfDate"],
  5: ["LowQuality"],
  6: ["Erroneous"],
})

export const $263: $.Codec<types.pallet_identity.pallet.Call> = $.taggedUnion("type", {
  0: ["addRegistrar", ["account", $197]],
  1: ["setIdentity", ["info", $264]],
  2: ["setSubs", ["subs", $298]],
  3: ["clearIdentity"],
  4: ["requestJudgement", ["regIndex", $125], ["maxFee", $58]],
  5: ["cancelRequest", ["regIndex", $4]],
  6: ["setFee", ["index", $125], ["fee", $58]],
  7: ["setAccountId", ["index", $125], ["new", $197]],
  8: ["setFields", ["index", $125], ["fields", $300]],
  9: ["provideJudgement", ["regIndex", $125], ["target", $197], ["judgement", $302], [
    "identity",
    $11,
  ]],
  10: ["killIdentity", ["target", $197]],
  11: ["addSub", ["sub", $197], ["data", $267]],
  12: ["renameSub", ["sub", $197], ["data", $267]],
  13: ["removeSub", ["sub", $197]],
  14: ["quitSub"],
})

export const $304: $.Codec<types.polkadot_runtime.ProxyType | undefined> = $.option($79)

export const $303: $.Codec<types.pallet_proxy.pallet.Call> = $.taggedUnion("type", {
  0: ["proxy", ["real", $197], ["forceProxyType", $304], ["call", $.deferred(() => $181)]],
  1: ["addProxy", ["delegate", $197], ["proxyType", $79], ["delay", $4]],
  2: ["removeProxy", ["delegate", $197], ["proxyType", $79], ["delay", $4]],
  3: ["removeProxies"],
  4: ["createPure", ["proxyType", $79], ["delay", $4], ["index", $80]],
  5: ["killPure", ["spawner", $197], ["proxyType", $79], ["index", $80], ["height", $125], [
    "extIndex",
    $125,
  ]],
  6: ["announce", ["real", $197], ["callHash", $11]],
  7: ["removeAnnouncement", ["real", $197], ["callHash", $11]],
  8: ["rejectAnnouncement", ["delegate", $197], ["callHash", $11]],
  9: ["proxyAnnounced", ["delegate", $197], ["real", $197], ["forceProxyType", $304], [
    "call",
    $.deferred(() => $181),
  ]],
})

export const $306: $.Codec<types.pallet_multisig.Timepoint | undefined> = $.option($82)

export const $305: $.Codec<types.pallet_multisig.pallet.Call> = $.taggedUnion("type", {
  0: ["asMultiThreshold1", ["otherSignatories", $206], ["call", $.deferred(() => $181)]],
  1: ["asMulti", ["threshold", $80], ["otherSignatories", $206], ["maybeTimepoint", $306], [
    "call",
    $.deferred(() => $181),
  ], ["maxWeight", $8]],
  2: ["approveAsMulti", ["threshold", $80], ["otherSignatories", $206], ["maybeTimepoint", $306], [
    "callHash",
    $1,
  ], ["maxWeight", $8]],
  3: ["cancelAsMulti", ["threshold", $80], ["otherSignatories", $206], ["timepoint", $82], [
    "callHash",
    $1,
  ]],
})

export const $307: $.Codec<types.pallet_bounties.pallet.Call> = $.taggedUnion("type", {
  0: ["proposeBounty", ["value", $58], ["description", $12]],
  1: ["approveBounty", ["bountyId", $125]],
  2: ["proposeCurator", ["bountyId", $125], ["curator", $197], ["fee", $58]],
  3: ["unassignCurator", ["bountyId", $125]],
  4: ["acceptCurator", ["bountyId", $125]],
  5: ["awardBounty", ["bountyId", $125], ["beneficiary", $197]],
  6: ["claimBounty", ["bountyId", $125]],
  7: ["closeBounty", ["bountyId", $125]],
  8: ["extendBountyExpiry", ["bountyId", $125], ["remark", $12]],
})

export const $308: $.Codec<types.pallet_child_bounties.pallet.Call> = $.taggedUnion("type", {
  0: ["addChildBounty", ["parentBountyId", $125], ["value", $58], ["description", $12]],
  1: ["proposeCurator", ["parentBountyId", $125], ["childBountyId", $125], ["curator", $197], [
    "fee",
    $58,
  ]],
  2: ["acceptCurator", ["parentBountyId", $125], ["childBountyId", $125]],
  3: ["unassignCurator", ["parentBountyId", $125], ["childBountyId", $125]],
  4: ["awardChildBounty", ["parentBountyId", $125], ["childBountyId", $125], ["beneficiary", $197]],
  5: ["claimChildBounty", ["parentBountyId", $125], ["childBountyId", $125]],
  6: ["closeChildBounty", ["parentBountyId", $125], ["childBountyId", $125]],
})

export const $309: $.Codec<types.pallet_tips.pallet.Call> = $.taggedUnion("type", {
  0: ["reportAwesome", ["reason", $12], ["who", $197]],
  1: ["retractTip", ["hash", $11]],
  2: ["tipNew", ["reason", $12], ["who", $197], ["tipValue", $58]],
  3: ["tip", ["hash", $11], ["tipValue", $58]],
  4: ["closeTip", ["hash", $11]],
  5: ["slashTip", ["hash", $11]],
})

export const $315: $.Codec<types.Compact<types.u16>> = $.compact($80)

export const $314: $.Codec<[types.Compact<types.u32>, types.Compact<types.u16>]> = $.tuple(
  $125,
  $315,
)

export const $313: $.Codec<Array<[types.Compact<types.u32>, types.Compact<types.u16>]>> = $.array(
  $314,
)

export const $320: $.Codec<types.sp_arithmetic.per_things.PerU16> = $80

export const $319: $.Codec<types.Compact<types.sp_arithmetic.per_things.PerU16>> = $.compact($320)

export const $318: $.Codec<
  [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>]
> = $.tuple($315, $319)

export const $317: $.Codec<
  [
    types.Compact<types.u32>,
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    types.Compact<types.u16>,
  ]
> = $.tuple($125, $318, $315)

export const $316: $.Codec<
  Array<
    [
      types.Compact<types.u32>,
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      types.Compact<types.u16>,
    ]
  >
> = $.array($317)

export const $323: $.Codec<
  [
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
  ]
> = $.sizedArray($318, 2)

export const $322: $.Codec<
  [
    types.Compact<types.u32>,
    [
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    ],
    types.Compact<types.u16>,
  ]
> = $.tuple($125, $323, $315)

export const $321: $.Codec<
  Array<
    [
      types.Compact<types.u32>,
      [
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      ],
      types.Compact<types.u16>,
    ]
  >
> = $.array($322)

export const $326: $.Codec<
  [
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
  ]
> = $.sizedArray($318, 3)

export const $325: $.Codec<
  [
    types.Compact<types.u32>,
    [
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    ],
    types.Compact<types.u16>,
  ]
> = $.tuple($125, $326, $315)

export const $324: $.Codec<
  Array<
    [
      types.Compact<types.u32>,
      [
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      ],
      types.Compact<types.u16>,
    ]
  >
> = $.array($325)

export const $329: $.Codec<
  [
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
  ]
> = $.sizedArray($318, 4)

export const $328: $.Codec<
  [
    types.Compact<types.u32>,
    [
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    ],
    types.Compact<types.u16>,
  ]
> = $.tuple($125, $329, $315)

export const $327: $.Codec<
  Array<
    [
      types.Compact<types.u32>,
      [
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      ],
      types.Compact<types.u16>,
    ]
  >
> = $.array($328)

export const $332: $.Codec<
  [
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
  ]
> = $.sizedArray($318, 5)

export const $331: $.Codec<
  [
    types.Compact<types.u32>,
    [
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    ],
    types.Compact<types.u16>,
  ]
> = $.tuple($125, $332, $315)

export const $330: $.Codec<
  Array<
    [
      types.Compact<types.u32>,
      [
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      ],
      types.Compact<types.u16>,
    ]
  >
> = $.array($331)

export const $335: $.Codec<
  [
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
  ]
> = $.sizedArray($318, 6)

export const $334: $.Codec<
  [
    types.Compact<types.u32>,
    [
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    ],
    types.Compact<types.u16>,
  ]
> = $.tuple($125, $335, $315)

export const $333: $.Codec<
  Array<
    [
      types.Compact<types.u32>,
      [
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      ],
      types.Compact<types.u16>,
    ]
  >
> = $.array($334)

export const $338: $.Codec<
  [
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
  ]
> = $.sizedArray($318, 7)

export const $337: $.Codec<
  [
    types.Compact<types.u32>,
    [
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    ],
    types.Compact<types.u16>,
  ]
> = $.tuple($125, $338, $315)

export const $336: $.Codec<
  Array<
    [
      types.Compact<types.u32>,
      [
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      ],
      types.Compact<types.u16>,
    ]
  >
> = $.array($337)

export const $341: $.Codec<
  [
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
  ]
> = $.sizedArray($318, 8)

export const $340: $.Codec<
  [
    types.Compact<types.u32>,
    [
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    ],
    types.Compact<types.u16>,
  ]
> = $.tuple($125, $341, $315)

export const $339: $.Codec<
  Array<
    [
      types.Compact<types.u32>,
      [
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      ],
      types.Compact<types.u16>,
    ]
  >
> = $.array($340)

export const $344: $.Codec<
  [
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
  ]
> = $.sizedArray($318, 9)

export const $343: $.Codec<
  [
    types.Compact<types.u32>,
    [
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    ],
    types.Compact<types.u16>,
  ]
> = $.tuple($125, $344, $315)

export const $342: $.Codec<
  Array<
    [
      types.Compact<types.u32>,
      [
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      ],
      types.Compact<types.u16>,
    ]
  >
> = $.array($343)

export const $347: $.Codec<
  [
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
  ]
> = $.sizedArray($318, 10)

export const $346: $.Codec<
  [
    types.Compact<types.u32>,
    [
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    ],
    types.Compact<types.u16>,
  ]
> = $.tuple($125, $347, $315)

export const $345: $.Codec<
  Array<
    [
      types.Compact<types.u32>,
      [
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      ],
      types.Compact<types.u16>,
    ]
  >
> = $.array($346)

export const $350: $.Codec<
  [
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
  ]
> = $.sizedArray($318, 11)

export const $349: $.Codec<
  [
    types.Compact<types.u32>,
    [
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    ],
    types.Compact<types.u16>,
  ]
> = $.tuple($125, $350, $315)

export const $348: $.Codec<
  Array<
    [
      types.Compact<types.u32>,
      [
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      ],
      types.Compact<types.u16>,
    ]
  >
> = $.array($349)

export const $353: $.Codec<
  [
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
  ]
> = $.sizedArray($318, 12)

export const $352: $.Codec<
  [
    types.Compact<types.u32>,
    [
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    ],
    types.Compact<types.u16>,
  ]
> = $.tuple($125, $353, $315)

export const $351: $.Codec<
  Array<
    [
      types.Compact<types.u32>,
      [
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      ],
      types.Compact<types.u16>,
    ]
  >
> = $.array($352)

export const $356: $.Codec<
  [
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
  ]
> = $.sizedArray($318, 13)

export const $355: $.Codec<
  [
    types.Compact<types.u32>,
    [
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    ],
    types.Compact<types.u16>,
  ]
> = $.tuple($125, $356, $315)

export const $354: $.Codec<
  Array<
    [
      types.Compact<types.u32>,
      [
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      ],
      types.Compact<types.u16>,
    ]
  >
> = $.array($355)

export const $359: $.Codec<
  [
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
  ]
> = $.sizedArray($318, 14)

export const $358: $.Codec<
  [
    types.Compact<types.u32>,
    [
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    ],
    types.Compact<types.u16>,
  ]
> = $.tuple($125, $359, $315)

export const $357: $.Codec<
  Array<
    [
      types.Compact<types.u32>,
      [
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      ],
      types.Compact<types.u16>,
    ]
  >
> = $.array($358)

export const $362: $.Codec<
  [
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
  ]
> = $.sizedArray($318, 15)

export const $361: $.Codec<
  [
    types.Compact<types.u32>,
    [
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
    ],
    types.Compact<types.u16>,
  ]
> = $.tuple($125, $362, $315)

export const $360: $.Codec<
  Array<
    [
      types.Compact<types.u32>,
      [
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
        [types.Compact<types.u16>, types.Compact<types.sp_arithmetic.per_things.PerU16>],
      ],
      types.Compact<types.u16>,
    ]
  >
> = $.array($361)

export const $312: $.Codec<types.polkadot_runtime.NposCompactSolution16> = $.object(
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

export const $311: $.Codec<types.pallet_election_provider_multi_phase.RawSolution> = $.object(
  ["solution", $312],
  ["score", $88],
  ["round", $4],
)

export const $363: $.Codec<types.pallet_election_provider_multi_phase.SolutionOrSnapshotSize> = $
  .object(["voters", $125], ["targets", $125])

export const $364: $.Codec<types.sp_npos_elections.ElectionScore | undefined> = $.option($88)

export const $367: $.Codec<types.sp_npos_elections.Support> = $.object(["total", $6], [
  "voters",
  $68,
])

export const $366: $.Codec<[types.sp_core.crypto.AccountId32, types.sp_npos_elections.Support]> = $
  .tuple($0, $367)

export const $365: $.Codec<
  Array<[types.sp_core.crypto.AccountId32, types.sp_npos_elections.Support]>
> = $.array($366)

export const $310: $.Codec<types.pallet_election_provider_multi_phase.pallet.Call> = $.taggedUnion(
  "type",
  {
    0: ["submitUnsigned", ["rawSolution", $311], ["witness", $363]],
    1: ["setMinimumUntrustedScore", ["maybeNextScore", $364]],
    2: ["setEmergencyElectionResult", ["supports", $365]],
    3: ["submit", ["rawSolution", $311]],
    4: ["governanceFallback", ["maybeMaxVoters", $236], ["maybeMaxTargets", $236]],
  },
)

export const $368: $.Codec<types.pallet_bags_list.pallet.Call> = $.taggedUnion("type", {
  0: ["rebag", ["dislocated", $197]],
  1: ["putInFrontOf", ["lighter", $197]],
})

export const $370: $.Codec<types.pallet_nomination_pools.BondExtra> = $.taggedUnion("type", {
  0: ["FreeBalance", ["value", $6]],
  1: ["Rewards"],
})

export const $371: $.Codec<types.pallet_nomination_pools.ConfigOp.$$u128> = $.taggedUnion("type", {
  0: ["Noop"],
  1: ["Set", ["value", $6]],
  2: ["Remove"],
})

export const $372: $.Codec<types.pallet_nomination_pools.ConfigOp.$$u32> = $.taggedUnion("type", {
  0: ["Noop"],
  1: ["Set", ["value", $4]],
  2: ["Remove"],
})

export const $373: $.Codec<types.pallet_nomination_pools.ConfigOp.$$sp_core.crypto.AccountId32> = $
  .taggedUnion("type", { 0: ["Noop"], 1: ["Set", ["value", $0]], 2: ["Remove"] })

export const $369: $.Codec<types.pallet_nomination_pools.pallet.Call> = $.taggedUnion("type", {
  0: ["join", ["amount", $58], ["poolId", $4]],
  1: ["bondExtra", ["extra", $370]],
  2: ["claimPayout"],
  3: ["unbond", ["memberAccount", $197], ["unbondingPoints", $58]],
  4: ["poolWithdrawUnbonded", ["poolId", $4], ["numSlashingSpans", $4]],
  5: ["withdrawUnbonded", ["memberAccount", $197], ["numSlashingSpans", $4]],
  6: ["create", ["amount", $58], ["root", $197], ["nominator", $197], ["stateToggler", $197]],
  7: ["nominate", ["poolId", $4], ["validators", $206]],
  8: ["setState", ["poolId", $4], ["state", $91]],
  9: ["setMetadata", ["poolId", $4], ["metadata", $12]],
  10: ["setConfigs", ["minJoinBond", $371], ["minCreateBond", $371], ["maxPools", $372], [
    "maxMembers",
    $372,
  ], ["maxMembersPerPool", $372]],
  11: ["updateRoles", ["poolId", $4], ["newRoot", $373], ["newNominator", $373], [
    "newStateToggler",
    $373,
  ]],
  12: ["chill", ["poolId", $4]],
})

export const $374: $.Codec<types.pallet_fast_unstake.pallet.Call> = $.taggedUnion("type", {
  0: ["registerFastUnstake"],
  1: ["deregister"],
  2: ["control", ["uncheckedErasToCheck", $4]],
})

export const $375: $.Codec<types.polkadot_runtime_parachains.configuration.pallet.Call> = $
  .taggedUnion("type", {
    0: ["setValidationUpgradeCooldown", ["new", $4]],
    1: ["setValidationUpgradeDelay", ["new", $4]],
    2: ["setCodeRetentionPeriod", ["new", $4]],
    3: ["setMaxCodeSize", ["new", $4]],
    4: ["setMaxPovSize", ["new", $4]],
    5: ["setMaxHeadDataSize", ["new", $4]],
    6: ["setParathreadCores", ["new", $4]],
    7: ["setParathreadRetries", ["new", $4]],
    8: ["setGroupRotationFrequency", ["new", $4]],
    9: ["setChainAvailabilityPeriod", ["new", $4]],
    10: ["setThreadAvailabilityPeriod", ["new", $4]],
    11: ["setSchedulingLookahead", ["new", $4]],
    12: ["setMaxValidatorsPerCore", ["new", $236]],
    13: ["setMaxValidators", ["new", $236]],
    14: ["setDisputePeriod", ["new", $4]],
    15: ["setDisputePostConclusionAcceptancePeriod", ["new", $4]],
    16: ["setDisputeMaxSpamSlots", ["new", $4]],
    17: ["setDisputeConclusionByTimeOutPeriod", ["new", $4]],
    18: ["setNoShowSlots", ["new", $4]],
    19: ["setNDelayTranches", ["new", $4]],
    20: ["setZerothDelayTrancheWidth", ["new", $4]],
    21: ["setNeededApprovals", ["new", $4]],
    22: ["setRelayVrfModuloSamples", ["new", $4]],
    23: ["setMaxUpwardQueueCount", ["new", $4]],
    24: ["setMaxUpwardQueueSize", ["new", $4]],
    25: ["setMaxDownwardMessageSize", ["new", $4]],
    26: ["setUmpServiceTotalWeight", ["new", $8]],
    27: ["setMaxUpwardMessageSize", ["new", $4]],
    28: ["setMaxUpwardMessageNumPerCandidate", ["new", $4]],
    29: ["setHrmpOpenRequestTtl", ["new", $4]],
    30: ["setHrmpSenderDeposit", ["new", $6]],
    31: ["setHrmpRecipientDeposit", ["new", $6]],
    32: ["setHrmpChannelMaxCapacity", ["new", $4]],
    33: ["setHrmpChannelMaxTotalSize", ["new", $4]],
    34: ["setHrmpMaxParachainInboundChannels", ["new", $4]],
    35: ["setHrmpMaxParathreadInboundChannels", ["new", $4]],
    36: ["setHrmpChannelMaxMessageSize", ["new", $4]],
    37: ["setHrmpMaxParachainOutboundChannels", ["new", $4]],
    38: ["setHrmpMaxParathreadOutboundChannels", ["new", $4]],
    39: ["setHrmpMaxMessageNumPerCandidate", ["new", $4]],
    40: ["setUmpMaxIndividualWeight", ["new", $8]],
    41: ["setPvfCheckingEnabled", ["new", $43]],
    42: ["setPvfVotingTtl", ["new", $4]],
    43: ["setMinimumValidationUpgradeDelay", ["new", $4]],
    44: ["setBypassConsistencyCheck", ["new", $43]],
  })

export const $376: $.Codec<types.polkadot_runtime_parachains.shared.pallet.Call> = $.never

export const $377: $.Codec<types.polkadot_runtime_parachains.inclusion.pallet.Call> = $.never

export const $383: $.Codec<$.BitSequence> = $.bitSequence

export const $382: $.Codec<types.polkadot_primitives.v2.AvailabilityBitfield> = $383

export const $385: $.Codec<types.polkadot_primitives.v2.ValidatorIndex> = $4

export const $386: $.Codec<types.polkadot_primitives.v2.validator_app.Signature> = $101

export const $381: $.Codec<types.polkadot_primitives.v2.signed.UncheckedSigned> = $.object(
  ["payload", $382],
  ["validatorIndex", $385],
  ["signature", $386],
)

export const $380: $.Codec<Array<types.polkadot_primitives.v2.signed.UncheckedSigned>> = $.array(
  $381,
)

export const $392: $.Codec<types.polkadot_core_primitives.OutboundHrmpMessage> = $.object([
  "recipient",
  $98,
], ["data", $12])

export const $391: $.Codec<Array<types.polkadot_core_primitives.OutboundHrmpMessage>> = $.array(
  $392,
)

export const $394: $.Codec<types.polkadot_parachain.primitives.ValidationCode> = $12

export const $393: $.Codec<types.polkadot_parachain.primitives.ValidationCode | undefined> = $
  .option($394)

export const $390: $.Codec<types.polkadot_primitives.v2.CandidateCommitments> = $.object(
  ["upwardMessages", $164],
  ["horizontalMessages", $391],
  ["newValidationCode", $393],
  ["headData", $104],
  ["processedDownwardMessages", $4],
  ["hrmpWatermark", $4],
)

export const $389: $.Codec<types.polkadot_primitives.v2.CommittedCandidateReceipt> = $.object([
  "descriptor",
  $97,
], ["commitments", $390])

export const $396: $.Codec<types.polkadot_primitives.v2.ValidityAttestation> = $.taggedUnion(
  "type",
  { 1: ["Implicit", ["value", $386]], 2: ["Explicit", ["value", $386]] },
)

export const $395: $.Codec<Array<types.polkadot_primitives.v2.ValidityAttestation>> = $.array($396)

export const $388: $.Codec<types.polkadot_primitives.v2.BackedCandidate> = $.object(
  ["candidate", $389],
  ["validityVotes", $395],
  ["validatorIndices", $383],
)

export const $387: $.Codec<Array<types.polkadot_primitives.v2.BackedCandidate>> = $.array($388)

export const $402: $.Codec<types.polkadot_primitives.v2.ValidDisputeStatementKind> = $.taggedUnion(
  "type",
  {
    0: ["Explicit"],
    1: ["BackingSeconded", ["value", $11]],
    2: ["BackingValid", ["value", $11]],
    3: ["ApprovalChecking"],
  },
)

export const $403: $.Codec<types.polkadot_primitives.v2.InvalidDisputeStatementKind> = $
  .stringUnion({ 0: "Explicit" })

export const $401: $.Codec<types.polkadot_primitives.v2.DisputeStatement> = $.taggedUnion("type", {
  0: ["Valid", ["value", $402]],
  1: ["Invalid", ["value", $403]],
})

export const $400: $.Codec<
  [
    types.polkadot_primitives.v2.DisputeStatement,
    types.polkadot_primitives.v2.ValidatorIndex,
    types.polkadot_primitives.v2.validator_app.Signature,
  ]
> = $.tuple($401, $385, $386)

export const $399: $.Codec<
  Array<
    [
      types.polkadot_primitives.v2.DisputeStatement,
      types.polkadot_primitives.v2.ValidatorIndex,
      types.polkadot_primitives.v2.validator_app.Signature,
    ]
  >
> = $.array($400)

export const $398: $.Codec<types.polkadot_primitives.v2.DisputeStatementSet> = $.object(
  ["candidateHash", $114],
  ["session", $4],
  ["statements", $399],
)

export const $397: $.Codec<Array<types.polkadot_primitives.v2.DisputeStatementSet>> = $.array($398)

export const $379: $.Codec<types.polkadot_primitives.v2.InherentData> = $.object(
  ["bitfields", $380],
  ["backedCandidates", $387],
  ["disputes", $397],
  ["parentHeader", $187],
)

export const $378: $.Codec<types.polkadot_runtime_parachains.paras_inherent.pallet.Call> = $
  .taggedUnion("type", { 0: ["enter", ["data", $379]] })

export const $405: $.Codec<types.polkadot_primitives.v2.PvfCheckStatement> = $.object(
  ["accept", $43],
  ["subject", $103],
  ["sessionIndex", $4],
  ["validatorIndex", $385],
)

export const $404: $.Codec<types.polkadot_runtime_parachains.paras.pallet.Call> = $.taggedUnion(
  "type",
  {
    0: ["forceSetCurrentCode", ["para", $98], ["newCode", $394]],
    1: ["forceSetCurrentHead", ["para", $98], ["newHead", $104]],
    2: ["forceScheduleCodeUpgrade", ["para", $98], ["newCode", $394], ["relayParentNumber", $4]],
    3: ["forceNoteNewHead", ["para", $98], ["newHead", $104]],
    4: ["forceQueueAction", ["para", $98]],
    5: ["addTrustedValidationCode", ["validationCode", $394]],
    6: ["pokeUnusedValidationCode", ["validationCodeHash", $103]],
    7: ["includePvfCheckStatement", ["stmt", $405], ["signature", $386]],
  },
)

export const $406: $.Codec<types.polkadot_runtime_parachains.initializer.pallet.Call> = $
  .taggedUnion("type", { 0: ["forceApprove", ["upTo", $4]] })

export const $407: $.Codec<types.polkadot_runtime_parachains.dmp.pallet.Call> = $.never

export const $408: $.Codec<types.polkadot_runtime_parachains.ump.pallet.Call> = $.taggedUnion(
  "type",
  { 0: ["serviceOverweight", ["index", $10], ["weightLimit", $8]] },
)

export const $409: $.Codec<types.polkadot_runtime_parachains.hrmp.pallet.Call> = $.taggedUnion(
  "type",
  {
    0: ["hrmpInitOpenChannel", ["recipient", $98], ["proposedMaxCapacity", $4], [
      "proposedMaxMessageSize",
      $4,
    ]],
    1: ["hrmpAcceptOpenChannel", ["sender", $98]],
    2: ["hrmpCloseChannel", ["channelId", $112]],
    3: ["forceCleanHrmp", ["para", $98], ["inbound", $4], ["outbound", $4]],
    4: ["forceProcessHrmpOpen", ["channels", $4]],
    5: ["forceProcessHrmpClose", ["channels", $4]],
    6: ["hrmpCancelOpenRequest", ["channelId", $112], ["openRequests", $4]],
    7: ["forceOpenHrmpChannel", ["sender", $98], ["recipient", $98], ["maxCapacity", $4], [
      "maxMessageSize",
      $4,
    ]],
  },
)

export const $410: $.Codec<types.polkadot_runtime_parachains.disputes.pallet.Call> = $.stringUnion({
  0: "forceUnfreeze",
})

export const $411: $.Codec<types.polkadot_runtime_common.paras_registrar.pallet.Call> = $
  .taggedUnion("type", {
    0: ["register", ["id", $98], ["genesisHead", $104], ["validationCode", $394]],
    1: ["forceRegister", ["who", $0], ["deposit", $6], ["id", $98], ["genesisHead", $104], [
      "validationCode",
      $394,
    ]],
    2: ["deregister", ["id", $98]],
    3: ["swap", ["id", $98], ["other", $98]],
    4: ["removeLock", ["para", $98]],
    5: ["reserve"],
    6: ["addLock", ["para", $98]],
    7: ["scheduleCodeUpgrade", ["para", $98], ["newCode", $394]],
    8: ["setCurrentHead", ["para", $98], ["newHead", $104]],
  })

export const $412: $.Codec<types.polkadot_runtime_common.slots.pallet.Call> = $.taggedUnion(
  "type",
  {
    0: ["forceLease", ["para", $98], ["leaser", $0], ["amount", $6], ["periodBegin", $4], [
      "periodCount",
      $4,
    ]],
    1: ["clearAllLeases", ["para", $98]],
    2: ["triggerOnboard", ["para", $98]],
  },
)

export const $414: $.Codec<types.Compact<types.polkadot_parachain.primitives.Id>> = $.compact($98)

export const $413: $.Codec<types.polkadot_runtime_common.auctions.pallet.Call> = $.taggedUnion(
  "type",
  {
    0: ["newAuction", ["duration", $125], ["leasePeriodIndex", $125]],
    1: ["bid", ["para", $414], ["auctionIndex", $125], ["firstSlot", $125], ["lastSlot", $125], [
      "amount",
      $58,
    ]],
    2: ["cancelAuction"],
  },
)

export const $419: $.Codec<Uint8Array> = $.sizedUint8Array(33)

export const $418: $.Codec<types.sp_core.ecdsa.Public> = $419

export const $417: $.Codec<types.sp_runtime.MultiSigner> = $.taggedUnion("type", {
  0: ["Ed25519", ["value", $51]],
  1: ["Sr25519", ["value", $54]],
  2: ["Ecdsa", ["value", $418]],
})

export const $416: $.Codec<types.sp_runtime.MultiSigner | undefined> = $.option($417)

export const $422: $.Codec<types.sp_core.ecdsa.Signature> = $247

export const $421: $.Codec<types.sp_runtime.MultiSignature> = $.taggedUnion("type", {
  0: ["Ed25519", ["value", $222]],
  1: ["Sr25519", ["value", $101]],
  2: ["Ecdsa", ["value", $422]],
})

export const $420: $.Codec<types.sp_runtime.MultiSignature | undefined> = $.option($421)

export const $415: $.Codec<types.polkadot_runtime_common.crowdloan.pallet.Call> = $.taggedUnion(
  "type",
  {
    0: ["create", ["index", $414], ["cap", $58], ["firstPeriod", $125], ["lastPeriod", $125], [
      "end",
      $125,
    ], ["verifier", $416]],
    1: ["contribute", ["index", $414], ["value", $58], ["signature", $420]],
    2: ["withdraw", ["who", $0], ["index", $414]],
    3: ["refund", ["index", $414]],
    4: ["dissolve", ["index", $414]],
    5: ["edit", ["index", $414], ["cap", $58], ["firstPeriod", $125], ["lastPeriod", $125], [
      "end",
      $125,
    ], ["verifier", $416]],
    6: ["addMemo", ["index", $98], ["memo", $12]],
    7: ["poke", ["index", $98]],
    8: ["contributeAll", ["index", $414], ["signature", $420]],
  },
)

export const $428: $.Codec<Array<types.xcm.v0.Xcm>> = $.array($.deferred(() => $425))

export const $427: $.Codec<types.xcm.v0.order.Order> = $.taggedUnion("type", {
  0: ["Null"],
  1: ["DepositAsset", ["assets", $151], ["dest", $153]],
  2: ["DepositReserveAsset", ["assets", $151], ["dest", $153], ["effects", $.deferred(() => $426)]],
  3: ["ExchangeAsset", ["give", $151], ["receive", $151]],
  4: ["InitiateReserveWithdraw", ["assets", $151], ["reserve", $153], [
    "effects",
    $.deferred(() => $426),
  ]],
  5: ["InitiateTeleport", ["assets", $151], ["dest", $153], ["effects", $.deferred(() => $426)]],
  6: ["QueryHolding", ["queryId", $9], ["dest", $153], ["assets", $151]],
  7: ["BuyExecution", ["fees", $152], ["weight", $10], ["debt", $10], ["haltOnError", $43], [
    "xcm",
    $428,
  ]],
})

export const $426: $.Codec<Array<types.xcm.v0.order.Order>> = $.array($427)

export const $429: $.Codec<types.xcm.v0.Response> = $.taggedUnion("type", {
  0: ["Assets", ["value", $151]],
})

export const $425: $.Codec<types.xcm.v0.Xcm> = $.taggedUnion("type", {
  0: ["WithdrawAsset", ["assets", $151], ["effects", $426]],
  1: ["ReserveAssetDeposit", ["assets", $151], ["effects", $426]],
  2: ["TeleportAsset", ["assets", $151], ["effects", $426]],
  3: ["QueryResponse", ["queryId", $9], ["response", $429]],
  4: ["TransferAsset", ["assets", $151], ["dest", $153]],
  5: ["TransferReserveAsset", ["assets", $151], ["dest", $153], ["effects", $426]],
  6: ["Transact", ["originType", $143], ["requireWeightAtMost", $10], ["call", $144]],
  7: ["HrmpNewChannelOpenRequest", ["sender", $125], ["maxMessageSize", $125], [
    "maxCapacity",
    $125,
  ]],
  8: ["HrmpChannelAccepted", ["recipient", $125]],
  9: ["HrmpChannelClosing", ["initiator", $125], ["sender", $125], ["recipient", $125]],
  10: ["RelayedFrom", ["who", $153], ["message", $.deferred(() => $425)]],
})

export const $433: $.Codec<Array<types.xcm.v1.Xcm>> = $.array($.deferred(() => $430))

export const $432: $.Codec<types.xcm.v1.order.Order> = $.taggedUnion("type", {
  0: ["Noop"],
  1: ["DepositAsset", ["assets", $145], ["maxAssets", $4], ["beneficiary", $122]],
  2: ["DepositReserveAsset", ["assets", $145], ["maxAssets", $4], ["dest", $122], [
    "effects",
    $.deferred(() => $431),
  ]],
  3: ["ExchangeAsset", ["give", $145], ["receive", $133]],
  4: ["InitiateReserveWithdraw", ["assets", $145], ["reserve", $122], [
    "effects",
    $.deferred(() => $431),
  ]],
  5: ["InitiateTeleport", ["assets", $145], ["dest", $122], ["effects", $.deferred(() => $431)]],
  6: ["QueryHolding", ["queryId", $9], ["dest", $122], ["assets", $145]],
  7: ["BuyExecution", ["fees", $135], ["weight", $10], ["debt", $10], ["haltOnError", $43], [
    "instructions",
    $433,
  ]],
})

export const $431: $.Codec<Array<types.xcm.v1.order.Order>> = $.array($432)

export const $434: $.Codec<types.xcm.v1.Response> = $.taggedUnion("type", {
  0: ["Assets", ["value", $133]],
  1: ["Version", ["value", $4]],
})

export const $430: $.Codec<types.xcm.v1.Xcm> = $.taggedUnion("type", {
  0: ["WithdrawAsset", ["assets", $133], ["effects", $431]],
  1: ["ReserveAssetDeposited", ["assets", $133], ["effects", $431]],
  2: ["ReceiveTeleportedAsset", ["assets", $133], ["effects", $431]],
  3: ["QueryResponse", ["queryId", $9], ["response", $434]],
  4: ["TransferAsset", ["assets", $133], ["beneficiary", $122]],
  5: ["TransferReserveAsset", ["assets", $133], ["dest", $122], ["effects", $431]],
  6: ["Transact", ["originType", $143], ["requireWeightAtMost", $10], ["call", $144]],
  7: ["HrmpNewChannelOpenRequest", ["sender", $125], ["maxMessageSize", $125], [
    "maxCapacity",
    $125,
  ]],
  8: ["HrmpChannelAccepted", ["recipient", $125]],
  9: ["HrmpChannelClosing", ["initiator", $125], ["sender", $125], ["recipient", $125]],
  10: ["RelayedFrom", ["who", $123], ["message", $.deferred(() => $430)]],
  11: ["SubscribeVersion", ["queryId", $9], ["maxResponseWeight", $9]],
  12: ["UnsubscribeVersion"],
})

export const $424: $.Codec<types.xcm.VersionedXcm> = $.taggedUnion("type", {
  0: ["V0", ["value", $425]],
  1: ["V1", ["value", $430]],
  2: ["V2", ["value", $130]],
})

export const $439: $.Codec<Array<types.xcm.v0.Xcm>> = $.array($.deferred(() => $436))

export const $438: $.Codec<types.xcm.v0.order.Order> = $.taggedUnion("type", {
  0: ["Null"],
  1: ["DepositAsset", ["assets", $151], ["dest", $153]],
  2: ["DepositReserveAsset", ["assets", $151], ["dest", $153], ["effects", $426]],
  3: ["ExchangeAsset", ["give", $151], ["receive", $151]],
  4: ["InitiateReserveWithdraw", ["assets", $151], ["reserve", $153], ["effects", $426]],
  5: ["InitiateTeleport", ["assets", $151], ["dest", $153], ["effects", $426]],
  6: ["QueryHolding", ["queryId", $9], ["dest", $153], ["assets", $151]],
  7: ["BuyExecution", ["fees", $152], ["weight", $10], ["debt", $10], ["haltOnError", $43], [
    "xcm",
    $439,
  ]],
})

export const $437: $.Codec<Array<types.xcm.v0.order.Order>> = $.array($438)

export const $440: $.Codec<types.xcm.double_encoded.DoubleEncoded> = $.object(["encoded", $12])

export const $436: $.Codec<types.xcm.v0.Xcm> = $.taggedUnion("type", {
  0: ["WithdrawAsset", ["assets", $151], ["effects", $437]],
  1: ["ReserveAssetDeposit", ["assets", $151], ["effects", $437]],
  2: ["TeleportAsset", ["assets", $151], ["effects", $437]],
  3: ["QueryResponse", ["queryId", $9], ["response", $429]],
  4: ["TransferAsset", ["assets", $151], ["dest", $153]],
  5: ["TransferReserveAsset", ["assets", $151], ["dest", $153], ["effects", $426]],
  6: ["Transact", ["originType", $143], ["requireWeightAtMost", $10], ["call", $440]],
  7: ["HrmpNewChannelOpenRequest", ["sender", $125], ["maxMessageSize", $125], [
    "maxCapacity",
    $125,
  ]],
  8: ["HrmpChannelAccepted", ["recipient", $125]],
  9: ["HrmpChannelClosing", ["initiator", $125], ["sender", $125], ["recipient", $125]],
  10: ["RelayedFrom", ["who", $153], ["message", $.deferred(() => $436)]],
})

export const $444: $.Codec<Array<types.xcm.v1.Xcm>> = $.array($.deferred(() => $441))

export const $443: $.Codec<types.xcm.v1.order.Order> = $.taggedUnion("type", {
  0: ["Noop"],
  1: ["DepositAsset", ["assets", $145], ["maxAssets", $4], ["beneficiary", $122]],
  2: ["DepositReserveAsset", ["assets", $145], ["maxAssets", $4], ["dest", $122], [
    "effects",
    $431,
  ]],
  3: ["ExchangeAsset", ["give", $145], ["receive", $133]],
  4: ["InitiateReserveWithdraw", ["assets", $145], ["reserve", $122], ["effects", $431]],
  5: ["InitiateTeleport", ["assets", $145], ["dest", $122], ["effects", $431]],
  6: ["QueryHolding", ["queryId", $9], ["dest", $122], ["assets", $145]],
  7: ["BuyExecution", ["fees", $135], ["weight", $10], ["debt", $10], ["haltOnError", $43], [
    "instructions",
    $444,
  ]],
})

export const $442: $.Codec<Array<types.xcm.v1.order.Order>> = $.array($443)

export const $441: $.Codec<types.xcm.v1.Xcm> = $.taggedUnion("type", {
  0: ["WithdrawAsset", ["assets", $133], ["effects", $442]],
  1: ["ReserveAssetDeposited", ["assets", $133], ["effects", $442]],
  2: ["ReceiveTeleportedAsset", ["assets", $133], ["effects", $442]],
  3: ["QueryResponse", ["queryId", $9], ["response", $434]],
  4: ["TransferAsset", ["assets", $133], ["beneficiary", $122]],
  5: ["TransferReserveAsset", ["assets", $133], ["dest", $122], ["effects", $431]],
  6: ["Transact", ["originType", $143], ["requireWeightAtMost", $10], ["call", $440]],
  7: ["HrmpNewChannelOpenRequest", ["sender", $125], ["maxMessageSize", $125], [
    "maxCapacity",
    $125,
  ]],
  8: ["HrmpChannelAccepted", ["recipient", $125]],
  9: ["HrmpChannelClosing", ["initiator", $125], ["sender", $125], ["recipient", $125]],
  10: ["RelayedFrom", ["who", $123], ["message", $.deferred(() => $441)]],
  11: ["SubscribeVersion", ["queryId", $9], ["maxResponseWeight", $9]],
  12: ["UnsubscribeVersion"],
})

export const $447: $.Codec<types.xcm.v2.Instruction> = $.taggedUnion("type", {
  0: ["WithdrawAsset", ["value", $133]],
  1: ["ReserveAssetDeposited", ["value", $133]],
  2: ["ReceiveTeleportedAsset", ["value", $133]],
  3: ["QueryResponse", ["queryId", $9], ["response", $140], ["maxWeight", $9]],
  4: ["TransferAsset", ["assets", $133], ["beneficiary", $122]],
  5: ["TransferReserveAsset", ["assets", $133], ["dest", $122], ["xcm", $130]],
  6: ["Transact", ["originType", $143], ["requireWeightAtMost", $9], ["call", $440]],
  7: ["HrmpNewChannelOpenRequest", ["sender", $125], ["maxMessageSize", $125], [
    "maxCapacity",
    $125,
  ]],
  8: ["HrmpChannelAccepted", ["recipient", $125]],
  9: ["HrmpChannelClosing", ["initiator", $125], ["sender", $125], ["recipient", $125]],
  10: ["ClearOrigin"],
  11: ["DescendOrigin", ["value", $123]],
  12: ["ReportError", ["queryId", $9], ["dest", $122], ["maxResponseWeight", $9]],
  13: ["DepositAsset", ["assets", $145], ["maxAssets", $125], ["beneficiary", $122]],
  14: ["DepositReserveAsset", ["assets", $145], ["maxAssets", $125], ["dest", $122], ["xcm", $130]],
  15: ["ExchangeAsset", ["give", $145], ["receive", $133]],
  16: ["InitiateReserveWithdraw", ["assets", $145], ["reserve", $122], ["xcm", $130]],
  17: ["InitiateTeleport", ["assets", $145], ["dest", $122], ["xcm", $130]],
  18: ["QueryHolding", ["queryId", $9], ["dest", $122], ["assets", $145], [
    "maxResponseWeight",
    $9,
  ]],
  19: ["BuyExecution", ["fees", $135], ["weightLimit", $148]],
  20: ["RefundSurplus"],
  21: ["SetErrorHandler", ["value", $.deferred(() => $445)]],
  22: ["SetAppendix", ["value", $.deferred(() => $445)]],
  23: ["ClearError"],
  24: ["ClaimAsset", ["assets", $133], ["ticket", $122]],
  25: ["Trap", ["value", $9]],
  26: ["SubscribeVersion", ["queryId", $9], ["maxResponseWeight", $9]],
  27: ["UnsubscribeVersion"],
})

export const $446: $.Codec<Array<types.xcm.v2.Instruction>> = $.array($447)

export const $445: $.Codec<types.xcm.v2.Xcm> = $446

export const $435: $.Codec<types.xcm.VersionedXcm> = $.taggedUnion("type", {
  0: ["V0", ["value", $436]],
  1: ["V1", ["value", $441]],
  2: ["V2", ["value", $445]],
})

export const $423: $.Codec<types.pallet_xcm.pallet.Call> = $.taggedUnion("type", {
  0: ["send", ["dest", $155], ["message", $424]],
  1: ["teleportAssets", ["dest", $155], ["beneficiary", $155], ["assets", $150], [
    "feeAssetItem",
    $4,
  ]],
  2: ["reserveTransferAssets", ["dest", $155], ["beneficiary", $155], ["assets", $150], [
    "feeAssetItem",
    $4,
  ]],
  3: ["execute", ["message", $435], ["maxWeight", $10]],
  4: ["forceXcmVersion", ["location", $122], ["xcmVersion", $4]],
  5: ["forceDefaultXcmVersion", ["maybeXcmVersion", $236]],
  6: ["forceSubscribeVersionNotify", ["location", $155]],
  7: ["forceUnsubscribeVersionNotify", ["location", $155]],
  8: ["limitedReserveTransferAssets", ["dest", $155], ["beneficiary", $155], ["assets", $150], [
    "feeAssetItem",
    $4,
  ], ["weightLimit", $148]],
  9: ["limitedTeleportAssets", ["dest", $155], ["beneficiary", $155], ["assets", $150], [
    "feeAssetItem",
    $4,
  ], ["weightLimit", $148]],
})

export const $181: $.Codec<types.polkadot_runtime.RuntimeCall> = $.taggedUnion("type", {
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

export const $188: $.Codec<types.sp_runtime.traits.BlakeTwo256> = C.$null

export const $301: $.Codec<types.pallet_identity.types.IdentityField> = $.stringUnion({
  1: "Display",
  2: "Legal",
  4: "Web",
  8: "Riot",
  16: "Email",
  32: "PgpFingerprint",
  64: "Image",
  128: "Twitter",
})

export const $384: $.Codec<types.bitvec.order.Lsb0> = C.$null

export const $450: $.Codec<types.pallet_scheduler.pallet.Error> = $.stringUnion({
  0: "FailedToSchedule",
  1: "NotFound",
  2: "TargetBlockNumberInPast",
  3: "RescheduleNoChange",
  4: "Named",
})

export const $452: $.Codec<[types.sp_core.crypto.AccountId32, types.u128] | undefined> = $.option(
  $69,
)

export const $451: $.Codec<types.pallet_preimage.RequestStatus> = $.taggedUnion("type", {
  0: ["Unrequested", ["deposit", $69], ["len", $4]],
  1: ["Requested", ["deposit", $452], ["count", $4], ["len", $236]],
})

export const $453: $.Codec<[types.primitive_types.H256, types.u32]> = $.tuple($11, $4)

export const $454: $.Codec<Uint8Array> = $12

export const $455: $.Codec<types.pallet_preimage.pallet.Error> = $.stringUnion({
  0: "TooBig",
  1: "AlreadyNoted",
  2: "NotAuthorized",
  3: "NotNoted",
  4: "Requested",
  5: "NotRequested",
})

export const $457: $.Codec<[types.sp_consensus_babe.app.Public, types.u64]> = $.tuple($189, $10)

export const $458: $.Codec<Array<[types.sp_consensus_babe.app.Public, types.u64]>> = $.array($457)

export const $456: $.Codec<Array<[types.sp_consensus_babe.app.Public, types.u64]>> = $458

export const $460: $.Codec<Array<Uint8Array>> = $.array($1)

export const $459: $.Codec<Array<Uint8Array>> = $460

export const $463: $.Codec<types.sp_consensus_babe.digests.PrimaryPreDigest> = $.object(
  ["authorityIndex", $4],
  ["slot", $190],
  ["vrfOutput", $1],
  ["vrfProof", $102],
)

export const $464: $.Codec<types.sp_consensus_babe.digests.SecondaryPlainPreDigest> = $.object([
  "authorityIndex",
  $4,
], ["slot", $190])

export const $465: $.Codec<types.sp_consensus_babe.digests.SecondaryVRFPreDigest> = $.object(
  ["authorityIndex", $4],
  ["slot", $190],
  ["vrfOutput", $1],
  ["vrfProof", $102],
)

export const $462: $.Codec<types.sp_consensus_babe.digests.PreDigest> = $.taggedUnion("type", {
  1: ["Primary", ["value", $463]],
  2: ["SecondaryPlain", ["value", $464]],
  3: ["SecondaryVRF", ["value", $465]],
})

export const $461: $.Codec<types.sp_consensus_babe.digests.PreDigest | undefined> = $.option($462)

export const $466: $.Codec<types.sp_consensus_babe.BabeEpochConfiguration> = $.object(["c", $193], [
  "allowedSlots",
  $194,
])

export const $467: $.Codec<types.pallet_babe.pallet.Error> = $.stringUnion({
  0: "InvalidEquivocationProof",
  1: "InvalidKeyOwnershipProof",
  2: "DuplicateOffenceReport",
  3: "InvalidConfiguration",
})

export const $468: $.Codec<[types.sp_core.crypto.AccountId32, types.u128, boolean]> = $.tuple(
  $0,
  $6,
  $43,
)

export const $469: $.Codec<types.pallet_indices.pallet.Error> = $.stringUnion({
  0: "NotAssigned",
  1: "NotOwner",
  2: "InUse",
  3: "NotTransfer",
  4: "Permanent",
})

export const $472: $.Codec<types.pallet_balances.Reasons> = $.stringUnion({
  0: "Fee",
  1: "Misc",
  2: "All",
})

export const $471: $.Codec<types.pallet_balances.BalanceLock> = $.object(["id", $139], [
  "amount",
  $6,
], ["reasons", $472])

export const $473: $.Codec<Array<types.pallet_balances.BalanceLock>> = $.array($471)

export const $470: $.Codec<Array<types.pallet_balances.BalanceLock>> = $473

export const $475: $.Codec<types.pallet_balances.ReserveData> = $.object(["id", $139], [
  "amount",
  $6,
])

export const $476: $.Codec<Array<types.pallet_balances.ReserveData>> = $.array($475)

export const $474: $.Codec<Array<types.pallet_balances.ReserveData>> = $476

export const $477: $.Codec<types.pallet_balances.Releases> = $.stringUnion({ 0: "V100", 1: "V200" })

export const $478: $.Codec<types.pallet_balances.pallet.Error> = $.stringUnion({
  0: "VestingBalance",
  1: "LiquidityRestrictions",
  2: "InsufficientBalance",
  3: "ExistentialDeposit",
  4: "KeepAlive",
  5: "ExistingVestingSchedule",
  6: "DeadAccount",
  7: "TooManyReserves",
})

export const $479: $.Codec<types.sp_arithmetic.fixed_point.FixedU128> = $6

export const $480: $.Codec<types.pallet_transaction_payment.Releases> = $.stringUnion({
  0: "V1Ancient",
  1: "V2",
})

export const $482: $.Codec<types.pallet_authorship.UncleEntryItem> = $.taggedUnion("type", {
  0: ["InclusionHeight", ["value", $4]],
  1: ["Uncle", ["value", $.tuple($11, $92)]],
})

export const $483: $.Codec<Array<types.pallet_authorship.UncleEntryItem>> = $.array($482)

export const $481: $.Codec<Array<types.pallet_authorship.UncleEntryItem>> = $483

export const $484: $.Codec<types.pallet_authorship.pallet.Error> = $.stringUnion({
  0: "InvalidUncleParent",
  1: "UnclesAlreadySet",
  2: "TooManyUncles",
  3: "GenesisUncle",
  4: "TooHighUncle",
  5: "UncleAlreadyIncluded",
  6: "OldUncle",
})

export const $487: $.Codec<types.pallet_staking.UnlockChunk> = $.object(["value", $58], [
  "era",
  $125,
])

export const $488: $.Codec<Array<types.pallet_staking.UnlockChunk>> = $.array($487)

export const $486: $.Codec<Array<types.pallet_staking.UnlockChunk>> = $488

export const $489: $.Codec<Array<types.u32>> = $94

export const $485: $.Codec<types.pallet_staking.StakingLedger> = $.object(
  ["stash", $0],
  ["total", $58],
  ["active", $58],
  ["unlocking", $486],
  ["claimedRewards", $489],
)

export const $491: $.Codec<Array<types.sp_core.crypto.AccountId32>> = $206

export const $490: $.Codec<types.pallet_staking.Nominations> = $.object(["targets", $491], [
  "submittedIn",
  $4,
], ["suppressed", $43])

export const $493: $.Codec<types.u64 | undefined> = $.option($10)

export const $492: $.Codec<types.pallet_staking.ActiveEraInfo> = $.object(["index", $4], [
  "start",
  $493,
])

export const $494: $.Codec<[types.u32, types.sp_core.crypto.AccountId32]> = $.tuple($4, $0)

export const $496: $.Codec<Map<types.sp_core.crypto.AccountId32, types.u32>> = $.map($0, $4)

export const $495: $.Codec<types.pallet_staking.EraRewardPoints> = $.object(["total", $4], [
  "individual",
  $496,
])

export const $498: $.Codec<[types.sp_core.crypto.AccountId32, types.u32]> = $.tuple($0, $4)

export const $497: $.Codec<Array<[types.sp_core.crypto.AccountId32, types.u32]>> = $.array($498)

export const $499: $.Codec<types.pallet_staking.Forcing> = $.stringUnion({
  0: "NotForcing",
  1: "ForceNew",
  2: "ForceNone",
  3: "ForceAlways",
})

export const $501: $.Codec<types.pallet_staking.UnappliedSlash> = $.object(
  ["validator", $0],
  ["own", $6],
  ["others", $68],
  ["reporters", $206],
  ["payout", $6],
)

export const $500: $.Codec<Array<types.pallet_staking.UnappliedSlash>> = $.array($501)

export const $502: $.Codec<[types.sp_arithmetic.per_things.Perbill, types.u128]> = $.tuple($42, $6)

export const $503: $.Codec<types.pallet_staking.slashing.SlashingSpans> = $.object(
  ["spanIndex", $4],
  ["lastStart", $4],
  ["lastNonzeroSlash", $4],
  ["prior", $94],
)

export const $504: $.Codec<types.pallet_staking.slashing.SpanRecord> = $.object(["slashed", $6], [
  "paidOut",
  $6,
])

export const $506: $.Codec<[types.u32, boolean]> = $.tuple($4, $43)

export const $505: $.Codec<Array<[types.u32, boolean]>> = $.array($506)

export const $507: $.Codec<types.pallet_staking.Releases> = $.stringUnion({
  0: "V100Ancient",
  1: "V200",
  2: "V300",
  3: "V400",
  4: "V500",
  5: "V600",
  6: "V700",
  7: "V800",
  8: "V900",
  9: "V1000",
  10: "V1100",
  11: "V1200",
})

export const $508: $.Codec<types.pallet_staking.pallet.pallet.Error> = $.stringUnion({
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

export const $509: $.Codec<types.sp_staking.offence.OffenceDetails> = $.object(["offender", $56], [
  "reporters",
  $206,
])

export const $510: $.Codec<[Uint8Array, Uint8Array]> = $.tuple($45, $12)

export const $512: $.Codec<[types.sp_core.crypto.AccountId32, types.polkadot_runtime.SessionKeys]> =
  $.tuple($0, $212)

export const $511: $.Codec<
  Array<[types.sp_core.crypto.AccountId32, types.polkadot_runtime.SessionKeys]>
> = $.array($512)

export const $514: $.Codec<types.sp_core.crypto.KeyTypeId> = $16

export const $513: $.Codec<[types.sp_core.crypto.KeyTypeId, Uint8Array]> = $.tuple($514, $12)

export const $515: $.Codec<types.pallet_session.pallet.Error> = $.stringUnion({
  0: "InvalidProof",
  1: "NoAssociatedValidatorId",
  2: "DuplicatedKey",
  3: "NoKeys",
  4: "NoAccount",
})

export const $516: $.Codec<types.pallet_grandpa.StoredState> = $.taggedUnion("type", {
  0: ["Live"],
  1: ["PendingPause", ["scheduledAt", $4], ["delay", $4]],
  2: ["Paused"],
  3: ["PendingResume", ["scheduledAt", $4], ["delay", $4]],
})

export const $518: $.Codec<Array<[types.sp_finality_grandpa.app.Public, types.u64]>> = $48

export const $517: $.Codec<types.pallet_grandpa.StoredPendingChange> = $.object(
  ["scheduledAt", $4],
  ["delay", $4],
  ["nextAuthorities", $518],
  ["forced", $236],
)

export const $519: $.Codec<types.pallet_grandpa.pallet.Error> = $.stringUnion({
  0: "PauseFailed",
  1: "ResumeFailed",
  2: "ChangePending",
  3: "TooSoon",
  4: "InvalidKeyOwnershipProof",
  5: "InvalidEquivocationProof",
  6: "DuplicateOffenceReport",
})

export const $521: $.Codec<Array<types.pallet_im_online.sr25519.app_sr25519.Public>> = $.array($53)

export const $520: $.Codec<Array<types.pallet_im_online.sr25519.app_sr25519.Public>> = $521

export const $524: $.Codec<Uint8Array> = $12

export const $526: $.Codec<Array<Uint8Array>> = $.array($524)

export const $525: $.Codec<Array<Uint8Array>> = $526

export const $523: $.Codec<types.pallet_im_online.BoundedOpaqueNetworkState> = $.object([
  "peerId",
  $524,
], ["externalAddresses", $525])

export const $522: $.Codec<types.pallet_im_online.BoundedOpaqueNetworkState> = $.lenPrefixed($523)

export const $527: $.Codec<types.pallet_im_online.pallet.Error> = $.stringUnion({
  0: "InvalidKey",
  1: "DuplicatedHeartbeat",
})

export const $529: $.Codec<
  [types.u32, types.frame_support.traits.preimages.Bounded, types.sp_core.crypto.AccountId32]
> = $.tuple($4, $180, $0)

export const $530: $.Codec<
  Array<[types.u32, types.frame_support.traits.preimages.Bounded, types.sp_core.crypto.AccountId32]>
> = $.array($529)

export const $528: $.Codec<
  Array<[types.u32, types.frame_support.traits.preimages.Bounded, types.sp_core.crypto.AccountId32]>
> = $530

export const $532: $.Codec<Array<types.sp_core.crypto.AccountId32>> = $206

export const $531: $.Codec<[Array<types.sp_core.crypto.AccountId32>, types.u128]> = $.tuple(
  $532,
  $6,
)

export const $535: $.Codec<types.pallet_democracy.types.Tally> = $.object(["ayes", $6], [
  "nays",
  $6,
], ["turnout", $6])

export const $534: $.Codec<types.pallet_democracy.types.ReferendumStatus> = $.object(
  ["end", $4],
  ["proposal", $180],
  ["threshold", $62],
  ["delay", $4],
  ["tally", $535],
)

export const $533: $.Codec<types.pallet_democracy.types.ReferendumInfo> = $.taggedUnion("type", {
  0: ["Ongoing", ["value", $534]],
  1: ["Finished", ["approved", $43], ["end", $4]],
})

export const $538: $.Codec<[types.u32, types.pallet_democracy.vote.AccountVote]> = $.tuple($4, $63)

export const $539: $.Codec<Array<[types.u32, types.pallet_democracy.vote.AccountVote]>> = $.array(
  $538,
)

export const $537: $.Codec<Array<[types.u32, types.pallet_democracy.vote.AccountVote]>> = $539

export const $540: $.Codec<types.pallet_democracy.types.Delegations> = $.object(["votes", $6], [
  "capital",
  $6,
])

export const $541: $.Codec<types.pallet_democracy.vote.PriorLock> = $.tuple($4, $6)

export const $536: $.Codec<types.pallet_democracy.vote.Voting> = $.taggedUnion("type", {
  0: ["Direct", ["votes", $537], ["delegations", $540], ["prior", $541]],
  1: ["Delegating", ["balance", $6], ["target", $0], ["conviction", $235], ["delegations", $540], [
    "prior",
    $541,
  ]],
})

export const $542: $.Codec<
  [
    types.frame_support.traits.preimages.Bounded,
    types.pallet_democracy.vote_threshold.VoteThreshold,
  ]
> = $.tuple($180, $62)

export const $543: $.Codec<[types.u32, Array<types.sp_core.crypto.AccountId32>]> = $.tuple($4, $532)

export const $544: $.Codec<types.pallet_democracy.pallet.Error> = $.stringUnion({
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

export const $545: $.Codec<Array<types.primitive_types.H256>> = $157

export const $546: $.Codec<types.pallet_collective.Votes> = $.object(
  ["index", $4],
  ["threshold", $4],
  ["ayes", $206],
  ["nays", $206],
  ["end", $4],
)

export const $547: $.Codec<types.pallet_collective.pallet.Error> = $.stringUnion({
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

export const $548: $.Codec<Array<types.primitive_types.H256>> = $157

export const $549: $.Codec<types.pallet_collective.pallet.Error> = $.stringUnion({
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

export const $551: $.Codec<types.pallet_elections_phragmen.SeatHolder> = $.object(["who", $0], [
  "stake",
  $6,
], ["deposit", $6])

export const $550: $.Codec<Array<types.pallet_elections_phragmen.SeatHolder>> = $.array($551)

export const $552: $.Codec<types.pallet_elections_phragmen.Voter> = $.object(["votes", $206], [
  "stake",
  $6,
], ["deposit", $6])

export const $553: $.Codec<types.pallet_elections_phragmen.pallet.Error> = $.stringUnion({
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

export const $554: $.Codec<Array<types.sp_core.crypto.AccountId32>> = $206

export const $555: $.Codec<types.pallet_membership.pallet.Error> = $.stringUnion({
  0: "AlreadyMember",
  1: "NotMember",
  2: "TooManyMembers",
})

export const $556: $.Codec<types.pallet_treasury.Proposal> = $.object(
  ["proposer", $0],
  ["value", $6],
  ["beneficiary", $0],
  ["bond", $6],
)

export const $557: $.Codec<Array<types.u32>> = $94

export const $558: $.Codec<types.sp_arithmetic.per_things.Permill> = $4

export const $559: $.Codec<types.u128 | undefined> = $.option($6)

export const $560: $.Codec<types.frame_support.PalletId> = $139

export const $561: $.Codec<types.pallet_treasury.pallet.Error> = $.stringUnion({
  0: "InsufficientProposersBalance",
  1: "InvalidIndex",
  2: "TooManyApprovals",
  3: "InsufficientPermission",
  4: "ProposalNotApproved",
})

export const $562: $.Codec<types.polkadot_runtime_common.claims.pallet.Error> = $.stringUnion({
  0: "InvalidEthereumSignature",
  1: "SignerHasNoClaim",
  2: "SenderHasNoClaim",
  3: "PotUnderflow",
  4: "InvalidStatement",
  5: "VestedBalanceExists",
})

export const $564: $.Codec<Array<types.pallet_vesting.vesting_info.VestingInfo>> = $.array($253)

export const $563: $.Codec<Array<types.pallet_vesting.vesting_info.VestingInfo>> = $564

export const $565: $.Codec<types.pallet_vesting.Releases> = $.stringUnion({ 0: "V0", 1: "V1" })

export const $566: $.Codec<types.pallet_vesting.pallet.Error> = $.stringUnion({
  0: "NotVesting",
  1: "AtMaxVestingSchedules",
  2: "AmountLow",
  3: "ScheduleIndexOutOfBounds",
  4: "InvalidScheduleParams",
})

export const $567: $.Codec<types.pallet_utility.pallet.Error> = $.stringUnion({ 0: "TooManyCalls" })

export const $570: $.Codec<[types.u32, types.pallet_identity.types.Judgement]> = $.tuple($4, $302)

export const $571: $.Codec<Array<[types.u32, types.pallet_identity.types.Judgement]>> = $.array(
  $570,
)

export const $569: $.Codec<Array<[types.u32, types.pallet_identity.types.Judgement]>> = $571

export const $568: $.Codec<types.pallet_identity.types.Registration> = $.object(
  ["judgements", $569],
  ["deposit", $6],
  ["info", $264],
)

export const $573: $.Codec<Array<types.sp_core.crypto.AccountId32>> = $206

export const $572: $.Codec<[types.u128, Array<types.sp_core.crypto.AccountId32>]> = $.tuple(
  $6,
  $573,
)

export const $576: $.Codec<types.pallet_identity.types.RegistrarInfo> = $.object(["account", $0], [
  "fee",
  $6,
], ["fields", $300])

export const $575: $.Codec<types.pallet_identity.types.RegistrarInfo | undefined> = $.option($576)

export const $577: $.Codec<Array<types.pallet_identity.types.RegistrarInfo | undefined>> = $.array(
  $575,
)

export const $574: $.Codec<Array<types.pallet_identity.types.RegistrarInfo | undefined>> = $577

export const $578: $.Codec<types.pallet_identity.pallet.Error> = $.stringUnion({
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

export const $581: $.Codec<types.pallet_proxy.ProxyDefinition> = $.object(["delegate", $0], [
  "proxyType",
  $79,
], ["delay", $4])

export const $582: $.Codec<Array<types.pallet_proxy.ProxyDefinition>> = $.array($581)

export const $580: $.Codec<Array<types.pallet_proxy.ProxyDefinition>> = $582

export const $579: $.Codec<[Array<types.pallet_proxy.ProxyDefinition>, types.u128]> = $.tuple(
  $580,
  $6,
)

export const $585: $.Codec<types.pallet_proxy.Announcement> = $.object(["real", $0], [
  "callHash",
  $11,
], ["height", $4])

export const $586: $.Codec<Array<types.pallet_proxy.Announcement>> = $.array($585)

export const $584: $.Codec<Array<types.pallet_proxy.Announcement>> = $586

export const $583: $.Codec<[Array<types.pallet_proxy.Announcement>, types.u128]> = $.tuple($584, $6)

export const $587: $.Codec<types.pallet_proxy.pallet.Error> = $.stringUnion({
  0: "TooMany",
  1: "NotFound",
  2: "NotProxy",
  3: "Unproxyable",
  4: "Duplicate",
  5: "NoPermission",
  6: "Unannounced",
  7: "NoSelfProxy",
})

export const $588: $.Codec<[types.sp_core.crypto.AccountId32, Uint8Array]> = $.tuple($0, $1)

export const $589: $.Codec<types.pallet_multisig.Multisig> = $.object(
  ["when", $82],
  ["deposit", $6],
  ["depositor", $0],
  ["approvals", $206],
)

export const $590: $.Codec<types.pallet_multisig.pallet.Error> = $.stringUnion({
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

export const $592: $.Codec<types.pallet_bounties.BountyStatus> = $.taggedUnion("type", {
  0: ["Proposed"],
  1: ["Approved"],
  2: ["Funded"],
  3: ["CuratorProposed", ["curator", $0]],
  4: ["Active", ["curator", $0], ["updateDue", $4]],
  5: ["PendingPayout", ["curator", $0], ["beneficiary", $0], ["unlockAt", $4]],
})

export const $591: $.Codec<types.pallet_bounties.Bounty> = $.object(
  ["proposer", $0],
  ["value", $6],
  ["fee", $6],
  ["curatorDeposit", $6],
  ["bond", $6],
  ["status", $592],
)

export const $593: $.Codec<Uint8Array> = $12

export const $594: $.Codec<types.pallet_bounties.pallet.Error> = $.stringUnion({
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

export const $596: $.Codec<types.pallet_child_bounties.ChildBountyStatus> = $.taggedUnion("type", {
  0: ["Added"],
  1: ["CuratorProposed", ["curator", $0]],
  2: ["Active", ["curator", $0]],
  3: ["PendingPayout", ["curator", $0], ["beneficiary", $0], ["unlockAt", $4]],
})

export const $595: $.Codec<types.pallet_child_bounties.ChildBounty> = $.object(
  ["parentBounty", $4],
  ["value", $6],
  ["fee", $6],
  ["curatorDeposit", $6],
  ["status", $596],
)

export const $597: $.Codec<types.pallet_child_bounties.pallet.Error> = $.stringUnion({
  0: "ParentBountyNotActive",
  1: "InsufficientBountyBalance",
  2: "TooManyChildBounties",
})

export const $598: $.Codec<types.pallet_tips.OpenTip> = $.object(
  ["reason", $11],
  ["who", $0],
  ["finder", $0],
  ["deposit", $6],
  ["closes", $236],
  ["tips", $68],
  ["findersFee", $43],
)

export const $599: $.Codec<types.pallet_tips.pallet.Error> = $.stringUnion({
  0: "ReasonTooBig",
  1: "AlreadyKnown",
  2: "UnknownTip",
  3: "NotFinder",
  4: "StillOpen",
  5: "Premature",
})

export const $601: $.Codec<[boolean, types.u32]> = $.tuple($43, $4)

export const $600: $.Codec<types.pallet_election_provider_multi_phase.Phase> = $.taggedUnion(
  "type",
  { 0: ["Off"], 1: ["Signed"], 2: ["Unsigned", ["value", $601]], 3: ["Emergency"] },
)

export const $602: $.Codec<types.pallet_election_provider_multi_phase.ReadySolution> = $.object(
  ["supports", $365],
  ["score", $88],
  ["compute", $87],
)

export const $605: $.Codec<
  [types.sp_core.crypto.AccountId32, types.u64, Array<types.sp_core.crypto.AccountId32>]
> = $.tuple($0, $10, $491)

export const $604: $.Codec<
  Array<[types.sp_core.crypto.AccountId32, types.u64, Array<types.sp_core.crypto.AccountId32>]>
> = $.array($605)

export const $603: $.Codec<types.pallet_election_provider_multi_phase.RoundSnapshot> = $.object([
  "voters",
  $604,
], ["targets", $206])

export const $607: $.Codec<Map<types.sp_npos_elections.ElectionScore, types.u32>> = $.map($88, $4)

export const $606: $.Codec<Map<types.sp_npos_elections.ElectionScore, types.u32>> = $607

export const $609: $.Codec<[types.sp_npos_elections.ElectionScore, types.u32]> = $.tuple($88, $4)

export const $608: $.Codec<Array<[types.sp_npos_elections.ElectionScore, types.u32]>> = $.array(
  $609,
)

export const $610: $.Codec<types.pallet_election_provider_multi_phase.signed.SignedSubmission> = $
  .object(["who", $0], ["deposit", $6], ["rawSolution", $311], ["callFee", $6])

export const $611: $.Codec<types.pallet_election_provider_multi_phase.pallet.Error> = $.stringUnion(
  {
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
  },
)

export const $612: $.Codec<types.pallet_bags_list.list.Node> = $.object(
  ["id", $0],
  ["prev", $92],
  ["next", $92],
  ["bagUpper", $10],
  ["score", $10],
)

export const $613: $.Codec<types.pallet_bags_list.list.Bag> = $.object(["head", $92], ["tail", $92])

export const $614: $.Codec<Array<types.u64>> = $.array($10)

export const $616: $.Codec<types.pallet_bags_list.list.ListError> = $.stringUnion({
  0: "Duplicate",
  1: "NotHeavier",
  2: "NotInSameBag",
  3: "NodeNotFound",
})

export const $615: $.Codec<types.pallet_bags_list.pallet.Error> = $.taggedUnion("type", {
  0: ["List", ["value", $616]],
})

export const $619: $.Codec<Map<types.u32, types.u128>> = $.map($4, $6)

export const $618: $.Codec<Map<types.u32, types.u128>> = $619

export const $617: $.Codec<types.pallet_nomination_pools.PoolMember> = $.object(
  ["poolId", $4],
  ["points", $6],
  ["lastRecordedRewardCounter", $479],
  ["unbondingEras", $618],
)

export const $621: $.Codec<[types.u32, types.u128]> = $.tuple($4, $6)

export const $620: $.Codec<Array<[types.u32, types.u128]>> = $.array($621)

export const $623: $.Codec<types.pallet_nomination_pools.PoolRoles> = $.object(
  ["depositor", $0],
  ["root", $92],
  ["nominator", $92],
  ["stateToggler", $92],
)

export const $622: $.Codec<types.pallet_nomination_pools.BondedPoolInner> = $.object(
  ["points", $6],
  ["state", $91],
  ["memberCounter", $4],
  ["roles", $623],
)

export const $624: $.Codec<types.pallet_nomination_pools.RewardPool> = $.object(
  ["lastRecordedRewardCounter", $479],
  ["lastRecordedTotalPayouts", $6],
  ["totalRewardsClaimed", $6],
)

export const $626: $.Codec<types.pallet_nomination_pools.UnbondPool> = $.object(["points", $6], [
  "balance",
  $6,
])

export const $628: $.Codec<Map<types.u32, types.pallet_nomination_pools.UnbondPool>> = $.map(
  $4,
  $626,
)

export const $627: $.Codec<Map<types.u32, types.pallet_nomination_pools.UnbondPool>> = $628

export const $625: $.Codec<types.pallet_nomination_pools.SubPools> = $.object(["noEra", $626], [
  "withEra",
  $627,
])

export const $630: $.Codec<[types.u32, types.pallet_nomination_pools.UnbondPool]> = $.tuple(
  $4,
  $626,
)

export const $629: $.Codec<Array<[types.u32, types.pallet_nomination_pools.UnbondPool]>> = $.array(
  $630,
)

export const $631: $.Codec<Uint8Array> = $12

export const $633: $.Codec<types.pallet_nomination_pools.pallet.DefensiveError> = $.stringUnion({
  0: "NotEnoughSpaceInUnbondPool",
  1: "PoolNotFound",
  2: "RewardPoolNotFound",
  3: "SubPoolsNotFound",
  4: "BondedStashKilledPrematurely",
})

export const $632: $.Codec<types.pallet_nomination_pools.pallet.Error> = $.taggedUnion("type", {
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

export const $636: $.Codec<Array<types.u32>> = $94

export const $634: $.Codec<types.pallet_fast_unstake.types.UnstakeRequest> = $.object(
  ["stash", $0],
  ["checked", $636],
  ["deposit", $6],
)

export const $635: $.Codec<types.pallet_fast_unstake.pallet.MaxChecking> = C.$null

export const $637: $.Codec<types.pallet_fast_unstake.pallet.Error> = $.stringUnion({
  0: "NotController",
  1: "AlreadyQueued",
  2: "NotFullyBonded",
  3: "NotQueued",
  4: "AlreadyHead",
  5: "CallNotAllowed",
})

export const $638: $.Codec<types.polkadot_runtime_parachains.configuration.HostConfiguration> = $
  .object(
    ["maxCodeSize", $4],
    ["maxHeadDataSize", $4],
    ["maxUpwardQueueCount", $4],
    ["maxUpwardQueueSize", $4],
    ["maxUpwardMessageSize", $4],
    ["maxUpwardMessageNumPerCandidate", $4],
    ["hrmpMaxMessageNumPerCandidate", $4],
    ["validationUpgradeCooldown", $4],
    ["validationUpgradeDelay", $4],
    ["maxPovSize", $4],
    ["maxDownwardMessageSize", $4],
    ["umpServiceTotalWeight", $8],
    ["hrmpMaxParachainOutboundChannels", $4],
    ["hrmpMaxParathreadOutboundChannels", $4],
    ["hrmpSenderDeposit", $6],
    ["hrmpRecipientDeposit", $6],
    ["hrmpChannelMaxCapacity", $4],
    ["hrmpChannelMaxTotalSize", $4],
    ["hrmpMaxParachainInboundChannels", $4],
    ["hrmpMaxParathreadInboundChannels", $4],
    ["hrmpChannelMaxMessageSize", $4],
    ["codeRetentionPeriod", $4],
    ["parathreadCores", $4],
    ["parathreadRetries", $4],
    ["groupRotationFrequency", $4],
    ["chainAvailabilityPeriod", $4],
    ["threadAvailabilityPeriod", $4],
    ["schedulingLookahead", $4],
    ["maxValidatorsPerCore", $236],
    ["maxValidators", $236],
    ["disputePeriod", $4],
    ["disputePostConclusionAcceptancePeriod", $4],
    ["disputeMaxSpamSlots", $4],
    ["disputeConclusionByTimeOutPeriod", $4],
    ["noShowSlots", $4],
    ["nDelayTranches", $4],
    ["zerothDelayTrancheWidth", $4],
    ["neededApprovals", $4],
    ["relayVrfModuloSamples", $4],
    ["umpMaxIndividualWeight", $8],
    ["pvfCheckingEnabled", $43],
    ["pvfVotingTtl", $4],
    ["minimumValidationUpgradeDelay", $4],
  )

export const $640: $.Codec<
  [types.u32, types.polkadot_runtime_parachains.configuration.HostConfiguration]
> = $.tuple($4, $638)

export const $639: $.Codec<
  Array<[types.u32, types.polkadot_runtime_parachains.configuration.HostConfiguration]>
> = $.array($640)

export const $641: $.Codec<types.polkadot_runtime_parachains.configuration.pallet.Error> = $
  .stringUnion({ 0: "InvalidNewValue" })

export const $642: $.Codec<Array<types.polkadot_primitives.v2.ValidatorIndex>> = $.array($385)

export const $643: $.Codec<Array<types.polkadot_primitives.v2.validator_app.Public>> = $.array($213)

export const $644: $.Codec<types.polkadot_runtime_parachains.inclusion.AvailabilityBitfieldRecord> =
  $.object(["bitfield", $382], ["submittedAt", $4])

export const $645: $.Codec<
  types.polkadot_runtime_parachains.inclusion.CandidatePendingAvailability
> = $.object(
  ["core", $105],
  ["hash", $114],
  ["descriptor", $97],
  ["availabilityVotes", $383],
  ["backers", $383],
  ["relayParentNumber", $4],
  ["backedInNumber", $4],
  ["backingGroup", $106],
)

export const $646: $.Codec<types.polkadot_runtime_parachains.inclusion.pallet.Error> = $
  .stringUnion({
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
  [types.polkadot_primitives.v2.ValidatorIndex, types.polkadot_primitives.v2.ValidityAttestation]
> = $.tuple($385, $396)

export const $650: $.Codec<
  Array<
    [types.polkadot_primitives.v2.ValidatorIndex, types.polkadot_primitives.v2.ValidityAttestation]
  >
> = $.array($651)

export const $649: $.Codec<
  [
    types.polkadot_primitives.v2.CandidateReceipt,
    Array<
      [
        types.polkadot_primitives.v2.ValidatorIndex,
        types.polkadot_primitives.v2.ValidityAttestation,
      ]
    >,
  ]
> = $.tuple($96, $650)

export const $648: $.Codec<
  Array<
    [
      types.polkadot_primitives.v2.CandidateReceipt,
      Array<
        [
          types.polkadot_primitives.v2.ValidatorIndex,
          types.polkadot_primitives.v2.ValidityAttestation,
        ]
      >,
    ]
  >
> = $.array($649)

export const $647: $.Codec<types.polkadot_primitives.v2.ScrapedOnChainVotes> = $.object(
  ["session", $4],
  ["backingValidatorsPerCandidate", $648],
  ["disputes", $397],
)

export const $652: $.Codec<types.polkadot_runtime_parachains.paras_inherent.pallet.Error> = $
  .stringUnion({
    0: "TooManyInclusionInherents",
    1: "InvalidParentHeader",
    2: "CandidateConcludedInvalid",
    3: "InherentOverweight",
    4: "DisputeStatementsUnsortedOrDuplicates",
    5: "DisputeInvalid",
  })

export const $653: $.Codec<Array<Array<types.polkadot_primitives.v2.ValidatorIndex>>> = $.array(
  $642,
)

export const $658: $.Codec<types.polkadot_primitives.v2.ParathreadClaim> = $.tuple($98, $99)

export const $657: $.Codec<types.polkadot_primitives.v2.ParathreadEntry> = $.object(
  ["claim", $658],
  ["retries", $4],
)

export const $656: $.Codec<types.polkadot_runtime_parachains.scheduler.QueuedParathread> = $.object(
  ["claim", $657],
  ["coreOffset", $4],
)

export const $655: $.Codec<Array<types.polkadot_runtime_parachains.scheduler.QueuedParathread>> = $
  .array($656)

export const $654: $.Codec<types.polkadot_runtime_parachains.scheduler.ParathreadClaimQueue> = $
  .object(["queue", $655], ["nextCoreOffset", $4])

export const $661: $.Codec<types.polkadot_primitives.v2.CoreOccupied> = $.taggedUnion("type", {
  0: ["Parathread", ["value", $657]],
  1: ["Parachain"],
})

export const $660: $.Codec<types.polkadot_primitives.v2.CoreOccupied | undefined> = $.option($661)

export const $659: $.Codec<Array<types.polkadot_primitives.v2.CoreOccupied | undefined>> = $.array(
  $660,
)

export const $662: $.Codec<Array<types.polkadot_parachain.primitives.Id>> = $.array($98)

export const $665: $.Codec<types.polkadot_runtime_parachains.scheduler.AssignmentKind> = $
  .taggedUnion("type", { 0: ["Parachain"], 1: ["Parathread", ["value", $.tuple($99, $4)]] })

export const $664: $.Codec<types.polkadot_runtime_parachains.scheduler.CoreAssignment> = $.object(
  ["core", $105],
  ["paraId", $98],
  ["kind", $665],
  ["groupIdx", $106],
)

export const $663: $.Codec<Array<types.polkadot_runtime_parachains.scheduler.CoreAssignment>> = $
  .array($664)

export const $668: $.Codec<types.polkadot_runtime_parachains.paras.PvfCheckCause> = $.taggedUnion(
  "type",
  { 0: ["Onboarding", ["value", $98]], 1: ["Upgrade", ["id", $98], ["relayParentNumber", $4]] },
)

export const $667: $.Codec<Array<types.polkadot_runtime_parachains.paras.PvfCheckCause>> = $.array(
  $668,
)

export const $666: $.Codec<types.polkadot_runtime_parachains.paras.PvfCheckActiveVoteState> = $
  .object(["votesAccept", $383], ["votesReject", $383], ["age", $4], ["createdAt", $4], [
    "causes",
    $667,
  ])

export const $669: $.Codec<Array<types.polkadot_parachain.primitives.ValidationCodeHash>> = $.array(
  $103,
)

export const $670: $.Codec<types.polkadot_runtime_parachains.paras.ParaLifecycle> = $.stringUnion({
  0: "Onboarding",
  1: "Parathread",
  2: "Parachain",
  3: "UpgradingParathread",
  4: "DowngradingParachain",
  5: "OffboardingParathread",
  6: "OffboardingParachain",
})

export const $671: $.Codec<[types.polkadot_parachain.primitives.Id, types.u32]> = $.tuple($98, $4)

export const $674: $.Codec<types.polkadot_runtime_parachains.paras.ReplacementTimes> = $.object([
  "expectedAt",
  $4,
], ["activatedAt", $4])

export const $673: $.Codec<Array<types.polkadot_runtime_parachains.paras.ReplacementTimes>> = $
  .array($674)

export const $672: $.Codec<types.polkadot_runtime_parachains.paras.ParaPastCodeMeta> = $.object([
  "upgradeTimes",
  $673,
], ["lastPruned", $236])

export const $675: $.Codec<Array<[types.polkadot_parachain.primitives.Id, types.u32]>> = $.array(
  $671,
)

export const $676: $.Codec<types.polkadot_primitives.v2.UpgradeGoAhead> = $.stringUnion({
  0: "Abort",
  1: "GoAhead",
})

export const $677: $.Codec<types.polkadot_primitives.v2.UpgradeRestriction> = $.stringUnion({
  0: "Present",
})

export const $678: $.Codec<types.polkadot_runtime_parachains.paras.ParaGenesisArgs> = $.object(
  ["genesisHead", $104],
  ["validationCode", $394],
  ["parachain", $43],
)

export const $679: $.Codec<types.polkadot_runtime_parachains.paras.pallet.Error> = $.stringUnion({
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

export const $681: $.Codec<types.polkadot_runtime_parachains.initializer.BufferedSessionChange> = $
  .object(["validators", $643], ["queued", $643], ["sessionIndex", $4])

export const $680: $.Codec<
  Array<types.polkadot_runtime_parachains.initializer.BufferedSessionChange>
> = $.array($681)

export const $683: $.Codec<types.polkadot_core_primitives.InboundDownwardMessage> = $.object([
  "sentAt",
  $4,
], ["msg", $12])

export const $682: $.Codec<Array<types.polkadot_core_primitives.InboundDownwardMessage>> = $.array(
  $683,
)

export const $684: $.Codec<[types.polkadot_parachain.primitives.Id, Uint8Array]> = $.tuple($98, $12)

export const $685: $.Codec<types.polkadot_runtime_parachains.ump.pallet.Error> = $.stringUnion({
  0: "UnknownMessageIndex",
  1: "WeightOverLimit",
})

export const $686: $.Codec<types.polkadot_runtime_parachains.hrmp.HrmpOpenChannelRequest> = $
  .object(["confirmed", $43], ["Age", $4], ["senderDeposit", $6], ["maxMessageSize", $4], [
    "maxCapacity",
    $4,
  ], ["maxTotalSize", $4])

export const $687: $.Codec<Array<types.polkadot_parachain.primitives.HrmpChannelId>> = $.array($112)

export const $689: $.Codec<types.primitive_types.H256 | undefined> = $.option($11)

export const $688: $.Codec<types.polkadot_runtime_parachains.hrmp.HrmpChannel> = $.object(
  ["maxCapacity", $4],
  ["maxTotalSize", $4],
  ["maxMessageSize", $4],
  ["msgCount", $4],
  ["totalSize", $4],
  ["mqcHead", $689],
  ["senderDeposit", $6],
  ["recipientDeposit", $6],
)

export const $691: $.Codec<types.polkadot_core_primitives.InboundHrmpMessage> = $.object([
  "sentAt",
  $4,
], ["data", $12])

export const $690: $.Codec<Array<types.polkadot_core_primitives.InboundHrmpMessage>> = $.array($691)

export const $693: $.Codec<[types.u32, Array<types.polkadot_parachain.primitives.Id>]> = $.tuple(
  $4,
  $662,
)

export const $692: $.Codec<Array<[types.u32, Array<types.polkadot_parachain.primitives.Id>]>> = $
  .array($693)

export const $694: $.Codec<types.polkadot_runtime_parachains.hrmp.pallet.Error> = $.stringUnion({
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

export const $695: $.Codec<Array<types.polkadot_primitives.v2.assignment_app.Public>> = $.array(
  $214,
)

export const $697: $.Codec<Array<types.sp_authority_discovery.app.Public>> = $.array($215)

export const $696: $.Codec<types.polkadot_primitives.v2.SessionInfo> = $.object(
  ["activeValidatorIndices", $642],
  ["randomSeed", $1],
  ["disputePeriod", $4],
  ["validators", $643],
  ["discoveryKeys", $697],
  ["assignmentKeys", $695],
  ["validatorGroups", $653],
  ["nCores", $4],
  ["zerothDelayTrancheWidth", $4],
  ["relayVrfModuloSamples", $4],
  ["nDelayTranches", $4],
  ["noShowSlots", $4],
  ["neededApprovals", $4],
)

export const $698: $.Codec<[types.u32, types.polkadot_core_primitives.CandidateHash]> = $.tuple(
  $4,
  $114,
)

export const $699: $.Codec<types.polkadot_primitives.v2.DisputeState> = $.object(
  ["validatorsFor", $383],
  ["validatorsAgainst", $383],
  ["start", $4],
  ["concludedAt", $236],
)

export const $700: $.Codec<types.polkadot_runtime_parachains.disputes.pallet.Error> = $.stringUnion(
  {
    0: "DuplicateDisputeStatementSets",
    1: "AncientDisputeStatement",
    2: "ValidatorIndexOutOfBounds",
    3: "InvalidSignature",
    4: "DuplicateStatement",
    5: "PotentialSpam",
    6: "SingleSidedDispute",
  },
)

export const $701: $.Codec<types.polkadot_runtime_common.paras_registrar.ParaInfo> = $.object(
  ["manager", $0],
  ["deposit", $6],
  ["locked", $43],
)

export const $702: $.Codec<types.polkadot_runtime_common.paras_registrar.pallet.Error> = $
  .stringUnion({
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

export const $703: $.Codec<Array<[types.sp_core.crypto.AccountId32, types.u128] | undefined>> = $
  .array($452)

export const $704: $.Codec<types.polkadot_runtime_common.slots.pallet.Error> = $.stringUnion({
  0: "ParaNotOnboarding",
  1: "LeaseError",
})

export const $705: $.Codec<
  [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id]
> = $.tuple($0, $98)

export const $708: $.Codec<
  [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
> = $.tuple($0, $98, $6)

export const $707: $.Codec<
  [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128] | undefined
> = $.option($708)

export const $706: $.Codec<
  [
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
    | [types.sp_core.crypto.AccountId32, types.polkadot_parachain.primitives.Id, types.u128]
    | undefined,
  ]
> = $.sizedArray($707, 36)

export const $709: $.Codec<types.polkadot_runtime_common.auctions.pallet.Error> = $.stringUnion({
  0: "AuctionInProgress",
  1: "LeasePeriodInPast",
  2: "ParaNotRegistered",
  3: "NotCurrentAuction",
  4: "NotAuction",
  5: "AuctionEnded",
  6: "AlreadyLeasedOut",
})

export const $711: $.Codec<types.polkadot_runtime_common.crowdloan.LastContribution> = $
  .taggedUnion("type", {
    0: ["Never"],
    1: ["PreEnding", ["value", $4]],
    2: ["Ending", ["value", $4]],
  })

export const $710: $.Codec<types.polkadot_runtime_common.crowdloan.FundInfo> = $.object(
  ["depositor", $0],
  ["verifier", $416],
  ["deposit", $6],
  ["raised", $6],
  ["end", $4],
  ["cap", $6],
  ["lastContribution", $711],
  ["firstPeriod", $4],
  ["lastPeriod", $4],
  ["fundIndex", $4],
)

export const $712: $.Codec<types.polkadot_runtime_common.crowdloan.pallet.Error> = $.stringUnion({
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

export const $715: $.Codec<[types.u8, types.u8]> = $.tuple($2, $2)

export const $714: $.Codec<[types.u8, types.u8] | undefined> = $.option($715)

export const $716: $.Codec<types.xcm.VersionedResponse> = $.taggedUnion("type", {
  0: ["V0", ["value", $429]],
  1: ["V1", ["value", $434]],
  2: ["V2", ["value", $140]],
})

export const $713: $.Codec<types.pallet_xcm.pallet.QueryStatus> = $.taggedUnion("type", {
  0: ["Pending", ["responder", $155], ["maybeNotify", $714], ["timeout", $4]],
  1: ["VersionNotifier", ["origin", $155], ["isActive", $43]],
  2: ["Ready", ["response", $716], ["at", $4]],
})

export const $717: $.Codec<[types.u32, types.xcm.VersionedMultiLocation]> = $.tuple($4, $155)

export const $718: $.Codec<[types.u64, types.u64, types.u32]> = $.tuple($10, $10, $4)

export const $720: $.Codec<[types.xcm.VersionedMultiLocation, types.u32]> = $.tuple($155, $4)

export const $721: $.Codec<Array<[types.xcm.VersionedMultiLocation, types.u32]>> = $.array($720)

export const $719: $.Codec<Array<[types.xcm.VersionedMultiLocation, types.u32]>> = $721

export const $723: $.Codec<Uint8Array | undefined> = $.option($12)

export const $722: $.Codec<types.pallet_xcm.pallet.VersionMigrationStage> = $.taggedUnion("type", {
  0: ["MigrateSupportedVersion"],
  1: ["MigrateVersionNotifiers"],
  2: ["NotifyCurrentTargets", ["value", $723]],
  3: ["MigrateAndNotifyOldTargets"],
})

export const $724: $.Codec<types.pallet_xcm.pallet.Error> = $.stringUnion({
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

export const $727: $.Codec<types.frame_system.extensions.check_non_zero_sender.CheckNonZeroSender> =
  C.$null

export const $728: $.Codec<types.frame_system.extensions.check_spec_version.CheckSpecVersion> =
  C.$null

export const $729: $.Codec<types.frame_system.extensions.check_tx_version.CheckTxVersion> = C.$null

export const $730: $.Codec<types.frame_system.extensions.check_genesis.CheckGenesis> = C.$null

export const $732: $.Codec<C.Era> = C.$era

export const $731: $.Codec<types.frame_system.extensions.check_mortality.CheckMortality> = $732

export const $733: $.Codec<types.frame_system.extensions.check_nonce.CheckNonce> = $125

export const $734: $.Codec<types.frame_system.extensions.check_weight.CheckWeight> = C.$null

export const $735: $.Codec<types.pallet_transaction_payment.ChargeTransactionPayment> = $58

export const $736: $.Codec<types.polkadot_runtime_common.claims.PrevalidateAttests> = C.$null

export const $726: $.Codec<
  [
    types.frame_system.extensions.check_non_zero_sender.CheckNonZeroSender,
    types.frame_system.extensions.check_spec_version.CheckSpecVersion,
    types.frame_system.extensions.check_tx_version.CheckTxVersion,
    types.frame_system.extensions.check_genesis.CheckGenesis,
    types.frame_system.extensions.check_mortality.CheckMortality,
    types.frame_system.extensions.check_nonce.CheckNonce,
    types.frame_system.extensions.check_weight.CheckWeight,
    types.pallet_transaction_payment.ChargeTransactionPayment,
    types.polkadot_runtime_common.claims.PrevalidateAttests,
  ]
> = $.tuple($727, $728, $729, $730, $731, $733, $734, $735, $736)

export const $737: $.Codec<types.polkadot_runtime.Runtime> = C.$null

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
