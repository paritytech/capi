import * as C from "../mod.ts";

const root = C.rpcCall(C.polkadot, "rpc_methods", []);

const result = await root.run();

if (result instanceof Error) {
  throw result;
}
console.log(result);
