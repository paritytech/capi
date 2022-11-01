// // TODO: test-ify this?
// import { run } from "../effects/run.ts";
// import { chain } from "./to_generate.ts";

// class Counter {
//   i = 0;
// }
// const root = chain.unsubscribeNewHeads(
//   chain.subscribeNewHeads(function(header) {
//     const counter = this.state(Counter);
//     console.log(header);
//     if (counter.i === 3) {
//       return this.stop();
//     }
//     counter.i++;
//   }),
// );

// if (!Deno.test) {
//   const result = await run(root);
//   console.log(result);
// }
