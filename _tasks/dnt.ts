import { build } from "https://deno.land/x/dnt@0.26.0/mod.ts";
import * as fs from "../_deps/fs.ts";
import * as path from "../_deps/path.ts";

const outDir = path.join("target", "npm");

await fs.emptyDir(outDir);

await Promise.all([
  build({
    entryPoints: ["mod.ts", {
      name: "fluent",
      path: "fluent/mod.ts",
    }, {
      name: "frame_metadata",
      path: "frame_metadata/mod.ts",
    }, {
      name: "config",
      path: "config/mod.ts",
    }, {
      name: "known",
      path: "known/mod.ts",
    }, {
      name: "rpc",
      path: "rpc/mod.ts",
    }],
    outDir,
    mappings: {
      "https://deno.land/x/scale@v0.3.0/mod.ts": {
        name: "parity-scale-codec",
        version: "^0.3.0",
      },
      "_deps/smoldot_phantom.ts": {
        name: "@substrate/smoldot-light",
        version: "0.6.20",
        peerDependency: true,
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
      lib: ["dom"],
      importHelpers: true,
      sourceMap: true,
      target: "ES2021",
    },
    // TODO: re-enable as "cjs"
    scriptModule: false,
    shims: {
      deno: true,
      webSocket: true,
    },
    test: false,
    typeCheck: false, // TODO: reenable?
  }),
  fs.copy("LICENSE", path.join(outDir, "LICENSE")),
  fs.copy("Readme.md", path.join(outDir, "Readme.md")),
]);

await Promise.all([/* "script" */, "esm"].map((kind) => {
  return Promise.all(["hashers", "test-util/sr25519", "ss58"].map(async (dir) => {
    const from = `./${dir}/mod_bg.wasm`;
    const to = `target/npm/${kind}/${dir}/mod_bg.wasm`;
    await fs.copy(from, to);
  }));
}));
