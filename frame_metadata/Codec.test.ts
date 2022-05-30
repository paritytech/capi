import { assertEquals } from "../barrel.ts";
import { accountId32, accountId32Bytes, getLookupAndDeriveCodec, State } from "./test-util.ts";

const { lookup, deriveCodec } = await getLookupAndDeriveCodec("polkadot");

Deno.test("Derive AccountId32 Codec", async () => {
  const codec = deriveCodec(0);
  const encoded = codec.encode(accountId32);
  assertEquals(encoded, accountId32Bytes);
  assertEquals(codec.decode(encoded), accountId32);
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
  const auctionInfoStorageEntry = lookup.getStorageEntryByPalletNameAndName("Auctions", "AuctionInfo");
  const codec = deriveCodec(auctionInfoStorageEntry.value);
  const decoded = [8, 9945400];
  const encoded = codec.encode(decoded);
  assertEquals(codec.decode(encoded), decoded);
});

Deno.test("Derive Auction Winning Storage Entry Codec", async () => {
  const auctionWinningStorageEntry = lookup.getStorageEntryByPalletNameAndName("Auctions", "Winning");
  const codec = deriveCodec(auctionWinningStorageEntry.value);
  const decoded = [
    ...Array(7).fill(undefined),
    [accountId32, { 0: 2013 }, 8672334557167609n],
    ...Array(28).fill(undefined),
  ];
  const encoded = codec.encode(decoded);
  assertEquals(codec.decode(encoded), decoded);
});

// TODO: revisit
Deno.test("Babe Authorities", { ignore: true }, async () => {
  // const babe = lookup.getPalletByName("Babe");
  // const babeAuthorities = lookup.getStorageEntryByPalletAndName(babe, "Authorities");

  const result = await State.getStorage("wss://kusama-rpc.polkadot.io", lookup, deriveCodec, "Babe", "Authorities");
  console.log(result);
  // const decoded = {
  //   0: [
  //     [{ 0: { 0: accountId32 } }, 1n],
  //     [{ 0: { 0: accountId32 } }, 1n],
  //     [{ 0: { 0: accountId32 } }, 1n],
  //     [{ 0: { 0: accountId32 } }, 1n],
  //     [{ 0: { 0: accountId32 } }, 1n],
  //     [{ 0: { 0: accountId32 } }, 1n],
  //   ],
  // };
  // const encoded = babeAuthoritiesValueCodec.encode(decoded);
  // console.log(encoded);
  // assertEquals(babeAuthoritiesValueCodec.decode(encoded), decoded);
});

Deno.test("Balances Locks", { ignore: true }, async () => {
  const result = await State.getStorage(
    "wss://kusama-rpc.polkadot.io",
    lookup,
    deriveCodec,
    "System",
    "Account",
    accountId32,
  );
  console.log(result);
  // const balancesLockStorageEntry = lookup.getStorageEntryByNameAndPalletName("Balances", "Locks");
  // const codec = deriveCodec(balancesLockStorageEntry.value);
  // const decoded = {
  //   id: "democrac",
  //   amount: 50000000000,
  //   reasons: "Misc",
  // };
  // const encoded = codec.encode(decoded);
  // assertEquals(codec.decode(encoded), decoded);
});
