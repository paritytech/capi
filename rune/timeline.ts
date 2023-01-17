import { Notifier } from "../util/notifier.ts"

export class Timeline {
  current = 0

  extend() {
    return ++this.current
  }
}

export class Receipt {
  novel = false
  nextTime = Infinity
  eventSources = new Set<EventSource>()
  _finalized = new Notifier()

  async finalized() {
    if (this.eventSources.size) await this._finalized
  }

  setNovel(novel: boolean) {
    if (novel) this.novel = true
  }

  setNextTimeFrom(receipt: Receipt) {
    this.setNextTime(receipt.nextTime)
    if (this.nextTime === Infinity) {
      for (const source of receipt.eventSources) {
        this.bind(source)
      }
    }
  }

  setNextTime(time: number) {
    if (time < this.nextTime) {
      this.nextTime = time
      if (this.eventSources.size) {
        for (const source of this.eventSources) {
          source.receipts.delete(this)
        }
        this.eventSources.clear()
        this._finalized.emit()
      }
    }
  }

  setFrom(receipt: Receipt) {
    this.setNovel(receipt.novel)
    this.setNextTimeFrom(receipt)
  }

  bind(source: EventSource) {
    if (this.nextTime !== Infinity) return
    source.receipts.add(this)
    this.eventSources.add(source)
  }
}

export class EventSource {
  receipts = new Set<Receipt>()

  constructor(readonly timeline: Timeline) {}

  push() {
    const time = this.timeline.extend()
    for (const receipt of this.receipts) {
      receipt.setNextTime(time)
    }
    this.receipts.clear()
    return time
  }

  finish() {
    for (const receipt of this.receipts) {
      receipt.eventSources.delete(this)
      if (!receipt.eventSources.size) receipt._finalized.emit()
    }
    this.receipts.clear()
  }
}
