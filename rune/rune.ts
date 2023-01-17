import { deferred } from "../deps/std/async.ts"
import { getOrInit } from "../util/state.ts"
import { PromiseOr } from "../util/types.ts"
import { EventSource, Receipt, Timeline } from "./timeline.ts"

export class Batch {
  constructor(
    readonly timeline = new Timeline(),
    readonly parent?: Batch,
    readonly wrapParent: <T, U>(rune: _Rune<T, U>) => _Rune<T, U> = (x) => x,
  ) {}

  primed = new Map<Rune<any, any>, _Rune<any, any>>()
  prime<T, E>(rune: Rune<T, E>, signal: AbortSignal): _Rune<T, E> {
    const primed = getOrInit(this.primed, rune, () => this.getPrimed(rune) ?? rune._prime(this))
    primed.reference(signal)
    return primed
  }

  getPrimed<T, E>(rune: Rune<T, E>): _Rune<T, E> | undefined {
    const existing = this.primed.get(rune)
    if (existing) return existing
    const parent = this.parent?.getPrimed(rune)
    if (parent) {
      const wrapped = this.wrapParent(parent)
      this.primed.set(rune, wrapped)
      return wrapped
    }
    return undefined
  }

  spawn(time: number, receipt: Receipt) {
    return new Batch(new Timeline(), this, (x) => new _ProxyRune(this, x, time, receipt))
  }
}

export type _T<R> = R extends Rune<infer T, any> ? T : R
export type _U<R> = R extends Rune<any, infer U> ? U : never

export abstract class _Rune<T, U> {
  declare "": [T, U]

  abortController = new AbortController()
  signal = this.abortController.signal
  constructor(readonly batch: Batch) {
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

  _currentTime = -1
  _currentPromise: Promise<T> = null!
  _currentReceipt = new Receipt()
  async evaluate(time: number, receipt: Receipt) {
    if (this._currentTime > time) throw new Error("cannot regress")
    if (this._currentTime < time) {
      this._currentReceipt = new Receipt()
      if (this._currentTime === -1) {
        this._currentReceipt.novel = true
      }
      this._currentTime = time
      this._currentPromise = this._evaluate(time, this._currentReceipt)
    }
    const _receipt = this._currentReceipt
    try {
      return await this._currentPromise
    } finally {
      receipt.setFrom(_receipt)
    }
  }
  abstract _evaluate(time: number, receipt: Receipt): Promise<T>

  alive = true
  cleanup() {
    this.alive = false
  }
}

class _ProxyRune<T, E> extends _Rune<T, E> {
  constructor(
    batch: Batch,
    readonly inner: _Rune<T, E>,
    readonly innerTime: number,
    readonly innerReceipt: Receipt,
  ) {
    super(batch)
  }

  _evaluate(): Promise<T> {
    // TODO: improve
    return this.inner.evaluate(this.innerTime, this.innerReceipt)
  }
}

export class Rune<out T, out U = never> {
  declare "": [T, U]

  constructor(readonly _prime: (batch: Batch) => _Rune<T, U>) {}

  static new<T, E, A extends unknown[]>(
    ctor: new(batch: Batch, ...args: A) => _Rune<T, E>,
    ...args: A
  ) {
    return new Rune((batch) => new ctor(batch, ...args))
  }

  async run(batch = new Batch()): Promise<T> {
    for await (const value of this.watch(batch)) {
      return value
    }
    throw new Error("Rune did not yield any values")
  }

  async *watch(batch = new Batch()): AsyncIterable<T> {
    const abortController = new AbortController()
    const primed = batch.prime(this, abortController.signal)
    let time = 0
    try {
      while (time !== Infinity) {
        const receipt = new Receipt()
        const value = await primed.evaluate(time, receipt)
        if (receipt.ready && receipt.novel) {
          yield value
        }
        await receipt.finalized()
        time = receipt.nextTime
      }
    } finally {
      abortController.abort()
    }
  }

  static constant<T>(value: T) {
    return Rune.new(_ConstantRune, value)
  }

  static resolve<V>(value: V): Rune<_T<V>, _U<V>> {
    return (value instanceof Rune ? value : Rune.constant(value)) as any
  }

  pipe<T2>(fn: (value: T) => PromiseOr<T2>): Rune<T2, U> {
    return Rune.new(_PipeRune, this, fn)
  }

  static ls<R extends unknown[]>(runes: [...R]): Rune<{ [K in keyof R]: _T<R[K]> }, _U<R[number]>>
  static ls<R extends unknown[]>(runes: [...R]): Rune<_T<R[number]>[], _U<R[number]>> {
    return Rune.new(_LsRune, runes.map(Rune.resolve))
  }

  static rec<R extends {}>(
    runes: R,
  ): Rune<{ [K in keyof R]: _T<R[K]> }, _U<R[keyof R]>> {
    const keys = Object.keys(runes)
    const values = Object.values(runes)
    return Rune.ls(values).pipe((values) => {
      return Object.fromEntries(values.map((v, i) => [keys[i], v]))
    })
  }

  static asyncIter<T>(fn: (signal: AbortSignal) => AsyncIterable<T>): Rune<T, never> {
    return Rune.new(_AsyncIterRune, fn)
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

  unwrapError<T, U>(this: Rune<T, U>) {
    return this.unwrapNot((x): x is Extract<T, Error> => x instanceof Error)
  }

  unwrapOption<T, U>(this: Rune<T, U>) {
    return this.unwrapNot((x): x is T & undefined => x === undefined)
  }

  catch(): Rune<
    T | Exclude<U, UnwrappedValue<any>>,
    U extends UnwrappedValue<infer X> ? X : never
  > {
    return Rune.new(_CatchRune, this)
  }

  wrapU() {
    return Rune.new(_WrapURune, this)
  }

  lazy() {
    return Rune.new(_LazyRune, this)
  }

  filter(fn: (value: T) => boolean): Rune<T, U>
  filter<T2 extends T>(fn: (value: T) => value is T2): Rune<T2, U>
  filter(fn: (value: T) => boolean): Rune<T, U> {
    return Rune.new(_FilterRune, this, fn)
  }

  last() {
    return Rune.new(_LastRune, this)
  }

  reduce<T2>(init: T2, fn: (last: T2, value: T) => PromiseOr<T2>): Rune<T2, U> {
    return Rune.new(_ReduceRune, this, init, fn)
  }

  collect() {
    return this.reduce<T[]>([], (arr, val) => {
      arr.push(val)
      return arr
    }).last().singular()
  }

  flat<T, U1, U2>(this: Rune<Rune<T, U1>, U2>, indirect?: Rune<any, any>): Rune<T, U1 | U2> {
    return Rune.new(_FlatRune, this, indirect)
  }

  flatMap<T1, T2, U1, U2, U3>(
    this: Rune<Rune<T1, U1>, U2>,
    fn: (rune: Rune<T1, U1>) => Rune<T2, U3>,
  ): Rune<T2, U1 | U2 | U3> {
    return this.pipe(fn).flat(fn(Rune._placeholder()))
  }

  mapArray<T1, U1, T2, U2>(
    this: Rune<T1[], U1>,
    fn: (value: Rune<T1, never>) => Rune<T2, U2>,
  ): Rune<T2[], U1 | U2> {
    return this
      .pipe((arr) => Rune.ls(arr.map((val) => fn(Rune.constant(val)))))
      .flat(fn(Rune.new(_PlaceholderRune)))
  }

  singular() {
    return Rune.new(_SingularRune, this)
  }

  as<T2 extends T, U2 extends U = U>(): Rune<T2, U2> {
    return new Rune(this._prime as any)
  }

  static _placeholder() {
    return Rune.new(_PlaceholderRune)
  }

  subclass<A extends unknown[], C>(
    ctor: new(_prime: (batch: Batch) => _Rune<T, U>, ...args: A) => C,
    ...args: A
  ) {
    return new ctor(this._prime, ...args)
  }
}

class _ConstantRune<T> extends _Rune<T, never> {
  constructor(batch: Batch, readonly value: T) {
    super(batch)
  }

  async _evaluate() {
    return this.value
  }
}

class _PipeRune<T1, U, T2> extends _Rune<T2, U> {
  child
  constructor(
    batch: Batch,
    child: Rune<T1, U>,
    readonly fn: (value: T1) => PromiseOr<T2>,
  ) {
    super(batch)
    this.child = batch.prime(child, this.signal)
  }

  lastValue: T2 = null!
  async _evaluate(time: number, receipt: Receipt) {
    // TODO: improve
    const source = await this.child.evaluate(time, receipt)
    if (!receipt.ready || !receipt.novel) return this.lastValue
    return this.lastValue = await this.fn(source)
  }
}

class _LsRune<T, U> extends _Rune<T[], U> {
  children
  constructor(batch: Batch, children: Rune<T, U>[]) {
    super(batch)
    this.children = children.map((child) => batch.prime(child, this.signal))
  }

  async _evaluate(time: number, receipt: Receipt) {
    return Promise.all(this.children.map((child) => child.evaluate(time, receipt)))
  }
}

export abstract class _StreamRune<T> extends _Rune<T, never> {
  initPromise = deferred<void>()
  valueQueue: [number, T][] = []
  eventSource = new EventSource(this.batch.timeline)
  first = true
  done = false

  curIter = new AbortController()

  lastValue: T = null!
  constructor(batch: Batch) {
    super(batch)
  }

  async _evaluate(time: number, receipt: Receipt): Promise<T> {
    if (this.first) {
      await this.initPromise
    }
    while (time >= this.valueQueue[0]?.[0]!) { // NaN comparisons are false
      receipt.novel = true
      this.lastValue = this.valueQueue.shift()![1]
    }
    const value = this.lastValue
    if (this.valueQueue.length) {
      receipt.setNextTime(this.valueQueue[0]![0])
    } else if (!this.done) {
      receipt.bind(this.eventSource)
    }
    return value
  }

  push(value: T) {
    if (this.first) {
      this.first = false
      this.valueQueue.push([0, value])
      this.initPromise.resolve()
    } else {
      this.valueQueue.push([this.eventSource.push(), value])
    }
  }

  finish() {
    this.done = true
    this.eventSource.finish()
  }
}

class _AsyncIterRune<T> extends _StreamRune<T> {
  constructor(batch: Batch, fn: (signal: AbortSignal) => AsyncIterable<T>) {
    super(batch)
    ;(async () => {
      for await (const value of fn(this.signal)) {
        this.push(value)
      }
      this.finish()
    })()
  }
}

export class UnwrappedValue<T = unknown> {
  constructor(readonly value: T) {}
}

class _UnwrapRune<T1, U, T2 extends T1> extends _Rune<T2, U | Exclude<T1, T2>> {
  child
  constructor(batch: Batch, child: Rune<T1, U>, readonly fn: (value: T1) => value is T2) {
    super(batch)
    this.child = batch.prime(child, this.signal)
  }

  async _evaluate(time: number, receipt: Receipt) {
    const value = await this.child.evaluate(time, receipt)
    if (this.fn(value)) return value
    throw new UnwrappedValue(value)
  }
}

class _CatchRune<T, U> extends _Rune<
  T | Exclude<U, UnwrappedValue<any>>,
  U extends UnwrappedValue<infer X> ? X : never
> {
  child
  constructor(batch: Batch, child: Rune<T, U>) {
    super(batch)
    this.child = batch.prime(child, this.signal)
  }

  async _evaluate(time: number, receipt: Receipt) {
    try {
      return await this.child.evaluate(time, receipt)
    } catch (e) {
      if (e instanceof UnwrappedValue) {
        if (e.value instanceof UnwrappedValue) {
          throw e.value
        } else {
          return e.value as Exclude<U, UnwrappedValue<any>>
        }
      }
      throw e
    }
  }
}

class _WrapURune<T, U> extends _Rune<T, UnwrappedValue<U>> {
  child
  constructor(batch: Batch, child: Rune<T, U>) {
    super(batch)
    this.child = batch.prime(child, this.signal)
  }

  async _evaluate(time: number, receipt: Receipt) {
    try {
      return await this.child.evaluate(time, receipt)
    } catch (e) {
      if (e instanceof UnwrappedValue) {
        throw new UnwrappedValue(e)
      }
      throw e
    }
  }
}

class _LazyRune<T, U> extends _Rune<T, U> {
  child
  constructor(batch: Batch, child: Rune<T, U>) {
    super(batch)
    this.child = batch.prime(child, this.signal)
  }

  async _evaluate(time: number, _receipt: Receipt): Promise<T> {
    return await this.child.evaluate(time, new Receipt())
  }
}

class _FilterRune<T, U> extends _Rune<T, U> {
  child
  constructor(batch: Batch, child: Rune<T, U>, readonly fn: (value: T) => boolean) {
    super(batch)
    this.child = batch.prime(child, this.signal)
  }

  first = true
  lastValue: T = null!
  async _evaluate(time: number, receipt: Receipt): Promise<T> {
    const _receipt = new Receipt()
    try {
      const value = await this.child.evaluate(time, _receipt)
      if (!_receipt.ready || !_receipt.novel || this.fn(value)) {
        receipt.setNovel(_receipt.novel)
        this.lastValue = value
        this.first = false
        return value
      } else {
        receipt.setReady(!this.first)
        receipt.novel = true
        return this.lastValue
      }
    } finally {
      receipt.setNextTimeFrom(_receipt)
    }
  }
}

class _LastRune<T, U> extends _Rune<T, U> {
  child
  constructor(batch: Batch, child: Rune<T, U>) {
    super(batch)
    this.child = batch.prime(child, this.signal)
  }

  async _evaluate(time: number, receipt: Receipt): Promise<T> {
    const value = await this.child.evaluate(time, receipt)
    await receipt.finalized()
    receipt.setReady(receipt.nextTime === Infinity)
    return value
  }
}

class _ReduceRune<T1, U, T2> extends _Rune<T2, U> {
  child
  constructor(
    batch: Batch,
    child: Rune<T1, U>,
    public lastValue: T2,
    readonly fn: (last: T2, value: T1) => PromiseOr<T2>,
  ) {
    super(batch)
    this.child = batch.prime(child, this.signal)
  }

  async _evaluate(time: number, receipt: Receipt) {
    // TODO: improve
    const source = await this.child.evaluate(time, receipt)
    if (!receipt.ready || !receipt.novel) return this.lastValue
    return this.lastValue = await this.fn(this.lastValue, source)
  }
}

class _FlatRune<T, U1, U2> extends _Rune<T, U1 | U2> {
  child
  constructor(batch: Batch, child: Rune<Rune<T, U1>, U2>, indirect?: Rune<unknown, unknown>) {
    super(batch)
    this.child = batch.prime(child, this.signal)
    if (indirect) batch.prime(indirect, this.signal)
  }

  lastChildReceipt = new Receipt()
  innerController = new AbortController()
  currentInner: _Rune<T, U1> = null!
  lastValue: T = null!
  first = true
  async _evaluate(time: number, receipt: Receipt): Promise<T> {
    const rune = await this.child.evaluate(time, receipt)
    if (!receipt.ready) return null!
    if (receipt.novel) {
      this.innerController.abort()
      this.currentInner = new Batch(this.batch.timeline, this.batch).prime(
        rune,
        this.innerController.signal,
      )
    }
    const _receipt = new Receipt()
    try {
      const value = await this.currentInner.evaluate(time, _receipt)
      if (!_receipt.ready) {
        if (this.first) {
          receipt.ready = false
        }
        return this.lastValue
      }
      this.first = false
      return value
    } finally {
      receipt.setFrom(_receipt)
    }
  }

  override cleanup(): void {
    this.innerController.abort()
  }
}

class _SingularRune<T, U> extends _Rune<T, U> {
  constructor(batch: Batch, readonly child: Rune<T, U>) {
    super(batch)
  }

  result?: Promise<T>
  _evaluate(time: number, receipt: Receipt): Promise<T> {
    return this.result ??= this.child.run(
      new Batch(
        new Timeline(),
        this.batch,
        (x) => new _ProxyRune(this.batch, x, time, receipt),
      ),
    )
  }
}

class _PlaceholderRune extends _Rune<never, never> {
  async _evaluate(): Promise<never> {
    throw new Error("PlaceholderRune should not be evaluated")
  }
}
