import { hex } from "../crypto/mod.ts"
import { Deferred, deferred } from "../deps/std/async.ts"
import { Connect } from "./Connection.ts"
import { Consumer } from "./Consumer.ts"
import { ExtrinsicStatus } from "./ExtrinsicStatus.ts"
import * as known from "./known/mod.ts"
import { LegacyConsumer } from "./LegacyConsumer.ts"

export class ExperimentalConsumer extends Consumer {
  archiveConsumer

  constructor(
    connection: Connect,
    signal: AbortSignal,
    readonly archiveConnect: Connect,
  ) {
    super(connection, signal)
    this.archiveConsumer = new LegacyConsumer(archiveConnect, signal)
    this.follow()
  }

  follow() {
    this.subscription<known.ChainHeadUnstableFollowEvent>(
      "chainHead_unstable_follow",
      "chainHead_unstable_unfollow",
      [true],
      (event, subscriptionId) => {
        if (event.event === "initialized") {
          const { finalizedBlockRuntime } = event
          if (!finalizedBlockRuntime || finalizedBlockRuntime.type === "invalid") {
            throw new FinalizedBlockRuntimeInvalidError()
          }
          const incompatibleRuntime = !finalizedBlockRuntime.spec.apis.find(
            ([k, v]) => k === "0xd2bc9897eed08f15" && v === 3,
          )
          if (incompatibleRuntime) throw new IncompatibleRuntimeError()
        } else if (event.event === "finalized") {
          const finalizedHashesLeading = event.finalizedBlockHashes.slice(0, -1)
          ;[...finalizedHashesLeading, ...event.prunedBlockHashes].map((blockHash) =>
            this.connection.call("chainHead_unstable_unpin", [subscriptionId, blockHash])
          )
          const finalizedHash = event.finalizedBlockHashes.at(-1)!
          this.stateCallFlush(subscriptionId, finalizedHash)
          this.blockHashPendings.forEach((pending) => pending.resolve(finalizedHash))
          this.blockFlush(subscriptionId, finalizedHash)
          this.extrinsicsFlush(subscriptionId, finalizedHash)
          this.valuesFlush(subscriptionId, finalizedHash)
        } else if (event.event === "stop") this.follow()
      },
      this.signal,
    )
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
  stateCallFlush(followId: string, blockHash: string) {
    Object.entries(this.stateCallPendings).forEach(([method, argPendings]) => {
      Object.entries(argPendings).forEach(([args, pendings]) => {
        const controller = new AbortController()
        this.subscription<{ event: "done"; output: string }>(
          "chainHead_unstable_call",
          undefined,
          [followId, blockHash, method, args],
          (event) => {
            delete argPendings[args]
            if (!Object.values(argPendings).length) delete this.stateCallPendings[method]
            const metadata = hex.decode(event.output)
            pendings.forEach((pending) => pending.resolve(metadata))
            controller.abort()
          },
          controller.signal,
        )
      })
    })
  }

  metadata(blockHash?: string) {
    if (blockHash) return this.archiveConsumer.metadata(blockHash)
    return this.stateCall("Metadata_metadata", new Uint8Array())
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
  blockFlush(followId: string, blockHash: string) {
    if (this.blockPendings.length) {
      const controller = new AbortController()
      // TODO: why not emitting?
      this.subscription("chainHead_unstable_body", undefined, [followId, blockHash], (_result) => {
        while (this.blockPendings.length) {
          const blockPending = this.blockPendings.shift()!
          blockPending.resolve(null!)
        }
      }, controller.signal)
    }
  }

  extrinsicsPendings: Deferred<Uint8Array>[] = []
  extrinsics(blockHash?: string) {
    if (blockHash) return this.archiveConsumer.block(blockHash)
    const pending = deferred<Uint8Array>()
    this.extrinsicsPendings.push(pending)
    return pending
  }
  extrinsicsFlush(followId: string, blockHash: string) {
    if (this.extrinsicsPendings.length) {
      const controller = new AbortController()
      this.subscription<{ event: "done"; result: string }>(
        "chainHead_unstable_body",
        undefined,
        [followId, blockHash],
        (result) => {
          while (this.extrinsicsPendings.length) {
            const blockPending = this.extrinsicsPendings.shift()!
            blockPending.resolve(hex.decode(result.result))
          }
        },
        controller.signal,
      )
    }
  }

  keys(key: Uint8Array, limit: number, start?: Uint8Array, blockHash?: string) {
    return this.archiveConsumer.keys(key, limit, start, blockHash)
  }

  valuesKeys: Record<string, true> = {}
  valuesPendings: [keys: string[], pending: Deferred<Uint8Array[]>][] = []
  values(keys: Uint8Array[], blockHash?: string) {
    if (blockHash) return this.archiveConsumer.values(keys, blockHash)
    const keysEncoded = keys.map((key) => {
      const encoded = hex.encodePrefixed(key)
      this.valuesKeys[encoded] = true
      return encoded
    })
    const pending = deferred<Uint8Array[]>()
    this.valuesPendings.push([keysEncoded, pending])
    return pending
  }
  valuesFlush(followId: string, blockHash: string) {
    const keys = Object.entries(this.valuesKeys)
    if (keys.length) {
      const items = keys.map((key) => ({ key, type: "value" }))
      const controller = new AbortController()
      this.subscription<{ event: "items"; items: { key: string; value: string }[] }>(
        "chainHead_unstable_storage",
        "chainHead_unstable_stopStorage",
        [followId, blockHash, items, null],
        (message) => {
          const lookup = Object.fromEntries(message.items.map(({ key, value }) => [key, value]))
          while (this.valuesPendings.length) {
            const valuesPending = this.valuesPendings.shift()!
            const [keys, pending] = valuesPending
            pending.resolve(keys.map((key) => hex.decode(lookup[key]!)))
          }
          this.valuesKeys = {}
          controller.abort()
        },
        controller.signal,
      )
    }
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
}

class FinalizedBlockRuntimeInvalidError extends Error {
  override readonly name = "FinalizedBlockRuntimeInvalidError"
}
class IncompatibleRuntimeError extends Error {
  override readonly name = "IncompatibleRuntimeError"
}
