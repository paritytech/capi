import { POLKADOT_RPC_URL } from "/_/constants/chains/url.ts";
import * as c from "/connection/mod.ts";
import * as frame from "/frame/mod.ts";
import * as prim from "/primitive/mod.ts";
import * as sys from "/system/mod.ts";

// Represent a chain via a proxy URL
const chain = frame.Chain.ProxyWebSocketUrl(sys.lift(POLKADOT_RPC_URL));

// Represent a storage entry of the chain
const storageEntry = frame.StorageEntry(chain, "System", "Account");

// Represent a public key via an Ss58 address
const pubKey = prim.PubKey.Ss58Text(sys.lift("13SceNt2ELz3ti4rnQbY1snpYH4XE4fLFsW8ph9rpwJd6HFC"));

// Specifically, we want that key's bytes
const pubKeyBytes = sys.accessor(pubKey)((x) => x.bytes);

// Use those bytes to get a representation of the user's balance
const storageMapValue = frame.StorageMapValue(storageEntry, pubKeyBytes);

// Initiate the request
const result = await sys.Fiber(storageMapValue, {
  connections: new c.WebSocketConnectionPool(),
});

if (result instanceof Error) {
  console.log(result);
} else {
  console.log(result.value);
}
