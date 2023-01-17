import * as $ from "../deps/scale.ts"
import * as M from "../frame_metadata/mod.ts"
import * as rpc from "../rpc/mod.ts"
import { Args, Rune } from "../rune/mod.ts"
import * as U from "../util/mod.ts"
import { rpcCall } from "./rpc.ts"
import { state } from "./rpc_known_methods.ts"

export class ClientRune<out U> extends Rune<rpc.Client, U> {
  metadata<X>(...[blockHash]: Args<X, [blockHash?: U.HexHash]>) {
    return state
      .getMetadata(this.as(), blockHash)
      .unwrapError()
      .pipe((encoded) => {
        try {
          return M.fromPrefixedHex(encoded)
        } catch (e) {
          return e as $.ScaleError
        }
      })
      .unwrapError()
      .subclass(MetadataRune, this)
  }

  chainVersion = rpcCall<[], string>("system_version")(this.as()).unwrapError()
}

export class MetadataRune<out U> extends Rune<M.Metadata, U> {
  constructor(_prime: MetadataRune<U>["_prime"], readonly client: ClientRune<U>) {
    super(_prime)
  }

  pallet<X>(...[palletName]: Args<X, [palletName: string]>) {
    return Rune
      .ls([this.as(), palletName])
      .pipe(([metadata, palletName]) => M.getPallet(metadata, palletName))
      .unwrapError()
      .subclass(PalletRune, this)
  }

  deriveCodec = this.pipe((x) => M.DeriveCodec(x.tys))

  codec<X>(...[ty]: Args<X, [ty: number | M.Ty]>) {
    return Rune.ls([this.deriveCodec, ty]).pipe(([derive, ty]) => derive(ty)).subclass(CodecRune)
  }
}

export class PalletRune<out U> extends Rune<M.Pallet, U> {
  constructor(_prime: PalletRune<U>["_prime"], readonly metadata: MetadataRune<U>) {
    super(_prime)
  }

  storage<X>(...[storageName]: Args<X, [storageName: string]>) {
    return Rune
      .ls([this.as(), storageName])
      .pipe(([metadata, palletName]) => M.getStorage(metadata, palletName))
      .unwrapError()
      .subclass(StorageRune, this)
  }
}

export class StorageRune<K extends unknown[], V, U> extends Rune<M.StorageEntry, U> {
  constructor(_prime: StorageRune<K, V, U>["_prime"], readonly pallet: PalletRune<U>) {
    super(_prime)
    this.$key = Rune.rec({
      deriveCodec: this.pallet.metadata.deriveCodec,
      pallet: this.pallet,
      storageEntry: this.as(),
    }).pipe(M.$storageKey).subclass(CodecRune)
    this.$value = this.pallet.metadata.codec(this.pipe((x) => x.value))
  }

  $key
  $value

  entry<X>(...[key, blockHash]: Args<X, [key: K, blockHash?: U.HexHash]>) {
    const storageKey = this.$key.encoded(key).unwrapError().pipe(U.hex.encode)
    const valueHex = state.getStorage(this.pallet.metadata.client.as(), storageKey, blockHash)
      .unwrapError()
    return this.$value.decoded(valueHex.pipe(U.hex.decode)).as<V>()
  }

  keyPage<X>(
    ...[count, partialKey, start, blockHash]: Args<X, [
      count: number,
      partialKey: unknown[],
      start?: unknown[],
      blockHash?: U.HexHash,
    ]>
  ) {
    const storageKey = this.$key.encoded(partialKey).unwrapError().pipe(U.hex.encode)
    const startKey = this.$key.encoded(Rune.resolve(start).wrapU().unwrapOption()).unwrapError()
      .pipe(U.hex.encode).catch().unwrapError()
    const keysEncoded = state.getKeysPaged(
      this.pallet.metadata.client.as(),
      storageKey,
      count,
      startKey,
      blockHash,
    )
      .unwrapError()
    return Rune.ls([this.$key, keysEncoded])
      .pipe(([$key, keysEncoded]) => {
        return keysEncoded.map((keyEncoded: U.Hex) => {
          return $key.decode(U.hex.decode(keyEncoded))
        })
      })
  }

  private _asCodegenStorage<K extends unknown[], V extends unknown>(
    _$key: $.Codec<K>,
    _$value: $.Codec<V>,
  ) {
    return this as any as StorageRune<K, V, never>
  }
}

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
    return Rune.ls([this, value]).pipe(async ([codec, value]) => codec.decode(value))
  }
}
