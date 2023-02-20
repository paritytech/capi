import { Calls, Subscription, Subscriptions } from "../rpc/known/mod.ts"
import { Connection, ConnectionError, RpcSubscriptionMessage, ServerError } from "../rpc/mod.ts"
import { Batch, MetaRune, Run, Rune, RunicArgs, RunStream, ValueRune } from "../rune/mod.ts"
import { PromiseOr } from "../util/mod.ts"
import { ChainRune } from "./ChainRune.ts"

class RunConnection extends Run<Connection, never> {
  constructor(ctx: Batch, readonly initConnection: (signal: AbortSignal) => PromiseOr<Connection>) {
    super(ctx)
  }

  connection?: Connection
  async _evaluate(): Promise<Connection> {
    return this.connection ??= await this.initConnection(this.signal)
  }
}

export function connection(init: (signal: AbortSignal) => PromiseOr<Connection>) {
  return Rune.new(RunConnection, init).into(ConnectionRune)
}

export class ConnectionRune<U> extends Rune<Connection, U> {
  call<K extends keyof Calls, X>(
    callMethod: K,
    ...args: RunicArgs<X, [...Parameters<Calls[K]>]>
  ) {
    return Rune
      .tuple([this.as(Rune), ...args])
      .map(async ([connection, ...params]) => {
        const result = await connection.call(callMethod, params)
        if (result.error) throw new ServerError(result)
        return result.result as ReturnType<Calls[K]>
      })
      .throws(ConnectionError, ServerError)
  }

  subscribe<K extends keyof Subscriptions, X>(
    subscribeMethod: K,
    unsubscribeMethod: Subscription.UnsubscribeMethod<ReturnType<Subscriptions[K]>>,
    ...args: RunicArgs<X, [...Parameters<Subscriptions[K]>]>
  ) {
    return Rune.tuple([this, ...args])
      .map(([connection, ...params]) =>
        Rune.new(
          RunRpcSubscription,
          connection,
          params,
          subscribeMethod,
          unsubscribeMethod,
        )
      )
      .into(MetaRune)
      .flat()
      .map((event) => {
        if (event.error) throw new ServerError(event)
        return event.params.result as Subscription.Result<ReturnType<Subscriptions[K]>>
      })
      .throws(ConnectionError, ServerError)
  }

  chain() {
    return this.into(ValueRune).map((x) => ({ connection: x })).into(ChainRune)
  }
}

class RunRpcSubscription extends RunStream<RpcSubscriptionMessage> {
  constructor(
    ctx: Batch,
    connection: Connection,
    params: unknown[],
    subscribeMethod: string,
    unsubscribeMethod: string,
  ) {
    super(ctx)
    connection.subscription(
      subscribeMethod,
      unsubscribeMethod,
      params,
      (value) => this.push(value),
      this.signal,
    )
  }
}
