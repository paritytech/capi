import { Metadata } from "./test-common.ts";
import { toTsType } from "./toTsType.ts";

Deno.test("TDD", async () => {
  const metadata = await Metadata("polkadot");
  const result = toTsType(metadata, 1);
  console.log({ result });
});
