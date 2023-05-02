import { Hasher, hex } from "../../crypto/mod.ts"

export async function upload(server: string, kind: string, data: Uint8Array, hasher: Hasher) {
  const hash = hasher.hash(data)
  const url = new URL(`upload/${kind}/${hex.encode(hash)}`, server)
  const exists = await fetch(url, { method: "HEAD" })
  if (exists.ok) return hash
  const response = await fetch(url, { method: "PUT", body: data })
  if (!response.ok) throw new Error(await response.text())
  return hash
}
