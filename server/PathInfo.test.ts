import { assertEquals } from "../deps/std/testing/asserts.ts"
import { fromPathInfo, parsePathInfo, PathInfo } from "./PathInfo.ts"

const vCapi = "v0.1.0"
const generatorId = "frame"
const providerId = "dev"
const target = "polkadot"
const vRuntime = "v9.36.0"
const filePath = "types/mod.ts"

testPathInfo(
  `/${generatorId}/${providerId}`,
  { generatorId, providerId },
)

testPathInfo(
  `/${generatorId}/${providerId}/${target}`,
  { generatorId, providerId, target },
)

testPathInfo(
  `/${generatorId}/${providerId}/@${vRuntime}`,
  { generatorId, providerId, vRuntime },
)

testPathInfo(
  `/${generatorId}/${providerId}/${target}/@${vRuntime}`,
  { generatorId, providerId, target, vRuntime },
)

testPathInfo(
  `/${generatorId}/${providerId}/@${vRuntime}/${filePath}`,
  { generatorId, providerId, vRuntime, filePath },
)

testPathInfo(
  `/${generatorId}/${providerId}/${target}/@${vRuntime}/${filePath}`,
  { generatorId, providerId, target, vRuntime, filePath },
)

function testPathInfo(path: string, pathInfo: PathInfo) {
  pathInfo = {
    vCapi: undefined,
    target: undefined,
    vRuntime: undefined,
    filePath: undefined,
    ...pathInfo,
  }
  Deno.test(path, () => {
    const parsed = parsePathInfo(path)
    assertEquals(parsed, pathInfo)
    assertEquals(fromPathInfo(pathInfo), path)
  })
  const capiPath = `/@${vCapi}${path}`
  const capiPathInfo = { ...pathInfo, vCapi }
  Deno.test(capiPath, () => {
    const parsed = parsePathInfo(capiPath)
    assertEquals(parsed, capiPathInfo)
    assertEquals(fromPathInfo(capiPathInfo), capiPath)
  })
}
