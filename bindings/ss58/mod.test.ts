import { assertEquals } from "../../_deps/asserts.ts";
import { Ss58 } from "./mod.ts";

const ss58 = await Ss58();

Deno.test("Decode Ss58 Text", () => {
  const decoded = ss58.decode("12Y8b4C9ar162cBgycxYgxxHG7cLVs8gre9Y5xeMjW3izqer");
  assertEquals(decoded, [0, "43fa61b298e82f9f207ddea327900cee26b554756c4a533f36cd875e3e7bcf06"]);
});

Deno.test("Encode Ss58 Text", () => {
  const encoded = ss58.encode(
    0,
    "43fa61b298e82f9f207ddea327900cee26b554756c4a533f36cd875e3e7bcf06",
  );
  assertEquals(encoded, "12Y8b4C9ar162cBgycxYgxxHG7cLVs8gre9Y5xeMjW3izqer");
});
