import { Host } from "../../Host.ts"

export function fsHost(): Host {
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
