import * as sys from "/system/mod.ts";

export type RpcErr = SomeRpcErr;
export class SomeRpcErr extends sys.ErrorCtor("SomeRpcErr") {}

export const call = async <
  Beacon,
  Params extends string[],
>(
  resource: sys.ResourceResolved<Beacon>,
  method: string,
  ...params: Params
): Promise<sys.Result<RpcErr, string>> => {
  const payload: sys.Payload = {
    id: sys.Id(),
    method,
    params,
  };
  try {
    const responsePending = resource.receive(payload);
    resource.send(payload);
    return sys.ok(await responsePending);
  } catch (e) {
    return e as RpcErr;
  }
};
