import { blake2_256, Sr25519, ss58 } from "../crypto/mod.ts"
import * as $ from "../deps/scale.ts"
import { devUserPublicKeysData } from "../util/_artifacts/devUserPublicKeysData.ts"
import { ArrayOfLength } from "../util/ArrayOfLength.ts"
import { devnetsUrl } from "./devnets_env.ts"

const devUserInitialFunds = 1_000_000_000_000_000_000

export const devUserPublicKeys = $.array($.sizedUint8Array(32)).decode(devUserPublicKeysData)

export function addDevUsers(balances: [string, number][]) {
  const networkPrefix = ss58.decode(balances[0]![0])[0]
  for (const publicKey of devUserPublicKeys) {
    balances.push([ss58.encode(networkPrefix, publicKey), devUserInitialFunds])
  }
}

export function devUser(userId: number) {
  return Sr25519.fromSeed(blake2_256.hash(new TextEncoder().encode(`capi-dev-user-${userId}`)))
}

export function createDevUsers(): Promise<Record<typeof devUserNames[number], Sr25519>>
export function createDevUsers<N extends number>(count: N): Promise<ArrayOfLength<Sr25519, N>>
export async function createDevUsers(
  count?: number,
): Promise<Record<string, Sr25519> | Sr25519[]> {
  const response = await fetch(`${devnetsUrl()}?users=${count ?? devUserNames.length}`, {
    method: "POST",
  })
  if (!response.ok) throw new Error(await response.text())
  const index = +(await response.text())
  return typeof count === "number"
    ? Array.from({ length: count }, (_, i) => devUser(index + i))
    : Object.fromEntries(devUserNames.map((name, i) => [name, devUser(index + i)]))
}

export const devUserNames = [
  "alexa",
  "billy",
  "carol",
  "david",
  "ellie",
  "felix",
  "grace",
  "harry",
  "india",
  "james",
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
