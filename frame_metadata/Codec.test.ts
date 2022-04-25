import * as asserts from "std/testing/asserts.ts";
import { accountId32, accountId32Bytes, getLookupAndDeriveCodec } from "./test-util.ts";

const { lookup, deriveCodec } = await getLookupAndDeriveCodec("polkadot");

Deno.test("AccountId32", async () => {
  const codec = deriveCodec(0);
  const encoded = codec.encode(accountId32);
  asserts.assertEquals(encoded, accountId32Bytes);
  asserts.assertEquals(codec.decode(encoded), accountId32);
});

Deno.test("AccountInfo", async () => {
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
  asserts.assertEquals(codec.decode(encoded), decoded);
});

Deno.test("Auction AuctionInfo", async () => {
  const auctionInfoStorageEntry = lookup.getStorageEntryByPalletNameAndName("Auctions", "AuctionInfo");
  const codec = deriveCodec(auctionInfoStorageEntry.value);
  const decoded = [8, 9945400];
  const encoded = codec.encode(decoded);
  asserts.assertEquals(codec.decode(encoded), decoded);
});

Deno.test("Auction Winning", async () => {
  const auctionWinningStorageEntry = lookup.getStorageEntryByPalletNameAndName("Auctions", "Winning");
  const codec = deriveCodec(auctionWinningStorageEntry.value);
  const decoded = [
    ...Array(7).fill(undefined),
    [accountId32, { 0: 2013 }, 8672334557167609n],
    ...Array(28).fill(undefined),
  ];
  const encoded = codec.encode(decoded);
  asserts.assertEquals(codec.decode(encoded), decoded);
});

// TODO: revisit
Deno.test("Babe Authorities", { ignore: true }, async () => {
  const babeAuthoritiesStorageEntry = lookup.getStorageEntryByPalletNameAndName("Babe", "Authorities");
  const codec = deriveCodec(babeAuthoritiesStorageEntry.value);
  const decoded = {
    0: [
      [{ 0: accountId32 }, 1],
      [{ 0: accountId32 }, 1],
      [{ 0: accountId32 }, 1],
      [{ 0: accountId32 }, 1],
      [{ 0: accountId32 }, 1],
      [{ 0: accountId32 }, 1],
    ],
  };
  // const manual = s.record([
  //   0,
  //   s.array(
  //     s.tuple(
  //       s.record([0, s.record([0, s.sizedArray(s.u8, 32)])]),
  //       s.u64,
  //     ),
  //   ),
  // ]);
  // console.log(manual.encode(decoded as any));
  // const encoded = codec.encode(decoded);
  // asserts.assertEquals(codec.decode(encoded), decoded);
});

Deno.test("Balances Locks", async () => {
  // const balancesLockStorageEntry = lookup.getStorageEntryByNameAndPalletName("Balances", "Locks");
  // const codec = deriveCodec(balancesLockStorageEntry.value);
  // const decoded = {
  //   id: "democrac",
  //   amount: 50000000000,
  //   reasons: "Misc",
  // };
  // const encoded = codec.encode(decoded);
  // asserts.assertEquals(codec.decode(encoded), decoded);
});
