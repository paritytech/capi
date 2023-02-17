import { RpcHandler, RpcMessageId } from "../rpc_common.ts"

export type RpcConnCtor<D> = new(discoveryValue: D) => RpcConn

export abstract class RpcConn {
  currentId = 0
  handlerReferenceCount = new Map<RpcHandler, number>()

  abstract ready(): Promise<void>

  abstract send(id: RpcMessageId, method: string, params: unknown): void

  abstract close(): void
}
