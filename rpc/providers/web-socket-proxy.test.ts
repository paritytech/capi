import { deferred } from "../../deps/std/async.ts";
import { polkadot } from "../../known/mod.ts";
import { getRandomPort } from "../../test-util/mod.ts";
import { WebSocketProxy } from "./web-socket-proxy.ts";

Deno.test({
  name: "WebSocketProxy",
  async fn(t) {
    await t.step({
      name: "reconnect on client-side WebSocket close",
      async fn() {
        let firstConnection: WebSocket;

        const webSocketFactory = () => {
          const ws = new WebSocket(polkadot.discoveryValue);

          if (!firstConnection) {
            firstConnection = ws;
          }

          return ws;
        };

        const webSocketProxy = new WebSocketProxy({
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

        firstConnection!.close();

        await Promise.all([isClosed, isReopen]);

        const isManuallyClosed = deferred();
        webSocketProxy.onclose = () => isManuallyClosed.resolve();
        webSocketProxy.close();

        await isManuallyClosed;
      },
    });

    await t.step({
      name: "reconnect on server-side WebSocket close",
      async fn() {
        const port = getRandomPort();
        const listener = Deno.listen({ port });
        startWebSocketServer(listener);

        const webSocketProxy = new WebSocketProxy({
          webSocketFactory() {
            return new WebSocket(`ws://localhost:${port}`);
          },
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
      },
    });
  },
});

/**
 * Starts a WebSocket server that closes the WebSocket connection on the first message
 */
async function startWebSocketServer(listener: Deno.Listener) {
  async function handleConn(conn: Deno.Conn) {
    const httpConn = Deno.serveHttp(conn);
    for await (const e of httpConn) {
      e.respondWith(handle(e.request));
    }
  }

  function handle(req: Request) {
    const { socket, response } = Deno.upgradeWebSocket(req);

    socket.onmessage = () => {
      socket.close();
    };

    return response;
  }

  for await (const conn of listener) {
    handleConn(conn);
  }
}
