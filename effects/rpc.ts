import * as Z from "../deps/zones.ts";
import * as rpc from "../rpc/mod.ts";
import * as U from "../util/mod.ts";

const k0_ = Symbol();
const k1_ = Symbol();
const k2_ = Symbol();

export function rpcClient<
  DiscoveryValue,
  SendErrorData,
  HandlerErrorData,
  CloseErrorData,
  DiscoveryValueZ extends Z.$<DiscoveryValue>,
>(
  provider: rpc.Provider<DiscoveryValue, SendErrorData, HandlerErrorData, CloseErrorData>,
  discoveryValue: DiscoveryValueZ,
) {
  return Z
    .ls(provider, discoveryValue)
    .next(([_, discoveryValue]) => {
      return new rpc.Client(provider, discoveryValue as DiscoveryValue);
    }, k0_)
    .zoned("RpcClient");
}

export function rpcCall<Params extends unknown[], Result>(method: string, nonIdempotent?: boolean) {
  return <Client_ extends Z.$<rpc.Client>>(client: Client_) => {
    return <Params_ extends Z.Ls$<Params>>(...params: [...Params_]) => {
      return Z
        .rc(client, method, nonIdempotent, ...params)
        .next(async ([[client, method, _2, ...params], counter]) => {
          type ClientE = typeof client[rpc.ClientE_];
          // TODO: why do we need to explicitly type this / why is this not being inferred?
          const id = client.providerRef.nextId();
          const result: rpc.ClientCallEvent<ClientE["send"], ClientE["handler"], Result> =
            await client.call<Result>({
              jsonrpc: "2.0",
              id,
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
        }, k1_)
        .zoned("RpcCall");
    };
  };
}

// TODO: why are leading type params unknown when `extends Z.$Client<any, SendErrorData, HandlerErrorData, CloseErrorData>`?
export function rpcSubscription<Params extends unknown[], Result>() {
  return <Method extends string>(method: Method) => {
    return <Client_ extends Z.$<rpc.Client>>(client: Client_) => {
      return <
        Params_ extends Z.Ls$<Params>,
        Listener extends Z.$<U.Listener<Result, rpc.ClientSubscribeContext>>,
      >(params: [...Params_], listener: Listener) => {
        return Z
          .rc(client, listener, ...params)
          .next(async ([[client, listener, ...params], counter]) => {
            type ClientE = typeof client[rpc.ClientE_];
            const id = client.providerRef.nextId();
            let error:
              | undefined
              | RpcServerError
              | rpc.ProviderSendError<ClientE["send"]>
              | rpc.ProviderHandlerError<ClientE["handler"]>;
            const subscriptionId = await client.subscribe<Method, Result>({
              jsonrpc: "2.0",
              id,
              method,
              params,
            }, function(e) {
              if (e instanceof Error) {
                error = e;
                this.stop();
              } else if (e.error) {
                error = new RpcServerError(e);
                console.log(e);
                this.stop();
              } else {
                // TODO: halt if returns `Error` | `Promise<Error>`?
                listener.apply(this, [e.params.result]);
              }
            });
            const discardCheckResult = await discardCheck<ClientE["close"]>(client, counter);
            return discardCheckResult || error || subscriptionId!;
          }, k2_)
          .zoned("RpcSubscription");
      };
    };
  };
}

async function discardCheck<CloseErrorData>(
  client: rpc.Client<any, any, any, CloseErrorData>,
  counter: Z.RcCounter,
) {
  counter.i--;
  if (!counter.i) {
    return await client.discard();
  }
  return;
}

export class RpcServerError extends Error {
  override readonly name = "RpcServer";

  constructor(readonly inner: rpc.msg.ErrorMessage) {
    super();
  }
}
