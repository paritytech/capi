import { Deferred, deferred } from "../deps/std/async.ts"
import { getOrInit } from "../util/mod.ts"
import { RpcCallMessage, RpcIngressMessage, RpcSubscriptionHandler } from "./rpc_messages.ts"

const connectionMemos = new Map<new(discovery: any) => Connection, Map<unknown, Connection>>()

export abstract class Connection {
  nextId = 0
  references = 0
  #controller = new AbortController()
  signal = this.#controller.signal

  static bind<D>(
    this: new(discovery: D) => Connection,
    discovery: D,
  ): (signal: AbortSignal) => Connection {
    return (signal) => (Connection.connect<D>).call(this, discovery, signal)
  }

  static connect<D>(
    this: new(discovery: D) => Connection,
    discovery: D,
    signal: AbortSignal,
  ) {
    const memo = getOrInit(connectionMemos, this, () => new Map<unknown, Connection>())
    const connection = getOrInit(memo, discovery, () => {
      const connection = new this(discovery)
      connection.signal.addEventListener("abort", () => {
        memo.delete(discovery)
      })
      return connection
    })
    connection.ref(signal)
    return connection
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

  async call(method: string, params: unknown[]) {
    const id = this.nextId++
    return this.#call(id, method, params)
  }

  callResultPendings: Record<number, Deferred<RpcCallMessage>> = {}
  async #call(id: number, method: string, params: unknown[]) {
    await this.ready()
    const pending = deferred<RpcCallMessage>()
    this.callResultPendings[id] = pending
    this.send(id, method, params)
    return await pending
  }

  subscriptionHandlers: Record<string, RpcSubscriptionHandler> = {}
  subscriptionPendingInits: Record<number, (subscriptionId: string) => void> = {}
  async subscription(
    subscribe: string,
    unsubscribe: string,
    params: unknown[],
    handler: RpcSubscriptionHandler,
    signal: AbortSignal,
  ) {
    const id = this.nextId++
    this.subscriptionPendingInits[id] = (subscriptionId) => {
      delete this.subscriptionPendingInits[id]
      if (signal.aborted) return
      signal.addEventListener("abort", () => {
        delete this.subscriptionHandlers[subscriptionId]
        this.send(this.nextId++, unsubscribe, [subscriptionId])
      })
      this.subscriptionHandlers[subscriptionId] = handler
    }
    const message = await this.#call(id, subscribe, params)
    if (signal.aborted) {
      delete this.subscriptionPendingInits[id]
      return
    }
    if (message.error) {
      delete this.subscriptionPendingInits[id]
      return handler(message)
    }
  }

  handle(message: RpcIngressMessage) {
    if (typeof message.id === "number") {
      this.callResultPendings[message.id]?.resolve(message)
      delete this.callResultPendings[message.id]
      const init = this.subscriptionPendingInits[message.id]
      if (!message.error && init) init(message.result as string)
    } else if (message.params) {
      this.subscriptionHandlers[message.params.subscription]?.(message)
    } else {
      throw new Error(Deno.inspect(message)) // ... for now
    }
  }
}
