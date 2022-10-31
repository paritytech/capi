import * as rpc from "../rpc/mod.ts";
import * as U from "../util/mod.ts";

// TODO: handle this elsewhere
export class RpcError extends U.ErrorCtor("RpcCall") {
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
