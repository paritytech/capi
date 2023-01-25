import { ProviderFactory } from "./Provider.ts"

export class Env {
  providers

  constructor(readonly signal: AbortSignal, providersFactories: ProviderFactory[]) {
    this.providers = providersFactories.map((f) => f(this))
  }
}
