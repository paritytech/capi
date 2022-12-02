import { Deferred, deferred } from "../deps/std/async.ts"
import { getOrInit } from "../util/state.ts"
import { PromiseOr } from "../util/types.ts"

class Notification implements PromiseLike<void> {
  private _next: Deferred<void> = null!
  // dprint-ignore (doesn't respect instantiation expression)
  then<T1 = void, T2 = never>(...args: Parameters<typeof this._next.then<T1, T2>>) {
    return (this._next ??= deferred()).then(...args)
  }
  emit() {
    this._next?.resolve()
    this._next = null!
  }
}

export class Epoch {
  constructor(readonly timeline: Timeline) {}

  min = 0
  max = Infinity

  get finite() {
    return this.max !== Infinity
  }

  restrictMin(min: number) {
    this.min = Math.max(min, this.min)
  }

  restrictMax(max: number) {
    if (max >= this.max) return
    this.max = max
    if (this.handles.size) {
      for (const handle of this.handles) {
        handle.epochs.delete(this)
      }
      this.handles.clear()
      this.finalized.emit()
    }
  }

  contains(time: number) {
    return time >= this.min && time <= this.max
  }

  restrictMaxTo(epoch: Epoch) {
    this.restrictMax(epoch.max)
    if (!this.finite) {
      for (const handle of epoch.handles) {
        this.bind(handle)
      }
    }
  }

  restrictTo(epoch: Epoch) {
    this.restrictMin(epoch.min)
    this.restrictMaxTo(epoch)
  }

  handles = new Set<EpochHandle>()

  bind(handle: EpochHandle) {
    if (this.finite) return
    handle.epochs.add(this)
    this.handles.add(handle)
  }

  finalized = new Notification()
}

export class Timeline {
  time = 0
}

export class EpochHandle {
  epochs = new Set<Epoch>()

  constructor(readonly timeline: Timeline) {}

  terminateEpochs() {
    for (const epoch of this.epochs) {
      epoch.handles.delete(this)
      if (!epoch.handles.size) epoch.finalized.emit()
      epoch.restrictMax(this.timeline.time)
    }
    this.epochs.clear()
  }

  release() {
    for (const epoch of this.epochs) {
      epoch.handles.delete(this)
      if (!epoch.handles.size) epoch.finalized.emit()
    }
    this.epochs.clear()
  }
}

export class Cast {
  timeline = new Timeline()

  primed = new Map<Rune<any, any>, _Rune<any, any>>()
  prime<T, E>(rune: Rune<T, E>, signal: AbortSignal): _Rune<T, E> {
    const primed = getOrInit(this.primed, rune, () => rune._prime(this))
    primed.reference(signal)
    return primed
  }
}

export type _T<R> = R extends Rune<infer T, any> ? T : R
export type _U<R> = R extends Rune<any, infer U> ? U : never

export abstract class _Rune<T, U> {
  declare "": [T, U]

  abortController = new AbortController()
  signal = this.abortController.signal
  constructor(readonly cast: Cast) {
    this.signal.addEventListener("abort", () => this.cleanup())
  }

  referenceCount = 0
  reference(signal: AbortSignal) {
    this.referenceCount++
    signal.addEventListener("abort", () => {
      if (!--this.referenceCount) {
        this.abortController.abort()
      }
    })
  }

  abstract evaluate(time: number, epoch: Epoch): Promise<T>

  alive = true
  cleanup() {
    this.alive = false
  }
}

export abstract class _LinearRune<T, U> extends _Rune<T, U> {
  lastTime = -1
  lastValue: Promise<T> = Promise.resolve(null!)
  lastEpoch: Epoch | null = null
  async evaluate(time: number, epoch: Epoch): Promise<T> {
    if (time < this.lastTime) throw new Error("cannot regress")
    if (!this.lastEpoch?.contains(time)) {
      this.lastTime = time
      this.lastEpoch = new Epoch(this.cast.timeline)
      this.lastValue = this._evaluate(time, this.lastEpoch)
    }
    epoch.restrictTo(this.lastEpoch)
    return this.lastValue
  }

  abstract _evaluate(time: number, epoch: Epoch): Promise<T>
}

export class Rune<T, U = never> {
  declare "": [T, U]

  private constructor(readonly _prime: (cast: Cast) => _Rune<T, U>) {}

  static new<T, E, A extends unknown[]>(
    ctor: new(cast: Cast, ...args: A) => _Rune<T, E>,
    ...args: A
  ) {
    return new Rune((cast) => new ctor(cast, ...args))
  }

  async run(): Promise<T | U> {
    const cast = new Cast()
    const abortController = new AbortController()
    const primed = cast.prime(this, abortController.signal)
    const result = await primed.evaluate(0, new Epoch(cast.timeline))
    abortController.abort()
    return result
  }

  async *watch(): AsyncIterable<T | U> {
    const cast = new Cast()
    const abortController = new AbortController()
    const primed = cast.prime(this, abortController.signal)
    let time = 0
    let lastValue: T = null!
    let lastTime = -1
    while (true) {
      const epoch = new Epoch(cast.timeline)
      const promise = primed.evaluate(time, epoch)
      if (lastTime !== -1 && !epoch.contains(lastTime)) yield lastValue
      lastValue = await promise
      if (!epoch.finite) {
        yield lastValue
        lastTime = -1
        if (epoch.handles.size) await epoch.finalized
        if (!epoch.finite) break
      } else {
        lastTime = time
      }
      time = epoch.max + 1
    }
    if (lastTime !== -1) {
      yield lastValue
    }
    abortController.abort()
  }

  static constant<T>(value: T) {
    return Rune.new(_ConstantRune, value)
  }

  static resolve<V>(value: V): Rune<_T<V>, _U<V>> {
    return (value instanceof Rune ? value : Rune.constant(value)) as any
  }

  pipe<T2>(
    fn: (value: T) => PromiseOr<T2>,
  ): Rune<T2, U> {
    return Rune.new(_PipeRune, this, fn)
  }

  static ls<R extends unknown[]>(runes: [...R]): Rune<{ [K in keyof R]: _T<R[K]> }, _U<R[number]>>
  static ls<R extends unknown[]>(runes: [...R]): Rune<_T<R[number]>[], _U<R[number]>> {
    return Rune.new(_LsRune, runes.map(Rune.resolve))
  }

  static stream<T>(fn: () => AsyncIterable<T>) {
    return Rune.new(_StreamRune, fn)
  }

  // TODO: improve typing of unwrap* methods

  unwrap<T2 extends T>(fn: (value: T) => value is T2): Rune<T2, U | Exclude<T, T2>> {
    return Rune.new(_UnwrapRune, this, fn)
  }

  unwrapNot<T2 extends T>(fn: (value: T) => value is T2): Rune<Exclude<T, T2>, U | T2>
  unwrapNot<T2 extends T>(
    fn: (value: T) => value is T2,
  ): Rune<Exclude<T, T2>, U | Exclude<T, Exclude<T, T2>>> {
    return this.unwrap((value): value is Exclude<T, T2> => !fn(value))
  }

  unwrapError() {
    return this.unwrapNot((x): x is Extract<T, Error> => x instanceof Error)
  }

  unwrapOption() {
    return this.unwrapNot((x): x is T & undefined => x === undefined)
  }

  catch() {
    return Rune.new(_CatchRune, this)
  }

  lazy() {
    return Rune.new(_LazyRune, this)
  }

  latest() {
    return Rune.new(_LatestRune, this)
  }
}

class _ConstantRune<T> extends _LinearRune<T, never> {
  constructor(cast: Cast, readonly value: T) {
    super(cast)
  }

  async _evaluate() {
    return this.value
  }
}

class _PipeRune<T1, U, T2> extends _LinearRune<T2, U> {
  child
  constructor(cast: Cast, child: Rune<T1, U>, readonly fn: (value: T1) => PromiseOr<T2>) {
    super(cast)
    this.child = cast.prime(child, this.signal)
  }

  async _evaluate(time: number, epoch: Epoch) {
    return await this.fn(await this.child.evaluate(time, epoch))
  }
}

class _LsRune<T, U> extends _LinearRune<T[], U> {
  children
  constructor(cast: Cast, children: Rune<T, U>[]) {
    super(cast)
    this.children = children.map((child) => cast.prime(child, this.signal))
  }

  async _evaluate(time: number, epoch: Epoch) {
    return Promise.all(this.children.map((child) => child.evaluate(time, epoch)))
  }
}

class _StreamRune<T> extends _LinearRune<T, never> {
  initProm = deferred<void>()
  values: (T | undefined)[] = []
  epochHandle = new EpochHandle(this.cast.timeline)
  done = false
  constructor(cast: Cast, fn: (signal?: AbortSignal) => AsyncIterable<T>) {
    super(cast)
    ;(async () => {
      const iter = fn(this.signal)
      let first = true
      for await (const value of iter) {
        if (first) {
          first = false
          this.values[0] = value
          this.initProm.resolve()
        } else {
          this.epochHandle.terminateEpochs()
          this.values[++this.cast.timeline.time] = value
        }
      }
      this.epochHandle.release()
      this.done = true
    })()
  }

  async _evaluate(time: number, epoch: Epoch): Promise<T> {
    if (!this.values.length) {
      epoch.bind(this.epochHandle)
      await this.initProm
    }
    let end = Infinity
    const idx = this.values.findLastIndex((_, i) => {
      if (i <= time) return true
      end = i - 1
      return false
    })
    epoch.restrictMin(idx)
    epoch.restrictMax(end)
    if (end === Infinity && !this.done) {
      epoch.bind(this.epochHandle)
    }
    return this.values[idx]!
  }
}

export class UnwrappedValue {
  constructor(readonly value: unknown) {}
}

class _UnwrapRune<T1, U, T2 extends T1> extends _LinearRune<T2, U | Exclude<T1, T2>> {
  child
  constructor(cast: Cast, child: Rune<T1, U>, readonly fn: (value: T1) => value is T2) {
    super(cast)
    this.child = cast.prime(child, this.signal)
  }

  async _evaluate(time: number, epoch: Epoch) {
    const value = await this.child.evaluate(time, epoch)
    if (this.fn(value)) return value
    throw new UnwrappedValue(value)
  }
}

class _CatchRune<T, U> extends _LinearRune<T | U, never> {
  child
  constructor(cast: Cast, child: Rune<T, U>) {
    super(cast)
    this.child = cast.prime(child, this.signal)
  }

  async _evaluate(time: number, epoch: Epoch) {
    try {
      return await this.child.evaluate(time, epoch)
    } catch (e) {
      if (e instanceof UnwrappedValue) {
        return e.value as U
      }
      throw e
    }
  }
}

class _LazyRune<T, U> extends _Rune<T, U> {
  child
  constructor(cast: Cast, child: Rune<T, U>) {
    super(cast)
    this.child = cast.prime(child, this.signal)
  }

  evaluate(time: number, _epoch: Epoch): Promise<T> {
    return this.child.evaluate(time, new Epoch(this.cast.timeline))
  }
}

// TODO: abort rather than just filtering
class _LatestRune<T, U> extends _Rune<T, U> {
  child
  constructor(cast: Cast, child: Rune<T, U>) {
    super(cast)
    this.child = cast.prime(child, this.signal)
  }

  evaluate(time: number, epoch: Epoch): Promise<T> {
    const _epoch = new Epoch(this.cast.timeline)
    const promise = this.child.evaluate(time, _epoch)
    epoch.restrictMaxTo(_epoch)
    return promise
  }
}
