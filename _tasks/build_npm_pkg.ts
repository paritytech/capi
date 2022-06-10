import { build } from "https://deno.land/x/dnt@0.22.0/mod.ts";
import * as fs from "../_deps/fs.ts";
import * as path from "../_deps/path.ts";

const outDir = path.join("target", "npm");

await fs.emptyDir(outDir);

await Promise.all([
  build({
    entryPoints: ["./mod.ts"],
    outDir,
    mappings: {
      "https://deno.land/x/scale@v0.2.0/mod.ts": {
        name: "parity-scale-codec",
        version: "^0.2.0",
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
    shims: {},
    test: false,
    typeCheck: false,
  }),
  fs.copy("LICENSE", path.join(outDir, "LICENSE")),
]);

["esm"].map((kind) => {
  return ["hashers", "sr25519", "ss58"].map((feature) => {
    return fs.copy(
      `./bindings/${feature}/mod_bg.wasm`,
      `target/npm/${kind}/${feature}/mod_bg.wasm`,
    );
  });
});
