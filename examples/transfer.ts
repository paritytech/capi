import { getBindings, getHashers } from "/bindings/mod.ts";
import * as M from "/frame_metadata/mod.ts";
import * as C from "/mod.ts";
import * as hex from "/util/hex.ts";
import "std/dotenv/load.ts";

const bindings = await getBindings();
const hashers = await getHashers();

const pair = bindings.pairFromSecretSeed(
  hex.decode("2df317d6d3b060d9cef6999f592a4a4a3acfb7212a77172d8fcdf8a08f3bf120"),
);

const client = await C.wsRpcClient(C.WESTEND_RPC_URL);
const metadataRaw = await client.call("state_getMetadata", []);
if (metadataRaw instanceof Error) {
  throw metadataRaw;
}
const metadata = M.fromPrefixedHex(metadataRaw.result);
const deriveCodec = M.DeriveCodec(metadata);

const dest = new C.MultiAddress(
  C.MultiAddressKind.Id,
  hex.decode("8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48"),
);
const genesisHash = hex.decode("c5c2beaf81f8833d2ddcfe0c04b0612d16f0d08d67aa5032dde065ddf71b4ed1");

const $extrinsic = M.createExtrinsicCodec({
  metadata,
  deriveCodec,
  hashers,
  sign: (message) => ({
    _tag: "Sr25519",
    value: bindings.sign(pair.pubKey, pair.secretKey, message),
  }),
});

const extrinsic: M.Extrinsic = {
  protocolVersion: 4,
  signature: {
    address: new C.MultiAddress(C.MultiAddressKind.Address32, pair.pubKey),
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

console.log({ extrinsic });

const encoded = $extrinsic.encode(extrinsic);

console.log({ encoded });
console.log({ decoded: $extrinsic.decode(encoded) });

await client.close();
