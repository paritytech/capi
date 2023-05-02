import { blake2_256, Sr25519 } from "../crypto/mod.ts"

export function devUser(userId: number) {
  return Sr25519.fromSeed(blake2_256.hash(new TextEncoder().encode(`capi-dev-user-${userId}`)))
}
