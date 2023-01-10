import { assertEquals } from "../../deps/std/testing/asserts.ts"
import { parseWssPathInfo } from "./Wss.ts"

Deno.test("Wss Path Info Parsing", () => {
  assertEquals(parseWssPathInfo("rpc.polkadot.io@version/mod.ts"), {
    discoveryValue: "rpc.polkadot.io",
    version: "version",
    filePath: "mod.ts",
    key: "rpc.polkadot.io@version",
    ext: ".ts",
  })
})
