import { Client } from "./Base.ts";

// TODO: use branded beacon types instead of string
// TODO: dyn import smoldot and provider if chain spec is provided
// TODO: handle retry
// TODO: narrow to `[string, ...string[]]`
export async function rpcClient<Beacon extends [string, ...string[]]>(
  ...beacon: Beacon
): Promise<Client<any>> {
  const beacon0 = typeof beacon === "string" ? beacon : beacon[0]!; // TODO: rest
  let provider: Client<any>;
  if (beacon0.startsWith("wss://")) {
    provider = new (await import("./ws.ts")).ProxyWsUrlRpcClient(beacon0);
  } else {
    const [{ smoldotRpcClientFactory }, { start }] = await Promise.all([
      import("./smoldot.ts"),
      import("../_deps/smoldot.ts"),
    ]);
    provider = await smoldotRpcClientFactory(start)(beacon0);
  }
  await provider.opening();
  return provider;
}
