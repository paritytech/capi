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
        const webSocketFactory = sinon.spy(() => new WebSocket(polkadot.discoveryValue));

        const wsContainer = new WsContainer({
          webSocketFactory,
          reconnect: {
            delay: 0,
          },
        });

        await new Promise((resolve) => {
          wsContainer.listen("open", (stop) =>
            () => {
              stop();
              resolve(undefined);
            });
        });

        webSocketFactory.lastCall.returnValue.close();

        await new Promise((resolve) => {
          wsContainer.listen("close", (stop) =>
            () => {
              stop();
              resolve(undefined);
            });
        });

        await new Promise((resolve) => {
          wsContainer.listen("open", (stop) =>
            () => {
              stop();
              resolve(undefined);
            });
        });

        wsContainer.close();

        await new Promise((resolve) => {
          wsContainer.listen("close", (stop) =>
            () => {
              stop();
              resolve(undefined);
            });
        });

        assert(webSocketFactory.calledTwice);
      },
    });

    await t.step({
      name: "reconnect on server-side WebSocket close",
      async fn() {
        const port = getRandomPort();
        const listener = Deno.listen({ port });
        startWebSocketServer(listener);

        const webSocketFactory = sinon.spy(() => new WebSocket(`ws://localhost:${port}`));

        const wsContainer = new WsContainer({
          webSocketFactory,
          reconnect: {
            delay: 0,
          },
        });

        await new Promise((resolve) => {
          wsContainer.listen("open", (stop) =>
            () => {
              stop();
              resolve(undefined);
            });
        });

        wsContainer.send("a message!");

        await new Promise((resolve) => {
          wsContainer.listen("close", (stop) =>
            () => {
              stop();
              resolve(undefined);
            });
        });

        await new Promise((resolve) => {
          wsContainer.listen("open", (stop) =>
            () => {
              stop();
              resolve(undefined);
            });
        });

        wsContainer.send("a message!");

        listener.close();
        wsContainer.close();

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
