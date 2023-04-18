export { binary, CapiBinary } from "../deps/capi_binary_builds.ts"

import { CapiBinary } from "../deps/capi_binary_builds.ts"

export type Binary = string | CapiBinary

export async function resolveBinary(binary: Binary, _signal?: AbortSignal) {
  // TODO: use signal
  if (typeof binary === "string") {
    return binary
  } else {
    if (!(await binary.exists())) {
      console.log("Downloading", binary.key)
      await binary.download()
    }
    return binary.path
  }
}
