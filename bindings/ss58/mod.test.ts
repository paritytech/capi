import * as asserts from "../../_deps/asserts.ts";
import { Ss58Util } from "./mod.ts";

const ss58Util = await Ss58Util();

Deno.test("Decode Ss58 Text", () => {
  const decoded = ss58Util.decodeSs58Text("12Y8b4C9ar162cBgycxYgxxHG7cLVs8gre9Y5xeMjW3izqer");
  asserts.assertEquals(decoded, [
    0,
    "43fa61b298e82f9f207ddea327900cee26b554756c4a533f36cd875e3e7bcf06",
  ]);
});

Deno.test("Encode Ss58 Text", () => {
  const encoded = ss58Util.encodeSs58Text(
    0,
    "43fa61b298e82f9f207ddea327900cee26b554756c4a533f36cd875e3e7bcf06",
  );
  asserts.assertEquals(encoded, "12Y8b4C9ar162cBgycxYgxxHG7cLVs8gre9Y5xeMjW3izqer");
});

Deno.test("Base58ConversionFailed", () => {
  try {
    ss58Util.decodeSs58Text("-1");
  } catch (e) {
    asserts.assertEquals(e, "Base58ConversionFailed");
  }
});
