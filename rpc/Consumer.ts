import { Connection } from "./Connection.ts"
import { ExtrinsicStatus } from "./ExtrinsicStatus.ts"
import { SignedBlock } from "./known/mod.ts"
import { ServerError } from "./rpc_messages.ts"

export abstract class Consumer {
  constructor(readonly connection: Connection) {}

  abstract stateCall(method: string, args: Uint8Array, blockHash?: string): Promise<Uint8Array>

  abstract metadata(blockHash?: string): Promise<Uint8Array>

  abstract blockHash(blockNumber?: number): Promise<string>

  abstract block(blockHash?: string): Promise<SignedBlock>

  abstract keys(
    key: Uint8Array,
    limit: number,
    start?: Uint8Array,
    blockHash?: string,
  ): Promise<Uint8Array[]>

  abstract values(keys: Uint8Array[], blockHash?: string): Promise<(Uint8Array | undefined)[]>

  // TODO: can this be `Uint8Array` while keeping the decoded metadata external?
  abstract nonce(ss58Address: string): Promise<number>

  abstract submitExtrinsic(
    extrinsic: Uint8Array,
    cb: (status: ExtrinsicStatus) => void,
    signal: AbortSignal,
  ): void

  protected async call<R>(method: string, params: unknown[]): Promise<R> {
    const message = await this.connection.call(method, params)
    if (message.error) throw new ServerError(message)
    return message.result as R
  }

  protected subscription<R>(
    subscribe: string,
    unsubscribe: string | undefined,
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
