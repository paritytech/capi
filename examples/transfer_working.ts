import { assert } from "../_deps/asserts.ts";
import { Hashers, Sr25519 } from "../bindings/mod.ts";
import * as M from "../frame_metadata/mod.ts";
import { westendBeacon } from "../known/mod.ts";
import * as C from "../mod.ts";
import * as rpc from "../rpc/mod.ts";
import * as U from "../util/mod.ts";

const [client, sr25519, hashers] = await Promise.all([
  rpc.proxyClient(westendBeacon),
  Sr25519(),
  Hashers(),
]);
assert(!(client instanceof Error));
const metadataRes = await client.call("state_getMetadata", []);
assert(metadataRes.result);
const metadata = M.fromPrefixedHex(metadataRes.result);
const deriveCodec = M.DeriveCodec(metadata);

const genesisHashRes = await client.call("chain_getBlockHash", []);
assert(genesisHashRes.result);
const genesisHash = U.hex.decode(genesisHashRes.result);

const alice = sr25519.TestUser.fromName("alice");

const $extrinsic = M.$extrinsic({
  metadata,
  deriveCodec,
  hashers,
  sign: (message) => new C.Sr25519Signature(alice.sign(message)),
});

const from = new C.MultiAddress("Id", alice.publicKey);
const DEST_PUBLIC_KEY = "8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48";
const dest = new C.MultiAddress("Id", U.hex.decode(DEST_PUBLIC_KEY));

const extrinsic: M.Extrinsic = {
  protocolVersion: 4,
  signature: {
    address: from,
    extra: [
      /* era */ C.immortalEra,
      /* nonce */ 1000,
      /* tip */ 500,
    ],
    additional: [
      /* specVersion */ 100,
      /* transactionVersion */ 1,
      /* genesisHash */ genesisHash,
      /* checkpoint */ genesisHash,
    ],
  },
  palletName: "Balances",
  methodName: "transfer",
  args: { dest, value: 12345n },
};

const encoded = $extrinsic.encode(extrinsic);

console.log({ encoded });
console.log({ decoded: $extrinsic.decode(encoded) });

await client.close();
