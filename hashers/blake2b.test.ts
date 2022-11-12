import * as refImpl from "https://esm.sh/@noble/hashes@1.1.2/blake2b"
import { assertEquals } from "../deps/std/testing/asserts.ts"
import { hex } from "../util/mod.ts"
import { Blake2b } from "./blake2b.ts"

const lorem =
  // cspell:disable-next-line
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

const hashes: [name: string, data: Uint8Array, hash: string][] = [
  [
    "empty",
    new Uint8Array(),
    "786a02f742015903c6c6fd852552d272912f4740e15847618a86e217f71f5419d25e1031afee585313896444934eb04b903a685b1448b755d56f701afe9be2ce",
  ],
  [
    "[0; 1024]",
    new Uint8Array(1024),
    "b4b72b45c308e963f4c927827426228c0ed898403411ad108fbd0611e146ccd494bda4b9a593c33d7cf49931748e8bc29a829d50e904305cb38dfb1443532ef7",
  ],
  [
    "0..256",
    new Uint8Array(Array.from({ length: 256 }, (_, i) => i)),
    "1ecc896f34d3f9cac484c73f75f6a5fb58ee6784be41b35f46067b9c65c63a6794d3d744112c653f73dd7deb6666204c5a9bfa5b46081fc10fdbe7884fa5cbf8",
  ],
  [
    "lorem",
    new TextEncoder().encode(lorem),
    "bf6a2cf4132a6436f90190ebbf436dd622a73294d44348046c32504c224aaa3d1c80ca83107eb9548ccba36e141183b3bfb0f38779c0d9ab76b5971590e79d5e",
  ],
]

for (const [name, data, hash] of hashes) {
  Deno.test(`${name} reference`, () => {
    assertEquals(hex.encode(refImpl.blake2b(data)), hash)
  })
  Deno.test(`${name} straight`, () => {
    const hasher = new Blake2b()
    hasher.update(data)
    assertEquals(hex.encode(hasher.digest()), hash)
    hasher.dispose()
  })
  for (const chunkSize of [1, 13, 31, 32, 33, 49, 64, 65, 113]) {
    Deno.test(`${name} chunked ${chunkSize}`, () => {
      const hasher = new Blake2b()
      for (let i = 0; i < data.length; i += chunkSize) {
        hasher.update(data.slice(i, i + chunkSize))
      }
      assertEquals(hex.encode(hasher.digest()), hash)
      hasher.dispose()
    })
  }
}
