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

export function call<Params extends unknown[], Result>(method: string) {
  return <Client_ extends Z.$<Client>>(client: Client_) => {
    return <Params_ extends Z.Ls$<Params>>(...params: [...Params_]) => {
      return Z.call(
        Z.rc(client, method, ...params),
        async ([[client, method, ...params], counter]) => {
          type ClientE = typeof client[ClientE_];
          // TODO: why do we need to explicitly type this / why is this not being inferred?
          const result: ClientCallEvent<ClientE["send"], ClientE["handler"], Result> = await client
            .call<Result>({
              jsonrpc: "2.0",
              id: client.providerRef.nextId(),
              method,
              params,
            });
          const discardCheckResult = await discardCheck<ClientE["close"]>(client, counter);
          if (discardCheckResult) return discardCheckResult;
          if (result instanceof Error) {
            return result;
          } else if (result.error) {
            return new RpcServerError(result);
          }
          return result.result;
        },
      );
    };
  };
}

// TODO: why are leading type params unknown when `extends Z.$Client<any, SendErrorData, HandlerErrorData, CloseErrorData>`?
export function subscription<Params extends unknown[], Result>() {
  return <Method extends string>(method: Method) => {
    return <Client_ extends Z.$<Client>>(client: Client_) => {
      return <
        Params_ extends Z.Ls$<Params>,
        Listener extends Z.$<U.Listener<Result, ClientSubscribeContext>>,
      >(params: [...Params_], listener: Listener) => {
        return Z.call(
          Z.rc(client, listener, ...params),
          async ([[client, listener, ...params], counter]) => {
            type ClientE = typeof client[ClientE_];
            let error:
              | undefined
              | RpcServerError
              | ProviderSendError<ClientE["send"]>
              | ProviderHandlerError<ClientE["handler"]>;
            const id = await client.subscribe<Method, Result>({
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
            const discardCheckResult = await discardCheck<ClientE["close"]>(client, counter);
            return discardCheckResult || error || id!;
          },
        );
      };
    };
  };
}

async function discardCheck<CloseErrorData>(
  client: Client<any, any, any, CloseErrorData>,
  counter: Z.RcCounter,
) {
  counter.i--;
  if (counter.i === 1) {
    return await client.discard();
  }
}

export class RpcServerError extends Error {
  override readonly name = "RpcServer";

  constructor(readonly inner: msg.ErrorMessage) {
    super();
  }
}
