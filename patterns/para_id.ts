import * as $ from "../deps/scale.ts"

export const $paraId = sovereignAccountFactory("para")
export const $siblId = sovereignAccountFactory("sibl")

function sovereignAccountFactory(prefix: "sibl" | "para") {
  return $.createCodec<number>({
    _metadata: $.metadata("$sovereignAccount"),
    _staticSize: 32,
    _encode(buffer, value) {
      $.sizedUint8Array(4)._encode(buffer, new TextEncoder().encode(prefix))
      $.u32._encode(buffer, value)
      $.sizedUint8Array(24)._encode(buffer, new Uint8Array(24))
    },
    _decode(buffer) {
      const prefix_ = new TextDecoder().decode($.sizedUint8Array(4)._decode(buffer))
      const paraId = $.u32._decode(buffer)
      buffer.index += 24
      if (prefix != prefix_) throw new Error("Invalid prefix")
      return paraId
    },
    _assert(assert) {
      assert.typeof(this, "number")
    },
  })
}
