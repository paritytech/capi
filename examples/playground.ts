import { assert } from "../_deps/asserts.ts";
import { Hashers, Sr25519 } from "../bindings/mod.ts";
import * as M from "../frame_metadata/mod.ts";
import { KnownRpcMethods } from "../known/mod.ts";
import * as rpc from "../rpc/mod.ts";
import * as U from "../util/mod.ts";
const client = await rpc.localClient<KnownRpcMethods>({
  path: "../substrate-dev-hub/substrate-node-template",
  dev: true,
});
assert(!(client instanceof Error));
const metadataRaw = await client.call("state_getMetadata", []);
assert(metadataRaw.result);
const metadata = M.fromPrefixedHex(metadataRaw.result);
const lookup = new M.Lookup(metadata);
const pallet = lookup.getPalletByName("System");
const storageEntry = lookup.getStorageEntryByPalletAndName(pallet, "Account");
const deriveCodec = M.DeriveCodec(metadata);
const [sr25519, hashers] = await Promise.all([Sr25519(), Hashers()]);
const $storageMapKey = M.$storageMapKey({
  deriveCodec,
  hashers,
  pallet,
  storageEntry,
});
const alice = sr25519.TestUser.fromName("alice");
const key = U.hex.encode($storageMapKey.encode(alice.publicKey)) as U.HexString;
const storageRaw = await client.call("state_getStorage", [key]);
console.log(deriveCodec(storageEntry.value).decode(U.hex.decode(storageRaw.result!)));

// // console.log({ result });
await client.close();
