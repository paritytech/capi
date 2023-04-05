import { blake2_256, Sr25519, ss58 } from "../crypto/mod.ts"
import * as $ from "../deps/scale.ts"
import { testUserPublicKeysData } from "../util/_artifacts/testUserPublicKeysData.ts"
import { ArrayOfLength } from "../util/ArrayOfLength.ts"

const testUserInitialFunds = 1_000_000_000_000_000_000

export const testUserPublicKeys = $.array($.sizedUint8Array(32)).decode(testUserPublicKeysData)

export async function addTestUsers(balances: [string, number][]) {
  const networkPrefix = ss58.decode(balances[0]![0])[0]
  for (const publicKey of testUserPublicKeys) {
    balances.push([ss58.encode(networkPrefix, publicKey), testUserInitialFunds])
  }
}

export function testUser(userId: number) {
  return Sr25519.fromSeed(blake2_256.hash(new TextEncoder().encode(`capi-test-user-${userId}`)))
}
export function testUserFactory(endpoint: string) {
  return createUsers
  function createUsers(): Promise<Record<typeof testUserNames[number], Sr25519>>
  function createUsers<N extends number>(count: N): Promise<ArrayOfLength<Sr25519, N>>
  async function createUsers(count?: number): Promise<Record<string, Sr25519> | Sr25519[]> {
    const server = Deno.env.get("CAPN_SERVER")
    if (!server) throw new Error("Must be run with a capn server")
    const response = await fetch(
      new URL(`${endpoint}?users=${count ?? testUserNames.length}`, server),
      {
        method: "POST",
      },
    )
    if (!response.ok) throw new Error(await response.text())
    const index = +(await response.text())
    return typeof count === "number"
      ? Array.from({ length: count }, (_, i) => testUser(index + i))
      : Object.fromEntries(testUserNames.map((name, i) => [name, testUser(index + i)]))
  }
}

export const testUserNames = [
  "alexa",
  "billy",
  "carol",
  "david",
  "ellie",
  "felix",
  "grace",
  "harry",
  "india",
  "jason",
  "kiera",
  "laura",
  "matty",
  "nadia",
  "oscar",
  "piper",
  "quinn",
  "ryann",
  "steff",
  "tisix",
  "usher",
  "vicky",
  "wendy",
  "xenia",
  "yetis",
  "zelda",
] as const
