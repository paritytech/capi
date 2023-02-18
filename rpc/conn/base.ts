import { RpcHandler, RpcIngressMessage, RpcMessageId } from "../rpc_common.ts"

export type RpcConnCtor<D> = new(discoveryValue: D) => RpcConn

export abstract class RpcConn {
  currentId = 0
  handlerReferenceCounts = new Map<RpcHandler, number>()

  abstract ready(): Promise<void>

  abstract send(id: RpcMessageId, method: string, params: unknown): void

  abstract close(): void

  push(message: RpcIngressMessage) {
    for (const handler of this.handlerReferenceCounts.keys()) handler(message)
  }
}
