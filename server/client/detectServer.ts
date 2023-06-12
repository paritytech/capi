import { tryGetEnv } from "../../util/mod.ts"

export function detectServer() {
  const url = tryGetEnv("CAPI_SERVER")
  if (!url) throw new Error("Could not detect current-running Capi server")
  return url
}
