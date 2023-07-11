import { hex } from "../crypto/mod.ts"
import { deferred } from "../deps/std/async.ts"
import { Connection } from "./Connection.ts"
import { Consumer } from "./Consumer.ts"
import * as known from "./known/mod.ts"

export class ExperimentalConsumer extends Consumer {
  followId?: string
  finalizedBlockHash?: string

  constructor(connection: Connection) {
    super(connection)
    this.follow()
  }

  follow() {
    const controller = new AbortController()
    this.subscription<known.ChainHeadUnstableFollowEvent>(
      "chainHead_unstable_follow",
      "chainHead_unstable_unfollow",
      [true],
      (event, subscriptionId) => this[event.event](event as never, subscriptionId),
      controller.signal,
    )
  }

  initialized(event: known.ChainHeadUnstableFollowEvent.Initialized, subscriptionId: string) {
    const { finalizedBlockRuntime, finalizedBlockHash } = event
    if (!finalizedBlockRuntime || finalizedBlockRuntime.type === "invalid") {
      throw new FinalizedBlockRuntimeInvalidError()
    }
    if (finalizedBlockRuntime.spec.apis["0xd2bc9897eed08f15"] !== 3) {
      throw new IncompatibleRuntimeError()
    }
    this.followId = subscriptionId
    this.finalizedBlockHash = finalizedBlockHash
  }

  newBlock(_event: known.ChainHeadUnstableFollowEvent.NewBlock) {}
  bestBlockChanged(_: known.ChainHeadUnstableFollowEvent.BestBlockChanged) {}

  finalized(event: known.ChainHeadUnstableFollowEvent.Finalized) {
    const finalizedBlockHashLeading = event.finalizedBlockHashes.slice(0, -1)
    ;[
      ...finalizedBlockHashLeading,
      ...event.prunedBlockHashes,
    ].map((blockHash) =>
      this.connection.call("chainHead_unstable_unpin", [this.followId, blockHash])
    )
    this.finalizedBlockHash = event.finalizedBlockHashes.at(-1)!
  }

  stop() {
    this.followId = undefined!
    this.finalizedBlockHash = undefined!
    this.follow()
  }

  metadata() {
    const pending = deferred<Uint8Array>()
    const controller = new AbortController()
    this.subscription<{ event: "done"; output: string }>(
      "chainHead_unstable_call",
      "chainHead_unstable_stopCall",
      [this.followId, this.finalizedBlockHash],
      (event) => {
        if (event.event === "done") return pending.resolve(hex.decode(event.output))
        pending.reject("TODO: retries")
      },
      controller.signal,
    )
    return pending
  }

  values(keys: Uint8Array[], _blockHash?: string) {
    const pending = deferred<unknown>()
    const controller = new AbortController()
    this.subscription(
      "chainHead_unstable_storage",
      "chainHead_unstable_stopStorage",
      [
        this.followId,
        this.finalizedBlockHash,
        keys.map((key) => ({ key: hex.encodePrefixed(key), type: "value" })),
        null,
      ],
      (message) => {
        console.log(message)
        pending.resolve(message)
        controller.abort()
      },
      controller.signal,
    )
    return pending as any
  }
}

class FinalizedBlockRuntimeInvalidError extends Error {
  override readonly name = "FinalizedBlockRuntimeInvalidError"
}
class IncompatibleRuntimeError extends Error {
  override readonly name = "IncompatibleRuntimeError"
}
