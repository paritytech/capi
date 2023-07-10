// import { ExperimentalConsumer, SmoldotConnection } from "capi"

// const relayChainSpec = Deno.readTextFileSync("examples/smoldot/spec.json")

// const client = new ExperimentalConsumer(new SmoldotConnection({ relayChainSpec }))

// const controller = new AbortController()
// const { signal } = controller
// client.follow(signal)

// const signal = new AbortSignal()
// const connection = SmoldotConnection.connect({ relayChainSpec }, signal)
// await connection.ready()
// const result = await connection.call("rpc_methods", [])
// console.log(result)

// const { block } = await polkadot.blockHash().block().run()

// console.log(block)
// $.assert(known.$block, block)

// const smoldot = SmoldotConnection.connect()

// "account_nextIndex",
// "author_hasKey",
// "author_hasSessionKeys",
// "author_insertKey",
// "author_pendingExtrinsics",
// "author_removeExtrinsic",
// "author_rotateKeys",
// "author_submitAndWatchExtrinsic",
// "author_submitExtrinsic",
// "author_unwatchExtrinsic",
// "babe_epochAuthorship",
// "chain_getBlock",
// "chain_getBlockHash",
// "chain_getFinalizedHead",
// "chain_getHeader",
// "chain_subscribeAllHeads",
// "chain_subscribeFinalizedHeads",
// "chain_subscribeNewHeads",
// "chain_unsubscribeAllHeads",
// "chain_unsubscribeFinalizedHeads",
// "chain_unsubscribeNewHeads",
// "childstate_getKeys",
// "childstate_getStorage",
// "childstate_getStorageHash",
// "childstate_getStorageSize",
// "grandpa_roundState",
// "offchain_localStorageGet",
// "offchain_localStorageSet",
// "payment_queryInfo",
// "rpc_methods",
// "state_call",
// "state_getKeys",
// "state_getKeysPaged",
// "state_getMetadata",
// "state_getPairs",
// "state_getReadProof",
// "state_getRuntimeVersion",
// "state_getStorage",
// "state_getStorageHash",
// "state_getStorageSize",
// "state_queryStorage",
// "state_queryStorageAt",
// "state_subscribeRuntimeVersion",
// "state_subscribeStorage",
// "state_unsubscribeRuntimeVersion",
// "state_unsubscribeStorage",
// "system_accountNextIndex",
// "system_addReservedPeer",
// "system_chain",
// "system_chainType",
// "system_dryRun",
// "system_health",
// "system_localListenAddresses",
// "system_localPeerId",
// "system_name",
// "system_networkState",
// "system_nodeRoles",
// "system_peers",
// "system_properties",
// "system_removeReservedPeer",
// "system_version",
// "chainHead_unstable_body",
// "chainHead_unstable_call",
// "chainHead_unstable_follow",
// "chainHead_unstable_genesisHash",
// "chainHead_unstable_header",
// "chainHead_unstable_stopBody",
// "chainHead_unstable_stopCall",
// "chainHead_unstable_stopStorage",
// "chainHead_unstable_storage",
// "chainHead_unstable_storageContinue",
// "chainHead_unstable_unfollow",
// "chainHead_unstable_unpin",
// "chainSpec_unstable_chainName",
// "chainSpec_unstable_genesisHash",
// "chainSpec_unstable_properties",
// "sudo_unstable_p2pDiscover",
// "sudo_unstable_version",
// "transaction_unstable_submitAndWatch",
// "transaction_unstable_unwatch",
// "network_unstable_subscribeEvents",
// "network_unstable_unsubscribeEvents",
// "chainHead_unstable_finalizedDatabase"

class FinalizedBlockRuntimeInvalidError extends Error {
  override readonly name = "FinalizedBlockRuntimeInvalidError"
}
class IncompatibleRuntimeError extends Error {
  override readonly name = "IncompatibleRuntimeError"
}
