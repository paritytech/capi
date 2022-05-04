import { POLKADOT_RPC_URL } from "/_/constants/chains/url.ts";
import { defaultHashers } from "/frame_metadata/mod.ts";
import * as rpc from "/rpc/mod.ts";
import * as z from "./mod.ts";

const beacon = z.lift(POLKADOT_RPC_URL);
const pallet = z.pallet(beacon, z.lift("Timestamp"));
const entry = z.storageEntry(beacon, pallet, z.lift("Now"));

const storageKey = z.StorageKey.from(
  z.lift(POLKADOT_RPC_URL),
  z.lift("Timestamp"),
  z.lift("Now"),
);
const rpcCall = z.rpcCall(z.lift(POLKADOT_RPC_URL), z.lift("state_getStorage" as const), storageKey);
const decoded = z.storageValue(z.lift(POLKADOT_RPC_URL), entry, z.then(rpcCall)((e) => e.result));
const result = await z.exec(decoded).run({
  hashers: defaultHashers,
  rpcClientPool: rpc.rpcClientPool(rpc.wsRpcClient as any),
});
if (result instanceof Error) {
  console.log(result);
} else {
  console.log(result);
}
// const e = z.rpcCall(z.lift(POLKADOT_RPC_URL), z.lift("state_getMetadata" as const));
