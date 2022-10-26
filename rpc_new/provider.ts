import * as msg from "./msg.ts";

export type ProviderFactory<DiscoveryValue, HandlerE, SendE, CloseE> = (
  discoveryValue: DiscoveryValue,
  handler: ProviderHandler<HandlerE>,
) => Provider<SendE, CloseE>;

export interface Provider<SendE, CloseE> {
  send: ProviderSend<SendE>;
  release: ProviderRelease<CloseE>;
}

export type ProviderHandler<InternalE> = (event: msg.Ingress | InternalE) => void;
export type ProviderSend<SendE> = (message: msg.Egress) => Promise<void | SendE>;
export type ProviderRelease<CloseE> = () => Promise<void | CloseE>;
