// Thanks to Deno std crypto for the approach below
// import * as base64 from "std/encoding/base64.ts";

import { runCmd } from "/util/mod.ts";

await runCmd([
  "cargo",
  "build",
  "--release",
  "--target",
  "wasm32-unknown-unknown",
]);

await runCmd([
  "wasm-bindgen",
  "./target/wasm32-unknown-unknown/release/mod.wasm",
  "--target",
  "deno",
  "--weak-refs",
  "--out-dir",
  "./target/wasm",
]);

await Promise.all([
  Deno.copyFile("./target/wasm/mod_bg.wasm", "./bindings/bindings.wasm"),
  Deno.copyFile("./target/wasm/mod.d.ts", "./bindings/bindings.d.ts"),
  (async () => {
    const generatedScript = await Deno.readTextFile("./target/wasm/mod.js");
    const withReplacement = generatedScript.replace(
      /^const wasm_url =.*?;\nlet wasmCode =.*?;\n.*?const wasmInstance =.*?;\n/sm,
      `const wasm_url = new URL('bindings.wasm', import.meta.url);\n`
        + `const wasmInstance = (await WebAssembly.instantiateStreaming(fetch(wasm_url.toString()), imports)).instance;\n`,
    );
    await Deno.writeTextFile("./bindings/bindings.js", withReplacement);
  })(),
]);
