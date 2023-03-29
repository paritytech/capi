import * as ed from "../deps/ed25519.ts"
import { assertEquals } from "../deps/std/testing/asserts.ts"
import { testUser } from "./test_pairs.ts"

Deno.test("SR25519 to ED25519", () => {
  const sr25519User = testUser(1)
  const ed25519User = sr25519User.toEd25519()

  const ed25519PrivateKey = sr25519User.secretKey.slice(0, 32)
  const ed25519PublicKey = ed.sync.getPublicKey(ed25519PrivateKey)

  assertEquals(ed25519User.publicKey, ed25519PublicKey)
  assertEquals(ed25519User.secretKey, ed25519PrivateKey)
})
