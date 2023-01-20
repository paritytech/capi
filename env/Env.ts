import { ProviderBase } from "./provider/mod.ts"

export class Env {
  constructor(
    readonly signal: AbortSignal,
    readonly providers: Record<string, ProviderBase>,
  ) {
    for (const provider of Object.values(providers)) {
      if ("env" in provider) throw new Error("Provider already in use by another env")
      ;(provider as { env: Env }).env = this
    }
  }
}
