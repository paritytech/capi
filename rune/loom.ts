export class Loom {
  height = 0n

  extend() {
    return new Weft(this)
  }
}

export class Weft {
  times: bigint[] = []
  done = false

  constructor(readonly loom: Loom) {}

  extend(): number {
    return this.times.push(++this.loom.height)
  }

  cut() {
    this.done = true
  }
}

export class Warp {
  knots = new Map<Weft, number>()

  constructor(readonly parent?: Warp) {}

  tie(weft: Weft, height: number) {
    const existing = this.knots.get(weft)
    if (!existing) {
      this.knots.set(weft, height)
      this.parent?.tie(weft, height)
    } else if (existing !== height) {
      throw new Error("Cannot tie Warp to Weft at two heights")
    }
  }

  heightOn(weft: Weft) {
    return this.knots.get(weft)
  }

  satisfies(warp: Warp) {
    for (const [weft, height] of this.knots) {
      if ((warp.heightOn(weft) ?? height) !== height) {
        return false
      }
    }
    return true
  }

  fork() {
    return new Warp(this)
  }
}
