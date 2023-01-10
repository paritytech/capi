import { assertEquals } from "../../deps/std/testing/asserts.ts"
import { parsePolkadotDevPathInfo } from "./PolkadotDev.ts"

Deno.test("Polkadot Dev Path Info Parsing", () => {
  assertEquals(parsePolkadotDevPathInfo("polkadot@version/mod.ts"), {
    discoveryValue: "polkadot",
    version: "version",
    filePath: "mod.ts",
    key: "polkadot@version",
    ext: ".ts",
  })
})
