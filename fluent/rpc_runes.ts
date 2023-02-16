import {
  RpcClient,
  RpcClientError,
  RpcProvider,
  RpcServerError,
  RpcSubscriptionMessage,
} from "../rpc/mod.ts"
import { Batch, MetaRune, Run, Rune, RunicArgs, RunStream } from "../rune/mod.ts"
import { ClientRune } from "./ClientRune.ts"

class RunRpcClient<D> extends Run<RpcClient<D>, never> {
  constructor(
    ctx: Batch,
    readonly provider: RpcProvider<D>,
    readonly discoveryValue: D,
  ) {
    super(ctx)
  }

  client?: RpcClient<D>
  async _evaluate(): Promise<RpcClient<D>> {
    return this.client ??= new RpcClient(this.provider, this.discoveryValue)
  }
}

export function rpcClient<D>(provider: RpcProvider<D>, discoveryValue: D) {
  return Rune.new(RunRpcClient<D>, provider, discoveryValue).into(ClientRune)
}

export function rpcCall<Params extends unknown[], OkData>(method: string) {
  return <X>(...args: RunicArgs<X, [client: RpcClient<any>, ...params: Params]>) => {
    return Rune
      .tuple(args)
      .map(async ([client, ...params]) => {
        const result = await client.call<OkData>(method, params)
        if (result.error) throw new RpcServerError(result)
        return result.result
      })
      .throws(RpcClientError, RpcServerError)
  }
}

class RunRpcSubscription<NotificationData>
  extends RunStream<RpcSubscriptionMessage<NotificationData>>
{
  constructor(
    ctx: Batch,
    client: RpcClient<any>,
    params: unknown[],
    subscribeMethod: string,
    unsubscribeMethod: string,
  ) {
    super(ctx)
    client.subscription<NotificationData>(
      subscribeMethod,
      unsubscribeMethod,
      params,
      (value) => this.push(value),
      this,
    )
  }
}

export function rpcSubscription<Params extends unknown[], NotificationData>() {
  return (subscribeMethod: string, unsubscribeMethod: string) => {
    return <X>(...args: RunicArgs<X, [client: RpcClient<any>, ...params: Params]>) => {
      return Rune.tuple(args)
        .map(([client, ...params]) =>
          Rune.new(
            RunRpcSubscription<NotificationData>,
            client,
            params,
            subscribeMethod,
            unsubscribeMethod,
          )
        )
        .into(MetaRune)
        .flat()
        .map((event) => {
          if (event.error) throw new RpcServerError(event)
          return event.params.result
        })
        .throws(RpcClientError, RpcServerError)
    }
  }
}
