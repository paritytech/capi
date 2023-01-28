import { assertEquals } from "../deps/std/testing/asserts.ts"
import { DeriveCodec } from "../scale_info/Codec.ts"
import * as U from "../util/mod.ts"
import * as downloaded from "./_downloaded/mod.ts"
import { $storageKey } from "./Key.ts"
import { getPalletAndEntry } from "./Metadata.ts"

const metadata = downloaded.polkadot
const deriveCodec = DeriveCodec(metadata.tys)

Deno.test("System Accounts Key", () => {
  const systemAccountPalletAndEntry = getPalletAndEntry(metadata, "System", "Account")
  if (systemAccountPalletAndEntry instanceof Error) throw systemAccountPalletAndEntry
  const [pallet, storageEntry] = systemAccountPalletAndEntry
  const $key = $storageKey({ deriveCodec, pallet, storageEntry })
  const partialKey: unknown[] = []
  assertEquals(
    U.hex.encode($key.encode(partialKey)),
    "26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9",
  )
  const key = [U.alice.publicKey]
  const encoded = $key.encode(key)
  assertEquals(
    U.hex.encode(encoded),
    "26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9de1e86a9a8c739864cf3cc5ec2bea59fd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
  )
  const decoded = $key.decode(encoded)
  assertEquals(decoded, key)
})

Deno.test("Auction Winning Key", () => {
  const [pallet, storageEntry] = U.throwIfError(getPalletAndEntry(metadata, "Auctions", "Winning"))
  const $key = $storageKey({ deriveCodec, pallet, storageEntry })
  const key = [5]
  const encoded = $key.encode(key)
  assertEquals(
    U.hex.encode(encoded),
    "ca32a41f4b3ed515863dc0a38697f84e4a20667fb1dc58cb22bcadfd9ab7f67c39b9d2792f8bd4c305000000",
  )
  const decoded = $key.decode(encoded)
  assertEquals(key, decoded)
})

Deno.test("Multisig Multisigs partial storage Key", () => {
  const [pallet, storageEntry] = U.throwIfError(
    getPalletAndEntry(metadata, "Multisig", "Multisigs"),
  )
  const $key = $storageKey({ deriveCodec, pallet, storageEntry })
  const key = [U.alice.publicKey]
  const encoded = $key.encode(key)
  assertEquals(
    U.hex.encode(encoded),
    "7474449cca95dc5d0c00e71735a6d17d3cd15a3fd6e04e47bee3922dbfa92c8d518366b5b1bc7c99d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
  )
})
