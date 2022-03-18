#!/usr/bin/env -S deno run -A --no-check=remote --import-map=import_map.json

import { MOONBEAM_RPC_URL } from "/_/constants/chains/url.ts";
import * as rpc from "/rpc/mod.ts";
import * as sys from "/system/mod.ts";

const resource = sys.Resource.ProxyWebSocketUrl(sys.lift(MOONBEAM_RPC_URL));
const effect = rpc.SystemNodeRoles(resource);
const result = await sys.Fiber(effect, new sys.WebSocketConnections(), {});
if (result instanceof Error) {
  result;
} else {
  result.value.forEach((value) => {
    switch (value) {
      case rpc.NodeRoleKind.Full: {
        console.log("HIT HIT");
        break;
      }
      default: {
        console.log("NOPE");
      }
    }
  });
}
