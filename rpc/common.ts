import * as u from "/_/util/mod.ts";
import * as sys from "/system/mod.ts";

export type RpcErr = FailedValidationError;
export class FailedValidationError extends u.ErrorCtor("SomeRpcErr") {}

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
  const payload: sys.Payload = {
    id: sys.Id(),
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

// // TODO: create un-bloated factory for RPC effects
// export const rpcEffect = <
//   Resolved,
//   ParamsConstraint extends sys.AnyEffectA<string>[] | undefined,
// >(guard: (inQuestion: any) => inQuestion is Resolved) => {
//   return <
//     Beacon,
//     Resource extends sys.AnyEffectA<sys.ResourceResolved<Beacon>>,
//     Params extends ParamsConstraint,
//   >(
//     resource: Resource,
//     ...params: Params extends undefined ? [] : Params
//   ) => {
//     const paramEffects: Record<number, sys.AnyEffectA<string>> = [];
//     if (params.length) {
//       for (let i = 0; i < params.length; i++) {
//         paramEffects[i] = params[i]!;
//       }
//     }
//     return sys.effect<Resolved>()(
//       "SystemHealth",
//       { resource, ...paramEffects },
//       (_, resolved) => {
//         const resolvedParams: string[] = [];
//         for (let i = 0; i < params.length; i++) {
//           resolvedParams.push((resolved as any)[i]);
//         }
//         return call(resolved.resource, "system_health", guard);
//       },
//     );
//   };
// };
