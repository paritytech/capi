import * as asserts from "../_deps/asserts.ts";
import { Hashers, Sr25519 } from "../bindings/mod.ts";
import * as C from "../mod.ts";
import * as U from "../util/mod.ts";

const env = U.loadEnv({
  FROM_PUBLIC_KEY: U.hex.decode,
  FROM_SECRET_KEY: U.hex.decode,
  TO_PUBLIC_KEY: U.hex.decode,
});

const [client, sr25519, hashers] = await Promise.all([
  C.wsRpcClient(C.WESTEND_RPC_URL),
  Sr25519(),
  Hashers(),
]);

const metadataRaw = await client.call("state_getMetadata", []);
asserts.assert(metadataRaw.result);
const metadata = C.M.fromPrefixedHex(metadataRaw.result);
const deriveCodec = C.M.DeriveCodec(metadata);

const signer = sr25519
  .PublicKey.from(env.FROM_PUBLIC_KEY)
  .signer(env.FROM_SECRET_KEY);

const $extrinsic = C.M.$extrinsic({
  metadata,
  deriveCodec,
  hashers,
  sign: (message) => new C.Sr25519Signature(signer.sign(message)),
});

const from = new C.MultiAddress("Id", env.FROM_PUBLIC_KEY);
const dest = new C.MultiAddress("Id", env.TO_PUBLIC_KEY);

// TODO: get this from the RPC node
const genesisHash = U.hex.decode(
  "c5c2beaf81f8833d2ddcfe0c04b0612d16f0d08d67aa5032dde065ddf71b4ed1",
);

const extrinsic: C.M.Extrinsic = {
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
