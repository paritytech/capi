import * as $ from "../deps/scale.ts"
import { assertEquals } from "../deps/std/testing/asserts.ts"
import * as downloaded from "../frame_metadata/_downloaded/mod.ts"
import { getPalletConstruct, getStorage } from "../frame_metadata/mod.ts"
import { alice, throwIfUndefined } from "../util/mod.ts"
import { ChainError, DeriveCodec } from "./Codec.ts"

Deno.test("Derive all", () => {
  for (const ty of metadata.tys) deriveCodec(ty.id)
})

Deno.test("Derive AccountId32 Codec", () => {
  const codec = deriveCodec(0)
  const encoded = codec.encode(alice.publicKey)
  assertEquals(encoded, alice.publicKey)
  assertEquals(codec.decode(encoded), alice.publicKey)
})

Deno.test("Derive AccountInfo Codec", () => {
  const codec = deriveCodec(3)
  const decoded = {
    nonce: 4,
    consumers: 1,
    providers: 1,
    sufficients: 0,
    data: {
      free: 1340320999878n,
      reserved: 0n,
      miscFrozen: 50000000000n,
      feeFrozen: 0n,
    },
  }
  const encoded = codec.encode(decoded)
  assertEquals(codec.decode(encoded), decoded)
})

Deno.test("Derive Auctions AuctionInfo Storage Entry Codec", () => {
  const $value = storageValueCodec("Auctions", "AuctionInfo")
  const decoded = [8, 9945400]
  const encoded = $value.encode(decoded)
  assertEquals($value.decode(encoded), decoded)
})

Deno.test("Derive Auction Winning Storage Entry Codec", () => {
  const $value = storageValueCodec("Auctions", "Winning")
  const decoded = [
    ...Array(7).fill(undefined),
    [alice.publicKey, 2013, 8672334557167609n],
    ...Array(28).fill(undefined),
  ]
  const encoded = $value.encode(decoded)
  assertEquals($value.decode(encoded), decoded)
})

Deno.test("Derive pallet_xcm::pallet::Error codec", () => {
  const ty = metadata.tys.find((x) => x.path.join("::") === "pallet_xcm::pallet::Error")!
  const codec = deriveCodec(ty.id)
  const encoded = codec.encode("Unreachable")
  assertEquals(encoded, new Uint8Array([0]))
  assertEquals(codec.decode(encoded), "Unreachable")
})

Deno.test("Derive Result codec", () => {
  const ty = metadata.tys.find((x) =>
    x.path[0] === "Result"
    && x.params[1]!.ty!.path.join("::") === "sp_runtime::DispatchError"
  )!
  const codec = deriveCodec(ty.id)
  const ok = null
  const okEncoded = codec.encode(ok)
  assertEquals(okEncoded, new Uint8Array([0]))
  assertEquals(codec.decode(okEncoded), ok)
  const err = new ChainError({ type: "Other" })
  const errEncoded = codec.encode(err)
  assertEquals(errEncoded, new Uint8Array([1, 0]))
  assertEquals(codec.decode(errEncoded), err)
})

const metadata = downloaded.polkadot
const deriveCodec = DeriveCodec(metadata.tys)

function storageValueCodec(palletName: string, storageName: string): $.Codec<unknown> {
  return deriveCodec(
    throwIfUndefined(getPalletConstruct(getStorage, metadata, palletName, storageName)).value,
  )
}
