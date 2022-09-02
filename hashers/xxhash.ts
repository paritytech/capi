/*
  Copyright 2022 Parity Technologies
  SPDX-License-Identifier: Apache-2.0
  Adapted from https://github.com/polkadot-js/common/blob/40d6a388/packages/util-crypto/src/xxhash/xxhash64.ts

  Copyright 2017-2022 @polkadot/util-crypto authors & contributors
  SPDX-License-Identifier: Apache-2.0
  Adapted from https://github.com/pierrec/js-xxhash/blob/0504e76f3d31a21ae8528a7f590c7289c9e431d2/lib/xxhash64.js

  xxHash64 implementation in pure Javascript
  Copyright (C) 2016, Pierre Curto

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

const P64_1 = 11400714785074694791n;
const P64_2 = 14029467366897019727n;
const P64_3 = 1609587929392839161n;
const P64_4 = 9650029242287828579n;
const P64_5 = 2870177450012600261n;

// mask for a u64, all bits set
const U64 = 0xff_ff_ff_ff_ff_ff_ff_ffn;

function rotl(a: bigint, b: bigint): bigint {
  const c = a & U64;

  return ((c << b) | (c >> (64n - b))) & U64;
}

export class Xxhash {
  buf = new Uint8Array(32);
  view = new DataView(this.buf.buffer);
  bufI = 0;
  written = 0;
  vs;

  constructor(public rounds: number) {
    this.vs = new BigUint64Array(rounds * 4);
    for (let i = 0, seed = 0n; i < this.vs.length; seed++) {
      this.vs[i++] = seed + P64_1 + P64_2;
      this.vs[i++] = seed + P64_2;
      this.vs[i++] = seed;
      this.vs[i++] = seed - P64_1;
    }
  }

  _updateVs(view: DataView, p: number) {
    const a = view.getBigUint64(p, true);
    const b = view.getBigUint64(p + 8, true);
    const c = view.getBigUint64(p + 16, true);
    const d = view.getBigUint64(p + 24, true);
    for (let i = 0; i < this.vs.length;) {
      this.vs[i] = P64_1 * rotl(this.vs[i++]! + P64_2 * a, 31n);
      this.vs[i] = P64_1 * rotl(this.vs[i++]! + P64_2 * b, 31n);
      this.vs[i] = P64_1 * rotl(this.vs[i++]! + P64_2 * c, 31n);
      this.vs[i] = P64_1 * rotl(this.vs[i++]! + P64_2 * d, 31n);
    }
  }

  update(input: Uint8Array) {
    this.written += input.length;
    let i = 0;
    if (this.bufI) {
      i = Math.min(input.length, 32 - this.bufI);
      this.buf.set(input.subarray(0, i), this.bufI);
      this.bufI += i;
      if (this.bufI < 32) return;
      this._updateVs(this.view, 0);
    }
    if (i <= input.length - 32) {
      const view = new DataView(input.buffer, input.byteOffset, input.byteLength);
      do {
        this._updateVs(view, i);
        i += 32;
      } while (i + 32 <= input.length);
    }
    this.buf.set(input.subarray(i));
    this.bufI = input.length - i;
  }

  digest() {
    return this.digestInto(new Uint8Array(this.rounds * 8));
  }

  digestInto(digest: Uint8Array) {
    const digestView = new DataView(digest.buffer, digest.byteOffset, digest.byteLength);
    for (let i = 0; i < this.rounds; i++) {
      const v0 = this.vs[i * 4]!;
      const v1 = this.vs[i * 4 + 1]!;
      const v2 = this.vs[i * 4 + 2]!;
      const v3 = this.vs[i * 4 + 3]!;

      let h64 = 0n;
      if (this.written >= 32) {
        h64 = U64 & (rotl(v0, 1n) + rotl(v1, 7n) + rotl(v2, 12n) + rotl(v3, 18n));
        h64 = U64 & ((h64 ^ (P64_1 * rotl(v0 * P64_2, 31n))) * P64_1 + P64_4);
        h64 = U64 & ((h64 ^ (P64_1 * rotl(v1 * P64_2, 31n))) * P64_1 + P64_4);
        h64 = U64 & ((h64 ^ (P64_1 * rotl(v2 * P64_2, 31n))) * P64_1 + P64_4);
        h64 = U64 & ((h64 ^ (P64_1 * rotl(v3 * P64_2, 31n))) * P64_1 + P64_4);
      } else {
        h64 = BigInt(i) + P64_5;
      }
      h64 = U64 & (BigInt(this.written) + h64);

      let p = 0;
      while (p + 8 <= this.bufI) {
        const n = this.view.getBigUint64(p, true);
        h64 = U64 & (P64_4 + P64_1 * rotl(h64 ^ (P64_1 * rotl(P64_2 * n, 31n)), 27n));
        p += 8;
      }

      if (p + 4 <= this.bufI) {
        const n = BigInt(this.view.getUint32(p, true));
        h64 = U64 & (P64_3 + P64_2 * rotl(h64 ^ (P64_1 * n), 23n));
        p += 4;
      }

      while (p < this.bufI) {
        const n = BigInt(this.buf[p++]!);
        h64 = U64 & (P64_1 * rotl(h64 ^ (P64_5 * n), 11n));
      }

      h64 = U64 & (P64_2 * (h64 ^ (h64 >> 33n)));
      h64 = U64 & (P64_3 * (h64 ^ (h64 >> 29n)));
      h64 = U64 & (h64 ^ (h64 >> 32n));

      digestView.setBigUint64(i * 8, h64, true);
    }
    return digest;
  }
}
