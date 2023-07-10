import { Connection } from "./Connection.ts"
import * as known from "./known/mod.ts"
import { ServerError } from "./rpc_messages.ts"

export abstract class Consumer {
  constructor(readonly connection: Connection) {}

  abstract requirements: string[]

  async assertRequirementsMet() {
    const methods = new Set(await this.call<string[]>("rpc_methods", []))
    const missing: string[] = []
    this.requirements.forEach((requirement) => {
      if (!methods.has(requirement)) missing.push(requirement)
    })
    if (missing.length) throw new RpcRequirementsUnmet(missing)
  }

  abstract stateCall(call: Uint8Array): void

  abstract blockHash(blockNumber?: number): Promise<string>

  abstract block(blockHash?: string): Promise<known.SignedBlock>

  abstract keys(
    key: Uint8Array,
    limit: number,
    start?: string,
    blockHash?: string,
  ): Promise<string[]>

  abstract values(keys: Uint8Array[], blockHash?: string): Promise<(Uint8Array | undefined)[]>

  // TODO: can this be `Uint8Array` while keeping the decoded metadata external?
  abstract nonce(ss58Address: string): Promise<number>

  abstract submitExtrinsic(
    extrinsic: string,
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
    handler: (result: R) => void,
    signal: AbortSignal,
  ) {
    this.connection.subscription(subscribe, unsubscribe, params, (message) => {
      if (message.error) throw new ServerError(message)
      handler(message.result as R)
    }, signal)
  }
}

class RpcRequirementsUnmet extends Error {
  override readonly name = "RpcRequirementsUnmet"

  constructor(readonly unmet: string[]) {
    super(`The following RPC methods are unavailable: "${unmet.join(`", "`)}"`)
  }
}
