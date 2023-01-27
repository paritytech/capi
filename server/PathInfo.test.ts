import { assertExists, assertObjectMatch } from "../deps/std/testing/asserts.ts"
import { parsePathInfo } from "./PathInfo.ts"

Deno.test("vCapi + providerId + target + vRuntime + filePath", () => {
  const r = parsePathInfo(
    `@${vCapi}/${generatorId}/${providerId}/${target}/@${vRuntime}/${filePath}`,
  )
  assertExists(r)
  assertObjectMatch(r, {
    vCapi,
    generatorId,
    providerId,
    target,
    vRuntime,
    filePath,
  })
})

Deno.test("providerId + target + vRuntime + filePath", () => {
  const r = parsePathInfo(`${generatorId}/${providerId}/${target}/@${vRuntime}/${filePath}`)
  assertExists(r)
  assertObjectMatch(r, {
    generatorId,
    providerId,
    target,
    vRuntime,
    filePath,
  })
})

Deno.test("providerId + target + vRuntime", () => {
  const r = parsePathInfo(`${generatorId}/${providerId}/${target}/@${vRuntime}`)
  assertExists(r)
  assertObjectMatch(r, {
    generatorId,
    providerId,
    target,
    vRuntime,
  })
})

Deno.test("providerId + target", () => {
  const r = parsePathInfo(`${generatorId}/${providerId}/${target}`)
  assertExists(r)
  assertObjectMatch(r, {
    generatorId,
    providerId,
    target,
  })
})

Deno.test("vCapi + providerId + target + vRuntime", () => {
  const r = parsePathInfo(`@${vCapi}/${generatorId}/${providerId}/${target}/@${vRuntime}`)
  assertExists(r)
  assertObjectMatch(r, {
    vCapi,
    generatorId,
    providerId,
    target,
    vRuntime,
  })
})

Deno.test("vCapi + providerId + target", () => {
  const r = parsePathInfo(`@${vCapi}/${generatorId}/${providerId}/${target}`)
  assertExists(r)
  assertObjectMatch(r, {
    vCapi,
    generatorId,
    providerId,
    target,
  })
})

const vCapi = "v0.1.0"
const generatorId = "frame"
const providerId = "dev"
const target = "polkadot"
const vRuntime = "v9.36.0"
const filePath = "types/mod.ts"
