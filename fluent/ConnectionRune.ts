import { Calls, Subscription, Subscriptions } from "../rpc/known/mod.ts"
import { Connection, RpcClientError, RpcServerError, RpcSubscriptionMessage } from "../rpc/mod.ts"
import { Batch, MetaRune, Run, Rune, RunicArgs, RunStream } from "../rune/mod.ts"

class RunConnection extends Run<Connection, never> {
  constructor(ctx: Batch, readonly initConnection: (signal: AbortSignal) => Connection) {
    super(ctx)
  }

  connection?: Connection
  async _evaluate(): Promise<Connection> {
    return this.connection ??= this.initConnection(this.signal)
  }
}

export function connection(init: (signal: AbortSignal) => Connection) {
  return Rune.new(RunConnection, init).into(ConnectionRune)
}

export class ConnectionRune<U> extends Rune<Connection, U> {
  call<K extends keyof Calls, X>(
    callMethod: K,
    ...args: RunicArgs<X, [...Parameters<Calls[K]>]>
  ) {
    return Rune
      .tuple([this.as(Rune), ...args])
      .map(async ([client, ...params]) => {
        const result = await client.call<ReturnType<Calls[K]>>(callMethod, params)
        if (result.error) throw new RpcServerError(result)
        return result.result
      })
      .throws(RpcClientError, RpcServerError)
  }

  subscribe<K extends keyof Subscriptions, X>(
    subscribeMethod: K,
    unsubscribeMethod: Subscription.UnsubscribeMethod<ReturnType<Subscriptions[K]>>,
    ...args: RunicArgs<X, [...Parameters<Subscriptions[K]>]>
  ) {
    return Rune.tuple([this, ...args])
      .map(([client, ...params]) =>
        Rune.new(
          RunRpcSubscription<K, Subscription.Result<ReturnType<Subscriptions[K]>>>,
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

class RunRpcSubscription<Method extends string, NotificationData>
  extends RunStream<RpcSubscriptionMessage<Method, NotificationData>>
{
  constructor(
    ctx: Batch,
    connection: Connection,
    params: unknown[],
    subscribeMethod: string,
    unsubscribeMethod: string,
  ) {
    super(ctx)
    connection.subscription<Method, NotificationData>(
      subscribeMethod,
      unsubscribeMethod,
      params,
      (value) => this.push(value),
      this.signal,
    )
  }
}
