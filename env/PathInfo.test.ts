import { assertObjectMatch } from "../deps/std/testing/asserts.ts"
import { parsePathInfo } from "./PathInfo.ts"

Deno.test("vCapi + providerId + target + vRuntime + filePath", () => {
  assertObjectMatch(
    parsePathInfo(`@${vCapi}/${providerId}:${target}@${vRuntime}/${filePath}`),
    {
      vCapi,
      providerId,
      target,
      vRuntime,
      filePath,
    },
  )
})

Deno.test("providerId + target + vRuntime + filePath", () => {
  assertObjectMatch(parsePathInfo(`${providerId}:${target}@${vRuntime}/${filePath}`), {
    providerId,
    target,
    vRuntime,
    filePath,
  })
})

Deno.test("providerId + target + vRuntime", () => {
  assertObjectMatch(parsePathInfo(`${providerId}:${target}@${vRuntime}`), {
    providerId,
    target,
    vRuntime,
  })
})

Deno.test("providerId + target", () => {
  assertObjectMatch(parsePathInfo(`${providerId}:${target}`), {
    providerId,
    target,
  })
})

Deno.test("vCapi + providerId + target + vRuntime", () => {
  assertObjectMatch(parsePathInfo(`@${vCapi}/${providerId}:${target}@${vRuntime}`), {
    vCapi,
    providerId,
    target,
    vRuntime,
  })
})

Deno.test("vCapi + providerId + target", () => {
  assertObjectMatch(parsePathInfo(`@${vCapi}/${providerId}:${target}`), {
    vCapi,
    providerId,
    target,
  })
})

// @t6... you were right about naming constants... let's break convention where fitting.
const vCapi = "v0.1.0"
const providerId = "dev"
const target = "polkadot"
const vRuntime = "v9.36.0"
const filePath = "types/mod.ts"
