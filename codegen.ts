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
    import: "deno",
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
  outDir: args.out,
}).write();

// file:///Users/harrysolovay/Desktop/capi/frame_metadata/_downloaded/polkadot.scale
// /Users/harrysolovay/Desktop/capi/frame_metadata/_downloaded/polkadot.scale
// ./frame_metadata/_downloaded/polkadot.scale
// frame_metadata/_downloaded/polkadot.scale
async function getMetadata(src: string): Promise<M.Metadata> {
  if (src.startsWith("ws")) {
    const client = U.throwIfError(await proxyClient(new Config(() => src, undefined!)));
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

function fail(): never {
  // TODO: error message + correct usage suggestion
  Deno.exit();
}

function help(): never {
  console.log("Usage: codegen --metadata <file> --output <dir>");
  Deno.exit();
}
