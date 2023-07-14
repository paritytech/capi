import { hex } from "../crypto/mod.ts"
import { deferred } from "../deps/std/async.ts"
import { Connection } from "./Connection.ts"
import { Consumer } from "./Consumer.ts"
import * as known from "./known/mod.ts"

export class ExperimentalConsumer extends Consumer {
  #controller = new AbortController()
  #followId?: string
  #finalizedBlockHash?: string
  #ready = deferred<void>()

  constructor(connection: Connection) {
    super(connection)
    this.follow()
  }

  private follow() {
    this.subscription<known.ChainHeadUnstableFollowEvent>(
      "chainHead_unstable_follow",
      "chainHead_unstable_unfollow",
      [true],
      (event, subscriptionId) => this[event.event](event as never, subscriptionId),
      this.#controller.signal,
    )
  }

  private initialized(
    event: known.ChainHeadUnstableFollowEvent.Initialized,
    subscriptionId: string,
  ) {
    const { finalizedBlockRuntime, finalizedBlockHash } = event
    if (!finalizedBlockRuntime || finalizedBlockRuntime.type === "invalid") {
      throw new FinalizedBlockRuntimeInvalidError()
    }
    if (!finalizedBlockRuntime.spec.apis.find(([k, v]) => k === "0xd2bc9897eed08f15" && v === 3)) {
      throw new IncompatibleRuntimeError()
    }
    this.#followId = subscriptionId
    this.#finalizedBlockHash = finalizedBlockHash
    this.#ready.resolve()
  }

  private newBlock(_event: known.ChainHeadUnstableFollowEvent.NewBlock) {}

  private bestBlockChanged(_: known.ChainHeadUnstableFollowEvent.BestBlockChanged) {}

  private finalized(event: known.ChainHeadUnstableFollowEvent.Finalized) {
    const finalizedBlockHashLeading = event.finalizedBlockHashes.slice(0, -1)
    ;[...finalizedBlockHashLeading, ...event.prunedBlockHashes].map((blockHash) =>
      this.connection.call("chainHead_unstable_unpin", [this.#followId, blockHash])
    )
    this.#finalizedBlockHash = event.finalizedBlockHashes.at(-1)!
  }

  private stop() {
    this.#followId = undefined!
    this.#finalizedBlockHash = undefined!
    this.follow()
  }

  async metadata() {
    await this.#ready
    const pending = deferred<Uint8Array>()
    const controller = new AbortController()
    this.subscription<{ event: "done"; output: string }>(
      "chainHead_unstable_call",
      "chainHead_unstable_stopCall",
      [this.#followId, this.#finalizedBlockHash],
      (event) =>
        (event.event === "done")
          ? pending.resolve(hex.decode(event.output))
          : pending.reject(),
      controller.signal,
    )
    return await pending
  }

  values(keys: Uint8Array[], blockHash?: string) {
    return blockHash ? this.valuesAt(keys, blockHash) : this.valuesLatest(keys)
  }

  private async valuesLatest(keys: Uint8Array[]) {
    await this.#ready
    const pending = deferred<unknown>()
    const controller = new AbortController()
    this.subscription(
      "chainHead_unstable_storage",
      "chainHead_unstable_stopStorage",
      [
        this.#followId,
        this.#finalizedBlockHash,
        keys.map((key) => ({ key: hex.encodePrefixed(key), type: "value" })),
        null,
      ],
      (message) => {
        pending.resolve(message)
        controller.abort()
      },
      controller.signal,
    )
    return pending as any
  }

  private valuesAt(keys: Uint8Array[], blockHash?: string) {
    return undefined!
  }
}

class FinalizedBlockRuntimeInvalidError extends Error {
  override readonly name = "FinalizedBlockRuntimeInvalidError"
}
class IncompatibleRuntimeError extends Error {
  override readonly name = "IncompatibleRuntimeError"
}
