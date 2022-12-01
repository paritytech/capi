import { deferred } from "../deps/std/async.ts"
import { assertEquals } from "../deps/std/testing/asserts.ts"

export class Clock {
  time = 0
  next = deferred()
  scheduled = false

  reset() {
    assertEquals(this.scheduled, false)
    this.time = 0
  }

  async tick(time: number) {
    while (this.time < time) {
      this.tryProceed()
      await this.next
    }
    if (time !== this.time) {
      throw new Error("Invalid time")
    }
  }

  tryProceed() {
    if (this.scheduled) return
    this.scheduled = true
    const old = this.next
    setTimeout(() => {
      this.scheduled = false
      this.time++
      this.next = deferred()
      old.resolve()
    }, 0)
  }
}
