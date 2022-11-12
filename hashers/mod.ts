import * as $ from "../deps/scale.ts"
import { EncodeBuffer } from "../deps/scale.ts"
import { Blake2b } from "./blake2b.ts"
import { Xxhash } from "./xxhash.ts"

export abstract class Hasher {
  abstract create(): Hashing
  abstract digestLength: number
  abstract concat: boolean

  $hash<T>($inner: $.Codec<T>): $.Codec<T> {
    return $hash(this, $inner)
  }

  hash(data: Uint8Array): Uint8Array {
    const output = new Uint8Array(this.digestLength + (this.concat ? data.length : 0))
    const hashing = this.create()
    hashing.update(data)
    hashing.digestInto(output)
    hashing.dispose?.()
    if (this.concat) {
      output.set(data, this.digestLength)
    }
    return output
  }
}

function $hash<T>(hasher: Hasher, $inner: $.Codec<T>): $.Codec<T> {
  return $.createCodec({
    _metadata: $.metadata("$hash", $hash, hasher, $inner),
    _staticSize: hasher.digestLength + $inner._staticSize,
    _encode(buffer, value) {
      const hashArray = buffer.array.subarray(buffer.index, buffer.index += hasher.digestLength)
      const cursor = hasher.concat
        ? buffer.createCursor($inner._staticSize)
        : new EncodeBuffer(buffer.stealAlloc($inner._staticSize))
      $inner._encode(cursor, value)
      buffer.waitForBuffer(cursor, () => {
        if (hasher.concat) (cursor as ReturnType<EncodeBuffer["createCursor"]>).close()
        else cursor._commitWritten()
        const hashing = hasher.create()
        updateHashing(hashing, cursor)
        hashing.digestInto(hashArray)
        hashing.dispose?.()
      })
    },
    _decode(buffer) {
      if (!hasher.concat) throw new DecodeNonTransparentKeyError()
      buffer.index += hasher.digestLength
      return $inner._decode(buffer)
    },
    _assert(assert) {
      $inner._assert(assert)
    },
  })
}

export class Blake2Hasher extends Hasher {
  digestLength
  constructor(size: 128 | 256, public concat: boolean) {
    super()
    this.digestLength = size / 8
  }

  create(): Hashing {
    return new Blake2b(this.digestLength)
  }
}

export class IdentityHasher extends Hasher {
  digestLength = 0
  concat = true

  create(): Hashing {
    return {
      update() {},
      digestInto() {},
    }
  }

  override $hash<T>($inner: $.Codec<T>): $.Codec<T> {
    return $inner
  }

  override hash(data: Uint8Array): Uint8Array {
    return data.slice()
  }
}

export class TwoxHasher extends Hasher {
  digestLength
  rounds
  constructor(size: 64 | 128 | 256, public concat: boolean) {
    super()
    this.digestLength = size / 8
    this.rounds = size / 64
  }

  create(): Hashing {
    return new Xxhash(this.rounds)
  }
}

export interface Hashing {
  update(data: Uint8Array): void
  digestInto(array: Uint8Array): void
  dispose?(): void
}

export const Blake2_128 = new Blake2Hasher(128, false)
export const Blake2_128Concat = new Blake2Hasher(128, true)
export const Blake2_256 = new Blake2Hasher(256, false)
export const Identity = new IdentityHasher()
export const Twox128 = new TwoxHasher(128, false)
export const Twox256 = new TwoxHasher(256, false)
export const Twox64Concat = new TwoxHasher(64, true)

function updateHashing(hashing: Hashing, data: EncodeBuffer) {
  for (const array of data.finishedArrays) {
    if (array instanceof EncodeBuffer) {
      updateHashing(hashing, array)
    } else {
      hashing.update(array)
    }
  }
}

export class DecodeNonTransparentKeyError extends Error {
  override readonly name = "DecodeNonTransparentKeyError"
}
