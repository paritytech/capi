import * as u from "/_/util/mod.ts";
import * as c from "/connection/mod.ts";
import * as sys from "/system/mod.ts";

export type RpcErr = FailedValidationError;
export class FailedValidationError extends u.ErrorCtor("SomeRpcErr") {}

// TODO: handle undefined / resolving to undefined

export const call = async <
  Beacon,
  Params extends string[],
  ExpectedResolvedValue,
>(
  resource: sys.ResourceResolved<Beacon>,
  method: string,
  isExpectedResolvedValue: (resolvedValue: any) => resolvedValue is ExpectedResolvedValue,
  ...params: Params
): Promise<sys.Result<RpcErr, ExpectedResolvedValue>> => {
  const payload: c.Payload = {
    id: c.Id(),
    method,
    params,
  };
  const responsePending = resource.receive(payload);
  resource.send(payload);
  const result = await responsePending;
  if (isExpectedResolvedValue(result)) {
    return sys.ok(result);
  }
  return new FailedValidationError(); // TODO: provide more info
};
