import { download } from "../deps/capi_binary_builds.ts"

export type Binary = string | { binary: string; version: string; resolved?: Promise<string> }

export function binary(binary: string, version: string): Binary {
  return { binary, version }
}

export async function resolveBinary(binary: Binary, _signal: AbortSignal) {
  if (typeof binary === "string") {
    return binary
  } else {
    return await (binary.resolved ??= download(binary.binary, binary.version))
  }
}
