import * as $ from "../deps/scale.ts"
import * as M from "../frame_metadata/mod.ts"
import { Args } from "../rune/args.ts"
import { Rune } from "../rune/rune.ts"
import { DeriveCodec, Ty } from "../scale_info/mod.ts"

export class CodecRune<T, U> extends Rune<$.Codec<T>, U> {
  // TODO: eventually, utilize `V` to toggle runtime validation
  encoded<X>(...[value]: Args<X, [value: T]>) {
    return Rune.ls([this, value]).pipe(async ([codec, value]) => {
      try {
        $.assert(codec, value)
      } catch (e) {
        return e as $.ScaleAssertError
      }
      return await codec.encodeAsync(value)
    })
  }

  decoded<X>(...[value]: Args<X, [value: Uint8Array]>) {
    return Rune.ls([this, value]).pipe(([codec, value]) => codec.decode(value))
  }
}

export function deriveCodec<X>(...[metadata]: Args<X, [metadata: M.Metadata]>) {
  return Rune.resolve(metadata).pipe((metadata) => DeriveCodec(metadata.tys))
}

export function codec<X>(...args: Args<X, [deriveCodec: DeriveCodec, ty: number | Ty]>) {
  return Rune.ls(args).pipe(([deriveCodec, ty]) => deriveCodec(ty)).subclass(CodecRune)
}

export function $extrinsic<X>(args: Args<X, M.ExtrinsicCodecProps>) {
  return Rune.rec(args).pipe(M.$extrinsic).subclass(CodecRune)
}

export function $storageKey<X>(args: Args<X, M.StorageKeyProps>) {
  return Rune.rec(args).pipe(M.$storageKey).subclass(CodecRune)
}
