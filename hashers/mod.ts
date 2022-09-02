import { blake2b } from "../deps/blake2b.ts";
import * as $ from "../deps/scale.ts";
import { EncodeBuffer } from "../deps/scale.ts";
import { DecodeNonTransparentKeyError } from "../frame_metadata/Key.ts";
import { Xxhash } from "./xxhash.ts";

export abstract class Hasher {
  abstract create(): Hashing;
  abstract digestLength: number;
  abstract concat: boolean;

  $hash<T>($inner: $.Codec<T>): $.Codec<T> {
    return $.createCodec({
      _metadata: null,
      _staticSize: this.digestLength + $inner._staticSize,
      _encode: (buffer, value) => {
        const hashArray = buffer.array.subarray(buffer.index, buffer.index += this.digestLength);
        const cursor = this.concat
          ? buffer.createCursor($inner._staticSize)
          : new EncodeBuffer(buffer.stealAlloc($inner._staticSize));
        $inner._encode(cursor, value);
        buffer.waitForBuffer(cursor, () => {
          if (this.concat) (cursor as ReturnType<EncodeBuffer["createCursor"]>).close();
          else cursor._commitWritten();
          const hashing = this.create();
          updateHashing(hashing, cursor);
          hashing.digestInto(hashArray);
        });
      },
      _decode: (buffer) => {
        if (!this.concat) throw new DecodeNonTransparentKeyError();
        buffer.index += this.digestLength;
        return $inner._decode(buffer);
      },
    });
  }

  hash(data: Uint8Array): Uint8Array {
    const output = new Uint8Array(this.digestLength + (this.concat ? data.length : 0));
    const hashing = this.create();
    hashing.update(data);
    hashing.digestInto(output);
    if (this.concat) {
      output.set(data, this.digestLength);
    }
    return output;
  }
}

export class Blake2Hasher extends Hasher {
  digestLength;
  constructor(size: 128 | 256, public concat: boolean) {
    super();
    this.digestLength = size / 8;
  }

  create(): Hashing {
    return blake2b.create({ dkLen: this.digestLength });
  }
}

export class IdentityHasher extends Hasher {
  digestLength = 0;
  concat = true;

  create(): Hashing {
    return {
      update() {},
      digestInto() {},
    };
  }

  override $hash<T>($inner: $.Codec<T>): $.Codec<T> {
    return $inner;
  }

  override hash(data: Uint8Array): Uint8Array {
    return data.slice();
  }
}

export class TwoxHasher extends Hasher {
  digestLength;
  rounds;
  constructor(size: 64 | 128 | 256, public concat: boolean) {
    super();
    this.digestLength = size / 8;
    this.rounds = size / 64;
  }

  create(): Hashing {
    return new Xxhash(this.rounds);
  }
}

export interface Hashing {
  update(data: Uint8Array): void;
  digestInto(array: Uint8Array): void;
}

export const Blake2_128 = new Blake2Hasher(128, false);
export const Blake2_128Concat = new Blake2Hasher(128, true);
export const Blake2_256 = new Blake2Hasher(256, false);
export const Identity = new IdentityHasher();
export const Twox128 = new TwoxHasher(128, false);
export const Twox256 = new TwoxHasher(256, false);
export const Twox64Concat = new TwoxHasher(64, true);

function updateHashing(hashing: Hashing, data: EncodeBuffer) {
  for (const array of data.finishedArrays) {
    if (array instanceof EncodeBuffer) {
      updateHashing(hashing, array);
    } else {
      hashing.update(array);
    }
  }
}
