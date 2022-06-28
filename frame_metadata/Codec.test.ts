import { assertEquals } from "../_deps/asserts.ts";
import * as path from "../_deps/path.ts";
import { testPairs } from "../known/mod.ts";
import { DeriveCodec } from "./Codec.ts";
import { ChainError } from "./Codec.ts";
import { Lookup } from "./Lookup.ts";
import { fromPrefixedHex } from "./Metadata.ts";
import { Metadata } from "./test-common.ts";

const metadata = await Metadata("polkadot");
const lookup = new Lookup(metadata);
const deriveCodec = DeriveCodec(metadata);

Deno.test("Derive all", () => {
  for (const ty of metadata.tys) {
    deriveCodec(ty.i);
  }
});

Deno.test("Derive AccountId32 Codec", async () => {
  const codec = deriveCodec(0);
  const encoded = codec.encode(testPairs.alice.public);
  assertEquals(encoded, testPairs.alice.public);
  assertEquals(codec.decode(encoded), testPairs.alice.public);
});

Deno.test("Derive AccountInfo Codec", async () => {
  const codec = deriveCodec(3);
  const decoded = {
    nonce: 4,
    consumers: 1,
    providers: 1,
    sufficients: 0,
    data: {
      free: 1340320999878n,
      reserved: 0n,
      misc_frozen: 50000000000n,
      fee_frozen: 0n,
    },
  };
  const encoded = codec.encode(decoded);
  assertEquals(codec.decode(encoded), decoded);
});

Deno.test("Derive Auctions AuctionInfo Storage Entry Codec", async () => {
  const auctionInfoStorageEntry = lookup.getStorageEntryByPalletNameAndName(
    "Auctions",
    "AuctionInfo",
  );
  const codec = deriveCodec(auctionInfoStorageEntry.value);
  const decoded = [8, 9945400];
  const encoded = codec.encode(decoded);
  assertEquals(codec.decode(encoded), decoded);
});

Deno.test("Derive Auction Winning Storage Entry Codec", async () => {
  const auctionWinningStorageEntry = lookup.getStorageEntryByPalletNameAndName(
    "Auctions",
    "Winning",
  );
  const codec = deriveCodec(auctionWinningStorageEntry.value);
  const decoded = [
    ...Array(7).fill(undefined),
    [testPairs.alice.public, 2013, 8672334557167609n],
    ...Array(28).fill(undefined),
  ];
  const encoded = codec.encode(decoded);
  assertEquals(codec.decode(encoded), decoded);
});

Deno.test("Westend circular", async () => {
  const metadata = await Metadata("westend");
  const deriveCodec = DeriveCodec(metadata);
  deriveCodec(283);
});

Deno.test("Derive pallet_xcm::pallet::Error codec", async () => {
  const ty = metadata.tys.find((x) => x.path.join("::") === "pallet_xcm::pallet::Error")!;
  const codec = deriveCodec(ty.i);
  const encoded = codec.encode("Unreachable");
  assertEquals(encoded, new Uint8Array([0]));
  assertEquals(codec.decode(encoded), "Unreachable");
});

Deno.test("Derive Result codec", async () => {
  const ty = metadata.tys.find((x) =>
    x.path[0] === "Result"
    && metadata.tys[x.params[1]!.ty!]!.path.join("::") === "sp_runtime::DispatchError"
  )!;
  const codec = deriveCodec(ty.i);
  const ok = null;
  const okEncoded = codec.encode(ok);
  assertEquals(okEncoded, new Uint8Array([0]));
  assertEquals(codec.decode(okEncoded), ok);
  const err = new ChainError({ type: "Other" });
  const errEncoded = codec.encode(err);
  assertEquals(errEncoded, new Uint8Array([1, 0]));
  assertEquals(codec.decode(errEncoded), err);
});
