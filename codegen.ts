// TODO: prettier messaging & help screens
import { codegen } from "./codegen/mod.ts"
import { parse } from "./deps/std/flags.ts"
import * as C from "./mod.ts"
import * as T from "./test_util/mod.ts"
import * as U from "./util/mod.ts"

const args = parse(Deno.args, {
  string: ["src", "out", "import", "dev"],
  boolean: ["help"],
  default: {
    import: "https://deno.land/x/capi/mod.ts",
  },
  alias: {
    src: ["s"],
    dev: ["d"],
    out: ["o"],
    help: ["h", "?"],
  },
})

if (args.help) help()

if (!args.out) {
  throw new Error("Must specify `out`")
}

let metadata: C.M.Metadata
if (args.src && args.dev) {
  throw Error("Cannot specify both `src` and `dev`")
} else if (args.src) {
  if (args.src.endsWith(".scale")) {
    metadata = C.M.fromPrefixedHex(await Deno.readTextFile(args.src))
  } else {
    const client = C.rpcClient(C.rpc.proxyProvider, args.src)
    metadata = U.throwIfError(await C.metadata(client)().run())
  }
} else if (args.dev) {
  if (!T.isRuntimeName(args.dev)) {
    throw new T.InvalidRuntimeSpecifiedError(args.dev)
  }
  const client = T[args.dev as T.RuntimeName]
  metadata = U.throwIfError(await C.metadata(client)().run())
} else {
  throw new Error("Please specify either `src` or `dev`")
}
await run(metadata, args.out)

function run(metadata: C.M.Metadata, out: string) {
  // @ts-ignore TODO
  return codegen({
    importSpecifier: args.import,
    metadata,
  })
    .write(out)
}

// TODO: do we handle help differently depending on what flags were specified?
function help(): never {
  console.log("Usage: codegen -s=<scale_file|chain_spec|ws_url> -o=<dir>")
  Deno.exit()
}
