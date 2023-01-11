import { assertEquals } from "../../deps/std/testing/asserts.ts"
import { parseWssSubpathInfo } from "./Wss.ts"

Deno.test("Wss Subpath Info Parsing", () => {
  assertEquals(parseWssSubpathInfo("rpc.polkadot.io@version/mod.ts"), {
    chainKey: "rpc.polkadot.io@version",
    protocolTrailing: "rpc.polkadot.io",
    version: "version",
    filePath: "mod.ts",
    ext: ".ts",
  })
})
