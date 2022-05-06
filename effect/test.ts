import { POLKADOT_RPC_URL } from "/_/constants/chains/url.ts";
import { defaultHashers } from "/frame_metadata/mod.ts";
import * as rpc from "/rpc/mod.ts";
import * as z from "./mod.ts";

const read = z.read(POLKADOT_RPC_URL, "Timestamp", "Now");
const result = await z.exec(read).run({
  hashers: defaultHashers,
  rpcClientFactory: rpc.wsRpcClient,
});
if (result instanceof Error) {
  console.log(result);
} else {
  console.log(result);
}
