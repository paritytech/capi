import * as u from "/_/util/mod.ts";
import { call } from "/rpc/common.ts";
import * as s from "/system/mod.ts";

export enum NodeRoleKind {
  Full = "Full",
  LightClient = "LightClient",
  Authority = "Authority",
}

export type SystemNodeRolesResolved = [NodeRoleKind, NodeRoleKind?, NodeRoleKind?];

export const SystemNodeRoles = <
  Beacon,
  Resource extends s.AnyEffectA<s.ResourceResolved<Beacon>>,
>(resource: Resource) => {
  return s.effect<SystemNodeRolesResolved>()(
    "SystemNodeRoles",
    { resource },
    (_, resolved) => {
      return call(
        resolved.resource,
        "system_nodeRoles",
        u.isArray,
      ) as unknown as Promise<u.Ok<SystemNodeRolesResolved>>;
    },
  );
};
