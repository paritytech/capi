import { Deferred, deferred } from "../deps/std/async.ts"
import {
  RpcErrorMessage,
  RpcErrorMessageData,
  RpcHandler,
  RpcIngressMessage,
  RpcMessageId,
  RpcNotificationMessage,
  RpcOkMessage,
} from "./messages.ts"
import { RpcProvider } from "./provider/base.ts"

export class RpcClient<D> {
  conn

  constructor(readonly provider: RpcProvider<D>, readonly discovery: D) {
    this.conn = (signal: AbortSignal) => this.provider.ref(discovery, this.handler, signal)
  }

  callResultPendings: Record<RpcMessageId, Deferred<RpcCallMessage>> = {}
  async call<OkData = unknown, ErrorData extends RpcErrorMessageData = RpcErrorMessageData>(
    method: string,
    params: unknown[],
  ) {
    const controller = new AbortController()
    const conn = this.conn(controller.signal)
    await conn.ready()
    const id = conn.currentId++
    const pending = deferred<RpcCallMessage<OkData, ErrorData>>()
    this.callResultPendings[id] = pending
    conn.send(id, method, params)
    const result = await pending
    controller.abort()
    return result
  }

  subscriptionInitPendings: Record<RpcMessageId, RpcSubscriptionHandler> = {}
  subscriptions: Record<RpcMessageId, RpcSubscriptionHandler> = {}
  subscriptionIdByRpcMessageId: Record<RpcMessageId, string> = {}
  async subscription<
    NotificationData = unknown,
    ErrorData extends RpcErrorMessageData = RpcErrorMessageData,
  >(
    subscribe: string,
    unsubscribe: string,
    params: unknown[],
    handler: RpcSubscriptionHandler<NotificationData, ErrorData>,
    signal: AbortSignal,
  ) {
    const providerController = new AbortController()
    const conn = this.conn(providerController.signal)
    await conn.ready()
    const subscribeId = conn.currentId++
    this.subscriptionInitPendings[subscribeId] = handler as RpcSubscriptionHandler
    signal.addEventListener("abort", () => {
      delete this.subscriptionInitPendings[subscribeId]
      const subscriptionId = this.subscriptionIdByRpcMessageId[subscribeId]
      if (subscriptionId) {
        delete this.subscriptionIdByRpcMessageId[subscribeId]
        conn.send(conn.currentId++, unsubscribe, [subscriptionId])
        providerController.abort()
      }
    })
    conn.send(subscribeId, subscribe, params)
  }

  // TODO: error handling
  handler = (message: RpcIngressMessage) => {
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
          this.subscriptions[message.result] = subscriptionPending
          this.subscriptionIdByRpcMessageId[message.id] = message.result
        }
        delete this.subscriptionInitPendings[message.id]
      }
    } else if (message.params) this.subscriptions[message.params.subscription]?.(message)
  }
}

export type RpcCallMessage<
  OkData = any,
  ErrorData extends RpcErrorMessageData = RpcErrorMessageData,
> = RpcOkMessage<OkData> | RpcErrorMessage<ErrorData>

export type RpcSubscriptionMessage<
  NotificationData = any,
  ErrorData extends RpcErrorMessageData = RpcErrorMessageData,
> = RpcNotificationMessage<NotificationData> | RpcErrorMessage<ErrorData>

export type RpcSubscriptionHandler<
  NotificationData = any,
  ErrorData extends RpcErrorMessageData = RpcErrorMessageData,
> = RpcHandler<RpcSubscriptionMessage<NotificationData, ErrorData>>
