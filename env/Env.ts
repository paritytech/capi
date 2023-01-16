import { ProviderBase } from "./provider/mod.ts"

export class Env {
  abortController
  signal

  constructor(readonly providers: Record<string, ProviderBase>) {
    this.abortController = new AbortController()
    this.signal = this.abortController.signal
    for (const provider of Object.values(providers)) {
      if ("env" in provider) throw new Error("Provider already in use by another env")
      ;(provider as { env: Env }).env = this
    }
  }
}
