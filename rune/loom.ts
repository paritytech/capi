export class Loom {
  constructor(
    readonly onExtend: (weft: Weft, knot: number) => void,
    readonly onCut: (weft: Weft) => void,
  ) {}

  activeWefts = 0
}

export class Weft {
  lastKnot = 0
  done = false

  constructor(readonly loom: Loom) {
    loom.activeWefts++
  }

  extend(): number {
    const knot = ++this.lastKnot
    queueMicrotask(() => this.loom.onExtend(this, knot))
    return knot
  }

  cut() {
    this.loom.activeWefts--
    this.done = true
    queueMicrotask(() => this.loom.onCut(this))
  }
}

export class Warp {
  knots = new Map<Weft, number>()

  constructor(readonly parent?: Warp) {}

  tie(weft: Weft, knot: number, override = false): number {
    const existing = this.knots.get(weft)
    if (!existing || override) {
      this.knots.set(weft, knot)
      if (this.parent) {
        return this.parent.tie(weft, knot, override)
      }
    } else if (existing !== knot) {
      throw new Error("Cannot tie Warp to Weft at two heights")
    }
    return knot
  }

  get(weft: Weft) {
    return this.knots.get(weft)
  }

  satisfies(warp: Warp) {
    for (const [weft, height] of this.knots) {
      if ((warp.get(weft) ?? height) !== height) {
        return false
      }
    }
    return true
  }

  fork() {
    return new Warp(this)
  }
}
