import { assertEquals } from "../../deps/std/testing/asserts.ts"
import { PolkadotDevProvider } from "./PolkadotDev.ts"

Deno.test("Polkadot Dev Path Info Parsing", () => {
  assertEquals(PolkadotDevProvider.prototype.tryParsePathInfo("polkadot@version/mod.ts"), {
    runtimeName: "polkadot",
    runtimeVersion: "version",
    tsFilePath: "mod.ts",
  })
})
