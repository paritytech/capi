#!/usr/bin/env -S deno run -A --no-check=remote

import { MOONBEAM_RPC_URL } from "/_/constants/chains/url.ts";
import * as c from "/connection/mod.ts";
import * as rpc from "/rpc/mod.ts";
import * as sys from "/system/mod.ts";

const resourceUrl = sys.lift(MOONBEAM_RPC_URL);
const resource = sys.Resource.ProxyWebSocketUrl(resourceUrl);

const systemHealth = rpc.SystemHealth(resource);
const systemLocalListenAddresses = rpc.SystemLocalListenAddresses(resource);
const systemName = rpc.SystemName(resource);
const all = sys.all(systemHealth, systemLocalListenAddresses, systemName);
const repeatAll = sys.all(all, all, all);

const result = await sys.Fiber(repeatAll, {
  connections: new c.WebSocketConnectionPool(),
});

if (result instanceof Error) {
  console.log(result);
} else {
  console.log(result.value);
}
