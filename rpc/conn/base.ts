import { RpcHandler, RpcMessageId } from "../messages.ts"

export type RpcConnCtor<D> = new(discovery: D) => RpcConn
export abstract class RpcConn {
  currentId = 0
  references = new Map<RpcHandler, number>()

  abstract close(): void
  abstract send(id: RpcMessageId, method: string, params: unknown): void
  abstract ready(): Promise<void>
}
