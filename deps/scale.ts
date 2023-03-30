import { Codec, createCodec, metadata } from "https://deno.land/x/scale@v0.11.1/mod.ts#="

export * from "https://deno.land/x/scale@v0.11.1/mod.ts#="

// TODO: get rid
export function nullable<T>($inner: Codec<T>): Codec<T | null> {
  return createCodec({
    _metadata: metadata("$nullable", nullable, $inner),
    _staticSize: 1 + $inner._staticSize,
    _encode(buffer, value) {
      if (value === null) {
        buffer.array[buffer.index++] = 0
      } else {
        buffer.array[buffer.index++] = 1
        $inner._encode(buffer, value)
      }
    },
    _decode(buffer) {
      return buffer.array[buffer.index++] ? $inner._decode(buffer) : null
    },
    _assert(assert) {
      if (assert.value !== null) {
        $inner._assert(assert)
      }
    },
  })
}
