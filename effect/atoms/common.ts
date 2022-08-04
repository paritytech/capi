import { Config } from "../../config/mod.ts";
import * as rpc from "../../rpc/mod.ts";
import * as U from "../../util/mod.ts";

export class RpcError<
  Config_ extends Config,
  MethodName extends keyof Config_["RpcMethods"],
  Params extends Parameters<Config_["RpcMethods"][MethodName]>,
> extends U.ErrorCtor("RpcCall") {
  code;
  attempt;

  constructor(
    { code, message, attempt }: rpc.ErrMessage<Config_>["error"] & {
      attempt: {
        methodName: MethodName;
        params: Params;
      };
    },
  ) {
    super(message);
    this.code = code;
    this.attempt = attempt;
  }
}
