import { UnwrapA } from "/effect/Effect.ts";
import { step } from "/effect/intrinsic/Step.ts";
import * as rpc from "/rpc/mod.ts";

export interface RpcClientR<Beacon> {
  rpc: rpc.RpcClientFactory<Beacon>;
}

export const rpcClient = <Beacon>(beacon: Beacon) => {
  return step(
    [beacon],
    (beacon) => {
      return async (env: RpcClientR<UnwrapA<Beacon>>) => {
        return env.rpc(beacon);
      };
    },
  );
};

// () => {
//   return () => {
//     return (client) => {
//       return client.close();
//     };
//   };
// },
