import { PromiseOr } from "./types.ts"

export type CreateListener<Context = any, Event = any, Result = any> = (
  context: Context,
) => Listener<Event, Result>
export type Listener<Event, Result> = (event: Event) => ListenerResult<Result>

export class End<T> {
  constructor(readonly value: T) {}
}

export type ListenerResult<Result = any> = PromiseOr<void | End<Result>>

export type GetListenerResult<CreateListener_ extends CreateListener> = Exclude<
  Awaited<ReturnType<ReturnType<CreateListener_>>>,
  void
>["value"]

export type InnerEnd<CreateListener_ extends CreateListener> =
  [GetListenerResult<CreateListener_>] extends [void] ? never
    : End<GetListenerResult<CreateListener_>>

// TODO: util for mapping over `CreateListener`
