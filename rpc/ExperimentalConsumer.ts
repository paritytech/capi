import { hex } from "../crypto/mod.ts"
import { Deferred, deferred } from "../deps/std/async.ts"
import { Connection } from "./Connection.ts"
import { Consumer } from "./Consumer.ts"
import { ExtrinsicStatus } from "./ExtrinsicStatus.ts"
import * as known from "./known/mod.ts"
import { LegacyConsumer } from "./LegacyConsumer.ts"

export class ExperimentalConsumer extends Consumer {
  archiveConsumer

  constructor(
    connection: Connection,
    readonly archiveConnection: Connection,
    readonly signal: AbortSignal,
  ) {
    super(connection)
    this.archiveConsumer = new LegacyConsumer(archiveConnection)
    this.follow()
  }

  follow() {
    this.subscription<known.ChainHeadUnstableFollowEvent>(
      "chainHead_unstable_follow",
      "chainHead_unstable_unfollow",
      [true],
      (event, subscriptionId) => {
        if (event.event === "initialized") {
          const { finalizedBlockRuntime, finalizedHash } = event
          if (!finalizedBlockRuntime || finalizedBlockRuntime.type === "invalid") {
            throw new FinalizedBlockRuntimeInvalidError()
          }
          const incompatibleRuntime = !finalizedBlockRuntime.spec.apis.find(
            ([k, v]) => k === "0xd2bc9897eed08f15" && v === 3,
          )
          if (incompatibleRuntime) throw new IncompatibleRuntimeError()
          this.flushQueue(finalizedHash, subscriptionId)
        } else if (event.event === "finalized") {
          const finalizedHashesLeading = event.finalizedHashes.slice(0, -1)
          ;[...finalizedHashesLeading, ...event.prunedBlockHashes].map((blockHash) =>
            this.connection.call("chainHead_unstable_unpin", [subscriptionId, blockHash])
          )
          const finalizedHash = event.finalizedHashes.at(-1)!
          this.flushQueue(finalizedHash, subscriptionId)
        } else if (event.event === "stop") this.follow()
      },
      this.signal,
    )
  }

  flushQueue(hash: string, followId: string) {
    this.blockHashPendings.forEach((pending) => pending.resolve(hash))
    this.flushHeadMetadataPending(hash, followId, this.signal)
  }

  stateCallPendings: Record<string, Record<string, Deferred<unknown>[]>> = {}
  stateCall(method: string, args: Uint8Array, blockHash?: string) {
    if (blockHash) return this.archiveConsumer.stateCall(method, args, blockHash)
    const methodPendings = this.stateCallPendings[method] ??= {}
    const pending = deferred<Uint8Array>()
    const argsPendings = methodPendings[hex.encode(args)] ??= []
    argsPendings.push(pending)
    return pending
  }

  metadataPendings: Deferred<Uint8Array>[] = []
  metadata(blockHash?: string) {
    if (blockHash) return this.archiveConsumer.metadata(blockHash)
    const pending = deferred<Uint8Array>()
    this.metadataPendings.push(pending)
    return pending
  }

  blockHashPendings: Deferred<string>[] = []
  blockHash(blockNumber?: number) {
    if (typeof blockNumber === "number") return this.archiveConsumer.blockHash(blockNumber)
    const pending = deferred<string>()
    this.blockHashPendings.push(pending)
    return pending
  }

  blockPendings: Deferred<known.SignedBlock>[] = []
  block(blockHash?: string) {
    if (blockHash) return this.archiveConsumer.block(blockHash)
    const pending = deferred<known.SignedBlock>()
    this.blockPendings.push(pending)
    return pending
  }

  keys(key: Uint8Array, limit: number, start?: Uint8Array, blockHash?: string) {
    return this.archiveConsumer.keys(key, limit, start, blockHash)
  }

  valuesPendings: Deferred<Uint8Array[]>[] = []
  values(keys: Uint8Array[], blockHash?: string) {
    if (blockHash) return this.archiveConsumer.values(keys, blockHash)
    const pending = deferred<Uint8Array[]>()
    this.valuesPendings.push(pending)
    return pending
  }

  nonce(ss58Address: string) {
    return this.archiveConsumer.nonce(ss58Address)
  }

  submitExtrinsic(
    extrinsic: Uint8Array,
    handler: (status: ExtrinsicStatus) => void,
    signal: AbortSignal,
  ) {
    this.subscription<known.TransactionWatchEvent>(
      "transaction_unstable_submitAndWatch",
      "transaction_unstable_unwatch",
      [extrinsic],
      (event) => {
        handler(((): ExtrinsicStatus => {
          switch (event.event) {
            case "validated":
              return { type: "validated" }
            case "invalid":
              return {
                type: "invalidated",
                reason: event.error,
              }
            case "broadcasted":
              return {
                type: "broadcasted",
                numPeers: event.numPeers,
              }
            case "bestChainBlockIncluded":
              return {
                type: "included",
                block: event.block,
              }
            case "dropped":
              return {
                type: "dropped",
                broadcasted: event.broadcasted,
                reason: event.error,
              }
            case "finalized":
              return {
                type: "finalized",
                block: event.block,
              }
            case "error":
              return {
                type: "errored",
                message: event.error,
              }
          }
        })())
      },
      signal,
    )
  }

  // stateCall(method: string, args: Uint8Array, blockHash?: string) {
  //   if (blockHash) return this.archiveConsumer.stateCall(method, args, blockHash)
  //   const controller = new AbortController()
  //   this.subscription<{ event: "done"; output: string }>(
  //     "chainHead_unstable_call",
  //     undefined,
  //     [followId, blockHash],
  //     (event) => {
  //       if (event.event === "done") {
  //         const metadata = hex.decode(event.output)
  //         this.headMetadataPending.forEach((pending) => pending.resolve(metadata))
  //       } else {
  //         this.headMetadataPending.forEach((pending) => pending.reject())
  //       }
  //       controller.abort()
  //     },
  //     controller.signal,
  //   )
  // }

  flushHeadMetadataPending(
    blockHash: string,
    followId: string,
    signal: AbortSignal,
  ) {
    if (this.metadataPendings.length) {
      this.subscription<{ event: "done"; output: string }>(
        "chainHead_unstable_call",
        "chainHead_unstable_stopCall",
        [followId, blockHash],
        (event) => {
          if (event.event === "done") {
            const metadata = hex.decode(event.output)
            this.metadataPendings.forEach((pending) => pending.resolve(metadata))
          } else {
            this.metadataPendings.forEach((pending) => pending.reject())
          }
        },
        signal,
      )
    }
  }

  private async valuesLatest(keys: Uint8Array[]) {
    return null!
    // const pending = deferred<unknown>()
    // const controller = new AbortController()
    // this.subscription(
    //   "chainHead_unstable_storage",
    //   "chainHead_unstable_stopStorage",
    //   [
    //     this.followId,
    //     this.#finalizedBlockHash,
    //     keys.map((key) => ({ key: hex.encodePrefixed(key), type: "value" })),
    //     null,
    //   ],
    //   (message) => {
    //     pending.resolve(message)
    //     controller.abort()
    //   },
    //   controller.signal,
    // )
    // return pending as any
  }
}

class FinalizedBlockRuntimeInvalidError extends Error {
  override readonly name = "FinalizedBlockRuntimeInvalidError"
}
class IncompatibleRuntimeError extends Error {
  override readonly name = "IncompatibleRuntimeError"
}
