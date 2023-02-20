import { Deferred, deferred } from "../deps/std/async.ts"
import { getOrInit } from "../util/mod.ts"
import { RpcCallMessage, RpcIngressMessage, RpcSubscriptionHandler } from "./rpc_messages.ts"

const connectionMemos = new Map<new(discovery: any) => Connection, Map<unknown, Connection>>()

export abstract class Connection {
  nextId = 0
  references = 0
  signal
  #controller

  constructor() {
    this.#controller = new AbortController()
    this.signal = this.#controller.signal
  }

  static connect<D>(
    this: new(discovery: D) => Connection,
    discovery: D,
    signal: AbortSignal,
  ) {
    const memo = getOrInit(connectionMemos, this, () => new Map())
    return getOrInit(memo, discovery, () => {
      const connection = new this(discovery)
      connection.ref(signal)
      connection.signal.addEventListener("abort", () => {
        memo.delete(discovery)
      })
      return connection
    })
  }

  ref(signal: AbortSignal) {
    this.references++
    signal.addEventListener("abort", () => {
      if (!--this.references) {
        this.#controller.abort()
        this.close()
      }
    })
  }

  abstract ready(): Promise<void>

  abstract send(
    id: number,
    method: string,
    params: unknown,
  ): void

  protected abstract close(): void

  callResultPendings: Record<number, Deferred<RpcCallMessage>> = {}
  async call(method: string, params: unknown[]) {
    await this.ready()
    const id = this.nextId++
    const pending = deferred<RpcCallMessage>()
    this.callResultPendings[id] = pending
    this.send(id, method, params)
    return await pending
  }

  subscriptionInitPendings: Record<number, RpcSubscriptionHandler> = {}
  subscriptionHandlers: Record<string, RpcSubscriptionHandler> = {}
  subscriptionIdByRpcMessageId: Record<number, string> = {}
  subscription(
    subscribe: string,
    unsubscribe: string,
    params: unknown[],
    handler: RpcSubscriptionHandler,
    signal: AbortSignal,
  ) {
    ;(async () => {
      await this.ready()
      const subscribeId = this.nextId++
      this.subscriptionInitPendings[subscribeId] = handler as RpcSubscriptionHandler
      signal.addEventListener("abort", () => {
        delete this.subscriptionInitPendings[subscribeId]
        const subscriptionId = this.subscriptionIdByRpcMessageId[subscribeId]
        if (subscriptionId) {
          delete this.subscriptionIdByRpcMessageId[subscribeId]
          this.send(this.nextId++, unsubscribe, [subscriptionId])
        }
      })
      this.send(subscribeId, subscribe, params)
    })()
  }

  handle(message: RpcIngressMessage) {
    if (typeof message.id === "number") {
      const callResultPending = this.callResultPendings[message.id]
      if (callResultPending) {
        callResultPending.resolve(message)
        delete this.callResultPendings[message.id]
        return
      }
      const subscriptionPending = this.subscriptionInitPendings[message.id]
      if (subscriptionPending) {
        if (message.error) subscriptionPending(message)
        else {
          const subscriptionId = message.result as string
          this.subscriptionHandlers[subscriptionId] = subscriptionPending
          this.subscriptionIdByRpcMessageId[message.id] = subscriptionId
        }
        delete this.subscriptionInitPendings[message.id]
      }
    } else if (message.params) this.subscriptionHandlers[message.params.subscription]?.(message)
    else throw new Error(Deno.inspect(message)) // ... for now
  }
}
