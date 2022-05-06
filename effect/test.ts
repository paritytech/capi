import { POLKADOT_RPC_URL } from "/_/constants/chains/url.ts";
import { defaultHashers } from "/frame_metadata/mod.ts";
import * as rpc from "/rpc/mod.ts";
import * as z from "./mod.ts";

const pallet = z.pallet(POLKADOT_RPC_URL, "Timestamp");
const entry = z.StorageEntryMeta.fromPalletAndName(POLKADOT_RPC_URL, pallet, "Now");

const storageKey = z.StorageKey.from(POLKADOT_RPC_URL, pallet, entry);
const storageValueRes = z.rpcCall(POLKADOT_RPC_URL, "state_getStorage", storageKey);
const storageValueEncoded = z.then(storageValueRes)((e) => e.result);
const storageValue = z.storageValue(POLKADOT_RPC_URL, entry, storageValueEncoded);

const m = z.metadata(POLKADOT_RPC_URL);

const result = await z.exec(storageValue).run({
  hashers: defaultHashers,
  rpcClientFactory: rpc.wsRpcClient,
});
if (result instanceof Error) {
  console.log(result);
} else {
  console.log(result);
}
