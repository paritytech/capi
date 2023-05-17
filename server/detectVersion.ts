const rCapiVersion = /^https:\/\/(?:capi.dev\/|deno.land\/x\/capi)@(.+?)\//

export function detectVersion(): string | undefined {
  const match = rCapiVersion.exec(import.meta.url)?.[1]
  if (match) return match
  const sha = new TextDecoder().decode(
    new Deno.Command("git", { args: ["rev-parse", "HEAD"] }).outputSync().stdout,
  )
  if (sha.length) return sha.slice(0, 8)
  return
}
