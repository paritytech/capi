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

// export function contramapListener<This>() {
//   return <From, Into>(
//     listener: Listener<Into, This>,
//     map: (this: This, message: From) => Into,
//   ): Listener<From> => {
//     return function(e: From) {
//       return listener.apply(this, [map.apply(this, [e])])
//     }
//   }
// }
