const rCapiVersion = /^https:\/\/(?:capi.dev\/|deno.land\/x\/capi)@(.+?)\//

export function detectVersion(): string | undefined {
  return rCapiVersion.exec(import.meta.url)?.[1]
}
