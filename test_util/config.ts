import { Config } from "../config/mod.ts";
import { CallMethods, ErrorDetails, SubscriptionMethods } from "../known/rpc.ts";

class TestConfig extends Config<string, CallMethods, SubscriptionMethods, ErrorDetails> {
  constructor(readonly runtimeName: TestConfigRuntime.Name) {
    super(
      async () => {
        const hostname = Deno.env.get("TEST_CTX_HOSTNAME");
        const portRaw = Deno.env.get("TEST_CTX_PORT");
        if (!hostname || !portRaw) requiresSetupError();
        let conn: Deno.TcpConn;
        try {
          conn = await Deno.connect({
            hostname,
            port: parseInt(portRaw),
          });
        } catch (_e) {
          requiresSetupError();
        }
        conn.write(new Uint8Array([TestConfigRuntime.CODES[runtimeName]]));
        const port = await (async () => {
          for await (const x of conn.readable) {
            return new DataView(x.buffer).getUint16(0);
          }
          return undefined!;
        })();
        return `ws://127.0.0.1:${port}`;
      },
      {
        kusama: 2,
        rococo: undefined!, // TODO
        westend: 0,
        polkadot: 0,
      }[runtimeName],
    );
  }
}

function requiresSetupError(): never {
  throw new Error([
    "You are using a config that depends on the `test_ctx` util.",
    "You may want to try re-running the same command, but prefixed with `deno task test_ctx `.",
    "For instance, `deno task run examples/metadata.ts` would become `deno task test_ctx deno task run examples/metadata.ts`",
  ].join(" "));
}

export const polkadot = new TestConfig("polkadot");
export type polkadot = typeof polkadot;
export const kusama = new TestConfig("kusama");
export type kusama = typeof kusama;
export const westend = new TestConfig("westend");
export type westend = typeof westend;
export const rococo = new TestConfig("rococo");
export type rococo = typeof rococo;

export namespace TestConfigRuntime {
  export type CODES = typeof CODES;
  export const CODES = {
    polkadot: 0,
    kusama: 1,
    westend: 2,
    rococo: 3,
  } as const;
  export type Name = keyof CODES;
  export type NAMES = { [N in Name as CODES[N]]: N };
  export const NAMES: NAMES = {
    0: "polkadot",
    1: "kusama",
    2: "westend",
    3: "rococo",
  };
}
