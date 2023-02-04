import { deferred } from "../deps/std/async.ts"

export class Clock {
  time = 0
  next = deferred()
  scheduled = false
  timeout = -1

  reset() {
    if (this.scheduled) clearTimeout(this.timeout)
    this.scheduled = false
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
    this.timeout = setTimeout(() => {
      this.scheduled = false
      this.time++
      this.next = deferred()
      old.resolve()
    }, 0)
  }
}
