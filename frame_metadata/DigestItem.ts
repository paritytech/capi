import * as $ from "../deps/scale.ts";

export type DigestItem =
  | {
    type: "Other";
    value: Uint8Array;
  }
  | {
    type: "Consensus";
    value: [string, bigint];
  }
  | {
    type: "Seal";
    value: [string, bigint];
  }
  | {
    type: "PreRuntime";
    value: [string, bigint];
  }
  | { type: "RuntimeEnvironmentUpdated" };

const authority = sizedNativeText(4);
const authorityAndSlot = $.tuple(authority, $.u64);
export const $digestItem: $.Codec<DigestItem> = $.taggedUnion("type", {
  0: ["Other", ["value", $.uint8Array]],
  4: ["Consensus", ["value", authorityAndSlot]],
  5: ["Seal", ["value", authorityAndSlot]],
  6: ["PreRuntime", ["value", authorityAndSlot]],
  8: ["RuntimeEnvironmentUpdated"],
});

function sizedNativeText(len: number): $.Codec<string> {
  return $.createCodec({
    name: "$.sizedNativeText",
    _staticSize: 32,
    _metadata: [sizedNativeText, len],
    _encode(buffer, value) {
      buffer.insertArray(new TextEncoder().encode(value));
    },
    _decode(buffer) {
      const slice = buffer.array.slice(buffer.index, buffer.index + len);
      buffer.index += len;
      new TextDecoder();
      return new TextDecoder().decode(slice);
    },
  });
}
