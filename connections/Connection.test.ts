import { POLKADOT_RPC_URL } from "/_/constants/chains/url.ts";
import * as asserts from "std/testing/asserts.ts";
import { ServerErrResponse, WsConnection } from "./Connection.ts";

Deno.test({
  name: "state_getMetadata",
  ignore: true,
  async fn() {
    const c = new WsConnection(POLKADOT_RPC_URL);
    const payloadId = c.definePayload({
      method: "state_getMetadata",
      params: [],
    });
    const result = c.receive(payloadId);
    await c.sendPayload(payloadId);
    asserts.assert(typeof await result === "string");
    await c.close();
  },
  sanitizeResources: true,
  sanitizeOps: false,
});

Deno.test({
  name: "Invalid Method",
  ignore: true,
  async fn() {
    const c = new WsConnection(POLKADOT_RPC_URL);
    const payloadId = c.definePayload({
      method: "xyz",
      params: [],
    });
    try {
      const result = c.receive(payloadId);
      await c.sendPayload(payloadId);
      await result;
    } catch (e) {
      asserts.assert(e instanceof ServerErrResponse);
    }
    await c.close();
  },
  sanitizeResources: true,
  sanitizeOps: false,
});
