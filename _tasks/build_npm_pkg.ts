import * as fs from "std/fs/mod.ts";
import * as path from "std/path/mod.ts";
import { build } from "x/dnt/mod.ts";

const outDir = path.join("target", "npm");

await fs.emptyDir(outDir);

await Promise.all([
  build({
    importMap: "import_map.json",
    entryPoints: ["mod.ts"],
    outDir,
    mappings: {
      "https://deno.land/x/scale@v0.1.1/mod.ts": {
        name: "parity-scale-codec",
        version: "^0.1.1",
      },
    },
    package: {
      name: "capi-beta",
      version: "0.1.0-beta.1", // Deno.args[0]!,
      description: "A TypeScript toolkit for crafting interactions with Substrate-based chains",
      license: "Apache-2.0",
      repository: "github:paritytech/capi",
    },
    compilerOptions: {
      importHelpers: true,
      sourceMap: true,
      target: "ES2021",
    },
    scriptModule: false, // re-enable once top-level await removed from wasm bindings
    shims: {
      webSocket: true,
    },
    test: false,
    typeCheck: false,
  }),
  fs.copy("LICENSE", path.join(outDir, "LICENSE")),
]);
await fs.copy("target/wasm/crypto", path.join(outDir, "crypto"));
