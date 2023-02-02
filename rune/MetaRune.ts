import { Batch, Run, Rune } from "./Rune.ts"
import { Receipt } from "./Timeline.ts"
import { ValueRune } from "./ValueRune.ts"

export class MetaRune<T, U1, U2> extends Rune<Rune<T, U1>, U2> {
  flat(indirect?: Rune<any, any>): ValueRune<T, U1 | U2> {
    return ValueRune.new(RunFlat, this, indirect)
  }

  flatMap<T2, U3>(fn: (rune: Rune<T, U1>) => Rune<T2, U3>): ValueRune<T2, U1 | U2 | U3> {
    return this.as(ValueRune).map(fn).as(MetaRune).flat(fn(Rune._placeholder()))
  }
}

class RunFlat<T, U1, U2> extends Run<T, U1 | U2> {
  child
  constructor(batch: Batch, child: Rune<Rune<T, U1>, U2>, indirect?: Rune<unknown, unknown>) {
    super(batch)
    this.child = batch.prime(child, this.signal)
    if (indirect) batch.prime(indirect, this.signal)
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
      this.innerController.abort()
      this.innerController = new AbortController()
      // const innerBatch = new Batch(this.batch.timeline, this.batch)
      this.currentInner = this.batch.prime(rune, this.innerController.signal)
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