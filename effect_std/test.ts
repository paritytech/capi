import { POLKADOT_RPC_URL } from "/_/constants/chains/url.ts";
import * as rpc from "/rpc/mod.ts";
import { hashersRuntime } from "/runtime/mod.ts";
import * as z from "./mod.ts";

// const chain = z.pallet(POLKADOT_RPC_URL, "Timestamp");
// const entry = z.entry(chain, "Now");
// const intent = z.read(entry);

const pallet = new z.Pallet(POLKADOT_RPC_URL, "Timestamp");
const entry = new z.Entry(pallet, "Now");

// const storageEntry = z.storageEntryMeta(POLKADOT_RPC_URL, pallet, "Now");
// const key = z.storageEntryKey(POLKADOT_RPC_URL, pallet, storageEntry);
// const rpcCall = z.rpcCall(POLKADOT_RPC_URL, "state_getStorage", key);
// const result = z.then(rpcCall)((x) => x.result);
// const decoded = z.storageEntryValueDecoded(POLKADOT_RPC_URL, storageEntry, result);
// const runResult = await decoded.exec({
//   ...hashersRuntime,
//   rpcClientFactory: rpc.wsRpcClient,
// });
console.log(entry);

// const x = z.read(POLKADOT_RPC_URL, "Timestamp", "Now");

// if (result instanceof Error) {
//   console.log(result);
// } else {
//   console.log(result);
// }
