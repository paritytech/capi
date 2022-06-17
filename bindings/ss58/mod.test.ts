import * as asserts from "../../_deps/asserts.ts";
import { Ss58, Ss58DecodeError, Ss58EncodeError } from "./mod.ts";

const ss58 = await Ss58();

Deno.test("Decode Ss58 Text", () => {
  const decoded = ss58.decode("12Y8b4C9ar162cBgycxYgxxHG7cLVs8gre9Y5xeMjW3izqer");
  asserts.assertEquals(decoded, [
    0,
    "43fa61b298e82f9f207ddea327900cee26b554756c4a533f36cd875e3e7bcf06",
  ]);
});

Deno.test("Encode Ss58 Text", () => {
  const encoded = ss58.encode(
    0,
    "43fa61b298e82f9f207ddea327900cee26b554756c4a533f36cd875e3e7bcf06",
  );
  asserts.assertEquals(encoded, "12Y8b4C9ar162cBgycxYgxxHG7cLVs8gre9Y5xeMjW3izqer");
});

Deno.test("Base58DecodingFailed", () => {
  const result = ss58.decode("-1");
  asserts.assert(result instanceof Ss58DecodeError);
  asserts.assertEquals(result.name, "Ss58DecodeError");
  asserts.assertEquals(result.reason, "Base58DecodingFailed");
});
