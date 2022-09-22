import sinon from "../../deps/sinon.ts";
import { assert } from "../../deps/std/testing/asserts.ts";
import { polkadot } from "../../known/mod.ts";
import { getRandomPort } from "../../test-util/mod.ts";
import { WsContainer } from "./ws_container.ts";

Deno.test({
  name: "WsContainer",
  async fn(t) {
    await t.step({
      name: "reconnect on client-side WebSocket close",
      async fn() {
        const webSocketFactory = sinon.spy(
          (discoveryValue) => new WebSocket(discoveryValue),
        );
        const wsContainer = new WsContainer({
          discoveryValue: polkadot.discoveryValue,
          webSocketFactory,
          reconnect: {
            delay: 0,
          },
        });
        await wsContainer.once("open");
        webSocketFactory.lastCall.returnValue.close();
        await wsContainer.once("close");
        await wsContainer.once("open");
        wsContainer.close();
        await wsContainer.once("close");

        assert(webSocketFactory.calledTwice);
      },
    });

    await t.step({
      name: "reconnect on server-side WebSocket close",
      async fn() {
        const port = getRandomPort();
        const listener = Deno.listen({ port });
        startWebSocketServer(listener);
        const webSocketFactory = sinon.spy(
          (discoveryValue) => new WebSocket(discoveryValue),
        );
        const wsContainer = new WsContainer({
          discoveryValue: `ws://localhost:${port}`,
          webSocketFactory,
          reconnect: {
            delay: 0,
          },
        });
        await wsContainer.once("open");
        wsContainer.send("a message!");
        await wsContainer.once("close");
        await wsContainer.once("open");
        wsContainer.send("a message!");
        wsContainer.close();
        await wsContainer.once("close");
        listener.close();

        assert(webSocketFactory.calledTwice);
      },
    });
  },
});

/**
 * Starts a WebSocket server that closes the WebSocket connection on the first message
 */
async function startWebSocketServer(listener: Deno.Listener) {
  for await (const conn of listener) {
    for await (const e of Deno.serveHttp(conn)) {
      const { socket, response } = Deno.upgradeWebSocket(e.request);
      socket.onmessage = () => {
        socket.close();
      };
      e.respondWith(response);
    }
  }
}
