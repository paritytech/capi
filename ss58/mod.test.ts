import { assertEquals } from "../_deps/std/testing/asserts.ts";
import { Ss58 } from "./mod.ts";

Deno.test("Decode Ss58 Text", async () => {
  const decoded = (await Ss58()).decode("12Y8b4C9ar162cBgycxYgxxHG7cLVs8gre9Y5xeMjW3izqer");
  assertEquals(decoded, [0, "43fa61b298e82f9f207ddea327900cee26b554756c4a533f36cd875e3e7bcf06"]);
});

Deno.test("Encode Ss58 Text", async () => {
  const encoded = (await Ss58()).encode(
    0,
    "43fa61b298e82f9f207ddea327900cee26b554756c4a533f36cd875e3e7bcf06",
  );
  assertEquals(encoded, "12Y8b4C9ar162cBgycxYgxxHG7cLVs8gre9Y5xeMjW3izqer");
});
