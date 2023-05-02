import { Sr25519 } from "../../crypto/mod.ts"
import { devUser } from "../../nets/mod.ts"
import { ArrayOfLength } from "../../util/ArrayOfLength.ts"
import { detectServer } from "./detectServer.ts"

export function createDevUsers(): Promise<Record<typeof devUserNames[number], Sr25519>>
export function createDevUsers<N extends number>(count: N): Promise<ArrayOfLength<Sr25519, N>>
export async function createDevUsers(count?: number): Promise<Record<string, Sr25519> | Sr25519[]> {
  const response = await fetch(
    new URL(`/devnets/?users=${count ?? devUserNames.length}`, detectServer()),
    { method: "POST" },
  )
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
