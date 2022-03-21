import { POLKADOT_RPC_URL } from "/_/constants/chains/url.ts";
import * as c from "/mod.ts";

// Represent a chain via a proxy URL
const chain = c.Chain.ProxyWebSocketUrl(c.lift(POLKADOT_RPC_URL));

// Represent a storage entry of the chain
const storageEntry = c.StorageEntry(chain, "System", "Account");

// Represent a public key via an Ss58 address
const pubKey = c.PubKey.Ss58Text(c.lift("13SceNt2ELz3ti4rnQbY1snpYH4XE4fLFsW8ph9rpwJd6HFC"));

// Specifically, we want that key's bytes
const pubKeyBytes = c.then(pubKey)((x) => x.bytes);

// Use those bytes to get a representation of the user's balance
const storageMapValue = c.StorageMapValue(storageEntry, pubKeyBytes);

// Create a connection pool
const connections = new c.WebSocketConnectionPool();

// Spawn a fiber
const fiber = new c.Fiber(storageMapValue);

// Run the fiber
const result = await fiber.run({ connections });

if (result instanceof Error) {
  console.log(result);
} else {
  console.log(result.value);
}
