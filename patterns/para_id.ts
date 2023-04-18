import * as $ from "../deps/scale.ts"

export const $paraId = sovereignAccountFactory("para")
export const $siblId = sovereignAccountFactory("sibl")

function sovereignAccountFactory(prefix: "sibl" | "para") {
  const $prefix = $.constant(null, new TextEncoder().encode(prefix))
  const $postfix = $.constant(null, new Uint8Array(24))
  return $.createCodec<number>({
    _metadata: $.metadata(`$${prefix}Id`),
    _staticSize: $prefix._staticSize + $.u32._staticSize + $postfix._staticSize,
    _encode(buffer, value) {
      $prefix._encode(buffer, null)
      $.u32._encode(buffer, value)
      $postfix._encode(buffer, null)
    },
    _decode(buffer) {
      $prefix._decode(buffer)
      const paraId = $.u32._decode(buffer)
      $postfix._decode(buffer)
      return paraId
    },
    _assert(assert) {
      $.u32._assert(assert)
    },
  })
}
