import { assertEquals } from "../deps/std/testing/asserts.ts";
import { Hashers } from "../hashers/mod.ts";
import * as t from "../test-util/mod.ts";
import * as U from "../util/mod.ts";
import { $storageKey } from "./Key.ts";
import { getPalletAndEntry } from "./Metadata.ts";
import { setup } from "./test-common.ts";

Deno.test("System Accounts Key", async () => {
  const [metadata, deriveCodec] = await setup("polkadot");
  const [pallet, storageEntry] = U.throwIfError(getPalletAndEntry(metadata, "System", "Account"));
  const $key = $storageKey({
    deriveCodec,
    hashers: await Hashers(),
    pallet,
    storageEntry,
  });
  const keyEncoded = $key.encode(t.p.alice.publicKey);
  const encoded = U.hex.encode(keyEncoded);
  assertEquals(
    encoded,
    "26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9de1e86a9a8c739864cf3cc5ec2bea59fd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
  );
  const decoded = $key.decode(keyEncoded);
  assertEquals(decoded, t.p.alice.publicKey);
});

Deno.test("Auction Winning Key", async () => {
  const [metadata, deriveCodec] = await setup("polkadot");
  const [pallet, storageEntry] = U.throwIfError(getPalletAndEntry(metadata, "Auctions", "Winning"));
  const $key = $storageKey({
    deriveCodec,
    hashers: await Hashers(),
    pallet,
    storageEntry,
  });
  const key = 5;
  const encoded = $key.encode(key);
  assertEquals(
    U.hex.encode(encoded),
    "ca32a41f4b3ed515863dc0a38697f84e4a20667fb1dc58cb22bcadfd9ab7f67c39b9d2792f8bd4c305000000",
  );
  const decoded = $key.decode(encoded);
  assertEquals(key, decoded);
});
