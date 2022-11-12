import * as refImpl from "https://esm.sh/@polkadot/util-crypto@10.1.6/xxhash/index.js"
import { assertEquals } from "../deps/std/testing/asserts.ts"
import { hex } from "../util/mod.ts"
import { Xxhash } from "./xxhash.ts"

const lorem =
  // cspell:disable-next-line
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

const hashes: [name: string, data: Uint8Array, hash: string][] = [
  [
    "empty",
    new Uint8Array(),
    "99e9d85137db46ef4bbea33613baafd56f963c64b1f3685a4eb4abd67ff6203adb47db9f0e7b8df13bfd1c9806d4e14b99c769b2d80a6fdf09440a6f6f62f095",
  ],
  [
    "[0; 1024]",
    new Uint8Array(1024),
    "cdac85f0882874275d7ee38a70da85e98ed188fdabc8466b923b4e0a88c21e18411f08ee10a208b4dd712c68cfeecf68fabd60b05467e45268807a47a3359f41",
  ],
  [
    "0..256",
    new Uint8Array(Array.from({ length: 256 }, (_, i) => i)),
    "4b90cd0684beac1ff7566a6db01eecbe796a6681a553fa6f4ca7f8a1da4c7241822eb628b1ece95206ada4385fb1f2d08e2d2f953b2bcc4aa86e0ec82ef633d2",
  ],
  [
    "lorem",
    new TextEncoder().encode(lorem),
    "3056764314b1a8c5331511d478ff3f1203586c1a9308a54594234d9956fa6173dde73c6f4d92a266b80f4ea640fc58880baa7ba549315bf42b06d60439cdd4cc",
  ],
]

for (const [name, data, fullHash] of hashes) {
  for (const size of [64, 128, 256, 512] as const) {
    const hash = fullHash.slice(0, size / 4)
    const rounds = size / 64
    Deno.test(`${name} ${size} reference`, () => {
      assertEquals(refImpl.xxhashAsHex(data, size).slice(2), hash)
    })
    Deno.test(`${name} ${size} straight`, () => {
      const hasher = new Xxhash(rounds)
      hasher.update(data)
      assertEquals(hex.encode(hasher.digest()), hash)
      hasher.dispose()
    })
    if (size === 512) {
      for (const chunkSize of [1, 13, 31, 32, 33, 49, 64, 65, 113]) {
        Deno.test(`${name} ${size} chunked ${chunkSize}`, () => {
          const hasher = new Xxhash(rounds)
          for (let i = 0; i < data.length; i += chunkSize) {
            hasher.update(data.slice(i, i + chunkSize))
          }
          assertEquals(hex.encode(hasher.digest()), hash)
          hasher.dispose()
        })
      }
    }
  }
}
