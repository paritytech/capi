import { assertEquals } from "../_deps/asserts.ts";
import * as t from "../test-util/mod.ts";
import { ChainError, DeriveCodec } from "./Codec.ts";
import { normalize } from "./Contract.ts";
import { getEntryUnsafe } from "./Metadata.ts";
import { Metadata } from "./test-common.ts";

const metadata = await Metadata("polkadot");
const deriveCodec = DeriveCodec(metadata.tys);

Deno.test("Derive all", () => {
  for (const ty of metadata.tys) {
    deriveCodec(ty.id);
  }
});

Deno.test("Derive AccountId32 Codec", async () => {
  const codec = deriveCodec(0);
  const encoded = codec.encode(t.pairs.alice.public);
  assertEquals(encoded, t.pairs.alice.public);
  assertEquals(codec.decode(encoded), t.pairs.alice.public);
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
  const auctionInfoStorageEntry = getEntryUnsafe(metadata, "Auctions", "AuctionInfo");
  const codec = deriveCodec(auctionInfoStorageEntry.value);
  const decoded = [8, 9945400];
  const encoded = codec.encode(decoded);
  assertEquals(codec.decode(encoded), decoded);
});

Deno.test("Derive Auction Winning Storage Entry Codec", async () => {
  const auctionWinningStorageEntry = getEntryUnsafe(metadata, "Auctions", "Winning");
  const codec = deriveCodec(auctionWinningStorageEntry.value);
  const decoded = [
    ...Array(7).fill(undefined),
    [t.pairs.alice.public, 2013, 8672334557167609n],
    ...Array(28).fill(undefined),
  ];
  const encoded = codec.encode(decoded);
  assertEquals(codec.decode(encoded), decoded);
});

Deno.test("Westend circular", async () => {
  const metadata = await Metadata("westend");
  const deriveCodec = DeriveCodec(metadata.tys);
  deriveCodec(283);
});

Deno.test("Derive pallet_xcm::pallet::Error codec", async () => {
  const ty = metadata.tys.find((x) => x.path.join("::") === "pallet_xcm::pallet::Error")!;
  const codec = deriveCodec(ty.id);
  const encoded = codec.encode("Unreachable");
  assertEquals(encoded, new Uint8Array([0]));
  assertEquals(codec.decode(encoded), "Unreachable");
});

Deno.test("Derive Result codec", async () => {
  const ty = metadata.tys.find((x) =>
    x.path[0] === "Result"
    && metadata.tys[x.params[1]!.ty!]!.path.join("::") === "sp_runtime::DispatchError"
  )!;
  const codec = deriveCodec(ty.id);
  const ok = null;
  const okEncoded = codec.encode(ok);
  assertEquals(okEncoded, new Uint8Array([0]));
  assertEquals(codec.decode(okEncoded), ok);
  const err = new ChainError({ type: "Other" });
  const errEncoded = codec.encode(err);
  assertEquals(errEncoded, new Uint8Array([1, 0]));
  assertEquals(codec.decode(errEncoded), err);
});

Deno.test("Smart Contract codecs", async () => {
  const raw = await Deno.readTextFile("frame_metadata/raw_erc20_metadata.json");
  const normalized = normalize(JSON.parse(raw));
  for (const ty of normalized.V3.types) {
    deriveCodec(ty.id);
  }
});
