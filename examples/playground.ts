#!/usr/bin/env -S deno run -A --no-check=remote --import-map=import_map.json

import { MOONBEAM_RPC_URL } from "/_/constants/chains/url.ts";
import * as rpc from "/rpc/mod.ts";
import * as sys from "/system/mod.ts";

const resourceUrl = sys.lift(MOONBEAM_RPC_URL);
const resource = sys.Resource.ProxyWebSocketUrl(resourceUrl);

const systemHealth = rpc.SystemHealth(resource);
const systemLocalListenAddresses = rpc.SystemLocalListenAddresses(resource);
const systemName = rpc.SystemName(resource);
const all = sys.all(systemHealth, systemLocalListenAddresses, systemName);
const all2 = sys.all(all, rpc.SystemSyncState(resource));

const result = await sys.Fiber(all2, {
  connections: new sys.WebSocketConnections(),
});

if (result instanceof Error) {
  result;
} else {
  console.log(result.value);
  // console.log(result.value.isSyncing);
  // result.value.forEach((value) => {
  //   switch (value) {
  //     case rpc.NodeRoleKind.Full: {
  //       console.log("HIT HIT");
  //       break;
  //     }
  //     default: {
  //       console.log("NOPE");
  //     }
  //   }
  // });
}
