import { Deferred, deferred } from "../deps/std/async.ts"

export class Notifier implements PromiseLike<void> {
  private _next: Deferred<void> = null!
  then<T1 = void, T2 = never>(
    onfulfilled?: ((value: void) => T1 | PromiseLike<T1>) | null | undefined,
    onrejected?: ((reason: any) => T2 | PromiseLike<T2>) | null | undefined,
  ) {
    return (this._next ??= deferred()).then(onfulfilled, onrejected)
  }
  emit() {
    this._next?.resolve()
    this._next = null!
  }
}
