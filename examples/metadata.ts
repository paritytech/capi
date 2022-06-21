import * as C from "../mod.ts";

const result = await C.polkadot.metadata().read();

console.log({ result });
