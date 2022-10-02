import * as C from "../mod.ts";

const root = C.readBlock(C.polkadot);

const result = await root.run();

if (result instanceof Error) {
  throw result;
}
console.log(result);
