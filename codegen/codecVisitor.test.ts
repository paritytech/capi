import { Codec } from "../deps/scale.ts";
import * as path from "../deps/std/path.ts";
import { assertEquals } from "../deps/std/testing/asserts.ts";
import * as M from "../frame_metadata/mod.ts";
import * as C from "../mod.ts";
import * as testClients from "../test_util/clients/mod.ts";
import * as U from "../util/mod.ts";
import { codegen } from "./mod.ts";

const currentDir = path.dirname(path.fromFileUrl(import.meta.url));
const codegenTestDir = path.join(currentDir, "../target/codegen");

for (const [runtime, client] of Object.entries(testClients)) {
  Deno.test(runtime, async () => {
    const metadata = U.throwIfError(await C.metadata(client)().run());
    const outDir = path.join(codegenTestDir, runtime);
    await codegen({
      importSpecifier: "../../../mod.ts",
      metadata,
    }).write(outDir);
    const codegenedMod = await import(path.toFileUrl(path.join(outDir, "mod.ts")).toString());
    const deriveCodec = M.DeriveCodec(metadata.tys);
    const derivedCodecs = metadata.tys.map(deriveCodec);
    const codegenCodecs = codegen._metadata.types;
    const origInspect = Codec.prototype["_inspect"]!;
    let inspecting = 0;
    Codec.prototype["_inspect"] = function(inspect) {
      if (inspecting) {
        const di = derivedCodecs.indexOf(this);
        if (di !== -1) return "$" + di;
        const ci = codegenCodecs.indexOf(this);
        if (ci !== -1) return "$" + ci;
      }
      inspecting++;
      try {
        return origInspect.call(this, inspect);
      } finally {
        inspecting--;
      }
    };
    for (let i = 0; i < derivedCodecs.length; i++) {
      if (
        Deno.inspect(derivedCodecs[i], { depth: Infinity })
          !== Deno.inspect(codegenCodecs[i], { depth: Infinity })
      ) {
        assertEquals(derivedCodecs[i], codegenCodecs[i]);
      }
    }
    Codec.prototype["_inspect"] = origInspect;
  });
}
