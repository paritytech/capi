import { Deferred, deferred } from "../deps/std/async.ts"
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
      }
    } else if (typeof e.id === "number") {
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

  call: ClientCall<SendErrorData, HandlerErrorData> = (id, method, params) => {
    const waiter = deferred<ClientCallEvent<SendErrorData, HandlerErrorData>>()
    this.pendingCalls[id] = waiter
    this.providerRef.send({
      jsonrpc: "2.0",
      id,
      method,
      params,
    })
    return waiter
  }

  subscriptionFactory = <
    Params extends unknown[] = any[],
    NotificationData = any,
  >(): SubscriptionFactory<Params, NotificationData, SendErrorData, HandlerErrorData> =>
    (
      subscribeMethod,
      unsubscribeMethod,
      params,
      createListener,
    ) => {
      const id = this.providerRef.nextId()
      const waiter = deferred<any>() // TODO: type this narrowly
      const stop = async (value?: unknown) => {
        delete this.pendingSubscriptions[id]
        const activeSubscriptionId = this.activeSubscriptionByMessageId[id]
        if (activeSubscriptionId) {
          delete this.activeSubscriptions[activeSubscriptionId]
          await this.call(
            this.providerRef.nextId(),
            unsubscribeMethod,
            [activeSubscriptionId],
          )
        }
        delete this.activeSubscriptionByMessageId[id]
        waiter.resolve(value)
      }
      const listener = createListener({
        end(value = undefined!) {
          return new U.End(value)
        },
        endIfError(value) {
          return (value instanceof Error ? new U.End(value) : undefined) as any
        },
      })
      this.pendingSubscriptions[id] = (event) => {
        const result = listener(event)
        if (result instanceof Promise) {
          result.then((resultR) => maybeStop(resultR, event))
        } else {
          maybeStop(result, event)
        }
      }
      ;(async () => {
        const maybeError = await this.call(id, subscribeMethod, params)
        if (maybeError instanceof Error || maybeError.error) {
          listener(maybeError)
          stop()
        }
      })()
      return waiter

      function maybeStop(
        maybeEnd: U.ListenerResult,
        event: ClientSubscriptionEvent<any, any, SendErrorData, HandlerErrorData>,
      ) {
        if (maybeEnd instanceof U.End) {
          stop(maybeEnd.value)
        } else if (event instanceof Error) {
          stop()
        }
      }
    }

  discard = () => {
    this.pendingCalls = {}
    this.pendingSubscriptions = {}
    this.activeSubscriptions = {}
    this.activeSubscriptionByMessageId = {}
    return this.providerRef.release()
  }
}

export type ClientCallEvent<SendErrorData, HandlerErrorData, Result = any> =
  | msg.OkMessage<Result>
  | msg.ErrorMessage
  | ProviderSendError<SendErrorData>
  | ProviderHandlerError<HandlerErrorData>

export type ClientCall<SendErrorData, HandlerErrorData> = <Result = any>(
  id: number | string,
  method: string,
  params: unknown[],
) => Promise<ClientCallEvent<SendErrorData, HandlerErrorData, Result>>

export type ClientSubscriptionEvent<
  Method extends string,
  Result,
  SendErrorData,
  HandlerErrorData,
> =
  | msg.NotificationMessage<Method, Result>
  | msg.ErrorMessage
  | ProviderSendError<SendErrorData>
  | ProviderHandlerError<HandlerErrorData>

type SubscriptionListeners<SendErrorData, HandlerErrorData> = Record<
  string,
  ReturnType<CreateClientSubscriptionListener<any, any, SendErrorData, HandlerErrorData>>
>

export type SubscriptionFactory<
  Params extends unknown[],
  NotificationData,
  SendErrorData,
  HandlerErrorData,
> = <
  SubscribeMethod extends string,
  CreateListener_ extends CreateClientSubscriptionListener<
    SubscribeMethod,
    NotificationData,
    SendErrorData,
    HandlerErrorData
  >,
>(
  subscribeMethod: SubscribeMethod,
  unsubscribeMethod: string,
  params: [...Params],
  createListener: CreateListener_,
) => Promise<U.GetListenerResult<CreateListener_>>

export type CreateClientSubscriptionListener<
  SubscribeMethod extends string,
  NotificationData,
  SendErrorData,
  HandlerErrorData,
> = U.CreateListener<
  ClientSubscriptionContext,
  ClientSubscriptionEvent<SubscribeMethod, NotificationData, SendErrorData, HandlerErrorData>,
  any
>

export interface ClientSubscriptionContext {
  end: <T>(value?: T) => U.End<T>
  endIfError<I>(value: I): U.End<Extract<I, Error>>
}
