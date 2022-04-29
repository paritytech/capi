import { EgressMessageBase, IngressOpaqueMessage, MethodName } from "../common.ts";

export type SystemHealthEgressMessage = EgressMessageBase<MethodName.SystemHealth>;

export type SystemHealthIngressMessage = IngressOpaqueMessage<{
  isSyncing: boolean;
  peers: number;
  shouldHavePeers: boolean;
}>;
