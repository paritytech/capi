import * as $ from "../deps/scale.ts";

export function $lenPrefixed<T>($inner: $.Codec<T>): $.Codec<T> {
  return $.createCodec({
    _metadata: [$lenPrefixed, $inner],
    _staticSize: $.compactU32._staticSize + $inner._staticSize,
    _encode(buffer, extrinsic) {
      const lengthCursor = buffer.createCursor($.compactU32._staticSize);
      const contentCursor = buffer.createCursor($inner._staticSize);
      $inner._encode(contentCursor, extrinsic);
      buffer.waitForBuffer(contentCursor, () => {
        const length = contentCursor.finishedSize + contentCursor.index;
        $.compactU32._encode(lengthCursor, length);
        lengthCursor.close();
        contentCursor.close();
      });
    },
    _decode(buffer) {
      const length = $.compactU32._decode(buffer);
      return $inner.decode(buffer.array.subarray(buffer.index, buffer.index += length));
    },
  });
}
