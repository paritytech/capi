// import { Deferred, deferred } from "../deps/std/async.ts"
// import * as U from "../util/mod.ts"
// import * as msg from "./messages.ts"
// import { Provider, ProviderListener } from "./provider/base.ts"
// import { ProviderHandlerError, ProviderSendError } from "./provider/errors.ts"

// export class Client<
//   DiscoveryValue = any,
//   SendErrorData = any,
//   HandlerErrorData = any,
//   CloseErrorData = any,
// > {
//   providerRef
//   pendingCalls: Record<string, Deferred<unknown>> = {}
//   pendingSubscriptions: SubscriptionListeners<SendErrorData, HandlerErrorData> = {}
//   activeSubscriptions: SubscriptionListeners<SendErrorData, HandlerErrorData> = {}
//   activeSubscriptionByMessageId: Record<string, string> = {}

//   constructor(
//     readonly provider: Provider<DiscoveryValue, SendErrorData, HandlerErrorData, CloseErrorData>,
//     readonly discoveryValue: DiscoveryValue,
//   ) {
//     this.providerRef = provider(discoveryValue, this.listener)
//   }

//   listener: ProviderListener<SendErrorData, HandlerErrorData> = (e) => {
//     if (e instanceof ProviderSendError) {
//       const egressMessageId = e.egressMessage.id
//       const pendingCall = this.pendingCalls[egressMessageId]
//       pendingCall?.resolve(e)
//       delete this.pendingCalls[egressMessageId]
//     } else if (e instanceof Error) {
//       for (const id in this.pendingCalls) {
//         const pendingCall = this.pendingCalls[id]!
//         pendingCall.resolve(e)
//         delete this.pendingCalls[id]
//         this.pendingSubscriptions[id]?.(e)
//         delete this.pendingSubscriptions[id]
//       }
//       for (const id in this.activeSubscriptions) {
//         this.activeSubscriptions[id]!(e)
//         delete this.activeSubscriptions[id]
//       }
//     } else if (e.id !== undefined) {
//       const pendingCall = this.pendingCalls[e.id]
//       pendingCall?.resolve(e)
//       delete this.pendingCalls[e.id]
//       if (this.pendingSubscriptions[e.id]) {
//         if (e.error) {
//           this.pendingSubscriptions[e.id]!(e)
//         } else {
//           this.activeSubscriptions[e.result] = this.pendingSubscriptions[e.id]!
//           this.activeSubscriptionByMessageId[e.id] = e.result
//         }
//         delete this.pendingSubscriptions[e.id]
//       }
//     } else if (e.params) {
//       this.activeSubscriptions[e.params.subscription]?.(e)
//     }
//   }

//   call: ClientCall<SendErrorData, HandlerErrorData> = (id, method, params) => {
//     const waiter = deferred<ClientCallEvent<SendErrorData, HandlerErrorData>>()
//     this.pendingCalls[id] = waiter
//     this.providerRef.send({
//       jsonrpc: "2.0",
//       id,
//       method,
//       params,
//     })
//     return waiter
//   }

//   subscriptionFactory = <
//     Params extends unknown[] = any[],
//     NotificationData = any,
//   >(): SubscriptionFactory<Params, NotificationData, SendErrorData, HandlerErrorData> =>
//   (
//     subscribeMethod,
//     unsubscribeMethod,
//     params,
//     listener,
//     abortSignal,
//   ) => {
//     const id = this.providerRef.nextId()
//     abortSignal.addEventListener("abort", async () => {
//       delete this.pendingSubscriptions[id]
//       const activeSubscriptionId = this.activeSubscriptionByMessageId[id]
//       if (activeSubscriptionId) {
//         delete this.activeSubscriptions[activeSubscriptionId]
//         await this.call(
//           this.providerRef.nextId(),
//           unsubscribeMethod,
//           [activeSubscriptionId],
//         )
//       }
//       delete this.activeSubscriptionByMessageId[id]
//     })
//     this.call(id, subscribeMethod, params).then((x) => {
//       if (x instanceof Error || x.error) {
//         listener(x)
//       }
//     })
//     this.pendingSubscriptions[id] = listener
//   }

//   discard = () => {
//     this.pendingCalls = {}
//     this.pendingSubscriptions = {}
//     this.activeSubscriptions = {}
//     this.activeSubscriptionByMessageId = {}
//     return this.providerRef.release()
//   }
// }

// export type ClientCallEvent<SendErrorData, HandlerErrorData, Result = any> =
//   | msg.OkMessage<Result>
//   | msg.ErrorMessage
//   | ProviderSendError<SendErrorData>
//   | ProviderHandlerError<HandlerErrorData>

// export type ClientCall<SendErrorData, HandlerErrorData> = <Result = any>(
//   id: number | string,
//   method: string,
//   params: unknown[],
// ) => Promise<ClientCallEvent<SendErrorData, HandlerErrorData, Result>>

// export type ClientSubscriptionEvent<
//   Method extends string,
//   Result,
//   SendErrorData,
//   HandlerErrorData,
// > =
//   | msg.NotificationMessage<Method, Result>
//   | msg.ErrorMessage
//   | ProviderSendError<SendErrorData>
//   | ProviderHandlerError<HandlerErrorData>

// type SubscriptionListeners<SendErrorData, HandlerErrorData> = Record<
//   string,
//   SubscriptionListener<
//     any,
//     any,
//     SendErrorData,
//     HandlerErrorData
//   >
// >

// type SubscriptionListener<
//   SubscribeMethod extends string,
//   NotificationData,
//   SendErrorData,
//   HandlerErrorData,
// > = (
//   value: ClientSubscriptionEvent<
//     SubscribeMethod,
//     NotificationData,
//     SendErrorData,
//     HandlerErrorData
//   >,
// ) => void

// export type SubscriptionFactory<
//   Params extends unknown[],
//   NotificationData,
//   SendErrorData,
//   HandlerErrorData,
// > = <
//   SubscribeMethod extends string,
// >(
//   subscribeMethod: SubscribeMethod,
//   unsubscribeMethod: string,
//   params: [...Params],
//   listener: SubscriptionListener<
//     SubscribeMethod,
//     NotificationData,
//     SendErrorData,
//     HandlerErrorData
//   >,
//   abortSignal: AbortSignal,
// ) => void

// export interface ClientSubscriptionContext {
//   end: <T>(value?: T) => U.End<T>
//   endIfError<I>(value: I): U.End<Extract<I, Error>>
// }
