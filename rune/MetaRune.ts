import { Primer, Run, Rune } from "./Rune.ts"
import { Receipt, Timeline } from "./Timeline.ts"
import { ValueRune } from "./ValueRune.ts"

export class MetaRune<T, U1, U2> extends Rune<Rune<T, U1>, U2> {
  flat(): ValueRune<T, U1 | U2> {
    return ValueRune.new(RunFlat, this)
  }

  metaMap<T2, U3>(fn: (rune: Rune<T, U1>) => Rune<T2, U3>): MetaRune<T2, U3, U2> {
    return this.into(ValueRune).map(fn).into(MetaRune).pin(fn(Rune._placeholder()))
  }

  flatMap<T2, U3>(fn: (rune: Rune<T, U1>) => Rune<T2, U3>): ValueRune<T2, U2 | U3> {
    return this.into(ValueRune).map(fn).into(MetaRune).pin(fn(Rune._placeholder())).flat()
  }

  asOrtho(): OrthoRune<T, U1, U2> {
    return new OrthoRune((primer) => new RunAsOrtho(primer, this))
  }

  pin(pinned: Rune<unknown, unknown>) {
    return Rune.pin(this, pinned).into(MetaRune)
  }
}

export class OrthoRune<T, U1, U2> extends Rune<Run<T, U1>, U2> {
  flatSingular(): ValueRune<T, U1 | U2> {
    return ValueRune.new(RunFlatSingular, this)
  }

  orthoMap<T2, U3>(fn: (rune: ValueRune<T, U1>) => ValueRune<T2, U3>): OrthoRune<T2, U3, U2> {
    return this
      .into(ValueRune)
      .map((run) => fn(new ValueRune(() => run)))
      .into(MetaRune)
      .asOrtho()
      .pin(fn(Rune._placeholder().into(ValueRune)))
  }

  pin(pinned: Rune<unknown, unknown>) {
    return Rune.pin(this, pinned).into(OrthoRune)
  }
}

class RunFlat<T, U1, U2> extends Run<T, U1 | U2> {
  child
  constructor(
    readonly primer: Primer,
    child: Rune<Rune<T, U1>, U2>,
  ) {
    super(primer)
    this.child = primer.prime(child, this.signal)
  }

  lastChildReceipt = new Receipt()
  innerController = new AbortController()
  currentInner: Run<T, U1> = null!
  lastValue: T = null!
  first = true
  async _evaluate(time: number, receipt: Receipt): Promise<T> {
    const rune = await this.child.evaluate(time, receipt)
    if (!receipt.ready) return null!
    if (receipt.novel) {
      // TODO: prime before aborting?
      this.innerController.abort()
      this.innerController = new AbortController()
      this.currentInner = this.primer.prime(rune, this.innerController.signal)
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
    super.cleanup()
  }
}

class OrthoPrimer extends Primer {
  order: number
  timeline: Timeline

  constructor(readonly parent: Primer, readonly anchorTime: number) {
    super()
    this.order = parent.order + 1
    this.timeline = parent.timeline
  }

  _prime<T, U>(rune: Rune<T, U>): Run<T, U> {
    const parentRun = this.parent.getPrimed(rune)
    if (parentRun) {
      if (parentRun.order === this.parent.order) {
        return new RunWrapOrtho(this, parentRun)
      } else {
        return parentRun
      }
    }
    const run = rune._prime(this)
    this.parent.memo.set(rune._prime, run)
    return run
  }
}

class RunFlatSingular<T, U1, U2> extends Run<T, U1 | U2> {
  child
  constructor(readonly primer: Primer, child: Rune<Run<T, U1>, U2>) {
    super(primer)
    this.child = primer.prime(child, this.signal)
  }

  async _evaluate(time: number, receipt: Receipt) {
    const run = await this.child.evaluate(time, receipt)
    return new Rune(() => run).run(this.primer)
  }
}

class RunAsOrtho<T, U1, U2> extends Run<Run<T, U1>, U2> {
  child
  constructor(readonly primer: Primer, child: Rune<Rune<T, U1>, U2>) {
    super(primer)
    this.child = primer.prime(child, this.signal)
  }

  async _evaluate(time: number, receipt: Receipt) {
    const orthoPrimer = new OrthoPrimer(this.primer, time)
    const rune = await this.child.evaluate(time, receipt)
    return orthoPrimer.prime(rune, undefined)
  }
}

class RunWrapOrtho<T, U> extends Run<T, U> {
  constructor(readonly primer: OrthoPrimer, readonly child: Run<T, U>) {
    super(primer)
    child.reference(this.signal)
  }

  _evaluate(): Promise<T> {
    return this.child.evaluate(this.primer.anchorTime, new Receipt())
  }
}
