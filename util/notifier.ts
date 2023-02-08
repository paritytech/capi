import { Deferred, deferred } from "../deps/std/async.ts"

export class Notifier implements PromiseLike<void> {
  private _next: Deferred<void> = null!
  // dprint-ignore (doesn't respect instantiation expression)
  then<T1 = void, T2 = never>(...args: Parameters<typeof Notifier.prototype._next.then<T1, T2>>) {
    return (this._next ??= deferred()).then(...args)
  }
  emit() {
    this._next?.resolve()
    this._next = null!
  }
}
