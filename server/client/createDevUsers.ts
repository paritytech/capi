import { Sr25519 } from "../../crypto/mod.ts"
import { devUserNames } from "../../util/_artifacts/devUserNames.ts"
import { ArrayOfLength } from "../../util/ArrayOfLength.ts"
import { devUser } from "../../util/mod.ts"
import { devnetsUrl } from "./detectServer.ts"

export function createDevUsers(): Promise<Record<typeof devUserNames[number], Sr25519>>
export function createDevUsers<N extends number>(count: N): Promise<ArrayOfLength<Sr25519, N>>
export async function createDevUsers(count?: number): Promise<Record<string, Sr25519> | Sr25519[]> {
  const response = await fetch(`${devnetsUrl()}?users=${count ?? devUserNames.length}`, {
    method: "POST",
  })
  if (!response.ok) throw new Error(await response.text())
  const index = +(await response.text())
  return typeof count === "number"
    ? Array.from({ length: count }, (_, i) => devUser(index + i))
    : Object.fromEntries(devUserNames.map((name, i) => [name, devUser(index + i)]))
}
