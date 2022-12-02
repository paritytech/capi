import { Notifier } from "../util/notifier.ts"

export class Timeline {
  time = 0
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

  finalized = new Notifier()
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
