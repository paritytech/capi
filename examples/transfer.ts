import { getBindings } from "/bindings/mod.ts";
import * as M from "/frame_metadata/mod.ts";
import * as C from "/mod.ts";
import * as hex from "/util/hex.ts";
import "std/dotenv/load.ts";

const bindings = await getBindings();

const pair = bindings.pairFromSecretSeed(
  hex.decode("2df317d6d3b060d9cef6999f592a4a4a3acfb7212a77172d8fcdf8a08f3bf120"),
);

const client = await C.wsRpcClient(C.WESTEND_RPC_URL);
const metadataRaw = (await C.call(client, "state_getMetadata", [])).result;
if (!metadataRaw) {
  throw new Error();
}
const metadata = M.fromPrefixedHex(metadataRaw);
const deriveCodec = M.DeriveCodec(metadata);

const dest = new C.MultiAddress(
  C.MultiAddressKind.Id,
  hex.decode("8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48"),
);
const genesisHash = hex.decode("c5c2beaf81f8833d2ddcfe0c04b0612d16f0d08d67aa5032dde065ddf71b4ed1");

const encoded = await M.encodeExtrinsic({
  ...M.getExtrinsicCodecs(metadata, deriveCodec),
  pubKey: pair.pubKey,
  extrinsicVersion: metadata.extrinsic.version,
  palletName: "Balances",
  methodName: "transfer",
  args: { dest, value: 12345n },
  extras: new C.Extras(C.immortalEra, 1000, new C.ChargeAssetTxPayment(500000000000000n)),
  specVersion: 100,
  transactionVersion: 1,
  genesisHash,
  checkpoint: genesisHash,
  sign: (message) => {
    return bindings.sign(pair.pubKey, pair.secretKey, message);
  },
});

console.log({ encoded });
console.log({ decoded: M.decodeExtrinsic(metadata, deriveCodec, hex.decode(encoded)) });

await client.close();
