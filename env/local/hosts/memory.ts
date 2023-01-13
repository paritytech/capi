import { Host } from "../../Host.ts"

export function memoryHost(): Host {
  return {
    abortController: new AbortController(),
    write(dest, contents, codec) {
      return null!
    },
    read(src, codec) {
      return null!
    },
  }
}
