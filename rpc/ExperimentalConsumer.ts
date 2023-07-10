export {}

// import { deferred } from "../deps/std/async.ts"
// import { Consumer } from "./Consumer.ts"
// import * as known from "./known/mod.ts"
// import { RpcSubscriptionMessage } from "./rpc_messages.ts"

// export class ExperimentalConsumer extends Consumer {
//   declare followId?: string
//   follow(signal: AbortSignal) {
//     this.connection.subscription(
//       "chainHead_unstable_follow",
//       "chainHead_unstable_unfollow",
//       [true],
//       (message) => {
//         const event = RpcSubscriptionMessage.unwrap<known.ChainHeadUnstableFollowEvent>(message)
//         switch (event.event) {
//           case "initialized": {
//             this.followId = message.params?.subscription
//             return this.initialized(event, signal)
//           }
//           case "newBlock":
//             return this.newBlock(event)
//           case "bestBlockChanged":
//             return this.bestBlockChanged(event)
//           case "finalized":
//             return this.finalized(event)
//           case "stop": {
//             delete this.followId
//             this.stop(event, signal)
//           }
//         }
//       },
//       signal,
//     )
//   }

//   _metadata = deferred<string>()
//   initialized(event: known.ChainHeadUnstableFollowEvent.Initialized, signal: AbortSignal) {
//     const { finalizedBlockRuntime } = event
//     if (!finalizedBlockRuntime || finalizedBlockRuntime.type === "invalid") {
//       throw new FinalizedBlockRuntimeInvalidError()
//     }
//     if (finalizedBlockRuntime.spec.apis["0xd2bc9897eed08f15"] !== 3) {
//       throw new IncompatibleRuntimeError()
//     }
//     this.connection.subscription(
//       "chainHead_unstable_call",
//       "chainHead_unstable_stopCall",
//       [this.followId, event.finalizedBlockHash, "Metadata_metadata", ""],
//       (callMessage) => {
//         // TODO: type these
//         const event = RpcSubscriptionMessage.unwrap<{ event: "done"; output: string }>(callMessage)
//         if (event.event !== "done") {} // TODO: retries
//         this._metadata.resolve(event.output)
//       },
//       signal,
//     )
//   }

//   newBlock(event: known.ChainHeadUnstableFollowEvent.NewBlock) {
//     console.log(event)
//   }

//   bestBlockChanged(event: known.ChainHeadUnstableFollowEvent.BestBlockChanged) {
//     console.log(event)
//   }

//   _finalized = deferred<string>()
//   finalized(event: known.ChainHeadUnstableFollowEvent.Finalized) {
//     console.log(event)
//     const finalizedBlockHashLeading = event.finalizedBlockHashes.slice(0, -1)
//     ;[
//       ...finalizedBlockHashLeading,
//       ...event.prunedBlockHashes,
//     ].map((blockHash) =>
//       this.connection.call("chainHead_unstable_unpin", [this.followId, blockHash])
//     )
//     this._finalized.resolve(event.finalizedBlockHashes.at(-1)!)
//   }

//   stop(event: known.ChainHeadUnstableFollowEvent.Stop, signal: AbortSignal) {
//     console.log(event)
//     this.followId = undefined!
//     this.follow(signal)
//   }
// }

// class FinalizedBlockRuntimeInvalidError extends Error {
//   override readonly name = "FinalizedBlockRuntimeInvalidError"
// }
// class IncompatibleRuntimeError extends Error {
//   override readonly name = "IncompatibleRuntimeError"
// }

// // this.connection.subscription(
// //   "chainHead_unstable_storage",
// //   "chainHead_unstable_stopStorage",
// //   [
// //     this.followId,
// //     finalizedBlockHash,
// //     [{
// //       key: "0xf0c365c3cf59d671eb72da0e7a4113c49f1f0515f462cdcf84e0f1d6045dfcbb",
// //       type: "value",
// //     }],
// //     null,
// //   ],
// //   (message) => {},
// //   this.signal,
// // )
