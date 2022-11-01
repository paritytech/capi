import { codegen } from "./codegen/mod.ts";
import { Config } from "./config/mod.ts";
import { parse } from "./deps/std/flags.ts";
import * as path from "./deps/std/path.ts";
import { unimplemented } from "./deps/std/testing/asserts.ts";
import * as M from "./frame_metadata/mod.ts";
import { proxyClient } from "./rpc/providers/proxy.ts";
import * as U from "./util/mod.ts";

const args = parse(Deno.args, {
  string: ["src", "out", "import"],
  boolean: ["help"],
  default: {
    import: "https://deno.land/x/capi/mod.ts",
  },
  alias: {
    src: ["s"],
    out: ["o"],
    help: ["h", "?"],
  },
});

if (args.help) help();
if (!args.src) fail();
if (!args.out) fail();

await codegen({
  importSpecifier: args.import,
  metadata: await getMetadata(args.src),
  rpcMethodNames: { // TODO: infer this via source
    state: [
      "getMetadata",
    ],
    chain: [
      "unsubscribeNewHeads",
      "subscribeNewHeads",
    ],
  },
}).write(args.out);

// Should disallow .scale as input?
async function getMetadata(src: string): Promise<M.Metadata> {
  if (src.startsWith("ws")) {
    const client = U.throwIfError(await proxyClient(new Config(() => src)));
    const metadata = U.throwIfError(await client.call("state_getMetadata", []));
    U.throwIfError(await client.close());
    if (metadata.error) fail();
    return M.fromPrefixedHex(metadata.result);
  } else if (path.isAbsolute(src)) {
    return await loadMetadata(src);
  } else {
    try {
      return await loadMetadata(path.fromFileUrl(src));
    } catch (_e) {
      unimplemented();
    }
  }
}

async function loadMetadata(src: string) {
  const ext = path.extname(src);
  switch (ext) {
    case ".scale": {
      return M.fromPrefixedHex(await Deno.readTextFile(src));
    }
    case ".json": {
      return unimplemented();
    }
    default:
      fail();
  }
}

// TODO: error message + correct usage suggestion
function fail(): never {
  Deno.exit(1);
}

// TODO: do we handle help differently depending on what flags were specified?
function help(): never {
  console.log("Usage: codegen -s=<scale_file|chain_spec|ws_url> -o=<dir>");
  Deno.exit();
}
