import * as u from "/_/util/mod.ts";
import * as c from "/connection/mod.ts";
import * as z from "/system/Effect.ts";

export interface ResourceRuntime<Beacon> {
  connections: c.ConnectionPool<Beacon>;
}

export interface ResourceResolved<Beacon> {
  beacon: Beacon;
  send(payload: c.Payload): void;
  receive(payload: c.Payload): Promise<unknown>;
}

export namespace Resource {
  export const ProxyWebSocketUrl = <Beacon extends z.AnyEffectA<string>>(beacon: Beacon) => {
    return z.effect<ResourceResolved<Beacon[z._A]>, ResourceRuntime<Beacon[z._A]>>()(
      "Resource.ProxyWebSocketUrl",
      { beacon },
      async (runtime, resolved, ctx) => {
        // TODO: set conditions to time-out the connection and tracked inflight
        runtime.connections.open(resolved.beacon);
        ctx.cleanup.push(async () => {
          runtime.connections.close(resolved.beacon);
        });
        return u.ok<ResourceResolved<Beacon[z._A]>>({
          beacon: resolved.beacon,
          send: (payload) => {
            return runtime.connections.send(resolved.beacon, payload);
          },
          receive: (payload) => {
            return runtime.connections.receive(payload);
          },
        });
      },
    );
  };
}
