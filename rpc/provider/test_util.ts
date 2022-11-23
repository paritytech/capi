import { Provider, ProviderRef } from "./base.ts"

export function setup(
  provider: Provider,
  discoveryValue: any,
  method: string,
  params: unknown[],
): Promise<[ProviderRef<any>, any]> {
  return new Promise((resolve) => {
    const providerRef = provider(discoveryValue, (message) => resolve([providerRef, message]))
    providerRef.send({
      jsonrpc: "2.0",
      id: providerRef.nextId(),
      method,
      params,
    })
  })
}
