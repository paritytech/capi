// TODO: close connection based on zones rc
import * as Z from "../deps/zones.ts";
import { Client, ClientCallEvent, ClientE_, ClientSubscribeContext } from "./client.ts";
import * as msg from "./messages.ts";
import { Provider } from "./provider/base.ts";
import { ProviderHandlerError, ProviderSendError } from "./provider/errors.ts";
import * as U from "./util.ts";

export function client<DiscoveryValue, SendErrorData, HandlerErrorData, CloseErrorData>(
  provider: Provider<DiscoveryValue, SendErrorData, HandlerErrorData, CloseErrorData>,
  discoveryValue: DiscoveryValue,
) {
  return Z.call(
    Z.ls(provider, discoveryValue),
    () => {
      return new Client(provider, discoveryValue);
    },
  );
}

// TODO: not narrowing error inner data type
export function call<Client_ extends Z.$<Client>>(client: Client_) {
  return <Result>() => {
    return <Method extends Z.$<string>, Params extends unknown[]>(
      method: Method,
      params: [...Params],
    ) => {
      return Z.call(Z.ls(client, method, ...params), async ([client, method, ...params]) => {
        // TODO: why do we need to explicitly type this / why is this not being inferred?
        const result: ClientCallEvent<
          typeof client[ClientE_]["send"],
          typeof client[ClientE_]["handler"],
          Result
        > = await client.call<Result>({
          jsonrpc: "2.0",
          id: client.providerRef.nextId(),
          method,
          params,
        });
        if (result instanceof Error) {
          return result;
        } else if (result.error) {
          return new RpcServerError(result);
        }
        return result.result;
      });
    };
  };
}

// TODO: why are leading type params unknown when `extends Z.$Client<any, SendErrorData, HandlerErrorData, CloseErrorData>`?
export function subscription<Client_ extends Z.$<Client>>(client: Client_) {
  return <Result>() => {
    return <
      Method extends Z.$<string>,
      Params extends unknown[],
      Listener extends Z.$<U.Listener<Result, ClientSubscribeContext>>,
    >(
      method: Method,
      params: [...Params],
      listener: Listener,
    ) => {
      return Z.call(
        Z.ls(client, method, listener, ...params),
        async ([client, method, listener, ...params]) => {
          let error:
            | undefined
            | RpcServerError
            | ProviderSendError<typeof client[ClientE_]["send"]>
            | ProviderHandlerError<typeof client[ClientE_]["handler"]>;
          const id = await client.subscribe<Z.T<Method>, Result>({
            jsonrpc: "2.0",
            id: client.providerRef.nextId(),
            method,
            params,
          }, function(e) {
            if (e instanceof Error) {
              error = e;
              this.stop();
            } else if (e.error) {
              error = new RpcServerError(e);
              this.stop();
            } else {
              listener.apply(this, [e.params.result]);
            }
          });
          return error || id!;
        },
      );
    };
  };
}

export class RpcServerError extends Error {
  override readonly name = "RpcServer";

  constructor(readonly inner: msg.ErrorMessage) {
    super();
  }
}
