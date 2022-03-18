import * as u from "/_/util/mod.ts";
import * as sys from "/system/mod.ts";

export type RpcErr = SomeRpcErr;
export class SomeRpcErr extends u.ErrorCtor("SomeRpcErr") {}

export const call = async <
  Beacon,
  Params extends string[],
  Asserted,
>(
  resource: sys.ResourceResolved<Beacon>,
  method: string,
  validateOk: (okValue: unknown) => okValue is Asserted,
  ...params: Params
): Promise<sys.Result<RpcErr, Asserted>> => {
  const payload: sys.Payload = {
    id: sys.Id(),
    method,
    params,
  };
  const responsePending = resource.receive(payload);
  resource.send(payload);
  const result = await responsePending;
  if (validateOk(result)) {
    return sys.ok(result);
  }
  return new SomeRpcErr(); //
};
