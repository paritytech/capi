import { Hex, hex } from "../util/mod.ts";
import wasmCode from "./blake2b.wasm.ts";

const memory = new WebAssembly.Memory({ initial: 1, maximum: 128 });

const wasmModule = new WebAssembly.Module(wasmCode);
const wasmInstance = new WebAssembly.Instance(wasmModule, {
  blake2b: { memory },
});

interface XxhashWasm {
  iv_adr: WebAssembly.Global;
  free_mem: WebAssembly.Global;
  reset(state_adr: number, dk_len: number): void;
  update(state_adr: number, msg_adr: number, msg_end: number, written: number): void;
  finish(state_adr: number, msg_adr: number, written: number): void;
}

const wasm = wasmInstance.exports as never as XxhashWasm;

let memBuf = new Uint8Array(memory.buffer);
let memI = wasm.free_mem.value;

memBuf.set(
  hex.decode(
"\
08c9bcf367e6096a3ba7ca8485ae67bb2bf894fe72f36e3cf1361d5f3af54fa5\
d182e6ad7f520e511f6c3e2b8c68059b6bbd41fbabd9831f79217e1319cde05b\
0008101820283038404850586068707870502040487868300860001058382818\
5840600028107868507018303808482038481808686058701030285020007840\
4800283810205078700858603040186810603050005840182068382878700848\
6028087870682050003830184810405868583870600818482800782040301050\
3078704858180040601068380820502850104020383008287858487018606800\
0008101820283038404850586068707870502040487868300860001058382818\
" as Hex,
  ),
  wasm.iv_adr.value,
);

const pool: Blake2bInner[] = [];
const finReg = new FinalizationRegistry<Blake2bInner>((inner) => {
  pool.push(inner);
});

export class Blake2b {
  private inner = pool.pop() ?? new Blake2bInner();

  constructor(public digestSize: number = 64) {
    finReg.register(this, this.inner, this.inner);
    this.inner.reset(digestSize);
  }

  update(input: Uint8Array) {
    this.inner.update(input);
  }

  digest() {
    return this.inner.digest(this.digestSize);
  }

  digestInto(digest: Uint8Array) {
    this.inner.digestInto(this.digestSize, digest);
  }

  dispose() {
    pool.push(this.inner);
    finReg.unregister(this.inner);
    this.inner = null!;
  }
}

class Blake2bInner {
  exLoc = 0;
  adr;
  exLen = 0;
  written = 0;

  constructor() {
    ensureAvailable(128 + 64);
    this.exLoc = memI;
    memI += 128;
    this.adr = memI;
    memI += 64;
  }

  reset(digestSize: number) {
    wasm.reset(this.adr, digestSize);
    this.written = 0;
    this.exLen = 0;
  }

  update(input: Uint8Array) {
    const total = this.exLen + input.length;
    if (total <= 128) {
      memBuf.set(input, this.exLoc + this.exLen);
      this.exLen += input.length;
      return;
    }
    ensureAvailable(total);
    if (this.exLen) {
      memBuf.set(memBuf.subarray(this.exLoc, this.exLoc + this.exLen), memI);
    }
    memBuf.set(input, memI + this.exLen);
    const excess = total % 128 || 128;
    wasm.update(this.adr, memI, memI + total - excess, this.written);
    this.written += total - excess;
    if (excess) {
      memBuf.set(input.subarray(input.length - excess), this.exLoc);
    }
    this.exLen = excess;
  }

  _digest() {
    this.written += this.exLen;
    memBuf.fill(0, this.exLoc + this.exLen, this.exLoc + 128);
    wasm.finish(
      this.adr,
      this.exLoc,
      this.written,
    );
  }

  digestInto(digestSize: number, digest: Uint8Array) {
    this._digest();
    digest.set(memBuf.subarray(this.adr, this.adr + digestSize));
  }

  digest(digestSize: number) {
    this._digest();
    return memBuf.slice(this.adr, this.adr + digestSize);
  }
}

function ensureAvailable(length: number) {
  if (memI + length <= memBuf.length) return;
  memory.grow(Math.ceil((memI + length - memBuf.length) / 65536));
  memBuf = new Uint8Array(memory.buffer);
}
