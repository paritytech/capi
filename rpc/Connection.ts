import { Deferred, deferred } from "../deps/std/async.ts"
import { getOrInit } from "../util/mod.ts"
import {
  RpcErrorMessage,
  RpcErrorMessageData,
  RpcHandler,
  RpcIngressMessage,
  RpcMessageId,
  RpcNotificationMessage,
  RpcOkMessage,
} from "./rpc_common.ts"

const connectionMemos = new Map<new(discovery: any) => Connection, Map<unknown, Connection>>()

export abstract class Connection {
  currentId = 0
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

  abstract send(id: RpcMessageId, method: string, params: unknown): void

  protected abstract close(): void

  callResultPendings: Record<RpcMessageId, Deferred<RpcCallMessage>> = {}
  async call<OkData = unknown, ErrorData extends RpcErrorMessageData = RpcErrorMessageData>(
    method: string,
    params: unknown[],
  ) {
    const controller = new AbortController()
    await this.ready()
    const id = this.currentId++
    const pending = deferred<RpcCallMessage<OkData, ErrorData>>()
    this.callResultPendings[id] = pending
    this.send(id, method, params)
    const result = await pending
    controller.abort()
    return result
  }

  subscriptionInitPendings: Record<RpcMessageId, RpcSubscriptionHandler> = {}
  subscriptionHandlers: Record<RpcMessageId, RpcSubscriptionHandler> = {}
  subscriptionIdByRpcMessageId: Record<RpcMessageId, string> = {}
  subscription<
    Method extends string = string,
    NotificationData = unknown,
    ErrorData extends RpcErrorMessageData = RpcErrorMessageData,
  >(
    subscribe: string,
    unsubscribe: string,
    params: unknown[],
    handler: RpcSubscriptionHandler<Method, NotificationData, ErrorData>,
    signal: AbortSignal,
  ) {
    const controller = new AbortController()
    ;(async () => {
      await this.ready()
      const subscribeId = this.currentId++
      this.subscriptionInitPendings[subscribeId] = handler as RpcSubscriptionHandler
      signal.addEventListener("abort", () => {
        delete this.subscriptionInitPendings[subscribeId]
        const subscriptionId = this.subscriptionIdByRpcMessageId[subscribeId]
        if (subscriptionId) {
          delete this.subscriptionIdByRpcMessageId[subscribeId]
          this.send(this.currentId++, unsubscribe, [subscriptionId])
          controller.abort()
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
          this.subscriptionHandlers[message.result] = subscriptionPending
          this.subscriptionIdByRpcMessageId[message.id] = message.result
        }
        delete this.subscriptionInitPendings[message.id]
      }
    } else if (message.params) this.subscriptionHandlers[message.params.subscription]?.(message)
    else throw new Error(Deno.inspect(message)) // ... for now
  }
}

export type RpcCallMessage<
  OkData = any,
  ErrorData extends RpcErrorMessageData = RpcErrorMessageData,
> = RpcOkMessage<OkData> | RpcErrorMessage<ErrorData>

export type RpcSubscriptionMessage<
  Method extends string = string,
  NotificationData = any,
  ErrorData extends RpcErrorMessageData = RpcErrorMessageData,
> = RpcNotificationMessage<Method, NotificationData> | RpcErrorMessage<ErrorData>

export type RpcSubscriptionHandler<
  Method extends string = string,
  NotificationData = any,
  ErrorData extends RpcErrorMessageData = RpcErrorMessageData,
> = RpcHandler<RpcSubscriptionMessage<Method, NotificationData, ErrorData>>
