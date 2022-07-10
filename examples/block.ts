import { polkadot } from "../known/mod.ts";
import * as C from "../mod.ts";

const result = await C
  .chain(polkadot)
  .block()
  .read();

console.log({ result });
