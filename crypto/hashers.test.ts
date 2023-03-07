import * as $ from "../deps/scale.ts"
import { assertEquals } from "../deps/std/testing/asserts.ts"
import { HasherKind as FrameHasherKind } from "../frame_metadata/mod.ts"
import { hashers, hex } from "./mod.ts"

interface Foo {
  a: Uint8Array
  b: boolean[]
  c: Promise<string>
  d?: Foo
}

const $foo: $.Codec<Foo> = $.object(
  $.field("a", $.uint8Array),
  $.field("b", $.array($.bool)),
  $.field("c", $.promise($.str)),
  $.optionalField("d", $.deferred(() => $foo)),
)

const foo: Foo = {
  a: new Uint8Array(1024),
  b: [false, false, true, true, false, true, false, true, false, false, false, true, false, true],
  c: fetch(
    "https://raw.githubusercontent.com/pierrec/js-xxhash/0504e76f3d31a21ae8528a7f590c7289c9e431d2/lib/xxhash64.js",
  ).then((r) => r.text()),
  d: {
    a: new TextEncoder().encode("hello world"),
    b: [],
    c: Promise.resolve("abc"),
  },
}

const encoded = await $foo.encodeAsync(foo)
const hexEncoded = hex.encode(encoded)

type HasherKind = FrameHasherKind | 'Blake2_512'

const hashes: Record<HasherKind, string> = {
  Blake2_128: "1f709e4fba4e77dc0e5f0d8ad9a34772",
  Blake2_128Concat: "1f709e4fba4e77dc0e5f0d8ad9a34772" + hexEncoded,
  Blake2_256: "4d4e2c28440cb2f4c5b27ba62dc730415e535de7b5da0e9839ed8c5e037fcd47",
  Blake2_512:
    "53aa17f327185024ab69173e1f24f836797ae16f285fb2a7e0cd7e3348e46d1c3e72eb18093d854f51b76df4f9b1fe7cf0dca68af2db61e6212b5e9493eb9b3f",
  Identity: hexEncoded,
  Twox128: "ea44441eaac4e86f012f973ddc3032b0",
  Twox256: "ea44441eaac4e86f012f973ddc3032b09ffb7852c4e93f2a9e6284582996b4f6",
  Twox64Concat: "ea44441eaac4e86f" + hexEncoded,
}

for (const hasherKind in hashes) {
  Deno.test(hasherKind, async () => {
    const hasher = hashers[hasherKind as HasherKind]
    const hash = hashes[hasherKind as HasherKind]
    assertEquals(hex.encode(hasher.hash(encoded)), hash)
    const hashData = await hasher.$hash($foo).encodeAsync(foo)
    assertEquals(hex.encode(hashData), hash)
    if (hasher.concat) {
      assertEquals(hasher.$hash($foo).decode(hashData), foo)
    }
  })
}
