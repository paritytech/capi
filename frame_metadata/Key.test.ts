import * as asserts from "../_deps/asserts.ts";
import { Hashers } from "../bindings/mod.ts";
import * as U from "../util/mod.ts";
import { $storageMapKey } from "./Key.ts";
import * as M from "./Metadata.ts";
import { accountId32, getLookupAndDeriveCodec } from "./test-util.ts";

const { lookup, deriveCodec } = await getLookupAndDeriveCodec("polkadot");
const hashers = await Hashers();

Deno.test("System Accounts Key", async () => {
  const pallet = lookup.getPalletByName("System");
  const storageEntry = lookup.getStorageEntryByPalletAndName(pallet, "Account");
  const $keys = $storageMapKey({
    deriveCodec,
    hashers,
    pallet,
    storageEntry: storageEntry as M.StorageEntry & M.MapStorageEntryType,
  });
  const keysEncoded = $keys.encode(accountId32);
  const encoded = U.hex.encode(keysEncoded);
  asserts.assertEquals(
    encoded,
    "26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9fe990c4cc12c1f07fb5ba1458311c6b543fa61b298e82f9f207ddea327900cee26b554756c4a533f36cd875e3e7bcf06",
  );
  const decoded = $keys.decode(keysEncoded);
  asserts.assertEquals(decoded, accountId32);
});

Deno.test("Auction Winning Key", async () => {
  const pallet = lookup.getPalletByName("Auctions");
  const storageEntry = lookup.getStorageEntryByPalletAndName(pallet, "Winning");
  const $key = $storageMapKey({
    deriveCodec,
    hashers,
    pallet,
    storageEntry: storageEntry as M.StorageEntry & M.MapStorageEntryType,
  });
  const key = 5;
  const encoded = $key.encode(key);
  asserts.assertEquals(
    U.hex.encode(encoded),
    "ca32a41f4b3ed515863dc0a38697f84e4a20667fb1dc58cb22bcadfd9ab7f67c39b9d2792f8bd4c305000000",
  );
  const decoded = $key.decode(encoded);
  asserts.assertEquals(key, decoded);
});
