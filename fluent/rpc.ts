import * as rpc from "../rpc/mod.ts"
import { _Rune, _StreamRune, Args, Batch, Rune } from "../rune/mod.ts"
import { ClientRune } from "./client.ts"

class _RpcClientRune<DV, SED, HED, CED> extends _Rune<rpc.Client<DV, SED, HED, CED>, never> {
  constructor(
    ctx: Batch,
    readonly provider: rpc.Provider<DV, SED, HED, CED>,
    readonly discoveryValue: DV,
  ) {
    super(ctx)
  }

  client?: rpc.Client<DV, SED, HED, CED>
  async _evaluate(): Promise<rpc.Client<DV, SED, HED, CED>> {
    return this.client ??= new rpc.Client(this.provider, this.discoveryValue)
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
  return Rune.new(_RpcClientRune, provider, discoveryValue).subclass(ClientRune)
}

export function rpcCall<Params extends unknown[], Result>(
  method: string,
  _nonIdempotent?: boolean,
) {
  return <X>(...args: Args<X, [client: rpc.Client, ...params: Params]>) => {
    return Rune.ls(args)
      .pipe(async ([client, ...params]) => {
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

class _RpcSubscriptionRune extends _StreamRune<rpc.ClientSubscriptionEvent<string, any, any, any>> {
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
    return <X>(...args: Args<X, [client: rpc.Client, ...params: Params]>) => {
      return Rune.ls(args)
        .pipe(([client, ...params]) =>
          Rune.new(_RpcSubscriptionRune, client, params, subscribeMethod, unsubscribeMethod)
        )
        .flat()
        .pipe((event) => {
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
