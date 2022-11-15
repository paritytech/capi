import { PromiseOr } from "./types.ts"

export type Listener<Event, This = any, EndResult = any> = (
  this: This,
  event: Event,
) => PromiseOr<void | End<EndResult>>

export class End<T> {
  constructor(readonly value: T) {}
}

export function contramapListener<This>() {
  return <From, Into>(
    listener: Listener<Into, This>,
    map: (this: This, message: From) => Into,
  ): Listener<From> => {
    return function(e: From) {
      return listener.apply(this, [map.apply(this, [e])])
    }
  }
}
