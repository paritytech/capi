import { polkadot } from "../known/mod.ts";

const result = await polkadot.block().read();

console.log({ result });
