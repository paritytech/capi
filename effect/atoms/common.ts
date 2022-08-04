import { Config } from "../../config/mod.ts";
import * as rpc from "../../rpc/mod.ts";
import * as U from "../../util/mod.ts";

export class RpcError<Config_ extends Config> extends U.ErrorCtor("RpcCall") {
  code;

  constructor({ code, message }: rpc.ErrMessage<Config_>["error"]) {
    super(message);
    this.code = code;
  }
}
