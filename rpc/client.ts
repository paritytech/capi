import { Deferred, deferred } from "../deps/std/async.ts"
import { getOrInit } from "../util/mod.ts"
import * as U from "../util/mod.ts"
import * as msg from "./messages.ts"
import { Provider, ProviderListener } from "./provider/base.ts"
import { ProviderHandlerError, ProviderSendError } from "./provider/errors.ts"

// TODO: delete this upon solving inner-type-access problem of RPC effects
export declare const ClientE_: unique symbol
export type ClientE_ = typeof ClientE_

export class Client<
  DiscoveryValue = any,
  SendErrorData = any,
  HandlerErrorData = any,
  CloseErrorData = any,
> {
  // TODO: delete this as well pending the above `TODO` ^
  declare [ClientE_]: {
    send: SendErrorData
    handler: HandlerErrorData
    close: CloseErrorData
  }

  providerRef
  pendingCalls: Record<string, Deferred<unknown>> = {}
  pendingSubscriptions: SubscriptionListeners<SendErrorData, HandlerErrorData> = {}
  activeSubscriptions: SubscriptionListeners<SendErrorData, HandlerErrorData> = {}
  activeSubscriptionByMessageId: Record<string, string> = {}
  subscriptionStates = new Map<string, WeakMap<new() => any, any>>()

  constructor(
    readonly provider: Provider<DiscoveryValue, SendErrorData, HandlerErrorData, CloseErrorData>,
    readonly discoveryValue: DiscoveryValue,
  ) {
    this.providerRef = provider(discoveryValue, this.#listener)
  }

  #listener: ProviderListener<SendErrorData, HandlerErrorData> = (e) => {
    if (e instanceof ProviderSendError) {
      const egressMessageId = e.egressMessage.id
      const pendingCall = this.pendingCalls[egressMessageId]
      pendingCall?.resolve(e)
      delete this.pendingCalls[egressMessageId]
    } else if (e instanceof Error) {
      for (const id in this.pendingCalls) {
        const pendingCall = this.pendingCalls[id]!
        pendingCall.resolve(e)
        delete this.pendingCalls[id]
        this.pendingSubscriptions[id]?.(e)
        delete this.pendingSubscriptions[id]
      }
      for (const id in this.activeSubscriptions) {
        this.activeSubscriptions[id]!(e)
        delete this.activeSubscriptions[id]
        this.subscriptionStates.delete(id)
      }
    } else if (e.id) {
      const pendingCall = this.pendingCalls[e.id]
      pendingCall?.resolve(e)
      delete this.pendingCalls[e.id]
      if (this.pendingSubscriptions[e.id]) {
        if (e.error) {
          this.pendingSubscriptions[e.id]!(e)
        } else {
          this.activeSubscriptions[e.result] = this.pendingSubscriptions[e.id]!
          this.activeSubscriptionByMessageId[e.id] = e.result
        }
        delete this.pendingSubscriptions[e.id]
      }
    } else if (e.params) {
      this.activeSubscriptions[e.params.subscription]?.(e)
    }
  }

  call: ClientCall<SendErrorData, HandlerErrorData> = (message) => {
    const waiter = deferred<ClientCallEvent<SendErrorData, HandlerErrorData>>()
    this.pendingCalls[message.id] = waiter
    this.providerRef.send(message)
    return waiter
  }

  subscribe: ClientSubscribe<SendErrorData, HandlerErrorData> = (
    message,
    unsubscribeMethod,
    listener,
  ) => {
    // const waiter = deferred<Awaited<ReturnType<typeof listener>>>() // TODO: type this narrowly
    const waiter = deferred<any>() // TODO: type this narrowly
    const stop = async (value?: unknown) => {
      delete this.pendingSubscriptions[message.id]
      const activeSubscriptionId = this.activeSubscriptionByMessageId[message.id]
      if (activeSubscriptionId) {
        delete this.activeSubscriptions[activeSubscriptionId]
      }
      delete this.activeSubscriptionByMessageId[message.id]
      await this.call({
        jsonrpc: "2.0",
        id: this.providerRef.nextId(),
        method: unsubscribeMethod,
        params: [activeSubscriptionId],
      })
      return waiter.resolve(value)
    }
    const listenerBound = listener.bind({
      message,
      state: <T>(ctor: new() => T) => {
        const messageState = getOrInit(this.subscriptionStates, message.id, () => new WeakMap())
        return getOrInit(messageState, ctor, () => new ctor())
      },
      end<T = void>(value: T = undefined!): U.End<T> {
        return new U.End(value)
      },
    }) as ClientSubscribeListener<SendErrorData, HandlerErrorData>
    const maybeStop = (maybeEnd: unknown) => {
      if (maybeEnd instanceof U.End) {
        stop(maybeEnd.value)
      } else if (maybeEnd instanceof Error) {
        stop(maybeEnd)
      }
    }
    const listenerBoundWithStop: ClientSubscribeListener<SendErrorData, HandlerErrorData> = (
      event,
    ) => {
      const result = listenerBound(event)
      if (result instanceof Promise) {
        result.then(maybeStop)
      } else {
        maybeStop(result)
      }
    }
    this.pendingSubscriptions[message.id] = listenerBoundWithStop
    ;(async () => {
      const maybeError = await this.call(message)
      if (maybeError instanceof Error || maybeError.error) {
        listenerBound(maybeError)
        stop()
      }
    })()
    return waiter
  }

  discard = () => {
    this.pendingCalls = {}
    this.pendingSubscriptions = {}
    this.activeSubscriptions = {}
    this.activeSubscriptionByMessageId = {}
    this.subscriptionStates.clear()
    return this.providerRef.release()
  }
}

export type ClientCallEvent<SendErrorData, HandlerErrorData, Result = any> =
  | msg.OkMessage<Result>
  | msg.ErrorMessage
  | ProviderSendError<SendErrorData>
  | ProviderHandlerError<HandlerErrorData>

export type ClientCall<SendErrorData, HandlerErrorData> = <Result = any>(
  message: msg.EgressMessage,
) => Promise<ClientCallEvent<SendErrorData, HandlerErrorData, Result>>

export type ClientSubscriptionEvent<
  SendErrorData,
  HandlerErrorData,
  Method extends string = string,
  Result = any,
> =
  | msg.NotificationMessage<Method, Result>
  | msg.ErrorMessage
  | ProviderSendError<SendErrorData>
  | ProviderHandlerError<HandlerErrorData>

type SubscriptionListeners<SendErrorData, HandlerErrorData> = Record<
  string,
  ClientSubscribeListener<SendErrorData, HandlerErrorData>
>

export type ClientSubscribe<SendErrorData, HandlerErrorData> = <
  Method extends string = string,
  Result = any,
  EndResult = any,
>(
  message: msg.EgressMessage,
  subscribeMethod: string,
  listener: ClientSubscribeListener<
    SendErrorData,
    HandlerErrorData,
    ClientSubscribeContext,
    Method,
    Result,
    EndResult
  >,
) => Promise<EndResult>

export type ClientSubscribeListener<
  SendErrorData,
  HandlerErrorData,
  Context = void,
  Method extends string = string,
  Result = string,
  EndResult = any,
> = U.Listener<
  ClientSubscriptionEvent<SendErrorData, HandlerErrorData, Method, Result>,
  Context,
  EndResult
>

export interface ClientSubscribeContext {
  message: msg.EgressMessage
  state: <T>(ctor: new() => T) => T
  end: <T>(value?: T) => U.End<T>
}
