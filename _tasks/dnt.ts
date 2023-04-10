import { config } from "../capi.config.ts"
import { build } from "../deps/dnt.ts"
import * as flags from "../deps/std/flags.ts"
import * as fs from "../deps/std/fs.ts"
import * as path from "../deps/std/path.ts"
import importMap from "../import_map.json" assert { type: "json" }
import { normalizePackageName } from "../util/normalize.ts"

const { version: packageVersion, server: serverVersion } = flags.parse(Deno.args, {
  string: ["version", "server"],
  default: {
    version: "v0.0.0-local",
  },
})

const server = serverVersion ? `https://capi.dev/@${serverVersion}/` : "http://localhost:4646/"
const hash = new URL(importMap.imports["@capi/"]).pathname.slice(1, -1)

const outDir = path.join("target", "npm")

await fs.emptyDir(outDir)

await Promise.all([
  build({
    package: {
      name: "capi",
      version: packageVersion,
      type: "module",
      description: "Capi is a framework for crafting interactions with Substrate chains",
      license: "Apache-2.0",
      repository: "github:paritytech/capi",
      dependencies: Object.fromEntries(
        Object.keys(config.chains ?? {}).map((key) => {
          const name = normalizePackageName(key)
          return [`@capi/${name}`, `${server}${hash}/${name}.tar`]
        }),
      ),
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
      {
        name: "./patterns/signature/polkadot",
        path: "./patterns/signature/polkadot.ts",
      },
      {
        name: "./patterns/consensus",
        path: "./patterns/consensus/mod.ts",
      },
      {
        name: "./patterns/ink",
        path: "./patterns/ink/mod.ts",
      },
      {
        name: "./patterns/multisig",
        path: "./patterns/multisig/mod.ts",
      },
      {
        name: "./patterns/identity",
        path: "./patterns/identity.ts",
      },
      {
        name: "./patterns/storage_sizes",
        path: "./patterns/storage_sizes.ts",
      },
    ],
    mappings: {
      "https://deno.land/x/wat_the_crypto@v0.0.1/mod.ts": {
        name: "wat-the-crypto",
        version: "0.0.1",
      },
      "https://deno.land/x/scale@v0.11.2/mod.ts#=": {
        name: "scale-codec",
        version: "0.11.2",
      },
      "https://deno.land/x/smoldot@light-js-deno-v0.7.6/index-deno.js": {
        name: "@substrate/smoldot-light",
        version: "0.7.6",
      },
      "https://deno.land/x/smoldot@light-js-deno-v0.7.6/client.d.ts": {
        name: "@substrate/smoldot-light",
        version: "0.7.6",
      },
      "https://esm.sh/v113/shiki@0.14.1?bundle": {
        name: "shiki",
        version: "0.14.1",
      },
      "./deps/shims/ws.ts": {
        name: "ws",
        version: "8.13.0",
      },
      "./deps/shims/upgradeWebSocket.ts": "./deps/shims/upgradeWebSocket.node.ts",
      "./deps/shims/register.ts": "./deps/shims/register.node.ts",
      "./deps/std/http.ts": "./deps/std/http.node.ts",
      "./server/getStatic.ts": "./server/getStatic.node.ts",
      "./util/port.ts": "./util/port.node.ts",
      "./util/gracefulExit.ts": "./util/gracefulExit.node.ts",
      "node:net": "node:net",
      "node:http": "node:http",
      "node:stream": "node:stream",
    },
    outDir,
    scriptModule: false,
    shims: {
      deno: true,
      crypto: true,
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
  fs.copy("LICENSE", path.join(outDir, "LICENSE")),
  fs.copy("Readme.md", path.join(outDir, "Readme.md")),
  fs.copy("server/static/", path.join(outDir, "esm/server/static/")),
])

await Deno.writeTextFile(
  "target/npm/esm/main.js",
  (await Deno.readTextFile("target/npm/esm/main.js"))
    .replace(/^#!.+/, "#!/usr/bin/env -S node --loader ts-node/esm"),
)
