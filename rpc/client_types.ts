import { Deferred, deferred } from "../deps/std/async.ts"
import { getOrInit } from "../util/mod.ts"
import * as U from "../util/mod.ts"
import * as msg from "./messages.ts"
import { Provider, ProviderListener } from "./provider/base.ts"
import { ProviderHandlerError, ProviderSendError } from "./provider/errors.ts"

// client.call("", [])
// client.subscription("start", "end", [], function(message) {
//   // ...
// })

export type Call<
  Params extends unknown[],
  Result,
> = (
  id: number,
  callMethod: string,
  params: [...Params],
) => Promise<Result>

export type Subscription<Params extends unknown[], Notif> = <
  SubscribeMethod extends string,
  Listener_ extends Listener<msg.NotificationMessage<SubscribeMethod, Notif>>,
>(
  subscribeMethod: SubscribeMethod,
  unsubscribeMethod: string,
  params: [...Params],
  listener: Listener_,
) => Promise<ListenerResult<Listener_>>

export type Listener<Event = any, Result = any> = (ctrl: {
  end: <Value = undefined>(value?: Value) => End<Value>
}) => (event: Event) => U.PromiseOr<void | End<Result>>

export class End<T> {
  constructor(readonly value: T) {}
}
type ListenerResult<Listener_ extends Listener> = Exclude<
  Awaited<ReturnType<ReturnType<Listener_>>>,
  void
>["value"]

declare function subscriptionFactory<Params extends unknown[], Notif>(): Subscription<Params, Notif>

///

const result = await subscriptionFactory<[], string>()("a", "b", [], ({ end }) =>
  (e) => {
    e.params.result
    return end(101)
  })
