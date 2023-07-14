import { hex } from "../crypto/mod.ts"
import { Connection } from "./Connection.ts"
import * as known from "./known/mod.ts"
import { ServerError } from "./rpc_messages.ts"

export abstract class Consumer {
  constructor(readonly connection: Connection) {}

  abstract stateCall(method: string, args: Uint8Array, blockHash?: string): Promise<Uint8Array>

  abstract metadata(blockHash?: string): Promise<Uint8Array>

  abstract blockHash(blockNumber?: number): Promise<string>

  abstract block(blockHash?: string): Promise<known.SignedBlock>

  async keys(
    key: Uint8Array,
    limit: number,
    start?: Uint8Array,
    blockHash?: string,
  ): Promise<Uint8Array[]> {
    return (await this.call<string[]>("state_getKeysPaged", [
      hex.encodePrefixed(key),
      limit,
      start ? hex.encodePrefixed(start) : undefined,
      blockHash,
    ])).map(hex.decode)
  }

  abstract values(keys: Uint8Array[], blockHash?: string): Promise<(Uint8Array | undefined)[]>

  // TODO: can this be `Uint8Array` while keeping the decoded metadata external?
  abstract nonce(ss58Address: string): Promise<number>

  abstract submitExtrinsic(
    extrinsic: Uint8Array,
    cb: (status: known.TransactionStatus) => void,
    signal: AbortSignal,
  ): void

  protected async call<R>(method: string, params: unknown[]): Promise<R> {
    const message = await this.connection.call(method, params)
    if (message.error) throw new ServerError(message)
    return message.result as R
  }

  protected subscription<R>(
    subscribe: string,
    unsubscribe: string,
    params: unknown[],
    handler: (result: R, subscriptionId: string) => void,
    signal: AbortSignal,
  ) {
    this.connection.subscription(subscribe, unsubscribe, params, (message) => {
      if (message.error) throw new ServerError(message)
      const { result, subscription } = message.params
      handler(result as R, subscription)
    }, signal)
  }
}
