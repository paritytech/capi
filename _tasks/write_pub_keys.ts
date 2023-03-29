import * as $ from "../deps/scale.ts"
import { testUser } from "../mod.ts"
import { DEFAULT_TEST_USER_COUNT } from "../providers/frame/mod.ts"

const pubKeys = []
for (let i = 0; i < DEFAULT_TEST_USER_COUNT; i++) {
  const sr25519User = testUser(i)
  const ed25519User = sr25519User.toEd25519()
  pubKeys.push(sr25519User.publicKey)
  pubKeys.push(ed25519User.publicKey)
}

const encoded = $.array($.sizedUint8Array(32)).encode(pubKeys)

await Deno.writeFile("test_users_public_keys.scale", encoded)
