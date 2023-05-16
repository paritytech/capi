const rCapiVersion = /^https:\/\/(?:capi.dev\/|deno.land\/x\/capi)@(.+?)\//

export function detectVersion(): string {
  const version = rCapiVersion.exec(import.meta.url)?.[0]
  if (!version) {
    throw new Error("Could not detect version from URL. Please specify via `--version` flag.")
  }
  return version
}
