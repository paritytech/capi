import * as path from "../deps/std/path.ts"

const rCapiVersion = /^https:\/\/(?:capi.dev\/|deno.land\/x\/capi)@(.+?)\//

export function detectVersion(): string | undefined {
  const match = rCapiVersion.exec(import.meta.url)?.[1]
  if (match) return match
  if (new URL(import.meta.url).protocol === "file:") {
    const sha = new TextDecoder().decode(
      new Deno.Command("git", {
        args: ["rev-parse", "HEAD"],
        cwd: path.fromFileUrl(new URL(".", import.meta.url)),
      }).outputSync().stdout,
    )
    if (sha.length) return sha.slice(0, 8)
  }
  return
}
