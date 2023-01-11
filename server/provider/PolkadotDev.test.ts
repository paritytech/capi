import { assertEquals } from "../../deps/std/testing/asserts.ts"
import { parsePolkadotDevPathInfo } from "./PolkadotDev.ts"

Deno.test("Polkadot Subpath Path Info Parsing", () => {
  assertEquals(parsePolkadotDevPathInfo("polkadot@version/mod.ts"), {
    chainKey: "polkadot@version",
    runtimeName: "polkadot",
    version: "version",
    filePath: "mod.ts",
    ext: ".ts",
  })
})
