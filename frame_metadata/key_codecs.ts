import { twox128 } from "../crypto/mod.ts"
import * as $ from "../deps/scale.ts"

export function $storageKey<I, O>(
  palletName: string,
  entryName: string,
  $key: $.Codec<I, O>,
): $.Codec<I, O> {
  const palletHash = twox128.hash(new TextEncoder().encode(palletName))
  const entryHash = twox128.hash(new TextEncoder().encode(entryName))
  return $.createCodec({
    _metadata: $.metadata("$storageKey", $storageKey, palletName, entryName, $key),
    _staticSize: $key._staticSize + 32,
    _encode(buffer, key) {
      buffer.insertArray(palletHash)
      buffer.insertArray(entryHash)
      $key._encode(buffer, key)
    },
    _decode(buffer) {
      // Ignore initial hashes
      buffer.index += 32
      return $key._decode(buffer)
    },
    _assert(assert) {
      $key._assert(assert)
    },
  })
}

export const $emptyKey = $.withMetadata($.metadata("$emptyKey"), $.constant<void>(undefined))

export const $partialEmptyKey = $.createCodec<void | null>({
  _metadata: $.metadata("$partialEmptyKey"),
  _staticSize: 0,
  _encode() {},
  _decode() {
    throw new Error("Cannot decode partial key")
  },
  _assert(assert) {
    if (assert.value != null) {
      throw new $.ScaleAssertError(this, assert.value, `${assert.path} != null`)
    }
  },
})

export function $partialSingleKey<I, O>($inner: $.Codec<I, O>): $.Codec<I | null, O | null> {
  return $.createCodec({
    _metadata: $.metadata("$partialSingleKey", $partialSingleKey, $inner),
    _staticSize: $inner._staticSize,
    _encode(buffer, key) {
      if (key !== null) $inner._encode(buffer, key)
    },
    _decode() {
      throw new Error("Cannot decode partial key")
    },
    _assert(assert) {
      if (assert.value === null) return
      $inner._assert(assert)
    },
  })
}

export type PartialMultiKey<T extends unknown[]> = T extends [...infer A, any]
  ? T | PartialMultiKey<A>
  : T | null

export function $partialMultiKey<T extends $.AnyCodec[]>(
  ...keys: [...T]
): $.Codec<PartialMultiKey<$.OutputTuple<T>>>
export function $partialMultiKey<T>(...codecs: $.Codec<T>[]): $.Codec<T[] | null> {
  return $.createCodec({
    _metadata: $.metadata("$partialMultiKey", $partialMultiKey, ...codecs),
    _staticSize: $.tuple(...codecs)._staticSize,
    _encode(buffer, key) {
      if (!key) return
      for (let i = 0; i < key.length; i++) {
        codecs[i]!._encode(buffer, key[i]!)
      }
    },
    _decode() {
      throw new Error("Cannot decode partial key")
    },
    _assert(assert) {
      if (assert.value === null) return
      assert.instanceof(this, Array)
      const assertLength = assert.key(this, "length")
      assertLength.typeof(this, "number")
      const length = assertLength.value as number
      $.tuple(...codecs.slice(0, length))._assert(assert)
    },
  })
}
