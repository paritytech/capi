import { ArrayOfLength } from "../util/mod.ts"
import { blake2_256 } from "./hashers.ts"
import { decode } from "./hex.ts"
import { Sr25519 } from "./Sr25519.ts"

export const alice = pair(
  "98319d4ff8a9508c4bb0cf0b5a78d760a0b2082c02775e6e82370816fedfff48925a225d97aa00682d6a59b95b18780c10d7032336e88f3442b42361f4a66011",
)
export const bob = pair(
  "081ff694633e255136bdb456c20a5fc8fed21f8b964c11bb17ff534ce80ebd5941ae88f85d0c1bfc37be41c904e1dfc01de8c8067b0d6d5df25dd1ac0894a325",
)
export const charlie = pair(
  "a8f2d83016052e5d6d77b2f6fd5d59418922a09024cda701b3c34369ec43a7668faf12ff39cd4e5d92bb773972f41a7a5279ebc2ed92264bed8f47d344f8f18c",
)
export const dave = pair(
  "20e05482ca4677e0edbc58ae9a3a59f6ed3b1a9484ba17e64d6fe8688b2b7b5d108c4487b9323b98b11fe36cb301b084e920f7b7895536809a6d62a451b25568",
)
export const eve = pair(
  "683576abfd5dc35273e4264c23095a1bf21c14517bece57c7f0cc5c0ed4ce06a3dbf386b7828f348abe15d76973a72009e6ef86a5c91db2990cb36bb657c6587",
)
export const ferdie = pair(
  "b835c20f450079cf4f513900ae9faf8df06ad86c681884122c752a4b2bf74d4303e4f21bc6cc62bb4eeed5a9cce642c25e2d2ac1464093b50f6196d78e3a7426",
)

export const aliceStash = pair(
  "e8da6c9d810e020f5e3c7f5af2dea314cbeaa0d72bc6421e92c0808a0c584a6046ab28e97c3ffc77fe12b5a4d37e8cd4afbfebbf2391ffc7cb07c0f38c023efd",
)
export const bobStash = pair(
  "c006507cdfc267a21532394c49ca9b754ca71de21e15a1cdf807c7ceab6d0b6c3ed408d9d35311540dcd54931933e67cf1ea10d46f75408f82b789d9bd212fde",
)

function pair(secret: string) {
  return Sr25519.fromSecret(decode(secret))
}

export function testUser(userId: number) {
  return Sr25519.fromSeed(blake2_256.hash(new TextEncoder().encode(`capi-test-user-${userId}`)))
}
export function testUserFactory(getIndex: (count: number) => Promise<number>) {
  return createUsers
  function createUsers(): Promise<Record<typeof NAMES[number], Sr25519>>
  function createUsers<N extends number>(count: N): Promise<ArrayOfLength<Sr25519, N>>
  async function createUsers(count?: number): Promise<Record<string, Sr25519> | Sr25519[]> {
    const index = await getIndex(count ?? NAMES.length)
    return typeof count === "number"
      ? Array.from({ length: count }, (_, i) => testUser(index + i))
      : Object.fromEntries(NAMES.map((name, i) => [name, testUser(index + i)]))
  }
}

// dprint-ignore-next-line
const NAMES = ["alexa", "billy", "carol", "david", "ellie", "felix", "grace", "harry", "india", "jason", "kiera", "laura", "matty", "nadia", "oscar", "piper", "quinn", "ryann", "steff", "tisix", "usher", "vicky", "wendy", "xenia", "yetis", "zelda"] as const
