import { Config } from "../config/mod.ts";

export class TestConfig extends Config<string> {
  constructor(readonly runtimeName: TestConfigRuntime.Name) {
    super(async () => {
      const hostname = Deno.env.get("TEST_CTX_HOSTNAME");
      const portRaw = Deno.env.get("TEST_CTX_PORT");
      if (!hostname || !portRaw) await testCtx();
      const conn = await Deno.connect({
        hostname,
        port: parseInt(portRaw!),
      });
      conn.write(new Uint8Array([TestConfigRuntime.CODES[runtimeName]]));
      const port = await (async () => {
        for await (const x of conn.readable) {
          return new DataView(x.buffer).getUint16(0);
        }
        return undefined!;
      })();
      return `ws://127.0.0.1:${port}`;
    });
  }
}

async function testCtx(): Promise<never> {
  const testCtxPath = new URL("../test_ctx.ts", import.meta.url).pathname;
  const p = Deno.run({
    cmd: ["deno", "task", "run", testCtxPath, "deno", "task", "run", Deno.mainModule],
  });
  const { code } = await p.status();
  Deno.exit(code);
}

export const polkadot = new TestConfig("polkadot");
export type polkadot = typeof polkadot;
export const kusama = new TestConfig("kusama");
export type kusama = typeof kusama;
export const westend = new TestConfig("westend");
export type westend = typeof westend;
export const rococo = new TestConfig("rococo");
export type rococo = typeof rococo;

export const configs = [polkadot, kusama, westend, rococo];

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
