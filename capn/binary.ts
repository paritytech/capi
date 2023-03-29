import { download } from "../deps/capi_binary_builds.ts"

export type Binary = string | ((signal: AbortSignal) => Promise<string>)

export function binary(binary: string, version: string) {
  let promise: Promise<string>
  // TODO: use signal
  return () => promise ??= download(binary, version)
}

export async function resolveBinary(binary: Binary, signal: AbortSignal) {
  if (typeof binary === "string") {
    return binary
  } else {
    return await binary(signal)
  }
}
