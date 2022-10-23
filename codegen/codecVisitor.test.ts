import * as M from "../frame_metadata/mod.ts";
import * as C from "../mod.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";

for (const config of T.configs) {
  Deno.test(config.runtimeName, async () => {
    const metadata = U.throwIfError(await C.run(new C.Metadata(config)));
    const codegen = await T.importCodegen(config);
    const deriveCodec = M.DeriveCodec(metadata.tys);
    const derivedCodecs = metadata.tys.map(deriveCodec);
    const codegenCodecs = codegen._metadata.types;
    assertCodecEquals(derivedCodecs, codegenCodecs);
  });
}

const memo = new Map<any, Set<any>>();
function assertCodecEquals(a: any, b: any, path = "") {
  const set = U.getOr(memo, a, () => new Set());
  if (set.has(b)) return;
  set.add(b);
  if (a === b) return;
  if (!a || !b || typeof a !== "object" || typeof b !== "object") {
    throw new Error(`${path}: ${Deno.inspect(a)} !== ${Deno.inspect(b)}`);
  }
  if ("_metadata" in a !== "_metadata" in b) {
    throw new Error(`${path}: codec-ness mismatch`);
  }
  if ("_metadata" in a) {
    if (a._metadata[0] === b._metadata[0] && a._metadata[0] === C.$.deferred) {
      assertCodecEquals(a._metadata[1](), b._metadata[1](), path + "._metadata[1]()");
      return;
    }
    assertCodecEquals(a._metadata, b._metadata, path + "._metadata");
    return;
  }
  if ((a instanceof Array) !== (b instanceof Array)) {
    throw new Error(`${path}: Array-ness mismatch`);
  }
  if (a instanceof Array) {
    assertCodecEquals(a.length, b.length, path + ".length");
    for (let i = 0; i < a.length; i++) {
      assertCodecEquals(a[i], b[i], path + `[${i}]`);
    }
    return;
  }
  assertCodecEquals(Object.keys(a), Object.keys(b), path + "#keys");
  for (const key of Object.keys(a)) {
    assertCodecEquals(
      a[key],
      b[key],
      path + (/^\p{ID_Start}\p{ID_Continue}*$/u.test(key) ? "." + key : `[${JSON.stringify(key)}]`),
    );
  }
}
