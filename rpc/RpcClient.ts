import { Deferred, deferred } from "../deps/std/async.ts"
import { getOrInit } from "../util/mod.ts"
import { RpcConnCtor } from "./conn/mod.ts"
import { ConnsRefCounter } from "./ConnsRefCounter.ts"
import {
  RpcErrorMessage,
  RpcErrorMessageData,
  RpcHandler,
  RpcIngressMessage,
  RpcMessageId,
  RpcNotificationMessage,
  RpcOkMessage,
} from "./rpc_common.ts"

const connRefCounters = new WeakMap<RpcConnCtor<any>, ConnsRefCounter<any>>()

export class RpcClient<D> {
  conn

  constructor(readonly connCtor: RpcConnCtor<D>, readonly discoveryValue: D) {
    const connRefCounter = getOrInit(
      connRefCounters,
      connCtor,
      () => new ConnsRefCounter(connCtor),
    )
    this.conn = (signal: AbortSignal) => connRefCounter.ref(discoveryValue, this.handler, signal)
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
  subscriptionHandlers: Record<RpcMessageId, RpcSubscriptionHandler> = {}
  subscriptionIdByRpcMessageId: Record<RpcMessageId, string> = {}
  subscription<
    NotificationData = unknown,
    ErrorData extends RpcErrorMessageData = RpcErrorMessageData,
  >(
    subscribe: string,
    unsubscribe: string,
    params: unknown[],
    handler: RpcSubscriptionHandler<NotificationData, ErrorData>,
    signal: AbortSignal,
  ) {
    const controller = new AbortController()
    const conn = this.conn(controller.signal)
    ;(async () => {
      await conn.ready()
      const subscribeId = conn.currentId++
      this.subscriptionInitPendings[subscribeId] = handler as RpcSubscriptionHandler
      signal.addEventListener("abort", () => {
        delete this.subscriptionInitPendings[subscribeId]
        const subscriptionId = this.subscriptionIdByRpcMessageId[subscribeId]
        if (subscriptionId) {
          delete this.subscriptionIdByRpcMessageId[subscribeId]
          conn.send(conn.currentId++, unsubscribe, [subscriptionId])
          controller.abort()
        }
      })
      conn.send(subscribeId, subscribe, params)
    })()
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
          this.subscriptionHandlers[message.result] = subscriptionPending
          this.subscriptionIdByRpcMessageId[message.id] = message.result
        }
        delete this.subscriptionInitPendings[message.id]
      }
    } else if (message.params) this.subscriptionHandlers[message.params.subscription]?.(message)
    // TODO: log message about fallthrough if in `--dbg`
  }
}

export type RpcCallMessage<
  OkData = any,
  ErrorData extends RpcErrorMessageData = RpcErrorMessageData,
> = RpcOkMessage<OkData> | RpcErrorMessage<ErrorData>

export type RpcSubscriptionMessage<
  NotificationData = any,
  ErrorData extends RpcErrorMessageData = RpcErrorMessageData,
> = RpcNotificationMessage<string, NotificationData> | RpcErrorMessage<ErrorData>

export type RpcSubscriptionHandler<
  NotificationData = any,
  ErrorData extends RpcErrorMessageData = RpcErrorMessageData,
> = RpcHandler<RpcSubscriptionMessage<NotificationData, ErrorData>>
