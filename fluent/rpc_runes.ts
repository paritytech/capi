import {
  RpcClient,
  RpcClientError,
  RpcErrorMessage,
  RpcSubscriptionMessage,
  WsRpcProvider,
} from "../rpc/mod.ts"
import { Batch, MetaRune, Run, Rune, RunicArgs, RunStream } from "../rune/mod.ts"
import { ClientRune } from "./ClientRune.ts"

class RunRpcClient extends Run<RpcClient, never> {
  constructor(
    ctx: Batch,
    readonly provider: WsRpcProvider,
    readonly discoveryValue: string,
  ) {
    super(ctx)
  }

  client?: RpcClient
  async _evaluate(): Promise<RpcClient> {
    return this.client ??= new RpcClient(this.provider, this.discoveryValue)
  }
}

export function rpcClient(provider: WsRpcProvider, discoveryValue: string) {
  return Rune.new(RunRpcClient, provider, discoveryValue).into(ClientRune)
}

export function rpcCall<Params extends unknown[], Result>(method: string) {
  return <X>(...args: RunicArgs<X, [client: RpcClient, ...params: Params]>) => {
    return Rune.tuple(args)
      .map(async ([client, ...params]) => {
        const result = await client.call<Result>(method, params)
        if (result.error) throw new RpcServerError(result)
        return result.result
      })
      .throws(RpcClientError, RpcServerError)
  }
}

class RunRpcSubscription extends RunStream<RpcSubscriptionMessage> {
  constructor(
    ctx: Batch,
    client: RpcClient,
    params: unknown[],
    subscribeMethod: string,
    unsubscribeMethod: string,
  ) {
    super(ctx)
    client.subscription(
      subscribeMethod,
      unsubscribeMethod,
      params,
      (value) => this.push(value),
      this,
    )
  }
}

export function rpcSubscription<Params extends unknown[], Result>() {
  return (subscribeMethod: string, unsubscribeMethod: string) => {
    return <X>(...args: RunicArgs<X, [client: RpcClient, ...params: Params]>) => {
      return Rune.tuple(args)
        .map(([client, ...params]) =>
          Rune.new(RunRpcSubscription, client, params, subscribeMethod, unsubscribeMethod)
        )
        .into(MetaRune)
        .flat()
        .map((event) => {
          if (event instanceof Error) {
            throw event
          } else if (event.error) {
            throw new RpcServerError(event)
          }
          return event.params.result as Result
        })
        .throws(RpcClientError, RpcServerError)
    }
  }
}

export class RpcServerError extends Error {
  override readonly name = "RpcServerError"
  code
  data

  constructor({ error: { code, data, message } }: RpcErrorMessage) {
    super(message)
    this.code = code
    this.data = data
  }
}
