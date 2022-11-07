import * as Z from "../../deps/zones.ts";
import * as rpc from "../../rpc/mod.ts";

export async function discardCheck<CloseErrorData>(
  client: rpc.Client<any, any, any, CloseErrorData>,
  counter: Z.RcCounter,
) {
  counter.i--;
  if (!counter.i) {
    return await client.discard();
  }
  return;
}

export class RpcServerError extends Error {
  override readonly name = "RpcServer";

  constructor(readonly inner: rpc.msg.ErrorMessage) {
    super();
  }
}
