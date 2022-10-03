import { assertEquals } from "../deps/std/testing/asserts.ts";
import * as t from "../test_util/mod.ts";
import * as U from "../util/mod.ts";
import { ChainError } from "./Codec.ts";
import { ContractMetadata } from "./Contract.ts";
import { getPalletAndEntry } from "./Metadata.ts";
import { setup } from "./test-common.ts";

Deno.test("Derive all", async () => {
  const [metadata, deriveCodec] = await setup("polkadot");
  for (const ty of metadata.tys) {
    deriveCodec(ty.id);
  }
});

Deno.test("Derive AccountId32 Codec", async () => {
  const [_, deriveCodec] = await setup("polkadot");
  const codec = deriveCodec(0);
  const encoded = codec.encode(t.alice.publicKey);
  assertEquals(encoded, t.alice.publicKey);
  assertEquals(codec.decode(encoded), t.alice.publicKey);
});

Deno.test("Derive AccountInfo Codec", async () => {
  const [_, deriveCodec] = await setup("polkadot");
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
  const [metadata, deriveCodec] = await setup("polkadot");
  const auctionInfoStorageEntry =
    U.throwIfError(getPalletAndEntry(metadata, "Auctions", "AuctionInfo"))[1];
  const codec = deriveCodec(auctionInfoStorageEntry.value);
  const decoded = [8, 9945400];
  const encoded = codec.encode(decoded);
  assertEquals(codec.decode(encoded), decoded);
});

Deno.test("Derive Auction Winning Storage Entry Codec", async () => {
  const [metadata, deriveCodec] = await setup("polkadot");
  const auctionWinningStorageEntry =
    U.throwIfError(getPalletAndEntry(metadata, "Auctions", "Winning"))[1];
  const codec = deriveCodec(auctionWinningStorageEntry.value);
  const decoded = [
    ...Array(7).fill(undefined),
    [t.alice.publicKey, 2013, 8672334557167609n],
    ...Array(28).fill(undefined),
  ];
  const encoded = codec.encode(decoded);
  assertEquals(codec.decode(encoded), decoded);
});

Deno.test("Westend circular", async () => {
  const [_, deriveCodec] = await setup("westend");
  // TODO: safeguard against runtime upgrade resulting in future testing of the wrong type
  deriveCodec(283);
});

Deno.test("Derive pallet_xcm::pallet::Error codec", async () => {
  const [metadata, deriveCodec] = await setup("polkadot");
  const ty = metadata.tys.find((x) => x.path.join("::") === "pallet_xcm::pallet::Error")!;
  const codec = deriveCodec(ty.id);
  const encoded = codec.encode("Unreachable");
  assertEquals(encoded, new Uint8Array([0]));
  assertEquals(codec.decode(encoded), "Unreachable");
});

Deno.test("Derive Result codec", async () => {
  const [metadata, deriveCodec] = await setup("polkadot");
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
  const [_, deriveCodec] = await setup("polkadot");
  const raw = await Deno.readTextFile("frame_metadata/raw_erc20_metadata.json");
  const normalized = ContractMetadata.normalize(JSON.parse(raw));
  for (const ty of normalized.V3.types) {
    deriveCodec(ty.id);
  }
});
