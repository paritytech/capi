import { Connections, Payload } from "/system/Connections.ts";
import * as Z from "/system/Effect.ts";
import * as sys from "/system/mod.ts";

export interface ResourceRuntime<Beacon> {
  connections: Connections<Beacon>;
}

/**
 * TODO: return means of actually interacting (a layer on top of `system/Connections`).
 * For now, we simply return the supplied beacon value and initialize all (as sockets)
 * at the `Fiber` root.
 */
export interface ResourceResolved<Beacon> {
  beacon: Beacon;
  send(payload: Payload): void;
  receive(payload: Payload): Promise<unknown>;
}

export namespace Resource {
  export const ProxyWebSocketUrl = <
    BeaconResolved extends string,
    Beacon extends Z.AnyEffectA<BeaconResolved>,
  >(beacon: Beacon) => {
    return Z.effect<ResourceResolved<Beacon>, ResourceRuntime<BeaconResolved>>()(
      "Resource.ProxyWebSocketUrl",
      { beacon },
      async (runtime, resolved, ctx) => {
        runtime.connections.open(resolved.beacon);
        ctx.cleanup.push(async () => {
          runtime.connections.close(resolved.beacon);
        });
        return sys.ok({
          beacon: resolved.beacon,
          // TODO: why isn't `Payload` inferred?
          send: (payload: Payload) => {
            return runtime.connections.send(resolved.beacon, payload);
          },
          // TODO: why isn't `Payload` inferred?
          receive: (payload: Payload) => {
            return runtime.connections.receive(payload);
          },
        });
      },
    );
  };
}
