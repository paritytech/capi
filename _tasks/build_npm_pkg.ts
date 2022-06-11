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
      name: "capi",
      version: Deno.args[0]!,
      description: "A TypeScript toolkit for crafting interactions with Substrate-based chains",
      license: "Apache-2.0",
      repository: "github:paritytech/capi",
    },
    compilerOptions: {
      importHelpers: true,
      sourceMap: true,
      target: "ES2021",
    },
    scriptModule: "cjs",
    shims: { deno: true, webSocket: true },
    test: false,
    typeCheck: false,
  }),
  fs.copy("LICENSE", path.join(outDir, "LICENSE")),
]);

await Promise.all(["script", "esm"].map((kind) => {
  return Promise.all(["hashers", "sr25519", "ss58"].map(async (feature) => {
    await fs.copy(
      `./bindings/${feature}/mod_bg.wasm`,
      `target/npm/${kind}/bindings/${feature}/mod_bg.wasm`,
    );
    if (kind === "esm") {
      await Deno.writeTextFile(
        `target/npm/${kind}/bindings/${feature}/mod.generated.js`,
        `
// workaround for https://github.com/rust-random/getrandom/issues/256
import * as crypto from "crypto"
const module = {
    require: (string) => {
        if(string !== "crypto") throw new Error("Unexpected require " + string)
        return crypto
    }
}
`,
        { append: true },
      );
    }
  }));
}));
