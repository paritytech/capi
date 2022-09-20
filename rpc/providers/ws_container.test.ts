import sinon from "../../deps/sinon.ts";
import { deferred } from "../../deps/std/async.ts";
import { assert } from "../../deps/std/testing/asserts.ts";
import { polkadot } from "../../known/mod.ts";
import { getRandomPort } from "../../test-util/mod.ts";
import { WSContainer } from "./ws_container.ts";

Deno.test({
  name: "WSContainer",
  async fn(t) {
    await t.step({
      name: "reconnect on client-side WebSocket close",
      async fn() {
        const webSocketFactory = sinon.spy(() => new WebSocket(polkadot.discoveryValue));

        const webSocketProxy = new WSContainer({
          webSocketFactory,
          reconnect: {
            delay: 0,
          },
        });

        const isOpen = deferred();
        webSocketProxy.onopen = () => isOpen.resolve();

        await isOpen;

        const isReopen = deferred();
        webSocketProxy.onopen = () => isReopen.resolve();

        const isClosed = deferred();
        webSocketProxy.onclose = () => isClosed.resolve();

        webSocketFactory.lastCall.returnValue.close();

        await Promise.all([isClosed, isReopen]);

        const isManuallyClosed = deferred();
        webSocketProxy.onclose = () => isManuallyClosed.resolve();
        webSocketProxy.close();

        await isManuallyClosed;

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

        const webSocketProxy = new WSContainer({
          webSocketFactory,
        });

        const isOpen = deferred();
        webSocketProxy.onopen = () => isOpen.resolve();
        await isOpen;

        webSocketProxy.send("a message!");

        const isClosed = deferred();
        webSocketProxy.onclose = () => isClosed.resolve();

        const isReopen = deferred();
        webSocketProxy.onopen = () => isReopen.resolve();

        await Promise.all([isClosed, isReopen]);

        webSocketProxy.send("a message!");

        listener.close();
        webSocketProxy.close();

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
