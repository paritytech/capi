import { PromiseOr } from "./types.ts"

export type CreateListener<Context = any, Event = any, Result = any> = (
  context: Context,
) => Listener<Event, Result>
export type Listener<Event, Result> = (event: Event) => PromiseOr<void | End<Result>>

export class End<T> {
  constructor(readonly value: T) {}
}

export type ListenerResult<CreateListener_ extends CreateListener> = Exclude<
  Awaited<ReturnType<ReturnType<CreateListener_>>>,
  void
>["value"]

export type InnerEnd<CreateListener_ extends CreateListener> =
  [ListenerResult<CreateListener_>] extends [void] ? never : End<ListenerResult<CreateListener_>>

// TODO: util for mapping over `CreateListener`
