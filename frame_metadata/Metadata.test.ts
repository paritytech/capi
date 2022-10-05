import { _format } from "https://deno.land/std@0.158.0/path/_util.ts";
import { assertSnapshot } from "../deps/std/testing/snapshot.ts";
import { setup } from "./test-common.ts";

const kInspect = Symbol.for("Deno.customInspect");

for (
  const name of [
    "polkadot",
    "kusama",
    "statemint",
    "moonbeam",
    "acala",
    "subsocial",
    "westend",
  ] as const
) {
  Deno.test(name, async (t) => {
    const [metadata] = await setup(name);
    let shouldAbbrev = true;
    // @ts-ignore .
    metadata.tys[kInspect] = (inspect: any, args: any) => {
      shouldAbbrev = false;
      const x = inspect([...metadata.tys], args);
      shouldAbbrev = true;
      return x;
    };
    for (const ty of metadata.tys) {
      const abbrev = `Ty#${ty.id}` + (ty.path?.length
        ? ` (${ty.path.join("::")})`
        : ty.type === "Primitive"
        ? ` (${ty.kind})`
        : "");
      // @ts-ignore .
      ty[kInspect] = (inspect: any, args: any) => {
        if (shouldAbbrev) {
          return abbrev;
        }
        shouldAbbrev = true;
        const ty2 = { __proto__: { [Symbol.toStringTag]: abbrev }, ...ty };
        // @ts-ignore .
        delete ty2[kInspect];
        const x = inspect(ty2, args);
        shouldAbbrev = false;
        return x;
      };
    }
    await assertSnapshot(t, metadata);
  });
}
