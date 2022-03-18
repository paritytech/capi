#!/usr/bin/env -S deno run -A --no-check=remote --import-map=import_map.json

import { POLKADOT_RPC_URL } from "/_/constants/chains/url.ts";
import * as rpc from "/rpc/mod.ts";
import * as sys from "/system/mod.ts";

const resource = sys.Resource.ProxyWebSocketUrl(sys.lift(POLKADOT_RPC_URL));
const rpcMethods = rpc.ChainGetFinalizedHead(resource);
const result = await sys.Fiber(rpcMethods, new sys.WebSocketConnections(), {});
if (result instanceof Error) {
  result;
} else {
  console.log(result.value);
}
