import { delay } from "../deps/std/async.ts"

export async function waitFor(fn: () => Promise<boolean>, interval = 1000, maxAttempts = 60) {
  let attempts = 0
  while (attempts++ < maxAttempts) {
    if (await fn()) return
    await delay(interval)
  }
  throw new Error("waitFor maxAttempts reached")
}
