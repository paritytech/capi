import wasmCode from "./xxhash.wasm.ts"

const memory = new WebAssembly.Memory({ initial: 1, maximum: 128 })

const wasmModule = new WebAssembly.Module(wasmCode)
const wasmInstance = new WebAssembly.Instance(wasmModule, {
  xxhash: { memory },
})

interface XxhashWasm {
  max_rounds: WebAssembly.Global
  free_mem: WebAssembly.Global
  init_mod(): void
  reset(rounds: number, state_adr: number): void
  update(rounds: number, state_adr: number, pos: number, end: number): void
  digest(
    rounds: number,
    state_adr: number,
    written: number,
    pos: number,
    end: number,
    digest_adr: number,
  ): void
}

const wasm = wasmInstance.exports as never as XxhashWasm
wasm.init_mod()

const maxRounds = wasm.max_rounds.value

let memBuf = new Uint8Array(memory.buffer)
let memI = wasm.free_mem.value

const pool: XxhashInner[] = []
const finReg = new FinalizationRegistry<XxhashInner>((inner) => {
  pool.push(inner)
})

export class Xxhash {
  private inner = pool.pop() ?? new XxhashInner()

  constructor(public rounds: number) {
    finReg.register(this, this.inner, this.inner)
    this.inner.reset(rounds)
  }

  update(input: Uint8Array) {
    this.inner.update(this.rounds, input)
  }

  digest() {
    return this.inner.digest(this.rounds)
  }

  digestInto(digest: Uint8Array) {
    this.inner.digestInto(this.rounds, digest)
  }

  dispose() {
    pool.push(this.inner)
    finReg.unregister(this.inner)
    this.inner = null!
  }
}

class XxhashInner {
  exLoc = 0
  adr
  exLen = 0
  written = 0

  constructor() {
    ensureAvailable(32 + maxRounds * 32)
    this.exLoc = memI
    memI += 32
    this.adr = memI
    memI += maxRounds * 32
  }

  reset(rounds: number) {
    wasm.reset(rounds, this.adr)
    this.written = 0
    this.exLen = 0
  }

  update(rounds: number, input: Uint8Array) {
    this.written += input.length
    const total = this.exLen + input.length
    if (total < 32) {
      memBuf.set(input, this.exLoc + this.exLen)
      this.exLen += input.length
      return
    }
    ensureAvailable(total)
    if (this.exLen) {
      memBuf.set(memBuf.subarray(this.exLoc, this.exLoc + this.exLen), memI)
    }
    memBuf.set(input, memI + this.exLen)
    const excess = total % 32
    wasm.update(rounds, this.adr, memI, memI + total - excess)
    if (excess) {
      memBuf.set(input.subarray(input.length - excess), this.exLoc)
    }
    this.exLen = excess
  }

  _digest(rounds: number) {
    ensureAvailable(rounds * 8)
    wasm.digest(
      rounds,
      this.adr,
      this.written,
      this.exLoc,
      this.exLoc + this.exLen,
      memI,
    )
  }

  digestInto(rounds: number, digest: Uint8Array) {
    this._digest(rounds)
    digest.set(memBuf.subarray(memI, memI + rounds * 8))
  }

  digest(rounds: number) {
    this._digest(rounds)
    return memBuf.slice(memI, memI + rounds * 8)
  }
}

function ensureAvailable(length: number) {
  if (memI + length <= memBuf.length) return
  memory.grow(Math.ceil((memI + length - memBuf.length) / 65536))
  memBuf = new Uint8Array(memory.buffer)
}
