import { ConnectionPool, Payload } from "/connection/mod.ts";
import * as Z from "/system/Effect.ts";
import * as sys from "/system/mod.ts";

export interface ResourceRuntime<Beacon> {
  connections: ConnectionPool<Beacon>;
}

export interface ResourceResolved<Beacon> {
  beacon: Beacon;
  send(payload: Payload): void;
  receive(payload: Payload): Promise<unknown>;
}

export namespace Resource {
  export const ProxyWebSocketUrl = <Beacon extends Z.AnyEffectA<string>>(beacon: Beacon) => {
    return Z.effect<ResourceResolved<Beacon[sys._A]>, ResourceRuntime<Beacon[sys._A]>>()(
      "Resource.ProxyWebSocketUrl",
      { beacon },
      async (runtime, resolved, ctx) => {
        // TODO: set conditions to time-out the connection and tracked inflight
        runtime.connections.open(resolved.beacon);
        ctx.cleanup.push(async () => {
          runtime.connections.close(resolved.beacon);
        });
        return sys.ok<ResourceResolved<Beacon[sys._A]>>({
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
