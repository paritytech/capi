import { Provider, ProviderRef } from "./base.ts"

export function setup(
  provider: Provider,
  discoveryValue: any,
  method: string,
  params: unknown[],
): Promise<[ProviderRef<any>, any, AbortController]> {
  return new Promise((resolve) => {
    const controller = new AbortController()
    const providerRef = provider(
      discoveryValue,
      (message) => resolve([providerRef, message, controller]),
      controller.signal,
    )
    providerRef.send({
      jsonrpc: "2.0",
      id: providerRef.nextId(),
      method,
      params,
    })
  })
}
