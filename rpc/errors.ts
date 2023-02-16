import { RpcErrorMessage } from "./messages.ts"

export class RpcClientError extends Error {
  override readonly name = "RpcClientError"
}

export class RpcServerError extends Error {
  override readonly name = "RpcServerError"
  code
  data

  // TODO: accept init `EgressMessage`?
  constructor({ error: { code, data, message } }: RpcErrorMessage) {
    super(message, { cause: message })
    this.code = code
    this.data = data
  }
}
