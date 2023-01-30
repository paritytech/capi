import * as rpc from "../rpc/mod.ts"
import { Batch, MetaRune, Run, Rune, RunicArgs, RunStream } from "../rune/mod.ts"
import { ClientRune } from "./client.ts"

class RunRpcClient<DV, SED, HED, CED> extends Run<rpc.Client<DV, SED, HED, CED>, never> {
  constructor(
    ctx: Batch,
    readonly provider: rpc.Provider<DV, SED, HED, CED>,
    readonly discoveryValue: DV,
  ) {
    super(ctx)
  }

  client?: rpc.Client<DV, SED, HED, CED>
  _evaluate(): Promise<rpc.Client<DV, SED, HED, CED>> {
    return Promise.resolve(this.client ??= new rpc.Client(this.provider, this.discoveryValue))
  }

  override cleanup(): void {
    this.client?.discard()
    super.cleanup()
  }
}

export function rpcClient<
  DiscoveryValue,
  SendErrorData,
  HandlerErrorData,
  CloseErrorData,
>(
  provider: rpc.Provider<DiscoveryValue, SendErrorData, HandlerErrorData, CloseErrorData>,
  discoveryValue: DiscoveryValue,
) {
  return Rune.new(RunRpcClient, provider, discoveryValue).as(ClientRune)
}

export function rpcCall<Params extends unknown[], Result>(
  method: string,
  _nonIdempotent?: boolean,
) {
  return <X>(...args: RunicArgs<X, [client: rpc.Client, ...params: Params]>) => {
    return Rune.tuple(args)
      .map(async ([client, ...params]) => {
        // TODO: why do we need to explicitly type this / why is this not being inferred?
        const id = client.providerRef.nextId()
        const result = await client.call<Result>(id, method, params)
        if (result instanceof Error) {
          return result
        } else if (result.error) {
          return new RpcServerError(result)
        }
        return result.result
      })
  }
}

class RunRpcSubscription extends RunStream<rpc.ClientSubscriptionEvent<string, any, any, any>> {
  constructor(
    ctx: Batch,
    client: rpc.Client,
    params: unknown[],
    subscribeMethod: string,
    unsubscribeMethod: string,
  ) {
    super(ctx)
    client.subscriptionFactory()(
      subscribeMethod,
      unsubscribeMethod,
      params,
      (value) => this.push(value),
      this.signal,
    )
  }
}

export function rpcSubscription<Params extends unknown[], Result>() {
  return (
    subscribeMethod: string,
    unsubscribeMethod: string,
  ) => {
    return <X>(...args: RunicArgs<X, [client: rpc.Client, ...params: Params]>) => {
      return Rune.tuple(args)
        .map(([client, ...params]) =>
          Rune.new(RunRpcSubscription, client, params, subscribeMethod, unsubscribeMethod)
        )
        .as(MetaRune)
        .flat()
        .map((event) => {
          if (event instanceof Error) {
            return event
          } else if (event.error) {
            return new RpcServerError(event)
          }
          return event.params.result as Result
        })
    }
  }
}

export class RpcServerError extends Error {
  override readonly name = "RpcServerError"

  constructor(readonly inner: rpc.msg.ErrorMessage) {
    super()
  }
}
