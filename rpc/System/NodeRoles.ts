import * as u from "/_/util/mod.ts";
import * as common from "/rpc/common.ts";
import * as sys from "/system/mod.ts";

export enum NodeRoleKind {
  Full = "Full",
  LightClient = "LightClient",
  Authority = "Authority",
}

export type SystemNodeRolesResolved = [NodeRoleKind, NodeRoleKind?, NodeRoleKind?];

export const SystemNodeRoles = <
  Beacon,
  Resource extends sys.AnyEffectA<sys.ResourceResolved<Beacon>>,
>(resource: Resource) => {
  return sys.effect<SystemNodeRolesResolved>()(
    "SystemNodeRoles",
    { resource },
    (_, resolved) => {
      return common.call(
        resolved.resource,
        "system_nodeRoles",
        u.isArray,
      ) as unknown as Promise<sys.Ok<SystemNodeRolesResolved>>;
    },
  );
};
