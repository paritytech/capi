// import * as C from "/mod.ts";
import * as M from "/frame_metadata/mod.ts";
import * as C from "/mod.ts";
import * as bindings from "/target/wasm/bindings/mod.js";
import "std/dotenv/load.ts";
import * as hex from "std/encoding/hex.ts";

const pair = bindings.pairFromSecretSeed(
  hex.decode(new TextEncoder().encode("2df317d6d3b060d9cef6999f592a4a4a3acfb7212a77172d8fcdf8a08f3bf120")),
);

const client = await C.wsRpcClient(C.WESTEND_RPC_URL);
const metadataRaw = (await C.call(client, "state_getMetadata", []) as C.OkRes<"state_getMetadata">).result;
const metadata = M.fromPrefixedHex(metadataRaw);
const deriveCodec = M.DeriveCodec(metadata);

const dest = {
  _tag: "Id",
  0: {
    0: [...hex.decode(new TextEncoder().encode("8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48"))],
  },
};
const hash = (hex.decode(new TextEncoder().encode("c5c2beaf81f8833d2ddcfe0c04b0612d16f0d08d67aa5032dde065ddf71b4ed1")));

const result = M.encodeExtrinsic(
  pair.pubKey,
  metadata,
  deriveCodec,
  "Balances",
  "transfer",
  { value: 12345n, dest },
  [
    {},
    {},
    {},
    {},
    { 0: { _tag: "Immortal" } },
    { 0: 1000 },
    {},
    { 0: 500000000000000n },
  ],
  100,
  1,
  hash,
  hash,
  (message) => {
    return bindings.sign(pair.pubKey, pair.secretKey, message);
  },
);

console.log(result);
// await C.call(client, "author_submitExtrinsic", [result]);
// console.log(result);

await client.close();
