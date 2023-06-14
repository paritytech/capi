import { build, EntryPoint } from "../deps/dnt.ts"
import * as flags from "../deps/std/flags.ts"
import * as fs from "../deps/std/fs.ts"
import * as path from "../deps/std/path.ts"
import importMap from "../import_map.json" assert { type: "json" }
import * as nets from "../nets.ts"
import { normalizePackageName } from "../util/normalize.ts"

const { version: packageVersion, server: serverVersion } = flags.parse(Deno.args, {
  string: ["version", "server"],
  default: {
    version: "v0.0.0-local",
  },
})

const server = serverVersion ? `https://capi.dev/@${serverVersion}/` : "http://localhost:4646/"
const hash = new URL(importMap.imports["@capi/"]).pathname.slice(1, -1)

const outDir = path.join(Deno.cwd(), "target", "npm")
const capiOutDir = path.join(outDir, "capi")
const examplesOutDir = path.join(outDir, "capi-examples")

await fs.emptyDir(outDir)
await Deno.mkdir(capiOutDir)

const entryPoints: EntryPoint[] = []
const mappings: Record<string, string> = {}

const allFiles = []
for await (
  const { path } of fs.walkSync(".", {
    exts: [".ts"],
    skip: [/\.test\.ts$/, /^(target|_tasks|examples)\//],
    includeDirs: false,
  })
) allFiles.push(`./${path}`)

for (const pathname of allFiles) {
  if (!pathname.endsWith(".node.ts")) {
    const nodePath = pathname.slice(0, -".ts".length) + ".node.ts"
    if (allFiles.includes(nodePath)) {
      mappings[pathname] = nodePath
    }
    if (!pathname.startsWith("./deps/")) {
      entryPoints.push({
        name: pathname.slice(0, -(pathname.endsWith("mod.ts") ? "/mod.ts".length : ".ts".length)),
        path: pathname,
      })
    }
  }
}

const capiCodegenDeps = Object.fromEntries(
  Object.keys(nets).map((key) => normalizePackageName(key)).map((
    packageName,
  ) => [`@capi/${packageName}`, `${server}${hash}/${packageName}.tar`]),
)

await Promise.all([
  build({
    package: {
      name: "capi",
      version: packageVersion,
      type: "module",
      description: "Capi is a framework for crafting interactions with Substrate chains",
      license: "Apache-2.0",
      repository: "github:paritytech/capi",
      dependencies: {
        ...capiCodegenDeps,
        "ts-node": "^10.9.1",
      },
    },
    compilerOptions: {
      importHelpers: true,
      sourceMap: true,
      target: "ES2021",
      lib: ["es2022.error"],
    },
    entryPoints: [
      {
        name: ".",
        path: "./mod.ts",
      },
      {
        kind: "bin",
        name: "capi",
        path: "./main.ts",
      },
      ...entryPoints,
    ],
    mappings: {
      ...mappings,
      "https://deno.land/x/wat_the_crypto@v0.0.3/mod.ts": {
        name: "wat-the-crypto",
        version: "0.0.3",
      },
      "https://deno.land/x/scale@v0.11.2/mod.ts#=": {
        name: "scale-codec",
        version: "0.11.2",
      },
      "https://deno.land/x/smoldot2@light-js-deno-v1.0.6/index-deno.js": {
        name: "smoldot",
        version: "1.0.6",
      },
      "https://deno.land/x/smoldot2@light-js-deno-v1.0.6/public-types.d.ts": {
        name: "smoldot",
        version: "1.0.6",
      },
      "./deps/shims/ws.ts": {
        name: "ws",
        version: "8.13.0",
      },
      "./deps/shims/shim-deno.ts": "@deno/shim-deno",
      "node:net": "node:net",
      "node:http": "node:http",
      "node:stream": "node:stream",
      "node:fs": "node:fs",
      "node:fs/promises": "node:fs/promises",
      "https://raw.githubusercontent.com/paritytech/capi-binary-builds/f5baeca/streamToFile.ts":
        "https://raw.githubusercontent.com/paritytech/capi-binary-builds/f5baeca/streamToFile.node.ts",
    },
    outDir: capiOutDir,
    shims: {
      deno: true,
      custom: [{
        package: {
          name: "isomorphic-ws",
          version: "5.0.0",
        },
        globalNames: [{
          name: "WebSocket",
          exportName: "default",
        }],
      }],
    },
    test: false,
    typeCheck: false,
  }),
  fs.copy("LICENSE", path.join(capiOutDir, "LICENSE")),
  fs.copy("Readme.md", path.join(capiOutDir, "Readme.md")),
  fs.copy("server/static/", path.join(capiOutDir, "esm/server/static/")),
])

await Promise.all([
  fs.copy(
    path.join(capiOutDir, "src/rune/_empty.d.ts"),
    path.join(capiOutDir, "types/rune/_empty.d.ts"),
    { overwrite: true },
  ),
  editFile(
    path.join(capiOutDir, "esm/main.js"),
    (content) =>
      content
        .replace(/^#!.+/, "#!/usr/bin/env -S node --loader ts-node/esm"),
  ),
  editFile(
    path.join(capiOutDir, "esm/_dnt.shims.js"),
    (content) =>
      content
        .replace(/"@deno\/shim-deno"/g, `"./deps/shims/Deno.node.js"`),
  ),
])

async function editFile(path: string, modify: (content: string) => string) {
  await Deno.writeTextFile(path, modify(await Deno.readTextFile(path)))
}

console.log(
  new TextDecoder().decode(
    (await new Deno.Command("npm", {
      args: ["pack", "--pack-destination", outDir],
      cwd: capiOutDir,
    }).output()).stderr,
  ),
)

const exampleEntryPoints: EntryPoint[] = []
for await (
  const { path } of fs.walkSync(".", {
    exts: [".eg.ts"],
    includeDirs: false,
  })
) {
  exampleEntryPoints.push({
    name: path,
    path: `./${path}`,
  })
}

await build({
  package: {
    name: "capi-examples",
    version: packageVersion,
    type: "module",
    devDependencies: {
      "ts-node": "^10.9.1",
    },
    dependencies: {
      ...capiCodegenDeps,
      capi: `file:../capi-${packageVersion}.tgz`,
    },
  },
  compilerOptions: {
    importHelpers: true,
    sourceMap: true,
    target: "ES2021",
    lib: ["es2022.error", "dom.iterable"],
  },
  entryPoints: exampleEntryPoints,
  mappings: {
    "https://deno.land/x/polkadot@0.2.38/keyring/mod.ts": {
      name: "@polkadot/keyring",
      version: "12.2.1",
    },
    "https://deno.land/x/polkadot@0.2.38/types/mod.ts": {
      name: "@polkadot/types",
      version: "10.7.2",
    },
  },
  importMap: "_tasks/dnt_examples_import_map.json",
  outDir: examplesOutDir,
  scriptModule: false,
  declaration: false,
  shims: { deno: true },
  test: false,
  typeCheck: false,
})

await Promise.all(
  [
    fs.copy(
      "examples/ink/erc20.json",
      path.join(examplesOutDir, "esm/examples/ink/erc20.json"),
      { overwrite: true },
    ),
    fs.copy(
      "examples/ink/erc20.wasm",
      path.join(examplesOutDir, "esm/examples/ink/erc20.wasm"),
      { overwrite: true },
    ),
  ],
)
