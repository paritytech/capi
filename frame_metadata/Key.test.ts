import { hashersR } from "/crypto/mod.ts";
import * as asserts from "std/testing/asserts.ts";
import { encodeKey } from "./Key.ts";
import { accountId32, getLookupAndDeriveCodec } from "./test-util.ts";

const { lookup, deriveCodec } = await getLookupAndDeriveCodec("polkadot");

Deno.test("System Accounts Key", () => {
  const pallet = lookup.getPalletByName("System");
  const storageEntry = lookup.getStorageEntryByPalletAndName(pallet, "Account");
  const key = encodeKey(deriveCodec, hashersR.hashers, pallet, storageEntry, accountId32);
  asserts.assertEquals(
    key,
    "26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9fe990c4cc12c1f07fb5ba1458311c6b543fa61b298e82f9f207ddea327900cee26b554756c4a533f36cd875e3e7bcf06",
  );
});

Deno.test("Auction Winning Key", async () => {
  const pallet = lookup.getPalletByName("Auctions");
  const storageEntry = lookup.getStorageEntryByPalletAndName(pallet, "Winning");
  const key = encodeKey(deriveCodec, hashersR.hashers, pallet, storageEntry, 5);
  asserts.assertEquals(
    key,
    "ca32a41f4b3ed515863dc0a38697f84e4a20667fb1dc58cb22bcadfd9ab7f67c39b9d2792f8bd4c305000000",
  );
});
