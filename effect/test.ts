import { POLKADOT_RPC_URL } from "/_/constants/chains/url.ts";
import { defaultHashers } from "/frame_metadata/mod.ts";
import * as rpc from "/rpc/mod.ts";
import * as z from "./mod.ts";

const beacon = z.lift(POLKADOT_RPC_URL);
const pallet = z.pallet(beacon, z.lift("Timestamp"));
const entry = z.StorageEntry.fromPalletAndName(beacon, pallet, z.lift("Now"));
const storageKey = z.StorageKey.from(beacon, pallet, entry);
const storageValueRes = z.rpcCall(beacon, z.lift("state_getStorage" as const), storageKey);
const storageValueEncoded = z.then(storageValueRes)((e) => e.result);
const storageValue = z.storageValue(beacon, entry, storageValueEncoded);

const result = await z.exec(storageValue).run({
  hashers: defaultHashers,
  rpcClientFactory: rpc.wsRpcClient,
});
if (result instanceof Error) {
  console.log(result);
} else {
  console.log(result);
}
