import { Payload } from "/system/Connections.ts";
import * as Z from "/system/Effect.ts";
import * as sys from "/system/mod.ts";

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
  export const ProxyWebSocketUrl = <Beacon extends string>(beacon: Z.AnyEffectA<Beacon>) => {
    return Z.effect<ResourceResolved<Beacon>>()(
      "Resource.ProxyWebSocketUrl",
      { beacon },
      async (_0, resolved, ctx) => {
        ctx.connections.open(resolved.beacon);
        ctx.cleanup.push(async () => {
          ctx.connections.close(resolved.beacon);
        });
        return sys.ok({
          beacon: resolved.beacon,
          // TODO: why isn't `Payload` inferred?
          send: (payload: Payload) => {
            return ctx.connections.send(resolved.beacon, payload);
          },
          // TODO: why isn't `Payload` inferred?
          receive: (payload: Payload) => {
            return ctx.connections.receive(payload);
          },
        });
      },
    );
  };
}
