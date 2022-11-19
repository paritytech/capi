import * as Z from "../deps/zones.ts"
import * as rpc from "../rpc/mod.ts"
import * as U from "../util/mod.ts"

const k0_ = Symbol()
const k1_ = Symbol()
const k2_ = Symbol()

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
      return new rpc.Client(provider, discoveryValue as DiscoveryValue)
    }, k0_)
}

export function rpcCall<Params extends unknown[], Result>(method: string, nonIdempotent?: boolean) {
  return <Client_ extends Z.$<rpc.Client>>(client: Client_) => {
    return <Params_ extends Z.Ls$<Params>>(...params: [...Params_]) => {
      return Z
        .rc(client, method, nonIdempotent, ...params)
        .next(async ([[client, method, _2, ...params], counter]) => {
          type ClientE = typeof client[rpc.ClientE_]
          // TODO: why do we need to explicitly type this / why is this not being inferred?
          const id = client.providerRef.nextId()
          const result: rpc.ClientCallEvent<ClientE["send"], ClientE["handler"], Result> =
            await client.call<Result>(id, method, ...params)
          const discardCheckResult = await discardCheck<ClientE["close"]>(client, counter)
          if (discardCheckResult) return discardCheckResult
          if (result instanceof Error) {
            return result
          } else if (result.error) {
            return new RpcServerError(result)
          }
          return result.result
        }, k1_)
    }
  }
}

// TODO: why are leading type params unknown when `extends Z.$Client<any, SendErrorData, HandlerErrorData, CloseErrorData>`?
export function rpcSubscription<Params extends unknown[], Event>() {
  return <SubscribeMethod extends string>(
    subscribeMethod: SubscribeMethod,
    unsubscribeMethod: string,
  ) => {
    return <Client_ extends Z.$<rpc.Client>>(client: Client_) => {
      return <
        Params_ extends Z.Ls$<Params>,
        CreateListener extends Z.$<U.CreateListener<rpc.ClientSubscriptionContext, Event>>,
      >(params: [...Params_], createListener: CreateListener) => {
        return Z
          .rc(client, createListener, ...params)
          .next(async ([[client, createListener, ...params], counter]) => {
            const result = await client.subscriptionFactory<
              Params,
              Event
            >()(subscribeMethod, unsubscribeMethod, params as [...Params], (ctx) => {
              const inner = createListener(ctx)
              return (e) => {
                if (e instanceof Error) {
                  return ctx.end(e)
                } else if (e.error) {
                  return ctx.end(new RpcServerError(e))
                }
                return inner(e.params.result) as ReturnType<ReturnType<Z.T<CreateListener>>>
              }
            })
            const discardCheckResult = await discardCheck<
              typeof client[rpc.ClientE_]["close"]
            >(client, counter)
            return discardCheckResult || result!
          }, k2_)
      }
    }
  }
}

async function discardCheck<CloseErrorData>(
  client: rpc.Client<any, any, any, CloseErrorData>,
  counter: Z.RcCounter,
) {
  counter.i--
  if (!counter.i) {
    return await client.discard()
  }
  return
}

export class RpcServerError extends Error {
  override readonly name = "RpcServerError"

  constructor(readonly inner: rpc.msg.ErrorMessage) {
    super()
  }
}
