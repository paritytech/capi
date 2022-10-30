import { Client, ClientSubscribeContext, ClientSubscribeListener } from "./client.ts";

export function call<Result>(method: string, ...params: unknown[]) {
  return <DiscoveryValue, SendErrorData, HandlerErrorData, CloseErrorData>(
    client: Client<DiscoveryValue, SendErrorData, HandlerErrorData, CloseErrorData>,
  ) => {
    return client.call<Result>({
      jsonrpc: "2.0",
      id: client.providerRef.nextId(),
      method,
      params,
    });
  };
}

export function subscription<Result>() {
  return <Method extends string>(method: Method, ...params: unknown[]) => {
    return <DiscoveryValue, SendErrorData, HandlerErrorData, CloseErrorData>(
      client: Client<DiscoveryValue, SendErrorData, HandlerErrorData, CloseErrorData>,
      listener: ClientSubscribeListener<
        SendErrorData,
        HandlerErrorData,
        ClientSubscribeContext,
        Method,
        Result
      >,
    ) => {
      return client.subscribe<Method, Result>({
        jsonrpc: "2.0",
        id: client.providerRef.nextId(),
        method,
        params,
      }, listener);
    };
  };
}
