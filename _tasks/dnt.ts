import { build } from "../deps/dnt.ts"
import * as fs from "../deps/std/fs.ts"
import * as path from "../deps/std/path.ts"

const outDir = path.join("target", "npm")

await fs.emptyDir(outDir)

await Promise.all([
  build({
    package: {
      name: "capi",
      version: Deno.args[0]!,
      description: "Capi is a framework for crafting interactions with Substrate chains",
      license: "Apache-2.0",
      repository: "github:paritytech/capi",
    },
    compilerOptions: {
      importHelpers: true,
      sourceMap: true,
      target: "ES2021",
      lib: ["es2022.error"],
    },
    entryPoints: [{
      name: ".",
      path: "./mod.ts",
    }, {
      name: "./patterns/consensus",
      path: "./patterns/consensus/mod.ts",
    }, {
      name: "./patterns/ink",
      path: "./patterns/ink/mod.ts",
    }, {
      name: "./patterns/multisig",
      path: "./patterns/multisig/mod.ts",
    }, {
      name: "./patterns/identity",
      path: "./patterns/identity.ts",
    }, {
      name: "./patterns/size_tree",
      path: "./patterns/sizeTree.ts",
    }, {
      name: "./server",
      path: "./server/mod.ts",
    }, {
      name: "./providers",
      path: "./providers/mod.ts",
    }],
    importMap: "import_map.json",
    mappings: {
      "https://deno.land/x/wat_the_crypto@v0.0.1/mod.ts": {
        name: "wat-the-crypto",
        version: "0.0.1",
      },
      "https://deno.land/x/scale@v0.11.0/mod.ts#=": {
        name: "scale-codec",
        version: "0.11.0",
      },
      "https://deno.land/x/smoldot@light-js-deno-v0.7.6/index-deno.js": {
        name: "@substrate/smoldot-light",
        version: "0.7.6",
      },
      // "https://raw.githubusercontent.com/paritytech/capi-crypto-wrappers/14289c5/lib.ts":
      //   "https://raw.githubusercontent.com/paritytech/capi-crypto-wrappers/14289c5/lib.node.ts",
    },
    outDir,
    scriptModule: false,
    shims: {
      deno: {
        test: true,
      },
      webSocket: true,
    },
    test: false,
    typeCheck: false,
  }),
  fs.copy("LICENSE", path.join(outDir, "LICENSE")),
  fs.copy("Readme.md", path.join(outDir, "Readme.md")),
  fs.copy("help.txt", path.join(outDir, "help.txt")),
])
