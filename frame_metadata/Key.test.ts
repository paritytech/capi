import * as asserts from "std/testing/asserts.ts";
import { defaultHashers, encodeKey } from "./Key.ts";
import { accountId32, getLookupAndDeriveCodec } from "./test-util.ts";

const [lookup, deriveCodec] = await getLookupAndDeriveCodec("polkadot");

Deno.test("Polkadot System Accounts", () => {
  const pallet = lookup.getPalletByName("System");
  const storageEntry = lookup.getStorageEntryByNameAndPalletName("System", "Account");
  const key = encodeKey(deriveCodec, defaultHashers, pallet, storageEntry, accountId32);
  asserts.assertEquals(
    key,
    "26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9fe990c4cc12c1f07fb5ba1458311c6b543fa61b298e82f9f207ddea327900cee26b554756c4a533f36cd875e3e7bcf06",
  );
});
