import { Config } from "../../config/mod.ts";
import sinon from "../../deps/sinon.ts";
import { delay } from "../../deps/std/async.ts";
import { assert } from "../../deps/std/testing/asserts.ts";
import { getRandomPort } from "../../test-util/mod.ts";
import { ProxyClient } from "./proxy.ts";
import { WsContainer } from "./ws_container.ts";

Deno.test({
  name: "WsContainer",
  async fn(t) {
    await t.step({
      name: "reconnect on client-side WebSocket close",
      async fn() {
        const server = createWebSocketServer();
        const factory = sinon.spy(
          ({ discoveryValue }) => new WebSocket(discoveryValue),
        );
        const wsContainer = new WsContainer({
          client: createTestClient(server.url),
          factory,
        });
        await wsContainer.send("a message!");
        factory.lastCall.returnValue.close();
        // schedule a .send call for the next loop
        await delay(1);
        await wsContainer.send("a message!");
        await wsContainer.close();
        server.close();

        assert(factory.calledTwice);
      },
    });

    await t.step({
      name: "reconnect on server-side WebSocket close",
      async fn() {
        const server = createWebSocketServer(
          function() {
            this.close();
          },
        );
        const factory = sinon.spy(
          ({ discoveryValue }) => new WebSocket(discoveryValue),
        );
        const wsContainer = new WsContainer({
          client: createTestClient(server.url),
          factory,
        });
        await wsContainer.send("a message!");
        // schedule a .send call for the next loop
        await delay(1);
        await wsContainer.send("a message!");
        await wsContainer.close();
        server.close();

        assert(factory.calledTwice);
      },
    });
  },
});

function createTestClient(discoveryValue: string) {
  return {
    onMessage: sinon.stub(),
    onError: sinon.stub(),
    config: {
      discoveryValue,
    },
  } as unknown as ProxyClient<Config<string>>;
}

function createWebSocketServer(onMessage?: WebSocket["onmessage"]) {
  const onmessage: WebSocket["onmessage"] = onMessage
    ?? (() => {});
  const port = getRandomPort();
  const listener = Deno.listen({ port });
  const startServer = async () => {
    for await (const conn of listener) {
      for await (const e of Deno.serveHttp(conn)) {
        const { socket, response } = Deno.upgradeWebSocket(e.request);
        socket.onmessage = onmessage;
        e.respondWith(response);
      }
    }
  };
  const close = () => listener.close();
  startServer();
  return {
    close,
    url: `ws://localhost:${port}`,
  };
}
