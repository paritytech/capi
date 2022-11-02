import * as rpc from "../rpc/mod.ts";

// TODO: handle this elsewhere
export class RpcError extends Error {
  override readonly name = "RpcCall";
  code;
  attempt;

  constructor(
    { code, message, attempt }: rpc.ErrMessage["error"] & {
      attempt: {
        methodName: string;
        params: unknown[];
      };
    },
  ) {
    super(message);
    this.code = code;
    this.attempt = attempt;
  }
}
