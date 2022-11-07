import { Codec } from "../deps/scale.ts";
import { assertEquals } from "../deps/std/testing/asserts.ts";
import * as M from "../frame_metadata/mod.ts";
import * as C from "../mod.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";

for (const config of T.configs) {
  Deno.test(config.runtimeName, async () => {
    const metadata = U.throwIfError(await C.run(C.metadata(config)));
    const codegen = await T.importCodegen(config);
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
