import { assert } from "../deps/std/testing/asserts.ts";
import * as M from "../frame_metadata/mod.ts";
import { Hashers } from "../hashers/mod.ts";
import { westend } from "../known/mod.ts";
import * as rpc from "../rpc/mod.ts";
import { Sr25519 } from "../test-util/mod.ts";
import * as U from "../util/mod.ts";

const [client, sr25519, hashers] = await Promise.all([
  rpc.stdClient(westend),
  Sr25519(),
  Hashers(),
]);
assert(!(client instanceof Error));
const metadataRes = await client.call("state_getMetadata", []);
assert(metadataRes.result);
const metadata = M.fromPrefixedHex(metadataRes.result);
const deriveCodec = M.DeriveCodec(metadata.tys);

const genesisHashRes = await client.call("chain_getBlockHash", []);
assert(genesisHashRes.result);
const genesisHash = U.hex.decode(genesisHashRes.result);

const alice = sr25519.TestUser.fromName("alice");

const $extrinsic = M.$extrinsic({
  metadata,
  deriveCodec,
  hashers,
  sign: (message) => ({
    type: "Sr25519",
    value: alice.sign(message),
  }),
});

const extrinsic: M.Extrinsic = {
  protocolVersion: 4,
  signature: {
    address: {
      type: "Id",
      value: alice.publicKey,
    },
    extra: [
      /* era */ { type: "Immortal" },
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
  args: {
    dest: {
      type: "Id",
      value: U.hex.decode("8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48"),
    },
    value: 12345n,
  },
};

const encoded = $extrinsic.encode(extrinsic);

console.log({ encoded });
console.log({ decoded: $extrinsic.decode(encoded) });

await client.close();
