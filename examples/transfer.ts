// import { WESTEND_RPC_URL } from "/constants/chains/url.ts";
// import * as C from "/mod.ts";
import * as M from "/frame_metadata/mod.ts";
import * as C from "/mod.ts";
import * as bindings from "/target/wasm/bindings/mod.js";
import * as U from "/util/mod.ts";
import "std/dotenv/load.ts";
import * as hex from "std/encoding/hex.ts";
import * as $ from "x/scale/mod.ts";

// Make sure you have these in a project-root-level `.env`
const PUB_KEY = Deno.env.get("PUB_KEY")!;
const PRIV_KEY = Deno.env.get("PRIV_KEY")!;

const pair = bindings.pairFromSecretSeed(
  hex.decode(new TextEncoder().encode("2df317d6d3b060d9cef6999f592a4a4a3acfb7212a77172d8fcdf8a08f3bf120")),
);

const client = await C.wsRpcClient(C.WESTEND_RPC_URL);
const metadataRaw = (await C.call(client, "state_getMetadata", []) as C.OkRes<"state_getMetadata">).result;
const genesisBlock = ((await C.call(client, "chain_getBlockHash", [0])) as C.OkRes<"chain_getBlockHash">).result;
const versionStuff =
  ((await C.call(client, "chain_getRuntimeVersion", [])) as C.OkRes<"chain_getRuntimeVersion">).result;

const eraReference = genesisBlock; // make current to make mortal

const metadata = M.fromPrefixedHex(metadataRaw);
const deriveCodec = M.DeriveCodec(metadata);

const lookup = new M.Lookup(metadata);
const balances = lookup.getPalletByName("Balances");
if (balances.calls === undefined) {
  throw new Error();
}

// console.log(metadata.types[656]);
const uncheckedExtrinsicMetadata = metadata.types[metadata.extrinsic.type];
if (!(uncheckedExtrinsicMetadata?._tag !== M.TypeKind.Union)) {
  throw new Error();
}

// console.log(uncheckedExtrinsicMetadata);

const dest = new C.Id(
  hex.decode(new TextEncoder().encode("8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48")),
);
const callEncoded = M.encodeCall(balances.i, deriveCodec(balances.calls.type), "transfer", {
  value: 12345n,
  dest,
});
const $extra = deriveCodec(656);
const extra = [
  {},
  {},
  {},
  {},
  { 0: { _tag: "Immortal" } },
  { 0: 1000 },
  {},
  { 0: 500000000000000n },
];
const extraEncoded = M.encodeExtra($extra, extra);
const hash = (hex.decode(new TextEncoder().encode("c5c2beaf81f8833d2ddcfe0c04b0612d16f0d08d67aa5032dde065ddf71b4ed1")));
const additionalEncoded = M.encodeAdditional(100, 1, hash, hash);
const fullUnsignedPayloadBytes = new Uint8Array([
  ...callEncoded,
  ...extraEncoded,
  ...additionalEncoded,
]);
const normalized = M.ensureMaxLen(fullUnsignedPayloadBytes);
const $signature = deriveCodec(464);
const signature = {
  _tag: "Sr25519",
  0: {
    0: bindings.sign(pair.pubKey, pair.secretKey, normalized),
  },
};
const $signatureToEncode = M.$SignatureToEncode($signature, $extra);
const signatureToEncode = $signatureToEncode.encode([[...pair.pubKey] as any, signature, extra]);
const final = new TextDecoder().decode(
  hex.encode(M.encodeExtrinsic(metadata.extrinsic.version, callEncoded, signatureToEncode)),
);
console.log(final);

await client.close();
